import type { DirectoAiConfig, Post } from "./types.js";

export interface DirectoAiTracker {
  trackEvent(name: string, data: Record<string, any>): Promise<void>;
  trackImpression(contentId: string, data: Record<string, any>): Promise<void>;
  trackViewTime(
    contentId: string,
    seconds: number,
    data: Record<string, any>,
  ): Promise<void>;
  toggleLike(contentId: string, campaignId?: string): Promise<void>;
  fetchProfileFeed(profileAccountId: string): Promise<Post[]>;
  followAccount(profileAccountId: string): Promise<void>;
  unfollowAccount(profileAccountId: string): Promise<void>;
  toggleFollowAccount(
    profileAccountId: string,
    isFollowing: boolean,
  ): Promise<void>;
  addFavorite(contentId: string, campaignId?: string): Promise<void>;
  removeFavorite(contentId: string): Promise<void>;
  toggleFavorite(
    contentId: string,
    campaignId: string | undefined,
    isFavorited: boolean,
  ): Promise<void>;
  reportContent(
    contentId: string,
    reportType: string,
    description?: string,
  ): Promise<void>;
  shareContent(contentData: any): Promise<void>;
}

export class NoopDirectoAiTracker implements DirectoAiTracker {
  async trackEvent(_name: string, _data: Record<string, any>): Promise<void> {}

  async trackImpression(
    _contentId: string,
    _data: Record<string, any>,
  ): Promise<void> {}

  async trackViewTime(
    _contentId: string,
    _seconds: number,
    _data: Record<string, any>,
  ): Promise<void> {}

  async toggleLike(
    _contentId: string,
    _campaignId?: string,
  ): Promise<void> {}

  async fetchProfileFeed(_profileAccountId: string): Promise<Post[]> {
    return [];
  }

  async followAccount(_profileAccountId: string): Promise<void> {}

  async unfollowAccount(_profileAccountId: string): Promise<void> {}

  async toggleFollowAccount(
    _profileAccountId: string,
    _isFollowing: boolean,
  ): Promise<void> {}

  async addFavorite(
    _contentId: string,
    _campaignId?: string,
  ): Promise<void> {}

  async removeFavorite(_contentId: string): Promise<void> {}

  async toggleFavorite(
    _contentId: string,
    _campaignId: string | undefined,
    _isFavorited: boolean,
  ): Promise<void> {}

  async reportContent(
    _contentId: string,
    _reportType: string,
    _description?: string,
  ): Promise<void> {}

  async shareContent(_contentData: any): Promise<void> {}
}

export class DefaultDirectoAiTracker implements DirectoAiTracker {
  private config: DirectoAiConfig;

  constructor(config: DirectoAiConfig) {
    this.config = config;
  }

  private get baseUrl() {
    return this.config.baseUrl || "https://api.directoai.com.br";
  }

  private stringToUTF16LE(value: string) {
    const bytes = new Uint8Array(value.length * 2);
    for (let i = 0; i < value.length; i += 1) {
      const code = value.charCodeAt(i);
      bytes[i * 2] = code & 0xff;
      bytes[i * 2 + 1] = code >> 8;
    }
    return bytes;
  }

