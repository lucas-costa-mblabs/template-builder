import 'package:directo_template_builder/directo_template_builder.dart';
import 'package:directo_template_builder/src/action_handler.dart';
import 'package:directo_template_builder/src/tracker.dart';
import 'package:directo_template_builder/src/widgets/avatar_node.dart';
import 'package:directo_template_builder/src/widgets/header_node.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

class FakeTracker implements DirectoAiTracker {
  String? lastFollowAccountId;
  bool? lastFollowWasFollowing;
  String? lastProfileFeedAccountId;
  List<Post> profileFeedPosts = const [];

  @override
  Future<void> addFavorite(String contentId, {String? campaignId}) async {}

  @override
  Future<List<Post>> fetchProfileFeed(String profileAccountId) async {
    lastProfileFeedAccountId = profileAccountId;
    return profileFeedPosts;
  }

  @override
  Future<void> followAccount(String profileAccountId) async {}

  @override
  Future<void> removeFavorite(String contentId) async {}

  @override
  Future<void> reportContent(
    String contentId, {
    required String reportType,
    String? description,
  }) async {}

  @override
  Future<void> shareContent(
    Map<String, dynamic> contentData, {
    String? campaignId,
    String? title,
  }) async {}

  @override
  Future<void> toggleFavorite(
    String contentId,
    bool isFavorited, {
    String? campaignId,
  }) async {}

  @override
  Future<void> toggleFollowAccount(
    String profileAccountId,
    bool isFollowing,
  ) async {
    lastFollowAccountId = profileAccountId;
    lastFollowWasFollowing = isFollowing;
  }

  @override
  Future<void> toggleLike(String contentId, {String? campaignId}) async {}

  @override
  Future<void> trackEvent(String name, Map<String, dynamic> data) async {}

  @override
  Future<void> trackImpression(
    String contentId,
    Map<String, dynamic> data,
  ) async {}

  @override
  Future<void> trackViewTime(
    String contentId,
    int seconds,
    Map<String, dynamic> data,
  ) async {}

  @override
  Future<void> unfollowAccount(String profileAccountId) async {}
}

