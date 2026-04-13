import 'package:flutter/material.dart';

import '../models/models.dart';
import '../post.dart';
import '../provider.dart';

const double _profileContentWidth = 400;
const double _profileCardWidth = 358;

String _resolveProfileAccountId(Post post) {
  final profileAccountId = post.profile?.accountId?.trim();
  if (profileAccountId != null && profileAccountId.isNotEmpty) {
    return profileAccountId;
  }

  final accountId = post.accountId?.trim();
  if (accountId != null && accountId.isNotEmpty) {
    return accountId;
  }

  return '';
}

bool _getInitialFollowingState(Post post) {
  return post.following == true ||
      post.isFollowing == true ||
      post.profile?.following == true ||
      post.profile?.isFollowing == true;
}

Future<void> showDirectoAiProfileView(
  BuildContext context, {
  required Post post,
}) {
  final sdk = DirectoAiTemplateProvider.of(context);

  return Navigator.of(context).push<void>(
    MaterialPageRoute(
      fullscreenDialog: true,
      builder: (context) {
        final page = DirectoAiProfileViewPage(initialPost: post);
        if (sdk == null) return page;

        return DirectoAiTemplateProvider(
          theme: sdk.theme,
          templates: sdk.templates,
          config: sdk.config,
          tracker: sdk.tracker,
          onAction: sdk.onAction,
          onReportSubmit: sdk.onReportSubmit,
          child: page,
        );
      },
    ),
  );
}

class DirectoAiProfileViewPage extends StatefulWidget {
  final Post initialPost;

  const DirectoAiProfileViewPage({super.key, required this.initialPost});

  @override
  State<DirectoAiProfileViewPage> createState() =>
      _DirectoAiProfileViewPageState();
}

class _DirectoAiProfileViewPageState extends State<DirectoAiProfileViewPage> {
  late final String _profileAccountId;
  late final bool _initialFollowing;
  late bool _isFollowing;
  bool _isFollowLoading = false;
  bool _isLoading = true;
  bool _hasLoadedProfileFeed = false;
  String _errorMessage = '';
  List<Post> _posts = const [];

  String get _profileName {
    final name = widget.initialPost.profile?.accountName.trim();
    if (name != null && name.isNotEmpty) return name;
    return 'Perfil';
  }

  String get _profileAvatarUrl =>
      widget.initialPost.profile?.iconUrl.trim() ?? '';

  String get _profileDescription =>
      widget.initialPost.profile?.description?.trim() ?? '';

  @override
  void initState() {
    super.initState();
    _profileAccountId = _resolveProfileAccountId(widget.initialPost);
    _initialFollowing = _getInitialFollowingState(widget.initialPost);
    _isFollowing = _initialFollowing;
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_hasLoadedProfileFeed) return;
    _hasLoadedProfileFeed = true;
    _loadProfileFeed();
  }

  Future<void> _loadProfileFeed() async {
    final sdk = DirectoAiTemplateProvider.of(context);

    if (_profileAccountId.isEmpty || sdk == null) {
      setState(() {
        _errorMessage = 'Não foi possível identificar o perfil desta conta.';
        _isLoading = false;
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final posts = await sdk.tracker.fetchProfileFeed(_profileAccountId);
      if (!mounted) return;
      setState(() {
        _posts = posts;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _errorMessage =
            'Não foi possível carregar as publicações desta conta agora.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _toggleFollow() async {
    final sdk = DirectoAiTemplateProvider.of(context);
    if (sdk == null || _profileAccountId.isEmpty || _isFollowLoading) {
      return;
    }

    final previousState = _isFollowing;
    setState(() {
      _isFollowLoading = true;
      _isFollowing = !previousState;
    });

    try {
      await sdk.tracker.toggleFollowAccount(_profileAccountId, previousState);
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _isFollowing = previousState;
      });
      debugPrint('DirectoAi SDK: Failed to toggle follow from profile: $error');
    } finally {
      if (mounted) {
        setState(() {
          _isFollowLoading = false;
        });
      }
    }
  }

  Widget _buildAvatar() {
    final avatarUrl = _profileAvatarUrl;
    return Container(
      width: 68,
      height: 68,
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        shape: BoxShape.circle,
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      clipBehavior: Clip.antiAlias,
      child: avatarUrl.isEmpty
          ? const SizedBox.shrink()
          : Image.network(
              avatarUrl,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => const SizedBox.shrink(),
            ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final buttonLabel = _isFollowing ? 'Seguindo' : 'Seguir';

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: _profileContentWidth),
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 28, 20, 48),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        IconButton(
                          onPressed: () => Navigator.of(context).pop(),
                          icon: const Icon(
                            Icons.arrow_back_ios_new_rounded,
                            size: 30,
                          ),
                          color: const Color(0xFF6B7280),
                        ),
                        const SizedBox(width: 8),
                        _buildAvatar(),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Text(
                            _profileName,
                            style: const TextStyle(
                              fontSize: 24,
                              height: 1.1,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF101828),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 36),
                    Text(
                      _profileName,
                      style: const TextStyle(
                        fontSize: 24,
                        height: 1.2,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF344054),
                      ),
                    ),
                    if (_profileDescription.isNotEmpty) ...[
                      const SizedBox(height: 10),
                      Text(
                        _profileDescription,
                        style: const TextStyle(
                          fontSize: 16,
                          height: 1.5,
                          color: Color(0xFF667085),
                        ),
                      ),
                    ],
                    const SizedBox(height: 22),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton(
                        onPressed: _profileAccountId.isEmpty || _isFollowLoading
                            ? null
                            : _toggleFollow,
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size.fromHeight(58),
                          backgroundColor: _isFollowing
                              ? Colors.white
                              : const Color(0xFF11B780),
                          side: const BorderSide(color: Color(0xFFD0D5DD)),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                        child: Text(
                          _isFollowLoading ? 'Processando...' : buttonLabel,
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                            color: _isFollowing
                                ? const Color(0xFF101828)
                                : Colors.white,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 28),
                    const Divider(height: 1, color: Color(0xFFE5E7EB)),
                    const SizedBox(height: 28),
                    const Text(
                      'Publicações',
                      style: TextStyle(
                        fontSize: 28,
                        height: 1.2,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF101828),
                      ),
                    ),
                    const SizedBox(height: 28),
                    const Divider(height: 1, color: Color(0xFFE5E7EB)),
                    const SizedBox(height: 28),
                    if (_isLoading)
                      const SizedBox(
                        height: 240,
                        child: Center(
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              ),
                              SizedBox(width: 12),
                              Text(
                                'Carregando publicações...',
                                style: TextStyle(color: Color(0xFF667085)),
                              ),
                            ],
                          ),
                        ),
                      )
                    else if (_errorMessage.isNotEmpty)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF7F6),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFFECACA)),
                        ),
                        child: Text(
                          _errorMessage,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 16,
                            color: Color(0xFFB42318),
                          ),
                        ),
                      )
                    else if (_posts.isEmpty)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFE5E7EB)),
                        ),
                        child: const Text(
                          'Esta conta ainda não possui publicações disponíveis.',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 16,
                            color: Color(0xFF667085),
                          ),
                        ),
                      )
                    else
                      Center(
                        child: Column(
                          children: _posts
                              .map(
                                (post) => Padding(
                                  padding: const EdgeInsets.only(bottom: 24),
                                  child: SizedBox(
                                    width: _profileCardWidth,
                                    child: CVDPost(post: post),
                                  ),
                                ),
                              )
                              .toList(),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
