export type ResolvedMediaType = "image" | "video";

const VIDEO_EXTENSIONS = [
  ".mp4",
  ".m4v",
  ".mov",
  ".webm",
  ".ogv",
  ".ogg",
  ".m3u8",
];

const normalizeMediaUrl = (value?: string | null): string => {
  if (!value) return "";
  return value.trim().toLowerCase().split("#")[0].split("?")[0];
};

export function inferMediaType(
  url?: string | null,
  explicitType?: unknown,
): ResolvedMediaType {
  const normalizedExplicit =
    typeof explicitType === "string" ? explicitType.trim().toLowerCase() : "";

  if (normalizedExplicit === "video") return "video";
  if (normalizedExplicit === "image") return "image";

  const normalizedUrl = normalizeMediaUrl(url);
  return VIDEO_EXTENSIONS.some((extension) => normalizedUrl.endsWith(extension))
    ? "video"
    : "image";
}

export function isHlsUrl(url?: string | null): boolean {
  return normalizeMediaUrl(url).endsWith(".m3u8");
}

export function parseAspectRatio(value?: string | null): number | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (trimmed.includes("/")) {
    const [width, height] = trimmed.split("/");
    const widthValue = Number(width);
    const heightValue = Number(height);

    if (widthValue > 0 && heightValue > 0) {
      return widthValue / heightValue;
    }
    return undefined;
  }

  const numericValue = Number(trimmed);
  return numericValue > 0 ? numericValue : undefined;
}
