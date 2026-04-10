import 'package:flutter/material.dart';
import '../provider.dart';
import '../utils.dart';
import '../action_handler.dart';
import '../models/models.dart';
import 'avatar_node.dart';

class HeaderNodeWidget extends StatelessWidget {
  final Map<String, dynamic> node;
  final Map<String, dynamic>? dataContext;

  const HeaderNodeWidget({super.key, required this.node, this.dataContext});

  @override
  Widget build(BuildContext context) {
    final sdk = DirectoAiTemplateProvider.of(context);
    final avatarUrl = resolveVariables(
      node['imageUrl']?.toString(),
      dataContext,
    ).trim();
    final postData = dataContext?['post'] as Map<String, dynamic>?;
    final isSponsored = postData?['sponsored'] == true;

    final title = resolveVariables(
      node['title']?.toString() ?? node['value']?.toString(),
      dataContext,
    );

    final onProfilePress = getNodeAction(node, 'onProfilePress');
    final menuItems = (node['menuItems'] as List<dynamic>?) ?? [];

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
                      dataContext,
                      sdk?.onAction,
                    )
                  : null,
              child: Row(
                children: [
                  AvatarNodeWidget(
                    node: {
                      'id': '${node['id']}-avatar',
                      'type': 'avatar',
                      'url': avatarUrl,
                      'size': 36,
                      'borderRadius': 'full',
                    },
                    dataContext: dataContext,
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
          // Right side: Menu Items
          if (menuItems.isNotEmpty)
            PopupMenuButton<Map<String, dynamic>>(
              icon: const Icon(Icons.more_vert, color: Color(0xFF6B7280)),
              onSelected: (item) {
                final itemAction = ComponentAction.fromOptionalJson(
                  item['action'],
                );
                if (itemAction != null) {
                  executeAction(
                    itemAction,
                    context,
                    dataContext,
                    sdk?.onAction,
                  );
                }
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
                        LabelWidget(item['label']?.toString() ?? ''),
                      ],
                    ),
                  );
                }).toList();
              },
            ),
        ],
      ),
    );
  }
}
