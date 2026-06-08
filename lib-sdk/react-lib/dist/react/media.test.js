import { describe, expect, it } from "vitest";
import { inferMediaType, isHlsUrl, parseAspectRatio } from "./media.js";
describe("media helpers", () => {
    it("should infer video by explicit type", () => {
        expect(inferMediaType("https://example.com/image.png", "video")).toBe("video");
    });
    it("should infer video by extension including m3u8", () => {
        expect(inferMediaType("https://example.com/movie.mp4")).toBe("video");
        expect(inferMediaType("https://example.com/live/playlist.m3u8?token=123")).toBe("video");
    });
    it("should detect hls URLs", () => {
        expect(isHlsUrl("https://example.com/live/playlist.m3u8#fragment")).toBe(true);
        expect(isHlsUrl("https://example.com/image.jpg")).toBe(false);
    });
    it("should parse aspect ratio values", () => {
        expect(parseAspectRatio("16/9")).toBeCloseTo(16 / 9);
        expect(parseAspectRatio("1.5")).toBe(1.5);
        expect(parseAspectRatio("invalid")).toBeUndefined();
    });
});
//# sourceMappingURL=media.test.js.map