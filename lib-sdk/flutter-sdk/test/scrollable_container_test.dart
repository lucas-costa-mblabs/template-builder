import 'package:directo_template_builder/src/scrollable_container.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('should render vertical scroll view by default', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(body: ScrollableContainer(children: [Text('Item')])),
      ),
    );

    final scrollView = tester.widget<SingleChildScrollView>(
      find.byType(SingleChildScrollView),
    );

    expect(scrollView.scrollDirection, Axis.vertical);
    expect(find.byType(Column), findsOneWidget);
  });

  testWidgets('should render horizontal scroll view when requested', (
    tester,
  ) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ScrollableContainer(
            orientation: Axis.horizontal,
            children: [Text('Item')],
          ),
        ),
      ),
    );

    final scrollView = tester.widget<SingleChildScrollView>(
      find.byType(SingleChildScrollView),
    );

    expect(scrollView.scrollDirection, Axis.horizontal);
    expect(find.byType(Row), findsOneWidget);
  });
}
