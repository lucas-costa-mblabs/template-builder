export class DefaultDirectoAiTracker {
    config;
    constructor(config) {
        this.config = config;
    }
    get baseUrl() {
        return this.config.baseUrl || "https://api.directoai.com.br";
    }
    async sendToGA(eventName, eventParams) {
        if (this.config.googleAnalyticsHandler) {
            try {
                this.config.googleAnalyticsHandler(eventName, eventParams);
            }
            catch (e) {
                console.error("DirectoAi SDK: Error in GA handler", e);
            }
        }
    }
    async sendMessageQueue(payload) {
        try {
            const response = await fetch(`${this.baseUrl}/metric-queue`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                console.warn("DirectoAi SDK: Error sending message to queue", response.status);
            }
        }
        catch (error) {
            console.error("DirectoAi SDK: Failed to send analytic event:", error);
        }
    }
    async trackEvent(name, data) {
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
    async trackImpression(contentId, data) {
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
    async trackViewTime(contentId, seconds, data) {
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
    async toggleLike(contentId, campaignId) {
        return this.trackEvent("click-like", {
            contentId,
            campaignId,
        });
    }
    async addFavorite(contentId, campaignId) {
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
        }
        catch (error) {
            console.error("DirectoAi SDK: Failed to add favorite:", error);
            throw error;
        }
    }
    async removeFavorite(contentId) {
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
        }
        catch (error) {
            console.error("DirectoAi SDK: Failed to remove favorite:", error);
            throw error;
        }
    }
    async toggleFavorite(contentId, campaignId, isFavorited) {
        if (isFavorited) {
            return this.removeFavorite(contentId);
        }
        else {
            return this.addFavorite(contentId, campaignId);
        }
    }
    async reportContent(contentId, reportType, description) {
        const url = `${this.baseUrl}/api/v1/contents/${contentId}/report`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reportType,
                    reporterCustomerId: this.config.customerId,
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
        }
        catch (error) {
            console.error("DirectoAi SDK: Failed to report content:", error);
            throw error;
        }
    }
    async shareContent(contentData) {
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
            }
            catch (e) {
                return Date.now().toString(36) + Math.random().toString(36).substr(2);
            }
        };
        const shareId = generateUUID();
        const contentId = contentData?.contentId || contentData?.id || "";
        const campaignId = contentData?.campaignId || "";
        const base64Encode = (str) => {
            try {
                if (typeof window !== "undefined") {
                    return window.btoa(unescape(encodeURIComponent(str)));
                }
                else if (typeof globalThis !== "undefined" && globalThis.btoa) {
                    return globalThis.btoa(unescape(encodeURIComponent(str)));
                }
                else {
                    return globalThis.Buffer.from(str).toString("base64");
                }
            }
            catch (e) {
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
            const response = await fetch(`${this.baseUrl}/campaign/api/v1/feed/share`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
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
                if (window.flutter_inappwebview?.callHandler) {
                    window.flutter_inappwebview.callHandler("shareLink", publicShareUrl);
                }
                else if (navigator.share &&
                    navigator.canShare &&
                    navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                }
                else {
                    await navigator.clipboard.writeText(publicShareUrl);
                }
            }
            else {
                const errorText = await response.text();
                throw new Error(`Share API failed: ${response.status} ${response.statusText} - ${errorText}`);
            }
        }
        catch (error) {
            console.error("DirectoAi SDK: Error creating share link:", error);
        }
    }
}
/**
 * Standalone utility to create a share link, matching the pattern provided by the user.
 */
export async function createShareLink(config, content, campaignId = "") {
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
        }
        catch (e) {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }
    };
    const base64Encode = (str) => {
        try {
            if (typeof window !== "undefined") {
                return window.btoa(unescape(encodeURIComponent(str)));
            }
            else if (typeof globalThis !== "undefined" && globalThis.btoa) {
                return globalThis.btoa(unescape(encodeURIComponent(str)));
            }
            else {
                return globalThis.Buffer.from(str).toString("base64");
            }
        }
        catch (e) {
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
            throw new Error(`Share API failed: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        return result.data?.url || null;
    }
    catch (error) {
        console.error("Error creating share link:", error);
        return null;
    }
}
//# sourceMappingURL=tracker.js.map