import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Text from '../components/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getOilsByIds } from '../data/oilDatabase';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

const TODAY = new Date().toLocaleDateString('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export default function ResultScreen({ route, navigation }: Props) {
  const { oilIds, blendName, blendDescription } = route.params;
  const oils = getOilsByIds(oilIds);

  const cardRef = useRef<View>(null);
  const [isSaving,  setIsSaving]  = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const captureCard = () =>
    captureRef(cardRef, { format: 'png', quality: 1 });

  const handleSaveImage = async () => {
    try {
      setIsSaving(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '사진을 저장하려면 미디어 라이브러리 접근 권한이 필요합니다.');
        return;
      }
      const uri = await captureCard();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('저장되었어요! 🌿', '카메라 롤에 이미지가 저장되었습니다.');
    } catch {
      Alert.alert('저장 실패', '다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      const uri = await captureCard();
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert('공유 불가', '이 기기에서는 공유 기능을 사용할 수 없습니다.');
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: `${blendName} 블렌드 공유하기`,
      });
    } catch {
      Alert.alert('공유 실패', '다시 시도해주세요.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleRestart = () => {
    navigation.reset({ index: 0, routes: [{ name: 'MoodCheck' }] });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* 캡처 대상 카드 */}
        <View ref={cardRef} style={styles.card} collapsable={false}>
          <LinearGradient
            colors={['#EDE7F6', '#FAE6EC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardInner}
          >
            <Text style={styles.cardDate}>{TODAY}</Text>
            <Text style={styles.cardEmoji}>✨</Text>
            <Text style={styles.cardTitle}>{blendName}</Text>
            <Text style={styles.cardDescription}>{blendDescription}</Text>

            <View style={styles.oilPills}>
              {oils.map((oil) => (
                <View
                  key={oil.id}
                  style={[styles.oilPill, { backgroundColor: oil.color + '30', borderColor: oil.color }]}
                >
                  <View style={[styles.oilDot, { backgroundColor: oil.color }]} />
                  <Text style={styles.oilPillText}>{oil.nameKo}</Text>
                </View>
              ))}
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.cardBrand}>🌿 Aroma Blend</Text>
              <Text style={styles.cardTagline}>당신만을 위한 향기 처방</Text>
            </View>
          </LinearGradient>
        </View>

        {/* 오일 효능 */}
        <View style={styles.effectsSection}>
          <Text style={styles.effectsTitle}>오늘의 블렌드 효능</Text>
          {oils.map((oil) => (
            <View key={oil.id} style={styles.effectCard}>
              <View style={styles.effectCardHeader}>
                <View style={[styles.effectColorBar, { backgroundColor: oil.color }]} />
                <Text style={styles.effectOilName}>{oil.nameKo}</Text>
              </View>
              <Text style={styles.effectDescription}>{oil.description}</Text>
              <View style={styles.pillRow}>
                {oil.effects.map((tag, i) => (
                  <View key={i} style={[styles.pill, { backgroundColor: oil.color + '28' }]}>
                    <Text style={[styles.pillText, { color: oil.color }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* 저장 / 공유 버튼 (나란히) */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.saveButton, styles.halfButton, isSaving && styles.buttonLoading]}
            onPress={handleSaveImage}
            activeOpacity={0.85}
            disabled={isSaving || isSharing}
          >
            <LinearGradient
              colors={['#C8B4E8', '#B89FD8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBtn}
            >
              {isSaving
                ? <ActivityIndicator color="#FFF" />
                : <Text style={styles.saveBtnText}>📷 저장</Text>
              }
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shareButton, styles.halfButton, isSharing && styles.buttonLoading]}
            onPress={handleShare}
            activeOpacity={0.85}
            disabled={isSaving || isSharing}
          >
            {isSharing
              ? <ActivityIndicator color="#C8B4E8" />
              : <Text style={styles.shareBtnText}>공유하기</Text>
            }
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.restartButton} onPress={handleRestart} activeOpacity={0.8}>
          <Text style={styles.restartText}>처음부터 다시하기</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 60 },

  // 카드
  card: {
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 28,
    borderWidth: 1.5,
    borderColor: '#C8B4E8',
    shadowColor: '#C8B4E8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  cardInner: { padding: 28, alignItems: 'center' },
  cardDate: { fontSize: 12, color: '#9B8EB8', marginBottom: 16 },
  cardEmoji: { fontSize: 48, marginBottom: 12 },
  cardTitle: { fontFamily: 'Ownglyph_corncorn', fontSize: 26, color: '#2D1B5C', textAlign: 'center', marginBottom: 12 },
  cardDescription: { fontSize: 14, color: '#5A4A7A', lineHeight: 22, textAlign: 'center', marginBottom: 20 },
  oilPills: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 24 },
  oilPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 6,
  },
  oilDot: { width: 8, height: 8, borderRadius: 4 },
  oilPillText: { fontSize: 15, color: '#2D1B5C' },
  cardFooter: { alignItems: 'center' },
  cardBrand: { fontSize: 13, color: '#C8B4E8' },
  cardTagline: { fontSize: 11, color: '#D4909A', marginTop: 2 },

  // 효능 섹션
  effectsSection: { marginBottom: 28 },
  effectsTitle: {
    fontFamily: 'Ownglyph_corncorn',
    fontSize: 20,
    color: '#2D1B5C',
    marginBottom: 20,
  },
  effectCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#C8B4E8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  effectCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  effectColorBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 10,
  },
  effectOilName: { fontSize: 16, color: '#2D1B5C', fontWeight: '700' },
  effectDescription: { fontSize: 14, color: '#5A4A7A', lineHeight: 22, marginBottom: 12 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14 },
  pillText: { fontSize: 12, fontWeight: '600' },

  // 버튼
  buttonRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  halfButton: { flex: 1 },
  saveButton: { borderRadius: 24, overflow: 'hidden' },
  gradientBtn: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center', minHeight: 52 },
  saveBtnText: { fontSize: 16, color: '#FFF' },
  shareButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#C8B4E8',
    minHeight: 52,
  },
  shareBtnText: { fontSize: 16, color: '#C8B4E8' },
  buttonLoading: { opacity: 0.65 },
  restartButton: { paddingVertical: 12, alignItems: 'center' },
  restartText: { fontSize: 14, color: '#B8AACC' },
});
