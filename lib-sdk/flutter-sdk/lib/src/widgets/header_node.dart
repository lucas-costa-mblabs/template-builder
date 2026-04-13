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
      await sdk.tracker.toggleFollowAccount(profileAccountId, previousFollowing);
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
      padding: const EdgeInsets.symmetric(vertical: 8.0),
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
                  icon: const Icon(Icons.more_vert, color: Color(0xFF6B7280)),
                  onSelected: (item) async {
                    await _handleMenuSelection(
                      context,
                      sdk,
                      item,
                    );
                  },
                  itemBuilder: (BuildContext context) {
                    return menuItems.map<PopupMenuEntry<Map<String, dynamic>>>((
                      item,
                    ) {
                      final iconName = item['icon']?.toString() ?? 'more';
                      IconData iconData = Icons.more_vert;
                      if (iconName == 'flag') iconData = Icons.flag_outlined;
                      if (iconName == 'report')
                        iconData = Icons.warning_amber_outlined;
                      if (iconName == 'follow')
                        iconData = Icons.person_add_outlined;
                      if (iconName == 'store') iconData = Icons.store_outlined;
                      if (iconName == 'heart') iconData = Icons.favorite_border;
                      if (iconName == 'share') iconData = Icons.share_outlined;
                      if (iconName == 'bookmark') iconData = Icons.bookmark_border;
                      final itemAction = ComponentAction.fromOptionalJson(
                        item['action'],
                      );
                      final actionName =
                          itemAction?.payload.actionName?.trim().toLowerCase();
                      final isFollowAction =
                          actionName == 'follow' || actionName == 'unfollow';
                      final itemLabel = isFollowAction
                          ? (isFollowing ? 'Deixar de seguir' : 'Seguir')
                          : (item['text']?.toString() ??
                                item['label']?.toString() ??
                                '');

                      LabelWidget(String text) =>
                          Text(text, style: const TextStyle(fontSize: 14));

                      return PopupMenuItem<Map<String, dynamic>>(
                        value: item as Map<String, dynamic>,
                        child: Row(
                          children: [
                            Icon(
                              iconData,
                              size: 20,
                              color: const Color(0xFF6B7280),
                            ),
                            const SizedBox(width: 8),
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
