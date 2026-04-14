typedef ResolvedMediaType = String;

const List<String> _videoExtensions = <String>[
  '.mp4',
  '.m4v',
  '.mov',
  '.webm',
  '.ogv',
  '.ogg',
  '.m3u8',
];

String _normalizeMediaUrl(String? value) {
  if (value == null || value.trim().isEmpty) return '';
  return value.trim().toLowerCase().split('#').first.split('?').first;
}

ResolvedMediaType inferMediaType(String? url, {String? explicitType}) {
  final normalizedExplicit = explicitType?.trim().toLowerCase() ?? '';

  if (normalizedExplicit == 'video') return 'video';
  if (normalizedExplicit == 'image') return 'image';

  final normalizedUrl = _normalizeMediaUrl(url);
  final isVideo = _videoExtensions.any(normalizedUrl.endsWith);
  return isVideo ? 'video' : 'image';
}

bool isHlsUrl(String? url) {
  return _normalizeMediaUrl(url).endsWith('.m3u8');
}

double? parseAspectRatio(String? value) {
  if (value == null || value.trim().isEmpty) return null;

  final trimmed = value.trim();
  if (trimmed.contains('/')) {
    final parts = trimmed.split('/');
    if (parts.length != 2) return null;

    final width = double.tryParse(parts[0]);
    final height = double.tryParse(parts[1]);

    if (width == null || height == null || width <= 0 || height <= 0) {
      return null;
    }

    return width / height;
  }

  final numericValue = double.tryParse(trimmed);
  if (numericValue == null || numericValue <= 0) return null;
  return numericValue;
}
