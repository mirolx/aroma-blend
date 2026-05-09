import { oilDatabase } from '../data/oilDatabase';

export interface MoodInput {
  moodLevel: number; // 1-5
  moodText: string;
}

export interface OilRecommendation {
  oilId: string;
  nameKo: string;
  reason: string;
}

export interface BlendRecommendation {
  oils: OilRecommendation[];
  blendName: string;
  blendDescription: string;
}

type MoodCategory = 'calm' | 'balance' | 'energy';

interface Rule {
  oilIds: [string, string, string];
  reasons: [string, string, string];
  blendNames: string[];
  descriptions: string[];
}

const RULES: Record<MoodCategory, Rule> = {
  // 기분 1-2: 진정 / 수면
  calm: {
    oilIds: ['lavender', 'chamomile', 'sandalwood'],
    reasons: [
      '신경계를 진정시켜 불안과 긴장을 부드럽게 완화해줍니다.',
      '사과향의 캐모마일이 마음을 달래고 편안한 수면을 유도합니다.',
      '따뜻한 우디향이 내면을 안정시키고 깊은 이완을 도와줍니다.',
    ],
    blendNames: ['고요한 밤', '달빛 위로', '평온의 품', '잔잔한 숨결'],
    descriptions: [
      '오늘 많이 힘드셨죠. 이 블렌드가 무거운 마음을 내려놓고 편안히 쉴 수 있도록 곁에 있을게요.',
      '지친 몸과 마음을 위한 따뜻한 위로입니다. 깊은 호흡과 함께 천천히 내려놓아 보세요.',
      '힘든 하루를 보내셨군요. 라벤더와 캐모마일의 향기가 오늘 밤 좋은 잠자리를 만들어 드릴 거예요.',
      '괜찮아요, 누구나 힘든 날이 있어요. 이 향기와 함께 잠시 숨을 고르세요.',
    ],
  },
  // 기분 3: 균형 / 호르몬
  balance: {
    oilIds: ['geranium', 'clarySage', 'rose'],
    reasons: [
      '감정의 균형을 잡아주고 호르몬 변화로 인한 기분 기복을 안정시킵니다.',
      '갱년기 증상에 특히 효과적이며 에스트로겐 유사 작용으로 신체 균형을 도와줍니다.',
      '여성 호르몬 균형과 자기 사랑의 감정을 불러일으켜 일상의 안정을 찾아줍니다.',
    ],
    blendNames: ['균형의 꽃', '봄날의 여유', '꽃의 중심', '내 안의 평화'],
    descriptions: [
      '오늘은 나를 위한 시간을 가져보세요. 이 블렌드가 몸과 마음의 균형을 회복하는 데 도움을 드릴 거예요.',
      '평범한 하루도 소중해요. 제라늄과 로즈의 향기로 오늘을 더 풍요롭게 만들어보세요.',
      '내면의 중심을 잡아주는 블렌드예요. 하루의 흐름 속에서 나만의 페이스를 찾을 수 있도록 도와드릴게요.',
      '균형 잡힌 하루를 위한 처방이에요. 꽃향기와 함께 오늘도 차분하게 나아가 보세요.',
    ],
  },
  // 기분 4-5: 활력 / 에너지
  energy: {
    oilIds: ['peppermint', 'lemon', 'rosemary'],
    reasons: [
      '상쾌한 민트향이 피로를 씻어내고 맑은 정신과 활력을 불어넣어 줍니다.',
      '레몬의 밝은 시트러스향이 기분을 전환시키고 긍정 에너지를 높여줍니다.',
      '집중력과 기억력을 강화하는 로즈마리가 활기차고 생산적인 하루를 도와줍니다.',
    ],
    blendNames: ['햇살 에너지', '상쾌한 아침', '빛나는 하루', '생기의 숲'],
    descriptions: [
      '좋은 기분이 오늘 하루를 더 빛나게 해줄 거예요! 이 활기찬 블렌드와 함께 멋진 하루를 만들어보세요.',
      '긍정적인 에너지가 넘치는 하루네요! 상큼한 향기로 그 기분을 더욱 오래 유지해보세요.',
      '오늘의 밝은 에너지를 향기로 담았어요. 페퍼민트와 레몬이 활기찬 하루를 응원합니다.',
      '활력 넘치는 오늘, 이 블렌드가 그 에너지를 온종일 함께해 드릴게요!',
    ],
  },
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getCategory(moodLevel: number): MoodCategory {
  if (moodLevel <= 2) return 'calm';
  if (moodLevel === 3) return 'balance';
  return 'energy';
}

export function getBlendRecommendation(input: MoodInput): BlendRecommendation {
  const rule = RULES[getCategory(input.moodLevel)];

  return {
    oils: rule.oilIds.map((oilId, index) => ({
      oilId,
      nameKo: oilDatabase.find((o) => o.id === oilId)?.nameKo ?? oilId,
      reason: rule.reasons[index],
    })),
    blendName: pickRandom(rule.blendNames),
    blendDescription: pickRandom(rule.descriptions),
  };
}
