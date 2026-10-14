import React from 'react';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText, Card, Heading, Icon, IconName, Pill, Ring, Screen, Section } from '@/src/ui';
import { C } from '@/src/theme';
import { Category, formatDay, kcal, localDay, useDemo } from '@/src/demo';

const categories: { label: Category; icon: IconName; color: string }[] = [
  { label: 'Café da manhã', icon: 'cafe-outline', color: '#EAA96B' },
  { label: 'Almoço', icon: 'sunny-outline', color: '#EBC162' },
  { label: 'Jantar', icon: 'moon-outline', color: '#7895CD' },
  { label: 'Lanches', icon: 'nutrition-outline', color: '#75BC91' },
];
export default function Home() {
  const { profile, meals, weights, photos } = useDemo();
  const today = localDay();
  const consumed = meals.filter(x => x.day === today).reduce((sum, x) => sum + x.kcal, 0);
  const remaining = Math.max(0, profile.calorieGoal - consumed);
  const current = weights.length ? weights[weights.length-1].value : profile.initialWeight;
  const difference = profile.initialWeight - current;
  const greeting = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';
  return <Screen>
    <View style={s.top}>
      <View><Pill text="VERSÃO DEMONSTRAÇÃO" icon="flask-outline" /><View style={{ height: 9 }} /><Heading title={greeting + ', ' + profile.name + '!'} subtitle="Um passo de cada vez. 🌿" /></View>
      <TouchableOpacity onPress={() => router.push('/(tabs)/perfil')} style={s.avatar}><AppText size={21} bold style={{ color: C.primary }}>{profile.name.slice(0,1).toUpperCase()}</AppText></TouchableOpacity>
    </View>
    <View style={s.calories}>
      <View style={s.calorieHeading}><View><AppText size={16} bold style={{ color: C.white }}>Seu dia em equilíbrio</AppText><AppText size={12} style={{ color: '#D5F5E4', marginTop: 5 }}>{formatDay(today)} • valores fictícios</AppText></View><Icon name="sparkles-outline" color="#CBEDDC" size={24} /></View>
      <View style={s.ringRow}>
        <Ring progress={consumed / Math.max(1, profile.calorieGoal)} center={kcal(consumed)} label="kcal consumidas" size={155} />
        <View style={s.ringInfo}>
          <AppText size={12} style={{ color: '#DDF5E7' }}>META DO DIA</AppText><AppText size={27} bold style={{ color: C.white }}>{kcal(profile.calorieGoal)} <AppText size={13} style={{ color: C.white }}>kcal</AppText></AppText>
          <View style={{ height: 12 }} /><AppText size={12} style={{ color: '#DDF5E7' }}>RESTANTES</AppText><AppText size={26} bold style={{ color: C.white }}>{kcal(remaining)} <AppText size={13} style={{ color: C.white }}>kcal</AppText></AppText>
        </View>
      </View>
      <AppText size={11} style={{ color: '#D4F6E3' }}>Meta ilustrativa, não uma recomendação nutricional.</AppText>
    </View>
    <Section title="Acompanhe sua jornada" action="Ver evolução" onPress={() => router.push('/(tabs)/evolucao')} />
    <Card>
      <View style={s.weightTop}><View style={s.weightIcon}><Icon name="scale-outline" color={C.primary} size={23} /></View><View style={{ flex: 1 }}><AppText bold size={16}>Minha evolução</AppText><AppText muted size={12}>Pequenos progressos fazem diferença</AppText></View><Pill text="SEU RITMO" /></View>
      <View style={s.weightNumbers}>
        <View><AppText muted size={11}>INÍCIO</AppText><AppText bold size={24}>{profile.initialWeight.toFixed(1).replace('.', ',')} <AppText muted size={13}>kg</AppText></AppText></View>
        <Icon name="arrow-forward-outline" color={C.muted} size={19} />
        <View><AppText muted size={11}>ATUAL</AppText><AppText bold size={24}>{current.toFixed(1).replace('.', ',')} <AppText muted size={13}>kg</AppText></AppText></View>
        <View><AppText muted size={11}>META</AppText><AppText bold size={24}>{profile.goalWeight.toFixed(1).replace('.', ',')} <AppText muted size={13}>kg</AppText></AppText></View>
      </View>
      <View style={s.divider} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Icon name="analytics-outline" color={C.primary} size={17} /><AppText size={13} bold>{difference >= 0 ? difference.toFixed(1).replace('.', ',') + ' kg a menos desde o início' : 'Seu peso variou ' + Math.abs(difference).toFixed(1).replace('.', ',') + ' kg'}</AppText></View>
    </Card>
    <Section title="Acesso rápido" />
    <View style={s.actions}>
      <Quick icon="restaurant-outline" label="Registrar refeição" onPress={() => router.push({ pathname: '/(tabs)/alimentacao', params: { novo: '1' } })} />
      <Quick icon="scale-outline" label="Registrar peso" onPress={() => router.push({ pathname: '/(tabs)/evolucao', params: { peso: '1' } })} />
      <Quick icon="camera-outline" label="Foto da semana" onPress={() => router.push({ pathname: '/(tabs)/evolucao', params: { foto: '1' } })} />
      <Quick icon="stats-chart-outline" label="Ver evolução" onPress={() => router.push('/(tabs)/evolucao')} />
    </View>
    <Section title="Refeições de hoje" action="Abrir diário" onPress={() => router.push('/(tabs)/alimentacao')} />
    <Card style={{ paddingVertical: 6 }}>{categories.map((x, i) => {
      const total = meals.filter(meal => meal.day === today && meal.category === x.label).reduce((sum, meal) => sum + meal.kcal, 0);
      return <View key={x.label} style={[s.meal, i < categories.length-1 && { borderBottomWidth: 1, borderBottomColor: C.line }]}><View style={[s.mealIcon, { backgroundColor: x.color + '22' }]}><Icon name={x.icon} color={x.color} size={20} /></View><View style={{ flex: 1 }}><AppText bold size={14}>{x.label}</AppText><AppText muted size={11}>{total ? 'Registro ilustrativo' : 'Nenhum registro'}</AppText></View><AppText bold size={14}>{total ? kcal(total) + ' kcal' : '—'}</AppText></View>;
    })}</Card>
    <View style={s.quote}><Icon name="heart-outline" color={C.primary} size={22} /><AppText bold size={14} style={{ flex: 1 }}>Consistência é mais importante que perfeição.</AppText></View>
    <AppText muted size={11} style={{ textAlign: 'center', marginTop: 5 }}>Demonstração: {photos.length} foto(s) nesta sessão • nenhum dado é salvo</AppText>
  </Screen>;
}
function Quick({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return <TouchableOpacity style={s.quick} onPress={onPress} activeOpacity={0.8}><View style={s.quickIcon}><Icon name={icon} color={C.primary} size={22} /></View><AppText bold size={12} style={{ textAlign: 'center' }}>{label}</AppText></TouchableOpacity>;
}
const s = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatar: { backgroundColor: C.primarySoft, width: 45, height: 45, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
  calories: { backgroundColor: C.primary, borderRadius: 29, padding: 22, marginBottom: 13, overflow: 'hidden' },
  calorieHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ringRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 18, gap: 17 },
  ringInfo: { flex: 1 },
  weightTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  weightIcon: { width: 46, height: 46, borderRadius: 17, backgroundColor: C.primarySoft, justifyContent: 'center', alignItems: 'center' },
  weightNumbers: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 25 },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 16 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 9, marginBottom: 10 },
  quick: { width: '48%', minHeight: 99, backgroundColor: C.white, borderRadius: 21, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 10 },
  quickIcon: { backgroundColor: C.primarySoft, padding: 11, borderRadius: 15 },
  meal: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  mealIcon: { width: 43, height: 43, justifyContent: 'center', alignItems: 'center', borderRadius: 15 },
  quote: { backgroundColor: C.primarySoft, borderRadius: 18, padding: 17, flexDirection: 'row', alignItems: 'center', gap: 14 },
});
