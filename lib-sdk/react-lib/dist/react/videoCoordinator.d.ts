type Listener = (activeVideoId: string | null) => void;
export declare function subscribeToActiveVideo(listener: Listener): () => void;
export declare function setActiveVideo(videoId: string | null): void;
export declare function getActiveVideo(): string | null;
export {};
//# sourceMappingURL=videoCoordinator.d.ts.map