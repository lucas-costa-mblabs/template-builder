import 'package:flutter/material.dart';
import '../provider.dart';
import '../utils.dart';
import '../action_handler.dart';

class AvatarNodeWidget extends StatelessWidget {
  final Map<String, dynamic> node;
  final Map<String, dynamic>? dataContext;

  const AvatarNodeWidget({super.key, required this.node, this.dataContext});

  @override
  Widget build(BuildContext context) {
    final sdk = DirectoAiTemplateProvider.of(context);
    final url = resolveVariables(node['url']?.toString(), dataContext).trim();
    final size = double.tryParse(node['size']?.toString() ?? '40') ?? 40.0;
    final bgColor = colorToHex(context, node['backgroundColor']?.toString());
    final radiusStr = node['borderRadius']?.toString();
    final radius = radiusStr == 'full'
        ? size / 2
        : getRadius(context, radiusStr);

    final action = getNodeAction(node);

    Widget child = Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: bgColor == Colors.transparent
            ? const Color(0xFFE5E7EB)
            : bgColor,
        borderRadius: BorderRadius.circular(radius),
      ),
      clipBehavior: Clip.antiAlias,
      child: url.isNotEmpty
          ? Image.network(
              url,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Icon(
                Icons.person,
                size: size * 0.6,
                color: const Color(0xFF6B7280),
              ),
            )
          : Icon(
              Icons.person,
              size: size * 0.6,
              color: const Color(0xFF6B7280),
            ),
    );

    if (action != null) {
      child = GestureDetector(
        onTap: () => executeAction(action, context, dataContext, sdk?.onAction),
        child: child,
      );
    }

    return child;
  }
}
