import React from 'react';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Icon, Pill } from '@/src/ui';
import { C } from '@/src/theme';

export default function Welcome() {
  return <SafeAreaView style={s.root}>
    <View style={s.shell}>
      <View style={s.brand}><View style={s.brandIcon}><Icon name="leaf" color={C.white} size={21} /></View><AppText bold size={25}>leve<AppText bold size={25} style={{ color: C.primary }}>+</AppText></AppText></View>
      <View style={s.hero}>
        <View style={s.decoration}>
          <View style={s.circleOuter}><View style={s.circleInner}><Icon name="heart" size={42} color={C.primary} /><AppText bold size={18}>Um dia de</AppText><AppText bold size={22}>cada vez.</AppText></View></View>
          <View style={s.floatTop}><Icon name="sparkles" color={C.primary} size={20} /><AppText bold size={12}>Pequenas vitórias</AppText></View>
          <View style={s.floatBottom}><Icon name="trending-up" color={C.primary} size={20} /><AppText bold size={12}>Sua evolução</AppText></View>
        </View>
        <Pill text="BEM-ESTAR NO SEU RITMO" icon="sparkles" />
        <AppText size={37} bold style={{ lineHeight: 44, marginTop: 14, letterSpacing: -1.2 }}>Sua evolução começa com <AppText bold size={37} style={{ color: C.primary, lineHeight: 44 }}>pequenos passos.</AppText></AppText>
        <AppText muted size={16} style={{ marginTop: 15, lineHeight: 25 }}>Controle sua alimentação, acompanhe seu peso e descubra sua evolução, um dia de cada vez.</AppText>
      </View>
      <View style={{ gap: 11 }}>
        <Button title="Explorar demonstração" icon="arrow-forward" onPress={() => router.replace('/(tabs)')} />
        <Button title="Experimentar onboarding" outline onPress={() => router.push('/onboarding')} />
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={{ alignItems: 'center', paddingTop: 5 }}>
          <AppText muted size={12}>Protótipo fictício • Sem cadastro real</AppText>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>;
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  shell: { flex: 1, width: '100%', maxWidth: 550, alignSelf: 'center', paddingHorizontal: 26, paddingVertical: 20, justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandIcon: { backgroundColor: C.primary, width: 38, height: 38, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  hero: { marginVertical: 12 },
  decoration: { height: 220, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  circleOuter: { width: 210, height: 210, borderRadius: 110, backgroundColor: '#D8F4E4', justifyContent: 'center', alignItems: 'center' },
  circleInner: { width: 167, height: 167, borderRadius: 95, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', gap: 3, shadowColor: C.primary, shadowOpacity: .09, shadowRadius: 20 },
  floatTop: { position: 'absolute', top: 18, right: 8, padding: 12, borderRadius: 17, backgroundColor: C.white, flexDirection: 'row', gap: 8, alignItems: 'center' },
  floatBottom: { position: 'absolute', bottom: 20, left: 1, padding: 12, borderRadius: 17, backgroundColor: C.white, flexDirection: 'row', gap: 8, alignItems: 'center' },
});
