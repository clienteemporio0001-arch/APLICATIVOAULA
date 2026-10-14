import React, { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText, Button, Card, Heading, Icon, IconName, Input, Pill, Screen, Section } from '@/src/ui';
import { C } from '@/src/theme';
import { useDemo } from '@/src/demo';

export default function Profile() {
  const { profile, setProfile, reset } = useDemo();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [target, setTarget] = useState(String(profile.goalWeight).replace('.', ','));
  const [calories, setCalories] = useState(String(profile.calorieGoal));
  const [error, setError] = useState('');
  const save = () => {
    const goalWeight = Number(target.replace(',', '.'));
    const calorieGoal = Number(calories.replace(',', '.'));
    if (!name.trim() || goalWeight < 25 || goalWeight > 350 || calorieGoal < 1000 || calorieGoal > 6000) {
      setError('Confira os campos: meta de 25 a 350 kg e valor ilustrativo de 1.000 a 6.000 kcal.'); return;
    }
    setProfile({ name: name.trim(), goalWeight, calorieGoal: Math.round(calorieGoal) });
    setError(''); setEditing(false);
  };
  return <Screen>
    <Pill text="PERFIL DE DEMONSTRAÇÃO" icon="flask-outline" /><View style={{ height: 12 }} />
    <Heading title="Meu perfil" subtitle="Seu espaço, suas escolhas, seu ritmo." />
    <Card style={s.bio}>
      <View style={s.avatar}><AppText bold size={35} style={{ color: C.primary }}>{profile.name.slice(0,1).toUpperCase()}</AppText></View>
      <AppText bold size={22} style={{ marginTop: 11 }}>{profile.name}</AppText>
      <AppText muted size={13}>Usuário fictício • Sem conta vinculada</AppText>
      <View style={{ marginTop: 14 }}><Pill text="CUIDAR É EVOLUIR" icon="heart-outline" /></View>
    </Card>
    <Section title="Minhas informações" action={editing ? 'Cancelar' : 'Editar'} onPress={() => { setEditing(!editing); setError(''); }} />
    <Card>
      {editing ? <>
        <AppText bold size={13}>Como podemos chamar você?</AppText><Input value={name} onChangeText={setName} />
        <AppText bold size={13} style={{ marginTop: 9 }}>Meta de peso (kg)</AppText><Input value={target} onChangeText={setTarget} keyboardType="decimal-pad" />
        <AppText bold size={13} style={{ marginTop: 9 }}>Meta fictícia diária (kcal)</AppText><Input value={calories} onChangeText={setCalories} keyboardType="numeric" />
        <AppText muted size={11}>Ajuste para testar os indicadores. Isso não é uma meta nutricional recomendada.</AppText>
        {error ? <AppText size={12} style={{ color: C.danger, marginTop: 8 }}>{error}</AppText> : null}
        <View style={{ marginTop: 15 }}><Button title="Salvar alterações" onPress={save} icon="checkmark-outline" /></View>
      </> : <>
        <Info icon="calendar-outline" label="Idade" value={profile.age + ' anos'} />
        <Info icon="resize-outline" label="Altura" value={profile.height + ' cm'} />
        <Info icon="fitness-outline" label="Atividade" value={profile.activity} />
        <Info icon="flag-outline" label="Meta de peso" value={String(profile.goalWeight).replace('.', ',') + ' kg'} />
        <Info icon="flame-outline" label="Calorias ilustrativas" value={profile.calorieGoal.toLocaleString('pt-BR') + ' kcal'} last />
      </>}
    </Card>
    <Section title="Personalização" />
    <Card style={{ padding: 16 }}>
      <TouchableOpacity onPress={() => router.push('/onboarding')}><Info icon="options-outline" label="Refazer onboarding" value="Alterar respostas" /></TouchableOpacity>
      <TouchableOpacity onPress={() => { reset(); setName('Ana'); setTarget('76'); setCalories('1900'); }}><Info icon="refresh-outline" label="Reiniciar demonstração" value="Limpar alterações" last /></TouchableOpacity>
    </Card>
    <Section title="Privacidade e segurança" />
    <Card><View style={s.notice}><Icon name="shield-checkmark-outline" size={26} color={C.primary} /><View style={{ flex: 1 }}><AppText bold size={14}>Esta é uma experiência simulada</AppText><AppText muted size={12} style={{ marginTop: 4 }}>Não há login, nuvem nem banco de dados nesta fase. Alterações e imagens escolhidas permanecem apenas em memória e são descartadas ao reiniciar a sessão.</AppText></View></View>
      <View style={{ height: 16 }} /><AppText muted size={12}>O recurso de autenticação, a exclusão de conta e a proteção RLS no Supabase serão implementados na Fase 2. Nenhum dado real deve ser registrado aqui.</AppText>
    </Card>
    <View style={{ gap: 10, marginTop: 7 }}><Button title="Voltar à apresentação" outline icon="arrow-back-outline" onPress={() => router.replace('/')} /></View>
    <AppText muted size={11} style={{ textAlign: 'center', marginTop: 25 }}>Leve+ • versão 0.1.0 • Fase 1</AppText>
  </Screen>;
}
function Info({ icon, label, value, last = false }: { icon: IconName; label: string; value: string; last?: boolean }) {
  return <View style={[s.info, last && { borderBottomWidth: 0 }]}><Icon name={icon} color={C.primary} size={21} /><AppText size={13} style={{ flex:1 }}>{label}</AppText><AppText muted size={12}>{value}</AppText></View>;
}
const s = StyleSheet.create({
  bio: { alignItems: 'center', paddingVertical: 27 },
  avatar: { width: 88, height: 88, borderRadius: 34, alignItems: 'center', justifyContent: 'center', backgroundColor: C.primarySoft },
  info: { flexDirection: 'row', gap: 14, alignItems: 'center', minHeight: 55, borderBottomColor: C.line, borderBottomWidth: 1 },
  notice: { flexDirection: 'row', gap: 12 },
});
