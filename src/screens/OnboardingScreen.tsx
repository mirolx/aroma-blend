import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ViewToken,
  Animated,
} from 'react-native';
import Text from '../components/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');
const FOOTER_H = 148;
const SLIDE_H  = height - FOOTER_H;

const SLIDES = [
  {
    key:   '1',
    emoji: '🌿',
    title: '향기는 마음을 치유해요',
    description:
      '아로마 오일의 향은 코를 통해 뇌의 감정 중추에 직접 닿아요.\n라벤더 한 방울이 긴장을 풀고,\n레몬 향기가 무거운 기분을 가볍게 띄워주듯\n향기는 말보다 빠르게 마음에 닿아요.',
    bg: '#F5F0FF' as const,
    accent: '#C8B4E8',
  },
  {
    key:   '2',
    emoji: '🧪',
    title: '오늘의 나에게 맞는 향',
    description:
      '같은 하루도 기분에 따라 필요한 향이 달라요.\n지치고 불안한 날엔 깊은 안정감의 우디 계열,\n무기력한 아침엔 상쾌한 시트러스 계열.\n오늘의 기분과 좋아하는 향 베이스를 알려주시면\n딱 맞는 아로마 조합을 추천해드려요.',
    bg: '#FFF5F0' as const,
    accent: '#E8A090',
  },
  {
    key:   '3',
    emoji: '✨',
    title: '나만의 블렌딩을 만들어요',
    description:
      '추천받은 오일을 플라스크에 직접 넣으며\n나만의 아로마를 완성해보세요.\n완성된 블렌딩은 카드로 저장해서\n소중한 사람과 나눌 수 있어요.',
    bg: '#F0FAF5' as const,
    accent: '#6BBFA0',
  },
];

const DOT_INACTIVE = 10;
const DOT_ACTIVE   = 24;

export default function OnboardingScreen({ navigation }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Animated width values for each dot
  const dotWidths = useRef(
    SLIDES.map((_, i) => new Animated.Value(i === 0 ? DOT_ACTIVE : DOT_INACTIVE))
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length === 0) return;
      const idx = viewableItems[0].index ?? 0;
      setActiveIndex(idx);
      dotWidths.forEach((w, i) => {
        Animated.spring(w, {
          toValue: i === idx ? DOT_ACTIVE : DOT_INACTIVE,
          damping: 14,
          stiffness: 160,
          useNativeDriver: false,
        } as any).start();
      });
    }
  ).current;

  const handleStart = async () => {
    await AsyncStorage.setItem('onboarding_completed', '1');
    navigation.replace('MoodCheck');
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    }
  };

  const isLast = activeIndex === SLIDES.length - 1;
  const currentAccent = SLIDES[activeIndex].accent;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View style={[styles.slide, { backgroundColor: item.bg }]}>
            <View style={styles.slideInner}>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={[styles.title, { color: '#2D1B5C' }]}>{item.title}</Text>
              <View style={[styles.divider, { backgroundColor: item.accent }]} />
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      {/* Footer: dots + button */}
      <View style={styles.footer}>
        {/* Page indicator dots */}
        <View style={styles.dots}>
          {SLIDES.map((slide, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  width: dotWidths[i],
                  backgroundColor: i === activeIndex ? currentAccent : '#DDD6EC',
                },
              ]}
            />
          ))}
        </View>

        {/* Action button */}
        {isLast ? (
          <TouchableOpacity onPress={handleStart} activeOpacity={0.85} style={styles.btnWrapper}>
            <LinearGradient
              colors={['#C8B4E8', '#D4909A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startBtn}
            >
              <Text style={styles.startBtnText}>시작하기 →</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleNext} activeOpacity={0.85} style={styles.btnWrapper}>
            <View style={[styles.nextBtn, { borderColor: currentAccent }]}>
              <Text style={[styles.nextBtnText, { color: currentAccent }]}>다음 →</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' },

  slide: {
    width,
    height: SLIDE_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideInner: {
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingTop: 40,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 28,
  },
  title: {
    fontFamily: 'Ownglyph_corncorn',
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  divider: {
    width: 40,
    height: 3,
    borderRadius: 2,
    marginBottom: 20,
    opacity: 0.6,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 28,
  },

  footer: {
    height: FOOTER_H,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 32,
    paddingTop: 12,
    backgroundColor: '#FAF7F2',
    gap: 20,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
  btnWrapper: {
    width: '100%',
  },
  startBtn: {
    borderRadius: 28,
    paddingVertical: 17,
    alignItems: 'center',
  },
  startBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  nextBtn: {
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  nextBtnText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
