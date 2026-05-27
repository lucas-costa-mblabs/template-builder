import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import type { Post as PostType } from "../core/types.js";
import { Post } from "./Post.js";
import { useTemplateContext } from "./context.js";

const PROFILE_CONTENT_WIDTH = "400px";
const PROFILE_CARD_WIDTH = "358px";

interface ProfileViewModalProps {
  initialPost: PostType;
  onClose: () => void;
}

function getProfileAccountId(post: PostType) {
  return (
    post.profile?.accountId?.trim() ||
    post.accountId?.trim() ||
    ""
  );
}

function getInitialFollowingState(post: PostType) {
  return (
    post.following === true ||
    post.isFollowing === true ||
    post.isFollower === true ||
    post.profile?.following === true ||
    post.profile?.isFollowing === true
  );
}

function getProfileDescription(post: PostType) {
  return post.profile?.description?.trim() || "";
}

export function ProfileViewModal({
  initialPost,
  onClose,
}: ProfileViewModalProps) {
  const { tracker, getIsFollowing, setIsFollowing } = useTemplateContext();
  const profileAccountId = getProfileAccountId(initialPost);
  const profileName =
    initialPost.profile?.accountName?.trim() || "Perfil";
  const profileAvatarUrl = initialPost.profile?.iconUrl?.trim() || "";
  const profileDescription = getProfileDescription(initialPost);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const initialFollowing = getInitialFollowingState(initialPost);
  const isFollowing = profileAccountId
    ? (getIsFollowing?.(profileAccountId) ?? initialFollowing)
    : initialFollowing;

  useEffect(() => {
    if (profileAccountId && initialFollowing) {
      setIsFollowing?.(profileAccountId, true);
    }
  }, [initialFollowing, profileAccountId, setIsFollowing]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadProfileFeed = async () => {
      if (!profileAccountId) {
        setErrorMessage("Não foi possível identificar o perfil desta conta.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextPosts = await tracker.fetchProfileFeed(profileAccountId);
        if (cancelled) return;
        setPosts(nextPosts);
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(
          "Não foi possível carregar as publicações desta conta agora.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadProfileFeed();

    return () => {
      cancelled = true;
    };
  }, [profileAccountId, tracker]);

  const buttonLabel = isFollowing ? "Seguindo" : "Seguir";
  const visiblePosts = useMemo(() => posts.filter(Boolean), [posts]);

  const handleFollowToggle = async () => {
    if (!profileAccountId || isFollowLoading) return;

    const previousState = isFollowing;
    setIsFollowLoading(true);
    setIsFollowing?.(profileAccountId, !previousState);

    try {
      await tracker.toggleFollowAccount(profileAccountId, previousState);
    } catch (error) {
      setIsFollowing?.(profileAccountId, previousState);
      console.error("DirectoAi SDK: Failed to toggle follow from profile:", error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Perfil de ${profileName}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "#ffffff",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: PROFILE_CONTENT_WIDTH,
          margin: "0 auto",
          padding: "28px 20px 48px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <button
            type="button"
            aria-label="Voltar"
            onClick={onClose}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "9999px",
              border: "none",
              backgroundColor: "transparent",
              color: "#6b7280",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowLeft size={30} strokeWidth={2.2} />
          </button>

          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "9999px",
              overflow: "hidden",
              border: "1px solid #e5e7eb",
              backgroundColor: "#f8fafc",
              flexShrink: 0,
            }}
          >
            {profileAvatarUrl ? (
              <img
                src={profileAvatarUrl}
                alt={profileName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : null}
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                lineHeight: 1.1,
                fontWeight: 700,
                color: "#101828",
              }}
            >
              {profileName}
            </h2>
          </div>
        </div>

        <div style={{ marginTop: "36px", width: "100%" }}>
          <div
            style={{
              fontSize: "24px",
              lineHeight: 1.2,
              fontWeight: 500,
              color: "#344054",
            }}
          >
            {profileName}
          </div>

          {profileDescription ? (
            <p
              style={{
                margin: "10px 0 0",
                fontSize: "16px",
                lineHeight: 1.5,
                color: "#667085",
              }}
            >
              {profileDescription}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => void handleFollowToggle()}
            disabled={!profileAccountId || isFollowLoading}
            style={{
              marginTop: "22px",
              width: "100%",
              minHeight: "58px",
              borderRadius: "14px",
              border: "1px solid #d0d5dd",
              backgroundColor: isFollowing ? "#ffffff" : "#11b780",
              color: isFollowing ? "#101828" : "#ffffff",
              fontSize: "20px",
              fontWeight: 600,
              cursor:
                !profileAccountId || isFollowLoading ? "not-allowed" : "pointer",
              opacity: !profileAccountId || isFollowLoading ? 0.7 : 1,
            }}
          >
            {isFollowLoading ? "Processando..." : buttonLabel}
          </button>
        </div>

        <div
          style={{
            marginTop: "28px",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "28px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "28px",
              lineHeight: 1.2,
              fontWeight: 700,
              color: "#101828",
            }}
          >
            Publicações
          </h3>
        </div>

        <div
          style={{
            marginTop: "28px",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "28px",
          }}
        >
          {isLoading ? (
            <div
              style={{
                minHeight: "240px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#667085",
                gap: "10px",
              }}
            >
              <LoaderCircle size={20} className="directo-spin" />
              Carregando publicações...
            </div>
          ) : errorMessage ? (
            <div
              style={{
                minHeight: "180px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "#b42318",
                fontSize: "16px",
                padding: "24px",
                border: "1px solid #fecdca",
                borderRadius: "16px",
                backgroundColor: "#fff7f6",
              }}
            >
              {errorMessage}
            </div>
          ) : visiblePosts.length === 0 ? (
            <div
              style={{
                minHeight: "180px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "#667085",
                fontSize: "16px",
                padding: "24px",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                backgroundColor: "#f8fafc",
              }}
            >
              Esta conta ainda não possui publicações disponíveis.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "24px",
              }}
            >
              {visiblePosts.map((post, index) => (
                <div
                  key={post.id || post.contentId || `${profileAccountId}-${index}`}
                  style={{ width: PROFILE_CARD_WIDTH, maxWidth: "100%" }}
                >
                  <Post post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        .directo-spin {
          animation: directo-spin 1s linear infinite;
        }
        @keyframes directo-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>,
    document.body,
  );
}
