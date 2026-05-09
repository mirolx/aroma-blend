import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Text from '../components/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { BaseType } from '../services/recommendationService';

type Props = NativeStackScreenProps<RootStackParamList, 'BaseSelect'>;

const { width } = Dimensions.get('window');

const BASES: {
  id: BaseType;
  emoji: string;
  nameKo: string;
  subtitle: string;
  ingredients: string;
  color: string;
  bgColor: string;
}[] = [
  {
    id: 'woody',
    emoji: '🌿',
    nameKo: 'Woody (우디)',
    subtitle: '깊고 안정적인 향',
    ingredients: '샌달우드, 시더우드, 베티버',
    color: '#C4A882',
    bgColor: '#F7F0E8',
  },
  {
    id: 'floral',
    emoji: '🌸',
    nameKo: 'Floral (플로럴)',
    subtitle: '부드럽고 달콤한 꽃향',
    ingredients: '라벤더, 로즈, 제라늄',
    color: '#D4909A',
    bgColor: '#FCF0F2',
  },
  {
    id: 'citrus',
    emoji: '🍋',
    nameKo: 'Citrus (시트러스)',
    subtitle: '상쾌하고 밝은 향',
    ingredients: '레몬, 오렌지, 베르가못',
    color: '#D4A820',
    bgColor: '#FEFAEC',
  },
  {
    id: 'herbal',
    emoji: '🌱',
    nameKo: 'Herbal (허브)',
    subtitle: '청량하고 자연스러운 향',
    ingredients: '페퍼민트, 로즈마리, 유칼립투스',
    color: '#7A9E6A',
    bgColor: '#F0F5EC',
  },
];

export default function BaseSelectScreen({ route, navigation }: Props) {
  const { moodScore } = route.params;
  const [selectedBase, setSelectedBase] = useState<BaseType | null>(null);

  const handleNext = () => {
    if (!selectedBase) return;
    navigation.navigate('Recommend', { moodScore, selectedBase });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>어떤 향이 좋으세요?</Text>
          <Text style={styles.subtitle}>마음에 드는 베이스 향을 선택해주세요</Text>
        </View>

        <View style={styles.cards}>
          {BASES.map((base) => {
            const isSelected = selectedBase === base.id;
            return (
              <TouchableOpacity
                key={base.id}
                onPress={() => setSelectedBase(base.id)}
                activeOpacity={0.88}
              >
                <View
                  style={[
                    styles.card,
                    { backgroundColor: base.bgColor },
                    isSelected && { borderColor: base.color, borderWidth: 2.5 },
                    !isSelected && styles.cardUnselected,
                  ]}
                >
                  <View style={[styles.emojiCircle, { backgroundColor: base.color + '28' }]}>
                    <Text style={styles.emoji}>{base.emoji}</Text>
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={styles.baseName}>{base.nameKo}</Text>
                    <Text style={[styles.baseSubtitle, { color: base.color }]}>{base.subtitle}</Text>
                    <Text style={styles.ingredients}>{base.ingredients}</Text>
                  </View>

                  {isSelected && (
                    <View style={[styles.checkBadge, { backgroundColor: base.color }]}>
                      <Text style={styles.checkMark}>✓</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !selectedBase && styles.nextButtonDisabled]}
          onPress={handleNext}
          activeOpacity={0.85}
          disabled={!selectedBase}
        >
          <LinearGradient
            colors={selectedBase ? ['#C8B4E8', '#B89FD8'] : ['#DDD', '#CCC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonInner}
          >
            <Text style={styles.nextButtonText}>이 향으로 시작하기 →</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← 기분 다시 선택하기</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 60, paddingBottom: 40 },

  header: { marginBottom: 32 },
  title: {
    fontFamily: 'Ownglyph_corncorn',
    fontSize: 30,
    color: '#2D1B5C',
    marginBottom: 8,
  },
  subtitle: { fontSize: 15, color: '#9B8EB8' },

  cards: { gap: 14, marginBottom: 32 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    padding: 18,
    borderWidth: 2.5,
    borderColor: 'transparent',
    shadowColor: '#C8B4E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardUnselected: {
    borderColor: 'transparent',
  },
  emojiCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emoji: { fontSize: 26 },
  cardContent: { flex: 1 },
  baseName: {
    fontSize: 16,
    color: '#2D1B5C',
    fontFamily: 'Ownglyph_corncorn',
    marginBottom: 2,
  },
  baseSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  ingredients: {
    fontSize: 12,
    color: '#9B8EB8',
    lineHeight: 17,
  },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  checkMark: { fontSize: 14, color: '#FFF', fontWeight: '700' },

  nextButton: { borderRadius: 28, overflow: 'hidden', marginBottom: 16 },
  nextButtonDisabled: { opacity: 0.45 },
  nextButtonInner: { paddingVertical: 18, alignItems: 'center' },
  nextButtonText: {
    fontFamily: 'Ownglyph_corncorn',
    fontSize: 17,
    color: '#FFF',
    letterSpacing: 0.3,
  },

  backButton: { alignItems: 'center', paddingVertical: 8 },
  backText: { fontSize: 14, color: '#B8AACC' },
});
