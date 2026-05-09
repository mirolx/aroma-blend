import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface HeadingProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3';
}

export default function Heading({ style, variant = 'h2', ...props }: HeadingProps) {
  return <Text style={[styles.base, styles[variant], style]} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#2D1B5C',
  },
  h1: { fontSize: 40, letterSpacing: 1.5 },
  h2: { fontSize: 28, letterSpacing: 0.5 },
  h3: { fontSize: 20 },
});
