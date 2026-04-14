import 'package:flutter/material.dart';
import '../provider.dart';
import '../utils.dart';
import '../action_handler.dart';
import '../models/models.dart';
import 'avatar_node.dart';

class HeaderNodeWidget extends StatefulWidget {
  final Map<String, dynamic> node;
  final Map<String, dynamic>? dataContext;

  const HeaderNodeWidget({super.key, required this.node, this.dataContext});

  @override
  State<HeaderNodeWidget> createState() => _HeaderNodeWidgetState();
}

class _HeaderNodeWidgetState extends State<HeaderNodeWidget> {
  bool? _isFollowing;
  bool _isFollowLoading = false;

  IconData _resolveMenuIcon(
    String? iconName,
    String? actionName,
    bool isFollowAction,
  ) {
    final normalizedIcon = iconName?.trim().toLowerCase();
    final normalizedAction = actionName?.trim().toLowerCase();

    if (normalizedIcon == 'flag') return Icons.flag_outlined;
    if (normalizedIcon == 'report') return Icons.warning_amber_outlined;
    if (normalizedIcon == 'follow') return Icons.person_add_outlined;
    if (normalizedIcon == 'store') return Icons.store_outlined;
    if (normalizedIcon == 'heart') return Icons.favorite_border;
    if (normalizedIcon == 'share') return Icons.share_outlined;
    if (normalizedIcon == 'bookmark') return Icons.bookmark_border;
    if (normalizedIcon == 'info') return Icons.info_outline;
    if (normalizedIcon == 'user') return Icons.person_add_outlined;
    if (normalizedIcon == 'star') return Icons.warning_amber_outlined;

    if (isFollowAction) return Icons.person_add_outlined;
    if (normalizedAction == 'report' || normalizedAction == 'denunciar') {
      return Icons.warning_amber_outlined;
    }
    if (normalizedAction == 'open_profile' ||
        normalizedAction == 'about' ||
        normalizedAction == 'sobre') {
      return Icons.info_outline;
    }

    return Icons.more_vert;
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final postData = widget.dataContext?['post'] as Map<String, dynamic>?;
    final profileData = postData?['profile'] as Map<String, dynamic>?;
    final initialFollowing =
        postData?['following'] == true ||
        postData?['isFollowing'] == true ||
        profileData?['following'] == true ||
        profileData?['isFollowing'] == true;

    _isFollowing ??= initialFollowing;
  }

  String? get _profileAccountId {
    final postData = widget.dataContext?['post'] as Map<String, dynamic>?;
    final profileData = postData?['profile'] as Map<String, dynamic>?;
    final profileAccountId = profileData?['accountId']?.toString().trim();
    if (profileAccountId != null && profileAccountId.isNotEmpty) {
      return profileAccountId;
    }

    final postAccountId = postData?['accountId']?.toString().trim();
    if (postAccountId != null && postAccountId.isNotEmpty) {
      return postAccountId;
    }

    return null;
  }

