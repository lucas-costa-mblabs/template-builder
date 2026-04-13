import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { Post } from "./Post.js";
import { useTemplateContext } from "./context.js";
const PROFILE_CONTENT_WIDTH = "400px";
const PROFILE_CARD_WIDTH = "358px";
function getProfileAccountId(post) {
    return (post.profile?.accountId?.trim() ||
        post.accountId?.trim() ||
        "");
}
function getInitialFollowingState(post) {
    return (post.following === true ||
        post.isFollowing === true ||
        post.profile?.following === true ||
        post.profile?.isFollowing === true);
}
function getProfileDescription(post) {
    return post.profile?.description?.trim() || "";
}
export function ProfileViewModal({ initialPost, onClose, }) {
    const { tracker, getIsFollowing, setIsFollowing } = useTemplateContext();
    const profileAccountId = getProfileAccountId(initialPost);
    const profileName = initialPost.profile?.accountName?.trim() || "Perfil";
    const profileAvatarUrl = initialPost.profile?.iconUrl?.trim() || "";
    const profileDescription = getProfileDescription(initialPost);
    const isSponsored = initialPost.sponsored === true || initialPost.profile?.description?.trim();
    const [posts, setPosts] = useState([]);
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
                if (cancelled)
                    return;
                setPosts(nextPosts);
            }
            catch (error) {
                if (cancelled)
                    return;
                setErrorMessage("Não foi possível carregar as publicações desta conta agora.");
            }
            finally {
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
        if (!profileAccountId || isFollowLoading)
            return;
        const previousState = isFollowing;
        setIsFollowLoading(true);
        setIsFollowing?.(profileAccountId, !previousState);
        try {
            await tracker.toggleFollowAccount(profileAccountId, previousState);
        }
        catch (error) {
            setIsFollowing?.(profileAccountId, previousState);
            console.error("DirectoAi SDK: Failed to toggle follow from profile:", error);
        }
        finally {
            setIsFollowLoading(false);
        }
    };
    return (_jsxs("div", { role: "dialog", "aria-modal": "true", "aria-label": `Perfil de ${profileName}`, style: {
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            backgroundColor: "#ffffff",
            overflowY: "auto",
        }, children: [_jsxs("div", { style: {
                    width: "100%",
                    maxWidth: PROFILE_CONTENT_WIDTH,
                    margin: "0 auto",
                    padding: "28px 20px 48px",
                    boxSizing: "border-box",
                }, children: [_jsxs("div", { style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            marginBottom: "18px",
                        }, children: [_jsx("button", { type: "button", "aria-label": "Voltar", onClick: onClose, style: {
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
                                }, children: _jsx(ArrowLeft, { size: 30, strokeWidth: 2.2 }) }), _jsx("div", { style: {
                                    width: "68px",
                                    height: "68px",
                                    borderRadius: "9999px",
                                    overflow: "hidden",
                                    border: "1px solid #e5e7eb",
                                    backgroundColor: "#f8fafc",
                                    flexShrink: 0,
                                }, children: profileAvatarUrl ? (_jsx("img", { src: profileAvatarUrl, alt: profileName, style: {
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    } })) : null }), _jsx("div", { children: _jsx("h2", { style: {
                                        margin: 0,
                                        fontSize: "30px",
                                        lineHeight: 1.1,
                                        fontWeight: 700,
                                        color: "#101828",
                                    }, children: profileName }) })] }), _jsxs("div", { style: {
                            width: "100%",
                            borderRadius: "28px",
                            padding: "24px",
                            boxSizing: "border-box",
                            background: "linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(255,255,255,1) 100%)",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
                        }, children: [_jsx("div", { style: {
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "6px 12px",
                                    borderRadius: "9999px",
                                    backgroundColor: "#eefdf7",
                                    color: "#0f8a62",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    letterSpacing: "0.04em",
                                    textTransform: "uppercase",
                                }, children: isSponsored ? "Marca em destaque" : "Perfil da conta" }), _jsx("div", { style: {
                                    marginTop: "16px",
                                    fontSize: "30px",
                                    lineHeight: 1.2,
                                    fontWeight: 700,
                                    color: "#1f2937",
                                }, children: profileName }), _jsx("p", { style: {
                                    margin: "10px 0 0",
                                    fontSize: "15px",
                                    lineHeight: 1.55,
                                    color: "#667085",
                                }, children: profileDescription ||
                                    "Acompanhe as publicações, novidades e campanhas desta conta em um só lugar." }), _jsxs("div", { style: {
                                    display: "flex",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                    marginTop: "16px",
                                }, children: [_jsx("div", { style: {
                                            padding: "8px 12px",
                                            borderRadius: "14px",
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #e5e7eb",
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            color: "#344054",
                                        }, children: "Conte\u00FAdo da marca" }), _jsx("div", { style: {
                                            padding: "8px 12px",
                                            borderRadius: "14px",
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #e5e7eb",
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            color: "#344054",
                                        }, children: "Publica\u00E7\u00F5es exclusivas" })] }), _jsx("button", { type: "button", onClick: () => void handleFollowToggle(), disabled: !profileAccountId || isFollowLoading, style: {
                                    marginTop: "20px",
                                    width: "100%",
                                    minHeight: "58px",
                                    borderRadius: "14px",
                                    border: "1px solid #d0d5dd",
                                    backgroundColor: isFollowing ? "#ffffff" : "#11b780",
                                    color: isFollowing ? "#101828" : "#ffffff",
                                    fontSize: "20px",
                                    fontWeight: 600,
                                    cursor: !profileAccountId || isFollowLoading ? "not-allowed" : "pointer",
                                    opacity: !profileAccountId || isFollowLoading ? 0.7 : 1,
                                    boxShadow: isFollowing
                                        ? "none"
                                        : "0 12px 24px rgba(17, 183, 128, 0.22)",
                                }, children: isFollowLoading ? "Processando..." : buttonLabel })] }), _jsx("div", { style: {
                            marginTop: "28px",
                            borderTop: "1px solid #e5e7eb",
                            paddingTop: "28px",
                        }, children: _jsx("h3", { style: {
                                margin: 0,
                                fontSize: "28px",
                                lineHeight: 1.2,
                                fontWeight: 700,
                                color: "#101828",
                            }, children: "Publica\u00E7\u00F5es" }) }), _jsx("div", { style: {
                            marginTop: "28px",
                            borderTop: "1px solid #e5e7eb",
                            paddingTop: "28px",
                        }, children: isLoading ? (_jsxs("div", { style: {
                                minHeight: "240px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#667085",
                                gap: "10px",
                            }, children: [_jsx(LoaderCircle, { size: 20, className: "directo-spin" }), "Carregando publica\u00E7\u00F5es..."] })) : errorMessage ? (_jsx("div", { style: {
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
                            }, children: errorMessage })) : visiblePosts.length === 0 ? (_jsx("div", { style: {
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
                            }, children: "Esta conta ainda n\u00E3o possui publica\u00E7\u00F5es dispon\u00EDveis." })) : (_jsx("div", { style: {
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "24px",
                            }, children: visiblePosts.map((post, index) => (_jsx("div", { style: { width: PROFILE_CARD_WIDTH, maxWidth: "100%" }, children: _jsx(Post, { post: post }) }, post.id || post.contentId || `${profileAccountId}-${index}`))) })) })] }), _jsx("style", { children: `
        .directo-spin {
          animation: directo-spin 1s linear infinite;
        }
        @keyframes directo-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      ` })] }));
}
//# sourceMappingURL=ProfileViewModal.js.map