import React, { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText, Button, Card, Heading, Icon, Input, Pill, Screen, Section } from '@/src/ui';
import { C } from '@/src/theme';
import { Category, formatDay, kcal, localDay, useDemo } from '@/src/demo';

const groups: Category[] = ['Café da manhã', 'Almoço', 'Jantar', 'Lanches'];
const foods = ['Arroz', 'Feijão', 'Ovo', 'Frango', 'Carne', 'Peixe', 'Banana', 'Maçã', 'Mandioca', 'Tapioca', 'Pão', 'Salada'];
export default function Food() {
  const { meals, addMeal, deleteMeal, profile } = useDemo();
  const { novo } = useLocalSearchParams<{ novo?: string }>();
  const [adding, setAdding] = useState(false);
  const [day, setDay] = useState(localDay());
  const [category, setCategory] = useState<Category>('Café da manhã');
  const [title, setTitle] = useState('');
  const [calories, setCalories] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { if (novo === '1') setAdding(true); }, [novo]);
  const selected = useMemo(() => meals.filter(item => item.day === day), [day, meals]);
  const eaten = selected.reduce((n, item) => n + item.kcal, 0);
  const save = () => {
    const number = Number(calories.replace(',', '.'));
    if (!title.trim() || !Number.isFinite(number) || number <= 0 || number > 10000) { setError('Preencha a refeição e uma quantidade válida de calorias de exemplo.'); return; }
    addMeal({ title: title.trim(), category, kcal: Math.round(number), day });
    setAdding(false); setTitle(''); setCalories(''); setError('');
  };
  return <Screen>
    <Pill text="DIÁRIO DEMONSTRATIVO" icon="flask-outline" />
    <View style={{ height: 12 }} /><Heading title="Alimentação" subtitle="Acompanhe suas escolhas sem complicar." />
    <Card style={s.hero}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><View><AppText size={12} muted>CONSUMIDAS NO DIA</AppText><AppText size={32} bold style={{ marginTop: 3 }}>{kcal(eaten)} <AppText muted size={15}>kcal</AppText></AppText></View><View style={s.heroIcon}><Icon name="nutrition-outline" color={C.primary} size={28} /></View></View>
      <View style={s.track}><View style={[s.fill, { width: Math.min(100, eaten / Math.max(1,profile.calorieGoal) * 100) + '%' }]} /></View><AppText muted size={12}>{kcal(profile.calorieGoal)} kcal: meta ilustrativa da demonstração</AppText>
    </Card>
    <View style={s.dateRow}><TouchableOpacity onPress={() => setDay(localDay())} style={[s.dateButton, day===localDay() && s.dateActive]}><AppText bold size={13} style={{ color: day===localDay()? C.white : C.ink }}>Hoje</AppText></TouchableOpacity><TouchableOpacity onPress={() => { const d = new Date(); d.setDate(d.getDate()-1); setDay(localDay(d)); }} style={[s.dateButton, day!==localDay() && s.dateActive]}><AppText bold size={13} style={{ color: day!==localDay()? C.white : C.ink }}>Ontem</AppText></TouchableOpacity><AppText muted size={12}>{formatDay(day)}</AppText></View>
    {adding ? <Card>
      <View style={s.editHeading}><AppText bold size={18}>Nova refeição ilustrativa</AppText><TouchableOpacity onPress={() => { setAdding(false); setError(''); }}><Icon name="close-circle-outline" color={C.muted} size={26} /></TouchableOpacity></View>
      <AppText muted size={12}>Selecione a refeição:</AppText><View style={s.chips}>{groups.map(g => <TouchableOpacity key={g} onPress={() => setCategory(g)} style={[s.chip, category===g && s.chipActive]}><AppText bold size={12} style={{ color: category===g? C.white:C.ink }}>{g}</AppText></TouchableOpacity>)}</View>
      <AppText bold size={13} style={{ marginTop: 10 }}>Alimento ou descrição</AppText><Input value={title} onChangeText={setTitle} placeholder="Ex.: Lanche da tarde" />
      <AppText bold size={13} style={{ marginTop: 10 }}>Calorias de demonstração (kcal)</AppText><Input value={calories} onChangeText={setCalories} placeholder="Ex.: 180" keyboardType="decimal-pad" />
      <AppText muted size={12}>Informe um valor fictício: o catálogo nutricional será integrado e validado na Fase 3.</AppText>
      {error ? <AppText style={{ color: C.danger, marginTop: 10 }}>{error}</AppText> : null}
      <View style={{ marginTop: 18 }}><Button icon="checkmark-circle-outline" title="Adicionar ao diário" onPress={save} /></View>
    </Card> : <Button title="Registrar refeição" icon="add-circle-outline" onPress={() => setAdding(true)} />}
    <Section title="Refeições registradas" />
    {groups.map(group => {
      const items = selected.filter(x => x.category === group);
      return <Card key={group} style={{ padding: 17 }}><View style={s.groupHeading}><View style={s.groupIcon}><Icon name={group === 'Café da manhã' ? 'cafe-outline' : group === 'Almoço' ? 'sunny-outline' : group === 'Jantar' ? 'moon-outline' : 'nutrition-outline'} color={C.primary} size={20} /></View><View style={{ flex: 1 }}><AppText bold size={15}>{group}</AppText><AppText muted size={12}>{items.length ? items.length + ' registro(s)' : 'Nada registrado'}</AppText></View><AppText bold size={13}>{kcal(items.reduce((n, x) => n+x.kcal, 0))} kcal</AppText></View>
      {items.map(item => <View key={item.id} style={s.record}><AppText size={13} style={{ flex: 1 }}>{item.title}</AppText><AppText bold size={13}>{kcal(item.kcal)} kcal</AppText><TouchableOpacity accessibilityLabel={'Excluir ' + item.title} onPress={() => deleteMeal(item.id)} style={{ padding: 9 }}><Icon name="trash-outline" color={C.danger} size={18} /></TouchableOpacity></View>)}
      </Card>;
    })}
    <Section title="Ideias simples para explorar" />
    <Card><AppText muted size={12}>Catálogo visual de exemplos. Não há tabela nutricional vinculada nesta fase.</AppText>
      <Input value={search} onChangeText={setSearch} placeholder="Buscar alimentos brasileiros..." />
      <View style={s.chips}>{foods.filter(f => f.toLowerCase().includes(search.toLowerCase())).map(food => <TouchableOpacity key={food} style={s.food} onPress={() => { setTitle(food + ' (exemplo)'); setAdding(true); }}><Icon name="add" size={14} color={C.primary} /><AppText size={12}>{food}</AppText></TouchableOpacity>)}</View>
    </Card>
    <View style={s.info}><Icon name="information-circle-outline" color={C.primary} size={19} /><AppText muted size={12} style={{ flex: 1 }}>Tudo nesta tela é simulado. Os valores não devem ser usados para decidir quanto comer.</AppText></View>
  </Screen>;
}
const s = StyleSheet.create({
  hero: { backgroundColor: '#F0FAF3' },
  heroIcon: { width: 55, height: 55, backgroundColor: C.white, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  track: { height: 9, marginTop: 19, marginBottom: 11, borderRadius: 30, backgroundColor: '#D5ECDD', overflow: 'hidden' },
  fill: { backgroundColor: C.primary, height: '100%', borderRadius: 30 },
  dateRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 17 },
  dateButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: C.white },
  dateActive: { backgroundColor: C.primary },
  groupHeading: { flexDirection: 'row', gap: 11, alignItems: 'center' },
  groupIcon: { width: 42, height: 42, justifyContent: 'center', alignItems: 'center', backgroundColor: C.primarySoft, borderRadius: 14 },
  record: { borderTopWidth: 1, borderTopColor: C.line, marginTop: 12, paddingTop: 11, flexDirection: 'row', alignItems: 'center', gap: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 13 },
  chip: { paddingHorizontal: 12, paddingVertical: 10, backgroundColor: C.bg, borderRadius: 14, borderWidth: 1, borderColor: C.line },
  chipActive: { backgroundColor: C.primary, borderColor: C.primary },
  editHeading: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 17 },
  food: { paddingHorizontal: 12, paddingVertical: 9, backgroundColor: '#F3FAF5', borderRadius: 13, flexDirection: 'row', alignItems: 'center', gap: 6 },
  info: { flexDirection: 'row', gap: 12, padding: 15, alignItems: 'center' },
});
