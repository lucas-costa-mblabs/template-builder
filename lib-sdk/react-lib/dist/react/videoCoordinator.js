let activeVideoId = null;
const listeners = new Set();
export function subscribeToActiveVideo(listener) {
    listeners.add(listener);
    listener(activeVideoId);
    return () => {
        listeners.delete(listener);
    };
}
export function setActiveVideo(videoId) {
    activeVideoId = videoId;
    listeners.forEach((listener) => listener(activeVideoId));
}
export function getActiveVideo() {
    return activeVideoId;
}
//# sourceMappingURL=videoCoordinator.js.map