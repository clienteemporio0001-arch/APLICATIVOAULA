import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/src/theme';

type TabIcon = React.ComponentProps<typeof Ionicons>['name'];
export default function TabLayout() {
  const icon = (name: TabIcon, color: string, size: number) => <Ionicons name={name} color={color} size={size} />;
  return <Tabs screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: C.primary,
    tabBarInactiveTintColor: C.muted,
    tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 1 },
    tabBarStyle: { backgroundColor: C.white, borderTopColor: C.line, height: 66, paddingBottom: 9, paddingTop: 7 },
    sceneStyle: { backgroundColor: C.bg },
  }}>
    <Tabs.Screen name="index" options={{ title: 'Hoje', tabBarIcon: ({ color, size, focused }) => icon(focused ? 'home' : 'home-outline', String(color), size) }} />
    <Tabs.Screen name="alimentacao" options={{ title: 'Alimentação', tabBarIcon: ({ color, size, focused }) => icon(focused ? 'restaurant' : 'restaurant-outline', String(color), size) }} />
    <Tabs.Screen name="evolucao" options={{ title: 'Evolução', tabBarIcon: ({ color, size, focused }) => icon(focused ? 'stats-chart' : 'stats-chart-outline', String(color), size) }} />
    <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: ({ color, size, focused }) => icon(focused ? 'person' : 'person-outline', String(color), size) }} />
  </Tabs>;
}
