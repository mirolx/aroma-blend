# 🌿 Aroma Blend

![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat-square&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-54.0-000020?style=flat-square&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)

> 오늘의 기분과 향 취향에 맞는 아로마 오일 블렌딩을 추천해주는 감성 앱

---

## 📖 프로젝트 소개

### 배경

갱년기를 겪는 40~60대 여성은 감정 기복, 수면 장애, 만성 피로 등 다양한 신체·심리적 스트레스를 경험합니다.  
아로마테라피는 약물 없이 자연스럽게 몸과 마음의 균형을 도울 수 있는 접근법이지만, 어떤 오일을 어떻게 블렌딩해야 하는지 막막한 경우가 많습니다.

### 컨셉

**Aroma Blend**는 오늘의 기분을 이모지로 체크하고, 선호하는 향 계열을 선택하면  
AI가 나에게 딱 맞는 에센셜 오일 3종과 블렌딩 레시피를 추천해 주는 앱입니다.  
복잡한 지식 없이도 나만의 향기 처방을 받을 수 있도록 감성적인 UX로 설계되었습니다.

---

## ✨ 주요 기능

| 스크린 | 기능 |
|---|---|
| 🌸 온보딩 | 앱 소개 및 첫 사용자 안내 (AsyncStorage로 재방문 시 스킵) |
| 😊 기분 체크 | 5단계 이모지 카드로 현재 기분 선택 + 텍스트 메모 |
| 🌿 향 베이스 선택 | Woody / Floral / Citrus / Herbal 4가지 계열 중 선택 |
| 💡 오일 추천 | 기분 × 향 베이스 조합으로 에센셜 오일 3종 + AI 블렌딩 설명 |
| ⚗️ 블렌딩 | 플라스크 애니메이션으로 블렌딩 과정 시각화 |
| 📋 결과 | 나만의 블렌딩 레시피 확인, 이미지로 저장 및 공유 |

---

## 🛠 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | React Native 0.81.5 + Expo ~54.0 |
| 언어 | TypeScript ~5.9 |
| 네비게이션 | React Navigation Native Stack ^7 |
| UI/애니메이션 | React Native SVG, Lottie React Native, Expo Linear Gradient |
| 햅틱 피드백 | Expo Haptics |
| 미디어 | Expo Media Library, Expo Sharing, React Native View Shot |
| 상태 저장 | AsyncStorage (온보딩 완료 여부) |
| 폰트 | Expo Google Fonts (Playfair Display), 커스텀 폰트 (Ownglyph) |
| AI API | OpenRouter API (개발용 무료, 추후 Anthropic API 교체 예정) |

---

## 📁 프로젝트 구조

```
aroma-blend/
├── assets/
│   ├── bottle.png          # 블렌딩 결과 병 이미지
│   ├── flask.png           # 블렌딩 플라스크 이미지
│   ├── spoid.png           # 스포이드 이미지
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── src/
│   ├── components/
│   │   ├── Heading.tsx     # 커스텀 헤딩 컴포넌트 (폰트 적용)
│   │   └── Text.tsx        # 커스텀 텍스트 컴포넌트 (폰트 적용)
│   ├── data/
│   │   └── oilDatabase.ts  # 에센셜 오일 데이터베이스 (효능, 향 계열, 감정 태그)
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── screens/
│   │   ├── SplashScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── MoodCheckScreen.tsx
│   │   ├── BaseSelectScreen.tsx
│   │   ├── RecommendScreen.tsx
│   │   ├── BlendScreen.tsx
│   │   └── ResultScreen.tsx
│   └── services/
│       ├── claudeService.ts          # OpenRouter API 통신 (AI 추천 문구 생성)
│       └── recommendationService.ts  # 기분 × 베이스 조합 추천 로직
├── .env                    # 환경변수 (git 제외)
├── .env.example            # 환경변수 예시 템플릿
├── App.tsx
├── app.json
├── babel.config.js
├── index.ts
├── package.json
└── tsconfig.json
```

---

## 🚀 시작하기

