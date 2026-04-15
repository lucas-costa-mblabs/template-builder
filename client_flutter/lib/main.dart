import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
  List<Post> posts = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      debugPrint('DEBUG: Starting _loadData...');
      final postsString = await rootBundle.loadString(
        'assets/feed.response.json',
      );
      debugPrint('DEBUG: Feed JSON loaded from assets.');

      final postsJson = jsonDecode(postsString);
      final List<dynamic> feedItems =
          (postsJson['data']?['feeds'] as List<dynamic>? ?? <dynamic>[]);
      debugPrint('DEBUG: JSONs decoded. Posts count: ${feedItems.length}');

      final parsedPosts = feedItems
          .map((item) => Post.fromJson(Map<String, dynamic>.from(item as Map)))
          .toList();
      debugPrint('DEBUG: Models parsed. Posts: ${parsedPosts.length}');

      setState(() {
        posts = parsedPosts;
        isLoading = false;
      });
      debugPrint('DEBUG: State updated. isLoading: false');
    } catch (e, stack) {
      debugPrint('DEBUG ERROR: $e');
      debugPrint('STACKTRACE: $stack');
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final config = DirectoAiConfig(
      accountId: '0b455c19-e389-4a7f-b83c-ef0cf7286ecb',
      apiKey: '57cbcfd2-fe10-41db-abf3-84bdb569cdae',
      customerId: 'mock-customer-123',
      baseUrl: 'https://api.dev-directoai.com.br',
    );
    final tracker = DefaultDirectoAiTracker(config);

    return DirectoAiRemoteTemplateProvider(
      config: config,
      tracker: tracker,
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
        body: ListView.separated(
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
        ),
      ),
    );
  }
}
