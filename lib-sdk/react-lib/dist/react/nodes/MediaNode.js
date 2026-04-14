import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { resolveVariables } from "../utils.js";
import { executeAction } from "../executeAction.js";
import { inferMediaType, isHlsUrl, parseAspectRatio } from "../media.js";
import { Pause, Play, Volume2, VolumeX, } from "lucide-react";
import { getActiveVideo, setActiveVideo, subscribeToActiveVideo } from "../videoCoordinator.js";
export function MediaNode({ node, dataContext }) {
    const url = resolveVariables(node.url, dataContext)?.trim();
    if (!url)
        return null;
    const mediaType = inferMediaType(url, node.mediaType);
    const posterUrl = resolveVariables(node.posterUrl, dataContext)?.trim();
    const aspectRatio = parseAspectRatio(node.aspectRatio);
    const resolvedAspectRatio = mediaType === "video"
        ? (aspectRatio ?? 4 / 5)
        : aspectRatio;
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const videoIdRef = useRef(`directo-video-${Math.random().toString(36).slice(2, 11)}`);
    const [isVisible, setIsVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(node.muted ?? true);
    const width = node.width || "100%";
    const height = node.height || "auto";
    const controls = node.controls ?? false;
    const muted = node.muted ?? true;
    const loop = node.loop ?? true;
    const playsInline = node.playsInline ?? true;
    const autoplay = node.autoplay ?? true;
    const shouldHandleClick = Boolean(node.action && mediaType !== "video");
    const baseStyle = {
        flex: node.flex || undefined,
        minHeight: node.flex ? 0 : undefined,
    };
    useEffect(() => {
        setIsMuted(muted);
    }, [muted]);
    useEffect(() => {
        if (mediaType !== "video" || !containerRef.current)
            return;
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.6);
        }, { threshold: [0, 0.25, 0.6, 0.85] });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [mediaType]);
    useEffect(() => {
        if (mediaType !== "video" || !videoRef.current)
            return;
        const videoElement = videoRef.current;
        let cleanup;
        let cancelled = false;
        if (isHlsUrl(url)) {
            if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
                videoElement.src = url;
            }
            else {
                void import("hls.js")
                    .then(({ default: Hls }) => {
                    if (cancelled || !videoRef.current)
                        return;
                    if (Hls.isSupported()) {
                        const hls = new Hls();
                        hls.loadSource(url);
                        hls.attachMedia(videoRef.current);
                        cleanup = () => hls.destroy();
                    }
                    else {
                        videoRef.current.src = url;
                    }
                })
                    .catch(() => {
                    if (!cancelled && videoRef.current) {
                        videoRef.current.src = url;
                    }
                });
            }
        }
        else {
            videoElement.src = url;
        }
        return () => {
            cancelled = true;
            cleanup?.();
        };
    }, [mediaType, url]);
    useEffect(() => {
        if (mediaType !== "video" || !videoRef.current)
            return;
        videoRef.current.muted = isMuted;
    }, [isMuted, mediaType]);
    useEffect(() => {
        if (mediaType !== "video" || !videoRef.current)
            return;
        const videoElement = videoRef.current;
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        videoElement.addEventListener("play", handlePlay);
        videoElement.addEventListener("pause", handlePause);
        videoElement.addEventListener("ended", handlePause);
        return () => {
            videoElement.removeEventListener("play", handlePlay);
            videoElement.removeEventListener("pause", handlePause);
            videoElement.removeEventListener("ended", handlePause);
        };
    }, [mediaType]);
    useEffect(() => {
        if (mediaType !== "video")
            return;
        return subscribeToActiveVideo((activeVideoId) => {
            if (activeVideoId &&
                activeVideoId !== videoIdRef.current &&
                videoRef.current &&
                !videoRef.current.paused) {
                videoRef.current.pause();
            }
        });
    }, [mediaType]);
    useEffect(() => {
        if (mediaType !== "video")
            return;
        return () => {
            if (getActiveVideo() === videoIdRef.current) {
                setActiveVideo(null);
            }
        };
    }, [mediaType]);
    useEffect(() => {
        if (mediaType !== "video" || !videoRef.current)
            return;
        const videoElement = videoRef.current;
        if (!isVisible) {
            if (!videoElement.paused) {
                videoElement.pause();
            }
            if (getActiveVideo() === videoIdRef.current) {
                setActiveVideo(null);
            }
            return;
        }
        if (!autoplay)
            return;
        setActiveVideo(videoIdRef.current);
        void videoElement.play().catch(() => {
            setIsPlaying(false);
        });
    }, [autoplay, isVisible, mediaType]);
    const mediaStyle = useMemo(() => ({
        width: "100%",
        height: "100%",
        objectFit: mediaType === "video"
            ? "cover"
            : (node.objectFit || "cover"),
        display: "block",
        backgroundColor: "#f8fafc",
    }), [mediaType, node.objectFit]);
    const togglePlayback = () => {
        if (!videoRef.current)
            return;
        if (videoRef.current.paused) {
            setActiveVideo(videoIdRef.current);
            void videoRef.current.play().catch(() => {
                setIsPlaying(false);
            });
            return;
        }
        videoRef.current.pause();
        if (getActiveVideo() === videoIdRef.current) {
            setActiveVideo(null);
        }
    };
    const content = mediaType === "video"
        ? (_jsxs("div", { style: {
                width: "100%",
                height: "100%",
                position: "relative",
                backgroundColor: "#020617",
            }, children: [_jsx("video", { "data-testid": "media-video", ref: videoRef, src: !isHlsUrl(url) ? url : undefined, poster: posterUrl || undefined, controls: controls, muted: isMuted, loop: loop, playsInline: playsInline, autoPlay: false, preload: "metadata", style: mediaStyle, onClick: (event) => {
                        event.stopPropagation();
                        togglePlayback();
                    } }), _jsx("button", { type: "button", "aria-label": isPlaying ? "Pausar video" : "Reproduzir video", onClick: (event) => {
                        event.stopPropagation();
                        togglePlayback();
                    }, style: {
                        position: "absolute",
                        inset: 0,
                        border: "none",
                        background: "linear-gradient(to top, rgba(2, 6, 23, 0.2), rgba(2, 6, 23, 0))",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        padding: 0,
                    }, children: _jsx("span", { style: {
                            width: "58px",
                            height: "58px",
                            borderRadius: "9999px",
                            backgroundColor: "rgba(15, 23, 42, 0.65)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: isPlaying ? 0 : 1,
                            transition: "opacity 180ms ease",
                        }, children: isPlaying ? _jsx(Pause, { size: 28 }) : _jsx(Play, { size: 28, fill: "#ffffff" }) }) }), _jsx("button", { type: "button", "aria-label": isMuted ? "Ativar som" : "Silenciar video", onClick: (event) => {
                        event.stopPropagation();
                        setIsMuted((current) => !current);
                    }, style: {
                        position: "absolute",
                        right: "12px",
                        bottom: "12px",
                        width: "36px",
                        height: "36px",
                        borderRadius: "9999px",
                        border: "none",
                        backgroundColor: "rgba(15, 23, 42, 0.72)",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        zIndex: 2,
                        padding: 0,
                    }, children: isMuted ? _jsx(VolumeX, { size: 18 }) : _jsx(Volume2, { size: 18 }) })] }))
        : (_jsx("img", { src: url, alt: resolveVariables(node.alt || "image", dataContext), style: mediaStyle }));
    return (_jsx("div", { ref: containerRef, style: {
            width,
            height,
            display: "flex",
            overflow: "hidden",
            cursor: shouldHandleClick ? "pointer" : undefined,
            aspectRatio: resolvedAspectRatio ? `${resolvedAspectRatio}` : undefined,
            ...baseStyle,
        }, onClick: shouldHandleClick
            ? () => executeAction(node.action, dataContext)
            : undefined, children: content }));
}
//# sourceMappingURL=MediaNode.js.map