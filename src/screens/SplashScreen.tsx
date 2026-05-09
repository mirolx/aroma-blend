import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Text from '../components/Text';
import Heading from '../components/Heading';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const { width, height } = Dimensions.get('window');

const PARTICLES = [
  { x: 0.08, y: 0.12, size: 10, color: '#C8B4E8', delay: 0 },
  { x: 0.88, y: 0.09, size: 14, color: '#D4909A', delay: 300 },
  { x: 0.93, y: 0.38, size: 8,  color: '#C8B4E8', delay: 600 },
  { x: 0.04, y: 0.50, size: 12, color: '#D4909A', delay: 150 },
  { x: 0.16, y: 0.76, size: 9,  color: '#C8B4E8', delay: 450 },
  { x: 0.82, y: 0.73, size: 11, color: '#D4909A', delay: 750 },
  { x: 0.52, y: 0.07, size: 7,  color: '#C8B4E8', delay: 200 },
  { x: 0.70, y: 0.88, size: 13, color: '#C8B4E8', delay: 500 },
  { x: 0.30, y: 0.91, size: 8,  color: '#D4909A', delay: 100 },
  { x: 0.97, y: 0.62, size: 6,  color: '#C8B4E8', delay: 800 },
];

export default function SplashScreen({ navigation }: Props) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale   = useRef(new Animated.Value(0.72)).current;
  const subOpacity  = useRef(new Animated.Value(0)).current;
  const tagOpacity  = useRef(new Animated.Value(0)).current;

  const particleAnims = useRef(PARTICLES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, damping: 12, stiffness: 80, useNativeDriver: true } as any),
      Animated.sequence([Animated.delay(500), Animated.timing(subOpacity, { toValue: 1, duration: 700, useNativeDriver: true })]),
      Animated.sequence([Animated.delay(900), Animated.timing(tagOpacity, { toValue: 1, duration: 700, useNativeDriver: true })]),
    ]).start();

    particleAnims.forEach((anim, i) => {
      const period = 1400 + (i % 4) * 150;
      Animated.sequence([
        Animated.delay(PARTICLES[i].delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, { toValue: 1, duration: period, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0.15, duration: period, useNativeDriver: true }),
          ])
        ),
      ]).start();
    });

    const timer = setTimeout(async () => {
      const done = await AsyncStorage.getItem('onboarding_completed');
      navigation.replace(done ? 'MoodCheck' : 'Onboarding');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {PARTICLES.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              left: p.x * width - p.size / 2,
              top: p.y * height - p.size / 2,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: p.color,
              opacity: particleAnims[i],
            },
          ]}
        />
      ))}

      <Animated.View style={[styles.logoBlock, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <Text style={styles.emoji}>🌿</Text>
        <Heading variant="h1" style={styles.title}>Aroma Blend</Heading>
      </Animated.View>

      <Animated.View style={{ opacity: subOpacity }}>
        <Text style={styles.subtitle}>당신만을 위한 향기 처방</Text>
      </Animated.View>

      <Animated.View style={[styles.tagBlock, { opacity: tagOpacity }]}>
        <View style={styles.divider} />
        <Text style={styles.tagline}>감정을 읽고, 향기로 답하다</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2', alignItems: 'center', justifyContent: 'center' },
  particle: { position: 'absolute' },
  logoBlock: { alignItems: 'center', marginBottom: 12 },
  emoji: { fontSize: 72, marginBottom: 16 },
  title: { fontSize: 40, letterSpacing: 3, color: '#2D1B5C' },
  subtitle: { fontSize: 16, color: '#C8B4E8', letterSpacing: 1, marginBottom: 28 },
  tagBlock: { alignItems: 'center' },
  divider: { width: 48, height: 2, backgroundColor: '#C8B4E8', borderRadius: 1, marginBottom: 16 },
  tagline: { fontSize: 13, color: '#D4909A', letterSpacing: 0.5 },
});
