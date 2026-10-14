import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DemoProvider } from '@/src/demo';
import { C } from '@/src/theme';

export default function RootLayout() {
  return <SafeAreaProvider><DemoProvider><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }} /></DemoProvider></SafeAreaProvider>;
}