### 사전 요구사항

- Node.js 18 이상
- Expo CLI (`npm install -g expo-cli`)
- iOS 시뮬레이터 또는 실기기 (Expo Go 앱)

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/your-repo/aroma-blend.git
cd aroma-blend

# 의존성 설치
npm install

# 개발 서버 실행 (터널 모드 — 실기기 테스트 시 권장)
npx expo start --tunnel

# iOS 시뮬레이터 직접 실행
npm run ios
```

---

## 🔑 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래 키를 입력하세요.

```env
EXPO_PUBLIC_OPENROUTER_API_KEY=your_key_here
```

> **OpenRouter API 키 발급:** [openrouter.ai](https://openrouter.ai) 에서 무료로 발급 가능합니다.  
> 추후 Anthropic API(`claude-sonnet-4-6`)로 교체 예정입니다.

`.env.example` 파일을 복사해서 시작할 수도 있습니다.

```bash
cp .env.example .env
```

---

## 📱 스크린 구성 및 플로우

```
SplashScreen
    │
    ▼ (AsyncStorage 온보딩 완료 여부 확인)
OnboardingScreen ──── (재방문 시 스킵)
    │
    ▼
MoodCheckScreen          ← 기분 선택 (1~5) + 텍스트 메모
    │  moodScore
    ▼
BaseSelectScreen         ← Woody / Floral / Citrus / Herbal 선택
    │  moodScore + selectedBase
    ▼
RecommendScreen          ← 오일 3종 추천 + AI 블렌딩 설명
    │  oilIds + blendName + blendDescription
    ▼
BlendScreen              ← 플라스크 블렌딩 애니메이션
    │  + moodLevel
    ▼
ResultScreen             ← 레시피 확인, 이미지 저장/공유
```

### 스크린별 전달 파라미터

| 라우트 | 파라미터 |
|---|---|
| `BaseSelect` | `moodScore: number` |
| `Recommend` | `moodScore: number`, `selectedBase: string` |
| `Blend` | `oilIds: string[]`, `blendName: string`, `blendDescription: string` |
| `Result` | `oilIds: string[]`, `blendName: string`, `blendDescription: string`, `moodLevel: number` |

---

## 🔬 향 베이스 추천 로직

기분 점수(1~5)와 향 베이스 선택(4종)을 조합해 **총 12가지 케이스**로 오일 3종을 추천합니다.

### 기분 구간 분류

| 구간 | 점수 | 설명 |
|---|---|---|
| `low` | 1 – 2 | 힘들고 지친 상태 → 안정·회복 계열 오일 |
| `medium` | 3 | 보통 상태 → 균형·유지 계열 오일 |
| `high` | 4 – 5 | 활기차고 좋은 상태 → 에너지·활력 계열 오일 |

### 베이스 × 기분 조합표

| 베이스 | low (1-2) | medium (3) | high (4-5) |
|---|---|---|---|
| 🌲 **Woody** | 샌달우드, 베티버, 프랑킨센스 | 시더우드, 샌달우드, 클라리세이지 | 시더우드, 주니퍼베리, 블랙페퍼 |
| 🌸 **Floral** | 라벤더, 캐모마일, 로즈 | 제라늄, 라벤더, 일랑일랑 | 로즈, 네롤리, 재스민 |
| 🍋 **Citrus** | 베르가못, 레몬, 자몽 | 오렌지, 베르가못, 레몬그라스 | 레몬, 라임, 만다린 |
| 🌿 **Herbal** | 클라리세이지, 페퍼민트, 라벤더 | 로즈마리, 페퍼민트, 바질 | 유칼립투스, 로즈마리, 티트리 |

> 추천된 오일 ID는 `oilDatabase.ts`에서 상세 정보(효능, 향 계열, 감정 태그, 색상)를 조회합니다.  
> AI(`claudeService.ts`)는 선택된 오일 조합을 바탕으로 블렌딩 이름과 감성적인 설명 문구를 생성합니다.

---

## 📄 라이선스

Private — All rights reserved.