  private async computeSHA256(value: string) {
    if (!value) return "";

    const utf16Bytes = this.stringToUTF16LE(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", utf16Bytes);
    const hashArray = new Uint8Array(hashBuffer);

    return Array.from(hashArray)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  }

  private async sendToGA(eventName: string, eventParams: Record<string, any>) {
    if (this.config.googleAnalyticsHandler) {
      try {
        this.config.googleAnalyticsHandler(eventName, eventParams);
      } catch (e) {
        console.error("DirectoAi SDK: Error in GA handler", e);
      }
    }
  }

  private async sendMessageQueue(payload: object) {
    try {
      const response = await fetch(`${this.baseUrl}/metric-queue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn(
          "DirectoAi SDK: Error sending message to queue",
          response.status,
        );
      }
    } catch (error) {
      console.error("DirectoAi SDK: Failed to send analytic event:", error);
    }
  }

  async trackEvent(name: string, data: Record<string, any>) {
    const payload = {
      type: "click",
      data: {
        ...data,
        accountId: this.config.accountId,
        customerId: this.config.customerId,
        deviceId: this.config.deviceId,
        eventType: name,
        createdAt: new Date().toISOString(),
      },
    };
    return this.sendMessageQueue(payload);
  }

  async trackImpression(contentId: string, data: Record<string, any>) {
    const payload = {
      type: "view",
      data: {
        ...data,
        contentId,
        accountId: this.config.accountId,
        customerId: this.config.customerId,
        deviceId: this.config.deviceId,
        createdAt: new Date().toISOString(),
      },
    };
    return this.sendMessageQueue(payload);
  }

  async trackViewTime(
    contentId: string,
    seconds: number,
    data: Record<string, any>,
  ) {
    const payload = {
      type: "timeView",
      data: {
        ...data,
        contentId,
        time: seconds,
        accountId: this.config.accountId,
        customerId: this.config.customerId,
        deviceId: this.config.deviceId,
        createdAt: new Date().toISOString(),
      },
    };
    return this.sendMessageQueue(payload);
  }

  async toggleLike(contentId: string, campaignId?: string) {
    return this.trackEvent("click-like", {
      contentId,
      campaignId,
    });
  }

  async fetchProfileFeed(profileAccountId: string): Promise<Post[]> {
    if (!this.config.accountId || !this.config.apiKey) {
      throw new Error("Missing required data for profile feed request");
    }

    const url = `${this.baseUrl}/campaign/api/v1/feed/accounts?accountId=${encodeURIComponent(this.config.accountId)}&apiKey=${encodeURIComponent(this.config.apiKey)}&profileAccountId=${encodeURIComponent(profileAccountId)}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Profile feed request failed: ${response.status}`);
      }

      const payload = await response.json();
      const feeds = Array.isArray(payload?.data?.feeds)
        ? payload.data.feeds
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.feeds)
            ? payload.feeds
            : [];

      return feeds as Post[];
    } catch (error) {
      console.error("DirectoAi SDK: Failed to fetch profile feed:", error);
      throw error;
    }
  }

  async followAccount(profileAccountId: string) {
    if (!this.config.accountId || !this.config.apiKey || !this.config.customerId) {
      throw new Error("Missing required data for follow action");
    }

    const url = `${this.baseUrl}/campaign/api/v1/feed/followers?accountId=${encodeURIComponent(this.config.accountId)}&apiKey=${encodeURIComponent(this.config.apiKey)}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: profileAccountId,
          customerId: this.config.customerId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Follow account failed: ${response.status}`);
      }

      await this.trackEvent("click-follow", {
        profileAccountId,
      });
    } catch (error) {
      console.error("DirectoAi SDK: Failed to follow account:", error);
      throw error;
    }
  }

  async unfollowAccount(profileAccountId: string) {
    if (!this.config.accountId || !this.config.apiKey || !this.config.customerId) {
      throw new Error("Missing required data for unfollow action");
    }

    const url = `${this.baseUrl}/campaign/api/v1/feed/followers?accountId=${encodeURIComponent(this.config.accountId)}&apiKey=${encodeURIComponent(this.config.apiKey)}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: profileAccountId,
          customerId: this.config.customerId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Unfollow account failed: ${response.status}`);
      }

      await this.trackEvent("click-unfollow", {
        profileAccountId,
      });
    } catch (error) {
      console.error("DirectoAi SDK: Failed to unfollow account:", error);
      throw error;
    }
  }

  async toggleFollowAccount(profileAccountId: string, isFollowing: boolean) {
    if (isFollowing) {
      return this.unfollowAccount(profileAccountId);
    }

    return this.followAccount(profileAccountId);
  }

  async addFavorite(contentId: string, campaignId?: string) {
    const url = `${this.baseUrl}/campaign/api/v1/feed/favorites`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: this.config.accountId,
          customerId: this.config.customerId,
          contentId,
          campaignId,
        }),
      });

      // Se sucesso ou conflito (já favoritado), logamos as métricas
      if (response.ok || response.status === 409) {
        await this.trackEvent("click-favorite", {
          contentId,
          campaignId,
        });

        await this.sendToGA("click_card", {
          content_id: contentId,
          account_id: this.config.accountId,
          customer_id: this.config.customerId,
          event_type: "click-favorite",
        });
      }

      if (!response.ok && response.status !== 409) {
        throw new Error(`Add favorite failed: ${response.status}`);
      }
    } catch (error) {
      console.error("DirectoAi SDK: Failed to add favorite:", error);
      throw error;
    }
  }

  async removeFavorite(contentId: string) {
    const url = `${this.baseUrl}/campaign/api/v1/feed/favorites`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: this.config.accountId,
          customerId: this.config.customerId,
          contentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Remove favorite failed: ${response.status}`);
      }
    } catch (error) {
      console.error("DirectoAi SDK: Failed to remove favorite:", error);
      throw error;
    }
  }

  async toggleFavorite(
    contentId: string,
    campaignId: string | undefined,
    isFavorited: boolean,
  ) {
    if (isFavorited) {
      return this.removeFavorite(contentId);
    } else {
      return this.addFavorite(contentId, campaignId);
    }
  }

