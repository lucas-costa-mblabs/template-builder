export type ResolvedMediaType = "image" | "video";
export declare function inferMediaType(url?: string | null, explicitType?: unknown): ResolvedMediaType;
export declare function isHlsUrl(url?: string | null): boolean;
export declare function parseAspectRatio(value?: string | null): number | undefined;
//# sourceMappingURL=media.d.ts.map