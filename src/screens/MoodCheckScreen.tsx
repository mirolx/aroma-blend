import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import Text from '../components/Text';
import Heading from '../components/Heading';
import Svg, { Path } from 'react-native-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { LinearGradient } from 'expo-linear-gradient';
type Props = NativeStackScreenProps<RootStackParamList, 'MoodCheck'>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 24) / 5; // padding 24*2=48, gap 6*4=24
const CARD_HEIGHT = 90;

const MOODS = [
  { level: 1, emoji: '😔', label: '많이\n힘들어요' },
  { level: 2, emoji: '😟', label: '조금\n힘들어요' },
  { level: 3, emoji: '😐', label: '그저\n그래요' },
  { level: 4, emoji: '🙂', label: '괜찮아요' },
  { level: 5, emoji: '😊', label: '좋아요!' },
];

export default function MoodCheckScreen({ navigation }: Props) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodText, setMoodText] = useState('');

  const handleMoodSelect = (level: number) => {
    setSelectedMood(level);
  };

  const handleNext = () => {
    if (!selectedMood) {
      Alert.alert('기분을 선택해주세요', '오늘의 기분을 이모지로 선택해주세요.');
      return;
    }
    navigation.navigate('BaseSelect', { moodScore: selectedMood });
  };

  return (
    <View style={styles.container}>
      {/* SVG 물결 장식 - 하단 고정 */}
      <View style={styles.waveContainer} pointerEvents="none">
        <Svg
          width={width}
          height={100}
          viewBox="0 0 390 100"
          preserveAspectRatio="none"
        >
          <Path
            d="M0,50 Q97,10 195,50 T390,50 L390,100 L0,100 Z"
            fill="#C8B4E8"
            fillOpacity={0.18}
          />
          <Path
            d="M0,65 Q120,28 245,62 T390,62 L390,100 L0,100 Z"
            fill="#D4909A"
            fillOpacity={0.12}
          />
        </Svg>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <View style={styles.header}>
            <Text style={styles.greeting}>안녕하세요 🌸</Text>
            <Heading variant="h2" style={styles.question}>
              오늘 기분이{'\n'}어떠세요?
            </Heading>
          </View>

          {/* 이모지 선택 */}
          <View style={styles.moodRow}>
            {MOODS.map((mood, i) => (
              <TouchableOpacity
                key={mood.level}
                onPress={() => handleMoodSelect(mood.level)}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.moodItem,
                    selectedMood === mood.level && styles.moodItemSelected,
                  ]}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text
                    style={[
                      styles.moodLabel,
                      selectedMood === mood.level && styles.moodLabelSelected,
                    ]}
                  >
                    {mood.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* 텍스트 입력 */}
          <View style={styles.textSection}>
            <Text style={styles.textLabel}>어떤 마음인지 조금 더 이야기해주세요 (선택)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="예: 요즘 잠을 못 자고 피곤해요. 머리가 자주 아파요..."
              placeholderTextColor="#C4B8D8"
              multiline
              maxLength={200}
              value={moodText}
              onChangeText={setMoodText}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{moodText.length}/200</Text>
          </View>

          {/* 다음 버튼 */}
          <TouchableOpacity
            style={[styles.nextButton, !selectedMood && styles.nextButtonDisabled]}
            onPress={handleNext}
            activeOpacity={0.85}
            disabled={!selectedMood}
          >
            <LinearGradient
              colors={selectedMood ? ['#C8B4E8', '#B89FD8'] : ['#DDD', '#CCC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButtonInner}
            >
              <Text style={styles.nextButtonText}>나에게 맞는 향기 찾기 →</Text>
            </LinearGradient>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' },
  flex: { flex: 1 },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 64, paddingBottom: 120 },
  header: { marginBottom: 40 },
  greeting: { fontSize: 17, color: '#C8B4E8', marginBottom: 10 },
  question: { fontFamily: 'Ownglyph_corncorn', fontSize: 34, lineHeight: 44 },
  moodRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 36,
  },
  moodItem: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  moodItemSelected: {
    borderWidth: 2,
    borderColor: '#C8B4E8',
    backgroundColor: 'rgba(200,180,232,0.15)',
  },
  moodEmoji: { fontSize: 32, marginBottom: 4 },
  moodLabel: {
    fontSize: 11,
    color: '#9B8EB8',
    textAlign: 'center',
    lineHeight: 15,
  },
  moodLabelSelected: { color: '#2D1B5C' },
  textSection: { marginBottom: 32 },
  textLabel: { fontSize: 14, color: '#2D1B5C', fontWeight: '600', marginBottom: 12 },
  textInput: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    fontSize: 15,
    color: '#2D1B5C',
    height: 120,
    borderWidth: 1.5,
    borderColor: '#E8E0F5',
    fontFamily: 'Ownglyph_corncorn',
  },
  charCount: { fontSize: 12, color: '#C4B8D8', textAlign: 'right', marginTop: 6 },
  nextButton: { borderRadius: 28, overflow: 'hidden' },
  nextButtonDisabled: { opacity: 0.45 },
  nextButtonInner: { paddingVertical: 18, alignItems: 'center' },
  nextButtonText: { fontSize: 17, color: '#FFF', letterSpacing: 0.3 },
});