void main() {
  final theme = CVDTheme(
    colors: {'primary': '#0D63D6'},
    spacing: {'xs': '4px', 'sm': '8px', 'md': '16px'},
    borderRadius: {'md': '8px'},
    typography: {},
  );

  Widget buildTestWidget({
    required Widget child,
    ReportSubmitCallback? onReportSubmit,
    DirectoAiTracker? tracker,
  }) {
    final config = DirectoAiConfig(accountId: 'test', apiKey: 'test');
    final resolvedTracker = tracker ?? DefaultDirectoAiTracker(config);

    return MaterialApp(
      home: DirectoAiTemplateProvider(
        config: config,
        tracker: resolvedTracker,
        theme: theme,
        templates: const <DirectoAiTemplate>[],
        onReportSubmit: onReportSubmit,
        child: Scaffold(body: child),
      ),
    );
  }

  testWidgets('should open report dialog and submit selected reason', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(1200, 1400));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    ReportSubmission? submission;

    final action = ComponentAction(
      type: 'UI_ACTION',
      payload: ActionPayload(actionName: 'report'),
    );

    await tester.pumpWidget(
      buildTestWidget(
        onReportSubmit: (report, dataContext) async {
          submission = report;
        },
        child: Builder(
          builder: (context) {
            return Center(
              child: ElevatedButton(
                onPressed: () {
                  executeAction(
                    action,
                    context,
                    {
                      'post': {
                        'contentId': 'content_1',
                        'campaignId': 'campaign_1',
                        'title': 'Raquete de Tênis',
                      },
                    },
                    null,
                    DirectoAiTemplateProvider.of(context)?.onReportSubmit,
                  );
                },
                child: const Text('Abrir denúncia'),
              ),
            );
          },
        ),
      ),
    );

    await tester.tap(find.text('Abrir denúncia'));
    await tester.pumpAndSettle();

    expect(find.text('Denunciar anúncio'), findsOneWidget);
    expect(find.text('Outro motivo'), findsOneWidget);

    await tester.tap(find.text('Outro motivo'));
    await tester.pumpAndSettle();

    await tester.enterText(
      find.byType(TextField),
      'Esse anúncio parece incorreto.',
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(
      find.widgetWithText(FilledButton, 'Enviar denúncia'),
    );
    await tester.tap(find.widgetWithText(FilledButton, 'Enviar denúncia'));
    await tester.pumpAndSettle();

    expect(submission, isNotNull);
    expect(submission!.reasonId, 'other_reason');
    expect(submission!.reasonLabel, 'Outro motivo');
    expect(submission!.details, 'Esse anúncio parece incorreto.');
    expect(submission!.contentId, 'content_1');
    expect(submission!.campaignId, 'campaign_1');
  });

  testWidgets('should toggle follow label in header menu', (tester) async {
    await tester.binding.setSurfaceSize(const Size(420, 800));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    final tracker = FakeTracker();

    await tester.pumpWidget(
      buildTestWidget(
        tracker: tracker,
        child: Align(
          alignment: Alignment.topCenter,
          child: SizedBox(
            width: 358,
            child: HeaderNodeWidget(
              node: {
                'id': 'header-follow',
                'type': 'header',
                'title': '{{post.profile.accountName}}',
                'imageUrl': '{{post.profile.iconUrl}}',
                'menuItems': [
                  {
                    'icon': 'user',
                    'text': 'Seguir',
                    'action': {
                      'type': 'UI_ACTION',
                      'payload': {'actionName': 'follow'},
                    },
                  },
                ],
              },
              dataContext: {
                'post': {
                  'accountId': 'profile_1',
                  'profile': {
                    'accountName': 'Super Zeus',
                    'iconUrl': 'https://example.com/avatar.png',
                  },
                },
              },
            ),
          ),
        ),
      ),
    );

    String extractMenuLabel(PopupMenuEntry<Map<String, dynamic>> entry) {
      final popupItem = entry as PopupMenuItem<Map<String, dynamic>>;
      final row = popupItem.child! as Row;
      final label = row.children.last as Text;
      return label.data ?? '';
    }

    var popupMenuButton = tester.widget<PopupMenuButton<Map<String, dynamic>>>(
      find.byType(PopupMenuButton<Map<String, dynamic>>),
    );
    var popupContext = tester.element(
      find.byType(PopupMenuButton<Map<String, dynamic>>),
    );

    expect(
      extractMenuLabel(popupMenuButton.itemBuilder(popupContext).single),
      'Seguir',
    );

    popupMenuButton.onSelected?.call({
      'icon': 'user',
      'text': 'Seguir',
      'action': {
        'type': 'UI_ACTION',
        'payload': {'actionName': 'follow'},
      },
    });
    await tester.pumpAndSettle();

    expect(tracker.lastFollowAccountId, 'profile_1');
    expect(tracker.lastFollowWasFollowing, false);

    popupMenuButton = tester.widget<PopupMenuButton<Map<String, dynamic>>>(
      find.byType(PopupMenuButton<Map<String, dynamic>>),
    );
    popupContext = tester.element(
      find.byType(PopupMenuButton<Map<String, dynamic>>),
    );

    expect(
      extractMenuLabel(popupMenuButton.itemBuilder(popupContext).single),
      'Deixar de seguir',
    );
  });

  testWidgets('should render avatar fallback label when image url is missing', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildTestWidget(
        child: const Center(
          child: AvatarNodeWidget(
            node: {
              'id': 'avatar-fallback',
              'type': 'avatar',
              'fallbackText': 'Flashsale',
              'size': 40,
              'borderRadius': 'full',
            },
          ),
        ),
      ),
    );

    expect(find.text('F'), findsOneWidget);
    expect(find.byIcon(Icons.person), findsNothing);
  });

  testWidgets('should open profile view and load account posts', (
    tester,
  ) async {
    final tracker = FakeTracker()
      ..profileFeedPosts = [
        Post(
          id: 'post_2',
          contentId: 'post_2',
          accountId: 'profile_1',
          title: 'Raquete de Tênis Babolat Pure Aero',
          url: 'https://example.com/image.jpg',
          price: '',
          originalPrice: '',
          discount: '',
          templateId: 'tpl_1',
          profile: PostProfile(
            accountId: 'profile_1',
            accountName: 'Super Zeus',
            iconUrl: 'https://example.com/avatar.png',
          ),
        ),
      ];

    await tester.pumpWidget(
      MaterialApp(
        home: DirectoAiTemplateProvider(
          config: DirectoAiConfig(accountId: 'test', apiKey: 'test'),
          tracker: tracker,
          theme: theme,
          templates: [
            DirectoAiTemplate(
              templateId: 'tpl_1',
              name: 'Test',
              active: true,
              slug: 'test',
              data: [
                {'id': 'text-1', 'type': 'text', 'value': '{{post.title}}'},
              ],
            ),
          ],
          child: Scaffold(
            body: Builder(
              builder: (context) {
                return ElevatedButton(
                  onPressed: () {
                    executeAction(
                      ComponentAction(
                        type: 'UI_ACTION',
                        payload: ActionPayload(actionName: 'open_profile'),
                      ),
                      context,
                      {
                        'post': {
                          'contentId': 'content_1',
                          'accountId': 'profile_1',
                          'templateId': 'tpl_1',
                          'title': 'Super Zeus',
                          'url': 'https://example.com/current-image.jpg',
                          'profile': {
                            'accountId': 'profile_1',
                            'accountName': 'Super Zeus',
                            'iconUrl': 'https://example.com/avatar.png',
                            'description': 'Loja oficial da Super Zeus',
                          },
                        },
                      },
                      null,
                      null,
                    );
                  },
                  child: const Text('Abrir perfil'),
                );
              },
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('Abrir perfil'));
    await tester.pumpAndSettle();

    expect(find.text('Publicações'), findsOneWidget);
    expect(tracker.lastProfileFeedAccountId, 'profile_1');
    expect(find.text('Raquete de Tênis Babolat Pure Aero'), findsOneWidget);

    await tester.tap(find.widgetWithText(OutlinedButton, 'Seguir'));
    await tester.pumpAndSettle();

    expect(tracker.lastFollowAccountId, 'profile_1');
    expect(tracker.lastFollowWasFollowing, false);
    expect(find.widgetWithText(OutlinedButton, 'Seguindo'), findsOneWidget);
  });

  testWidgets(
    'should render profile avatar fallback label when profile image is missing',
    (tester) async {
      final action = ComponentAction(
        type: 'UI_ACTION',
        payload: ActionPayload(actionName: 'open_profile'),
      );

      await tester.pumpWidget(
        buildTestWidget(
          tracker: FakeTracker(),
          child: Builder(
            builder: (context) {
              return Center(
                child: ElevatedButton(
                  onPressed: () {
                    executeAction(
                      action,
                      context,
                      {
                        'post': {
                          'contentId': 'content_4',
                          'accountId': 'profile_4',
                          'templateId': 'tpl_1',
                          'title': 'Flashsale',
                          'url': 'https://example.com/current-image.jpg',
                          'profile': {
                            'accountId': 'profile_4',
                            'accountName': 'Flashsale',
                            'iconUrl': '',
                          },
                        },
                      },
                      null,
                      null,
                    );
                  },
                  child: const Text('Abrir perfil'),
                ),
              );
            },
          ),
        ),
      );

      await tester.tap(find.text('Abrir perfil'));
      await tester.pumpAndSettle();

      expect(find.text('F'), findsOneWidget);
    },
  );

  testWidgets('should show error when profile account id is missing', (
    tester,
  ) async {
    final action = ComponentAction(
      type: 'UI_ACTION',
      payload: ActionPayload(actionName: 'open_profile'),
    );

    await tester.pumpWidget(
      buildTestWidget(
        tracker: FakeTracker(),
        child: Builder(
          builder: (context) {
            return Center(
              child: ElevatedButton(
                onPressed: () {
                  executeAction(
                    action,
                    context,
                    {
                      'post': {
                        'contentId': 'content_3',
                        'templateId': 'tpl_1',
                        'title': 'Conta sem id',
                        'url': 'https://example.com/current-image.jpg',
                        'profile': {
                          'accountName': 'Conta sem id',
                          'iconUrl': 'https://example.com/avatar.png',
                        },
                      },
                    },
                    null,
                    null,
                  );
                },
                child: const Text('Abrir perfil'),
              ),
            );
          },
        ),
      ),
    );

    await tester.tap(find.text('Abrir perfil'));
    await tester.pumpAndSettle();

    expect(
      find.text('Não foi possível identificar o perfil desta conta.'),
      findsOneWidget,
    );
  });
}
