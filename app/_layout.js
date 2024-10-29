
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
       
      </Stack>
  );
}
