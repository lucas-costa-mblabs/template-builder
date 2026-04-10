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
                    child: Text(
                      title,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF111827),
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Right side: Menu Items
          if (menuItems.isNotEmpty)
            Row(
              mainAxisSize: MainAxisSize.min,
              children: menuItems.map<Widget>((item) {
                final itemAction = ComponentAction.fromOptionalJson(
                  item['action'],
                );
                final iconName = item['icon']?.toString() ?? 'more';

                IconData iconData = Icons.more_vert;
                if (iconName == 'flag') iconData = Icons.flag_outlined;
                if (iconName == 'report')
                  iconData = Icons.warning_amber_outlined;
                if (iconName == 'follow') iconData = Icons.person_add_outlined;
                if (iconName == 'store') iconData = Icons.store_outlined;
                if (iconName == 'heart') iconData = Icons.favorite_border;
                if (iconName == 'share') iconData = Icons.share_outlined;
                if (iconName == 'bookmark') iconData = Icons.bookmark_border;

                return GestureDetector(
                  onTap: itemAction != null
                      ? () => executeAction(
                          itemAction,
                          context,
                          dataContext,
                          sdk?.onAction,
                        )
                      : null,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: Icon(
                      iconData,
                      size: 20,
                      color: const Color(0xFF6B7280),
                    ),
                  ),
                );
              }).toList(),
            ),
        ],
      ),
    );
  }
}
