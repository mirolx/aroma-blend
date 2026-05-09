import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import MoodCheckScreen from '../screens/MoodCheckScreen';
import BaseSelectScreen from '../screens/BaseSelectScreen';
import RecommendScreen from '../screens/RecommendScreen';
import BlendScreen from '../screens/BlendScreen';
import ResultScreen from '../screens/ResultScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  MoodCheck: undefined;
  BaseSelect: { moodScore: number };
  Recommend: { moodScore: number; selectedBase: string };
  Blend: { oilIds: string[]; blendName: string; blendDescription: string };
  Result: { oilIds: string[]; blendName: string; blendDescription: string; moodLevel: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="MoodCheck" component={MoodCheckScreen} />
      <Stack.Screen name="BaseSelect" component={BaseSelectScreen} />
      <Stack.Screen name="Recommend" component={RecommendScreen} />
      <Stack.Screen name="Blend" component={BlendScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  );
}
