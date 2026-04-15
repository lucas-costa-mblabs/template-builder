import 'package:flutter/material.dart';

class ScrollableContainer extends StatelessWidget {
  final Axis orientation;
  final List<Widget> children;
  final EdgeInsetsGeometry? padding;

  const ScrollableContainer({
    super.key,
    this.orientation = Axis.vertical,
    this.padding,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    final content = orientation == Axis.horizontal
        ? Row(children: children)
        : Column(children: children);

    return SingleChildScrollView(
      scrollDirection: orientation,
      padding: padding,
      child: content,
    );
  }
}
