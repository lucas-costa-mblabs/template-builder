import 'package:flutter/material.dart';
import 'package:directo_template_builder/directo_template_builder.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SDUI Flutter SDK Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const SduiFeedScreen(),
    );
  }
}

class SduiFeedScreen extends StatefulWidget {
  const SduiFeedScreen({super.key});

  @override
  State<SduiFeedScreen> createState() => _SduiFeedScreenState();
}

class _SduiFeedScreenState extends State<SduiFeedScreen> {
  late final DirectoAiConfig _config;
  late final DefaultDirectoAiTracker _tracker;
  late final DirectoAiRemoteFeedService _remoteFeedService;
  late Future<List<Post>> _feedFuture;

  @override
  void initState() {
    super.initState();
    _config = DirectoAiConfig(
      accountId: 'b3e196b8-046e-4092-bc42-aa8425a168d2',
      apiKey: 'e8a6f853-d162-44a0-85ec-4479d447e22a',
      customerId: 'mock-customer-123',
      baseUrl: 'https://api.dev-directoai.com.br',
    );
    _tracker = DefaultDirectoAiTracker(_config);
    _remoteFeedService = DirectoAiRemoteFeedService();
    _feedFuture = _remoteFeedService.load(_config);
  }

  void _reloadFeed() {
    setState(() {
      DirectoAiRemoteFeedService.clearCache(_config);
      _feedFuture = _remoteFeedService.load(_config);
    });
  }

  @override
  Widget build(BuildContext context) {
    return DirectoAiRemoteTemplateProvider(
      config: _config,
      tracker: _tracker,
      loadingBuilder: (context) =>
          const Scaffold(body: Center(child: CircularProgressIndicator())),
      child: Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        appBar: AppBar(
          title: const Text(
            'Directo SDUI SDK',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          centerTitle: true,
          backgroundColor: Colors.white,
          elevation: 0,
        ),
        body: FutureBuilder<List<Post>>(
          future: _feedFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState != ConnectionState.done) {
              return const Center(child: CircularProgressIndicator());
            }

            if (snapshot.hasError) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        'Nao foi possivel carregar os posts agora.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Color(0xFFB42318),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 12),
                      FilledButton(
                        onPressed: _reloadFeed,
                        child: const Text('Tentar novamente'),
                      ),
                    ],
                  ),
                ),
              );
            }

            final posts = snapshot.data ?? const <Post>[];

            return ListView.separated(
              padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
              itemCount: posts.length,
              separatorBuilder: (context, index) => const SizedBox(height: 20),
              itemBuilder: (context, index) {
                return Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 400),
                    child: CVDPost(post: posts[index]),
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }
}