  async reportContent(
    contentId: string,
    reportType: string,
    description?: string,
  ) {
    const url = `${this.baseUrl}/content/api/v1/contents/${contentId}/report`;
    const reporterCustomerId = await this.computeSHA256(
      this.config.customerId || "",
    );

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType,
          reporterCustomerId,
          ...(description ? { description } : {}),
        }),
      });

      if (!response.ok) {
        throw new Error(`Report content failed: ${response.status}`);
      }

      await this.trackEvent("click-report", {
        contentId,
        reportType,
      });
    } catch (error) {
      console.error("DirectoAi SDK: Failed to report content:", error);
      throw error;
    }
  }

  async shareContent(contentData: any) {
    const generateUUID = () => {
      try {
        if (typeof crypto !== "undefined" && crypto.randomUUID) {
          return crypto.randomUUID();
        }
        // Fallback for non-secure contexts or older environments
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      } catch (e) {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
      }
    };

    const shareId = generateUUID();
    const contentId = contentData?.contentId || contentData?.id || "";
    const campaignId = contentData?.campaignId || "";

    const base64Encode = (str: string) => {
      try {
        if (typeof window !== "undefined") {
          return window.btoa(unescape(encodeURIComponent(str)));
        } else if (typeof globalThis !== "undefined" && globalThis.btoa) {
          return globalThis.btoa(unescape(encodeURIComponent(str)));
        } else {
          return (globalThis as any).Buffer.from(str).toString("base64");
        }
      } catch (e) {
        return "";
      }
    };

    try {
      const payload = {
        shareId: shareId,
        contentId: contentId,
        campaignId: campaignId,
        accountId: this.config.accountId,
        createdBy: this.config.customerId || "",
        expiresInHours: 168,
        content: {
          ...contentData,
          encryptedSnapshot: contentData?.template
            ? base64Encode(contentData.template)
            : null,
          template: null,
        },
      };

      console.log("DirectoAi SDK: Creating share link...", {
        url: `${this.baseUrl}/campaign/api/v1/feed/share`,
        payload,
      });

      const response = await fetch(
        `${this.baseUrl}/campaign/api/v1/feed/share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        const result = await response.json();
        const publicShareUrl = result.data?.url;

        if (!publicShareUrl) {
          throw new Error("Share API failed: No URL returned");
        }

        console.log("DirectoAi SDK: Share created successfully:", result);

        await this.trackEvent("click-share", {
          contentId,
          campaignId,
        });

        const shareData = {
          title: contentData?.title || "Compartilhar",
          url: publicShareUrl,
          text: contentData?.title || "",
        };

        if ((window as any).flutter_inappwebview?.callHandler) {
          (window as any).flutter_inappwebview.callHandler(
            "shareLink",
            publicShareUrl,
          );
        } else if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare(shareData)
        ) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(publicShareUrl);
        }
      } else {
        const errorText = await response.text();
        throw new Error(
          `Share API failed: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }
    } catch (error) {
      console.error("DirectoAi SDK: Error creating share link:", error);
    }
  }
}

/**
 * Standalone utility to create a share link, matching the pattern provided by the user.
 */
export async function createShareLink(
  config: DirectoAiConfig,
  content: any,
  campaignId: string | null = "",
): Promise<string | null> {
  const generateUUID = () => {
    try {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    } catch (e) {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
  };

  const base64Encode = (str: string) => {
    try {
      if (typeof window !== "undefined") {
        return window.btoa(unescape(encodeURIComponent(str)));
      } else if (typeof globalThis !== "undefined" && globalThis.btoa) {
        return globalThis.btoa(unescape(encodeURIComponent(str)));
      } else {
        return (globalThis as any).Buffer.from(str).toString("base64");
      }
    } catch (e) {
      return "";
    }
  };

  try {
    const shareId = generateUUID();
    const payload = {
      shareId,
      contentId: content.contentId || content.id || "",
      campaignId: campaignId || "",
      accountId: config.accountId,
      createdBy: config.customerId || "",
      expiresInHours: 168,
      content: {
        ...content,
        encryptedSnapshot: content.template
          ? base64Encode(content.template)
          : null,
        template: null,
      },
    };

    const baseUrl = config.baseUrl || "https://api.directoai.com.br";
    const response = await fetch(`${baseUrl}/campaign/api/v1/feed/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Share API failed: ${response.status} ${response.statusText}`,
      );
    }

    const result = await response.json();
    return result.data?.url || null;
  } catch (error) {
    console.error("Error creating share link:", error);
    return null;
  }
}
