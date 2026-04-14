type Listener = (activeVideoId: string | null) => void;

let activeVideoId: string | null = null;
const listeners = new Set<Listener>();

export function subscribeToActiveVideo(listener: Listener): () => void {
  listeners.add(listener);
  listener(activeVideoId);

  return () => {
    listeners.delete(listener);
  };
}

export function setActiveVideo(videoId: string | null) {
  activeVideoId = videoId;
  listeners.forEach((listener) => listener(activeVideoId));
}

export function getActiveVideo(): string | null {
  return activeVideoId;
}
