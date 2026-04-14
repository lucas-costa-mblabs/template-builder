import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import 'package:visibility_detector/visibility_detector.dart';

import '../media_utils.dart';
import '../video_feed_coordinator.dart';

class VideoNodeWidget extends StatefulWidget {
  final String url;
  final String? posterUrl;
  final double? width;
  final double? height;
  final double? aspectRatio;
  final BoxFit fit;
  final bool autoplay;
  final bool muted;
  final bool loop;
  final bool controls;

  const VideoNodeWidget({
    super.key,
    required this.url,
    this.posterUrl,
    this.width,
    this.height,
    this.aspectRatio,
    required this.fit,
    required this.autoplay,
    required this.muted,
    required this.loop,
    required this.controls,
  });

  @override
  State<VideoNodeWidget> createState() => _VideoNodeWidgetState();
}

class _VideoNodeWidgetState extends State<VideoNodeWidget> {
  late final String _videoId;
  VideoPlayerController? _controller;
  bool _isInitialized = false;
  bool _hasError = false;
  bool _isMuted = true;
  bool _isVisibleEnough = false;

  @override
  void initState() {
    super.initState();
    _videoId = 'directo-video-${UniqueKey()}';
    _isMuted = widget.muted;
    FeedVideoCoordinator.activeVideoId.addListener(_handleActiveVideoChanged);
    _initializeController();
  }

  @override
  void didUpdateWidget(covariant VideoNodeWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.url != widget.url) {
      _disposeController();
      _initializeController();
    }
    if (oldWidget.muted != widget.muted) {
      _isMuted = widget.muted;
      _controller?.setVolume(_isMuted ? 0 : 1);
    }
  }

  Future<void> _initializeController() async {
    final controller = VideoPlayerController.networkUrl(Uri.parse(widget.url));
    _controller = controller;

    try {
      await controller.setLooping(widget.loop);
      await controller.setVolume(_isMuted ? 0 : 1);
      await controller.initialize();

      if (!mounted) return;
      setState(() {
        _isInitialized = true;
        _hasError = false;
      });

      await _syncPlaybackWithVisibility();
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _hasError = true;
        _isInitialized = false;
      });
    }
  }

  Future<void> _togglePlayback() async {
    if (_controller == null || !_isInitialized) return;

    if (_controller!.value.isPlaying) {
      await _controller!.pause();
      FeedVideoCoordinator.clear(_videoId);
    } else {
      FeedVideoCoordinator.activate(_videoId);
      await _controller!.play();
    }

    if (mounted) {
      setState(() {});
    }
  }

  Future<void> _toggleMute() async {
    _isMuted = !_isMuted;
    await _controller?.setVolume(_isMuted ? 0 : 1);
    if (mounted) {
      setState(() {});
    }
  }

  Future<void> _syncPlaybackWithVisibility() async {
    if (_controller == null || !_isInitialized) return;

    if (!_isVisibleEnough) {
      if (_controller!.value.isPlaying) {
        await _controller!.pause();
      }
      FeedVideoCoordinator.clear(_videoId);
      if (mounted) {
        setState(() {});
      }
      return;
    }

    if (!widget.autoplay) return;

    FeedVideoCoordinator.activate(_videoId);
    await _controller!.play();
    if (mounted) {
      setState(() {});
    }
  }

  void _handleActiveVideoChanged() {
    if (!mounted || _controller == null || !_isInitialized) return;

    final activeVideoId = FeedVideoCoordinator.activeVideoId.value;
    if (activeVideoId == null || activeVideoId == _videoId) return;

    if (_controller!.value.isPlaying) {
      _controller!.pause().then((_) {
        if (mounted) {
          setState(() {});
        }
      });
    }
  }

  void _disposeController() {
    _controller?.dispose();
    _controller = null;
  }

  @override
  void dispose() {
    FeedVideoCoordinator.activeVideoId.removeListener(
      _handleActiveVideoChanged,
    );
    FeedVideoCoordinator.clear(_videoId);
    _disposeController();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_hasError) {
      return _fallback();
    }

    final resolvedAspectRatio =
        widget.aspectRatio ??
        (_isInitialized &&
                _controller != null &&
                _controller!.value.aspectRatio > 0
            ? _controller!.value.aspectRatio
            : null) ??
        (isHlsUrl(widget.url) ? 16 / 9 : 1);

    Widget child;
    if (!_isInitialized || _controller == null) {
      child = Stack(
        fit: StackFit.expand,
        children: [
          if (widget.posterUrl != null && widget.posterUrl!.isNotEmpty)
            Image.network(
              widget.posterUrl!,
              fit: widget.fit,
              errorBuilder: (_, __, ___) => _placeholder(),
            )
          else
            _placeholder(),
          const Center(child: CircularProgressIndicator(strokeWidth: 2)),
        ],
      );
    } else {
      child = FittedBox(
        fit: widget.fit,
        clipBehavior: Clip.hardEdge,
        child: SizedBox(
          width: _controller!.value.size.width,
          height: _controller!.value.size.height,
          child: VideoPlayer(_controller!),
        ),
      );
    }

    final sized = SizedBox(
      width: widget.width,
      height: widget.height,
      child: AspectRatio(
        aspectRatio: resolvedAspectRatio,
        child: Stack(
          fit: StackFit.expand,
          children: [
            child,
            if (_isInitialized && _controller != null)
              Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: _togglePlayback,
                  child: Center(
                    child: AnimatedOpacity(
                      opacity: _controller!.value.isPlaying ? 0 : 1,
                      duration: const Duration(milliseconds: 180),
                      child: Container(
                        width: 56,
                        height: 56,
                        decoration: const BoxDecoration(
                          color: Color(0x800F172A),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          _controller!.value.isPlaying
                              ? Icons.pause_rounded
                              : Icons.play_arrow_rounded,
                          color: Colors.white,
                          size: 34,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            if (_isInitialized)
              Positioned(
                right: 12,
                bottom: 12,
                child: Material(
                  color: const Color(0xB80F172A),
                  shape: const CircleBorder(),
                  child: InkWell(
                    customBorder: const CircleBorder(),
                    onTap: _toggleMute,
                    child: Padding(
                      padding: const EdgeInsets.all(9),
                      child: Icon(
                        _isMuted
                            ? Icons.volume_off_rounded
                            : Icons.volume_up_rounded,
                        size: 18,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );

    return VisibilityDetector(
      key: ValueKey(_videoId),
      onVisibilityChanged: (info) {
        final nextIsVisibleEnough = info.visibleFraction >= 0.6;
        if (nextIsVisibleEnough == _isVisibleEnough) return;
        _isVisibleEnough = nextIsVisibleEnough;
        _syncPlaybackWithVisibility();
      },
      child: sized,
    );
  }

  Widget _placeholder() {
    return Container(
      color: const Color(0xFFF1F5F9),
      alignment: Alignment.center,
      child: const Icon(
        Icons.play_circle_outline_rounded,
        size: 42,
        color: Color(0xFF94A3B8),
      ),
    );
  }

  Widget _fallback() {
    return Container(
      width: widget.width,
      height: widget.height,
      color: const Color(0xFFF1F5F9),
      alignment: Alignment.center,
      child: const Icon(
        Icons.broken_image_outlined,
        size: 32,
        color: Color(0xFF94A3B8),
      ),
    );
  }
}
