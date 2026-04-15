import 'package:flutter/material.dart';
import 'models/models.dart';
import 'provider.dart';
import 'renderer.dart';
import 'utils.dart';
import 'widgets/legacy_html_view.dart';

class CVDPost extends StatelessWidget {
  final Post post;
  final DirectoAiTemplate? template;

  const CVDPost({super.key, required this.post, this.template});

  @override
  Widget build(BuildContext context) {
    final sdk = DirectoAiTemplateProvider.of(context);
    if (sdk == null) {
      return const Center(
        child: Text('Error: DirectoAiTemplateProvider not found!'),
      );
    }

    // Fallback para JSON Template (Builder)
    DirectoAiTemplate? resolvedTemplate = template;
    try {
      resolvedTemplate ??= sdk.templates.firstWhere(
        (t) => t.templateId == post.templateId,
      );
    } catch (e) {
      // Not found
    }

    if ((post.template?.isNotEmpty ?? false) && resolvedTemplate == null) {
      final legacyContext = {
        ...post.toJson(),
        'Title': post.title,
        'ImageURL': post.url,
        'Caption': post.legend,
        'CustomVariables': post.customVariables ?? {},
        'Sponsored': post.sponsored ?? false,
        'Liked': post.liked ?? false,
        'LikeCount': post.likeCount ?? 0,
        'Favorite': post.favorite ?? false,
        ...(post.customVariables ?? {}),
      };

      final renderedHtml = resolveVariables(post.template, legacyContext);

      return Container(
        width: double.infinity,
        clipBehavior: Clip.antiAlias,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: LegacyHtmlView(html: renderedHtml),
      );
    }

    if (resolvedTemplate == null) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: Colors.orange.withOpacity(0.5),
            style: BorderStyle.solid,
          ),
        ),
        child: Center(
          child: Text(
            'Template não encontrado: ${post.templateId}',
            style: const TextStyle(color: Colors.grey),
          ),
        ),
      );
    }

    final customVariables = post.customVariables ?? {};
    final customProfile = customVariables['profile'] is Map<String, dynamic>
        ? Map<String, dynamic>.from(customVariables['profile'])
        : <String, dynamic>{};

    final dataContext = {
      'post': {
        ...post.toJson(),
        'profile': post.profile?.toJson() ?? customProfile,
        'shop':
            post.shop?.toJson() ??
            {
              'name': customProfile['accountName'] ?? '',
              'avatar': customProfile['iconUrl'] ?? '',
            },
      },
    };

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0D000000),
            blurRadius: 3,
            offset: Offset(0, 1),
          ),
          BoxShadow(
            color: Color(0x03000000),
            blurRadius: 2,
            offset: Offset(0, 1),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: resolvedTemplate.data.map((node) {
          return CVDRenderer(
            node: node as Map<String, dynamic>,
            dataContext: dataContext,
          );
        }).toList(),
      ),
    );
  }
}
