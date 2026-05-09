import { oilDatabase, Oil } from '../data/oilDatabase';

export type BaseType = 'woody' | 'floral' | 'citrus' | 'herbal';
type MoodCategory = 'low' | 'medium' | 'high';

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

const OIL_IDS: Record<BaseType, Record<MoodCategory, [string, string, string]>> = {
  woody: {
    low:    ['sandalwood', 'vetiver', 'frankincense'],
    medium: ['cedarwood', 'sandalwood', 'clarySage'],
    high:   ['cedarwood', 'juniperBerry', 'blackPepper'],
  },
  floral: {
    low:    ['lavender', 'chamomile', 'rose'],
    medium: ['geranium', 'lavender', 'ylangYlang'],
    high:   ['rose', 'neroli', 'jasmine'],
  },
  citrus: {
    low:    ['bergamot', 'lemon', 'grapefruit'],
    medium: ['orange', 'bergamot', 'lemongrass'],
    high:   ['lemon', 'lime', 'mandarin'],
  },
  herbal: {
    low:    ['clarySage', 'peppermint', 'lavender'],
    medium: ['rosemary', 'peppermint', 'basil'],
    high:   ['eucalyptus', 'rosemary', 'teaTree'],
  },
};

const BLEND_INFO: Record<BaseType, Record<MoodCategory, { name: string; description: string }>> = {
  woody: {
    low:    { name: '고요한 뿌리',   description: '깊고 안정적인 우디 향이 지친 마음을 단단히 잡아줄 거예요. 나무처럼 묵묵히 곁에 있을게요.' },
    medium: { name: '대지의 균형',   description: '따뜻한 나무 향기가 일상의 중심을 잡아드릴 거예요. 균형 잡힌 하루를 함께해요.' },
    high:   { name: '생동하는 숲',   description: '상쾌하고 활기찬 우디 향으로 오늘의 에너지를 마음껏 발산해보세요!' },
  },
  floral: {
    low:    { name: '달빛 꽃향기',   description: '꽃들이 속삭이듯 당신의 지친 마음을 부드럽게 감싸드릴게요. 오늘은 꽃향기와 함께 쉬어가요.' },
    medium: { name: '봄날의 꽃밭',   description: '균형 잡힌 꽃향기가 오늘 하루를 더 풍요롭게 만들어줄 거예요.' },
    high:   { name: '꽃의 축제',     description: '생기 넘치는 꽃향기와 함께 오늘의 기쁨을 더욱 빛내보세요. 활짝 피어나는 하루예요!' },
  },
  citrus: {
    low:    { name: '햇살 위로',     description: '상큼한 과일향이 무거운 마음을 조금씩 가볍게 해줄 거예요. 햇살처럼 따뜻하게 곁에 있을게요.' },
    medium: { name: '시트러스 리듬', description: '균형 잡힌 시트러스 향으로 하루의 리듬을 맞춰보세요. 상쾌하고 여유로운 하루예요.' },
    high:   { name: '눈부신 아침',   description: '산뜻하고 밝은 시트러스 향으로 오늘의 에너지를 마음껏 펼쳐보세요!' },
  },
  herbal: {
    low:    { name: '초록 위로',     description: '자연의 청량한 허브향이 지친 마음을 조용히 어루만져 드릴게요. 자연 속에 있는 듯 편안하게 쉬어요.' },
    medium: { name: '허브 정원',     description: '균형 잡힌 허브향이 맑은 정신과 편안한 몸으로 이끌어줄 거예요.' },
    high:   { name: '청량한 바람',   description: '시원하고 활기찬 허브향으로 상쾌한 에너지를 느껴보세요. 자연의 힘이 함께해요!' },
  },
};

const REASON_TEMPLATE: Record<MoodCategory, (oil: Oil) => string> = {
  low:    (oil) => `${oil.effects[0]} 효과가 지친 마음을 부드럽게 위로해줄 거예요.`,
  medium: (oil) => `${oil.effects[0]} 효과로 균형 잡힌 하루를 만들어줄 거예요.`,
  high:   (oil) => `${oil.effects[0]} 효과로 오늘의 활기찬 에너지를 더욱 빛내줄 거예요!`,
};

function getMoodCategory(score: number): MoodCategory {
  if (score <= 2) return 'low';
  if (score === 3) return 'medium';
  return 'high';
}

export function getRecommendation(moodScore: number, base: BaseType): BlendRecommendation {
  const category = getMoodCategory(moodScore);
  const oilIds = OIL_IDS[base][category];
  const { name, description } = BLEND_INFO[base][category];

  const oils: OilRecommendation[] = oilIds.map((id) => {
    const oil = oilDatabase.find((o) => o.id === id);
    return {
      oilId: id,
      nameKo: oil?.nameKo ?? id,
      reason: oil ? REASON_TEMPLATE[category](oil) : '',
    };
  });

  return { oils, blendName: name, blendDescription: description };
}