  Future<void> _handleMenuSelection(
    BuildContext context,
    DirectoAiTemplateProvider? sdk,
    Map<String, dynamic> item,
  ) async {
    final itemAction = ComponentAction.fromOptionalJson(item['action']);
    final actionName = itemAction?.payload.actionName?.trim().toLowerCase();
    final isFollowAction = actionName == 'follow' || actionName == 'unfollow';
    final profileAccountId = _profileAccountId;

    if (!isFollowAction || profileAccountId == null || sdk == null) {
      if (itemAction != null) {
        await executeAction(
          itemAction,
          context,
          widget.dataContext,
          sdk?.onAction,
          sdk?.onReportSubmit,
        );
      }
      return;
    }

    final previousFollowing = _isFollowing ?? false;
    setState(() {
      _isFollowLoading = true;
      _isFollowing = !previousFollowing;
    });

    try {
      await sdk.tracker.toggleFollowAccount(
        profileAccountId,
        previousFollowing,
      );
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _isFollowing = previousFollowing;
      });
      debugPrint('DirectoAi SDK: Failed to toggle follow state: $error');
    } finally {
      if (mounted) {
        setState(() {
          _isFollowLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final sdk = DirectoAiTemplateProvider.of(context);
    final avatarUrl = resolveVariables(
      widget.node['imageUrl']?.toString(),
      widget.dataContext,
    ).trim();
    final postData = widget.dataContext?['post'] as Map<String, dynamic>?;
    final isSponsored = postData?['sponsored'] == true;

    final title = resolveVariables(
      widget.node['title']?.toString() ?? widget.node['value']?.toString(),
      widget.dataContext,
    );

    final onProfilePress = getNodeAction(widget.node, 'onProfilePress');
    final menuItems = (widget.node['menuItems'] as List<dynamic>?) ?? [];
    final isFollowing = _isFollowing ?? false;

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 10, 12),
      child: Row(
        children: [
          // Left side: Avatar + Title
          Expanded(
            child: GestureDetector(
              onTap: onProfilePress != null
                  ? () => executeAction(
                      onProfilePress,
                      context,
                      widget.dataContext,
                      sdk?.onAction,
                      sdk?.onReportSubmit,
                    )
                  : null,
              child: Row(
                children: [
                  AvatarNodeWidget(
                    node: {
                      'id': '${widget.node['id']}-avatar',
                      'type': 'avatar',
                      'url': avatarUrl,
                      'size': 36,
                      'borderRadius': 'full',
                    },
                    dataContext: widget.dataContext,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF111827),
                            height: 1.2,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                        if (isSponsored) ...[
                          const SizedBox(height: 2),
                          const Text(
                            'Patrocinado',
                            style: TextStyle(
                              fontSize: 12,
                              fontStyle: FontStyle.italic,
                              color: Color(0xFF9ca3af),
                              height: 1.2,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Right side: Follow state + menu
          if (menuItems.isNotEmpty)
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (isFollowing)
                  SizedBox(
                    width: 20,
                    height: 20,
                    child: Stack(
                      clipBehavior: Clip.none,
                      children: [
                        Container(
                          width: 20,
                          height: 20,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: const Color(0xFF6B7280),
                              width: 1.6,
                            ),
                          ),
                          child: const Center(
                            child: Icon(
                              Icons.person_outline,
                              size: 11,
                              color: Color(0xFF6B7280),
                            ),
                          ),
                        ),
                        Positioned(
                          top: -1,
                          right: -1,
                          child: Container(
                            width: 9,
                            height: 9,
                            decoration: const BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                            ),
                            child: const Center(
                              child: Icon(
                                Icons.check,
                                size: 8,
                                color: Color(0xFF6B7280),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                PopupMenuButton<Map<String, dynamic>>(
                  padding: const EdgeInsets.all(4),
                  iconSize: 20,
                  splashRadius: 20,
                  offset: const Offset(0, 8),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  color: const Color(0xFFFFFFFF),
                  elevation: 6,
                  icon: const Icon(
                    Icons.more_vert,
                    color: Color(0xFF6B7280),
                    size: 20,
                  ),
                  onSelected: (item) async {
                    await _handleMenuSelection(context, sdk, item);
                  },
                  itemBuilder: (BuildContext context) {
                    return menuItems.map<PopupMenuEntry<Map<String, dynamic>>>((
                      item,
                    ) {
                      final iconName = item['icon']?.toString();
                      final itemAction = ComponentAction.fromOptionalJson(
                        item['action'],
                      );
                      final actionName = itemAction?.payload.actionName
                          ?.trim()
                          .toLowerCase();
                      final isFollowAction =
                          actionName == 'follow' || actionName == 'unfollow';
                      final iconData = _resolveMenuIcon(
                        iconName,
                        actionName,
                        isFollowAction,
                      );
                      final itemLabel = isFollowAction
                          ? (isFollowing ? 'Deixar de seguir' : 'Seguir')
                          : (item['text']?.toString() ??
                                item['label']?.toString() ??
                                '');

                      LabelWidget(String text) => Text(
                        text,
                        style: const TextStyle(
                          fontSize: 14,
                          color: Color(0xFF111827),
                          fontWeight: FontWeight.w500,
                        ),
                      );

                      return PopupMenuItem<Map<String, dynamic>>(
                        value: item as Map<String, dynamic>,
                        height: 46,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 0,
                        ),
                        child: Row(
                          children: [
                            Icon(
                              iconData,
                              size: 18,
                              color: const Color(0xFF6B7280),
                            ),
                            const SizedBox(width: 10),
                            LabelWidget(
                              isFollowAction && _isFollowLoading
                                  ? 'Processando...'
                                  : itemLabel,
                            ),
                          ],
                        ),
                      );
                    }).toList();
                  },
                ),
              ],
            ),
        ],
      ),
    );
  }
}
