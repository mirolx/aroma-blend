import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Text from '../components/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getRecommendation, BlendRecommendation, BaseType } from '../services/recommendationService';
import { getOilById } from '../data/oilDatabase';

type Props = NativeStackScreenProps<RootStackParamList, 'Recommend'>;

const BASE_LABEL: Record<string, string> = {
  woody: '🌿 Woody',
  floral: '🌸 Floral',
  citrus: '🍋 Citrus',
  herbal: '🌱 Herbal',
};

export default function RecommendScreen({ route, navigation }: Props) {
  const { moodScore, selectedBase } = route.params;
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<BlendRecommendation | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const result = getRecommendation(moodScore, selectedBase as BaseType);
      setRecommendation(result);
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const handleBlend = () => {
    if (!recommendation) return;
    navigation.navigate('Blend', {
      oilIds: recommendation.oils.map((o) => o.oilId),
      blendName: recommendation.blendName,
      blendDescription: recommendation.blendDescription,
    });
  };

  if (loading) {
    return (
      <LinearGradient colors={['#FAF7F2', '#F0EBF8']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C8B4E8" />
        <Text style={styles.loadingText}>향기를 조합하고 있어요...</Text>
        <Text style={styles.loadingSubText}>🌿 최적의 블렌드를 찾는 중</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#FAF7F2', '#F0EBF8']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.baseTag}>{BASE_LABEL[selectedBase] ?? selectedBase} 베이스</Text>
          <Text style={styles.tag}>오늘의 아로마 처방</Text>
          <Text style={styles.blendName}>{recommendation?.blendName}</Text>
          <Text style={styles.description}>{recommendation?.blendDescription}</Text>
        </View>

        <View style={styles.oilCards}>
          {recommendation?.oils.map((oil, index) => {
            const oilData = getOilById(oil.oilId);
            return (
              <View key={oil.oilId} style={styles.oilCard}>
                <View style={[styles.oilColorBadge, { backgroundColor: oilData?.color ?? '#C8B4E8' }]}>
                  <Text style={styles.oilNumber}>{index + 1}</Text>
                </View>
                <View style={styles.oilInfo}>
                  <Text style={styles.oilName}>{oil.nameKo}</Text>
                  <Text style={styles.oilFamily}>{oilData?.scentFamily}</Text>
                  <Text style={styles.oilDescription}>{oilData?.description}</Text>
                  {oilData?.effects && (
                    <View style={styles.pillRow}>
                      {oilData.effects.map((tag, i) => (
                        <View
                          key={i}
                          style={[styles.pill, { backgroundColor: (oilData.color ?? '#C8B4E8') + '28' }]}
                        >
                          <Text style={[styles.pillText, { color: oilData.color ?? '#C8B4E8' }]}>
                            {tag}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.blendButton} onPress={handleBlend} activeOpacity={0.8}>
          <LinearGradient
            colors={['#C8B4E8', '#D4909A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.blendButtonGradient}
          >
            <Text style={styles.blendButtonText}>🧪 블렌딩 시작하기</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← 향 베이스 다시 선택하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText: { fontSize: 17, color: '#2D1B5C', fontWeight: '600' },
  loadingSubText: { fontSize: 14, color: '#C8B4E8' },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 60 },
  header: { marginBottom: 28 },
  baseTag: {
    fontSize: 13,
    color: '#9B8EB8',
    fontWeight: '600',
    marginBottom: 4,
  },
  tag: {
    fontSize: 12,
    color: '#C8B4E8',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  blendName: {
    fontFamily: 'Ownglyph_corncorn',
    fontSize: 30,
    color: '#2D1B5C',
    marginBottom: 12,
  },
  description: { fontSize: 15, color: '#5A4A7A', lineHeight: 22 },
  oilCards: { gap: 14, marginBottom: 32 },
  oilCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'flex-start',
    shadowColor: '#C8B4E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  oilColorBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  oilNumber: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  oilInfo: { flex: 1 },
  oilName: { fontSize: 16, fontWeight: '700', color: '#2D1B5C', marginBottom: 2 },
  oilFamily: { fontSize: 11, color: '#9B8EB8', marginBottom: 7 },
  oilDescription: { fontSize: 13, color: '#5A4A7A', lineHeight: 19, marginBottom: 10 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pillText: { fontSize: 11, fontWeight: '600' },
  blendButton: { borderRadius: 28, overflow: 'hidden', marginBottom: 16 },
  blendButtonGradient: { paddingVertical: 18, alignItems: 'center' },
  blendButtonText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  backButton: { alignItems: 'center', paddingVertical: 8 },
  backText: { fontSize: 14, color: '#C8B4E8' },
});
