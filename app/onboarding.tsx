import React, { useState } from 'react';
import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Icon, Input, Pill } from '@/src/ui';
import { useDemo } from '@/src/demo';
import { C } from '@/src/theme';

const questions = [
  { title: 'Como podemos chamar você?', hint: 'Vamos tornar essa jornada mais pessoal.' },
  { title: 'Qual é a sua idade?', hint: 'O Leve+ é destinado a adultos a partir dos 18 anos.' },
  { title: 'Qual é a sua altura?', hint: 'Informe sua altura em centímetros.' },
  { title: 'Qual é seu peso atual?', hint: 'Apenas para criar uma referência inicial.' },
  { title: 'Qual é sua meta de peso?', hint: 'Você pode ajustar sua meta depois, sem pressa.' },
  { title: 'Como é sua rotina de movimento?', hint: 'Selecione a opção que mais combina com seu dia a dia.' },
  { title: 'Como prefere definir suas calorias?', hint: 'O cálculo automático será implementado na Fase 3.' },
  { title: 'Mais um detalhe importante', hint: 'Este protótipo não emite prescrição nutricional.' },
];
const activities = ['Sedentária', 'Leve', 'Moderada', 'Intensa'];
export default function Onboarding() {
  const { profile, setProfile } = useDemo();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(String(profile.age));
  const [height, setHeight] = useState(String(profile.height));
  const [weight, setWeight] = useState(String(profile.initialWeight).replace('.', ','));
  const [goal, setGoal] = useState(String(profile.goalWeight));
  const [activity, setActivity] = useState(profile.activity);
  const [method, setMethod] = useState<'manual' | 'estimate'>('manual');
  const [physiology, setPhysiology] = useState<'a' | 'b' | null>(null);
  const [error, setError] = useState('');
  const fields = [
    <Input value={name} onChangeText={setName} placeholder="Como prefere ser chamado?" />,
    <Input value={age} onChangeText={setAge} placeholder="Ex.: 29" keyboardType="numeric" />,
    <Input value={height} onChangeText={setHeight} placeholder="Ex.: 165 cm" keyboardType="numeric" />,
    <Input value={weight} onChangeText={setWeight} placeholder="Ex.: 82,3 kg" keyboardType="decimal-pad" />,
    <Input value={goal} onChangeText={setGoal} placeholder="Ex.: 76 kg" keyboardType="decimal-pad" />,
    <View style={s.options}>{activities.map(a => <Option key={a} selected={activity === a} text={a} onPress={() => setActivity(a)} />)}</View>,
    <View style={s.options}>
      <Option selected={method === 'manual'} text="Definir meta com orientação profissional" onPress={() => setMethod('manual')} />
      <Option selected={method === 'estimate'} text="Solicitar estimativa energética futuramente" onPress={() => setMethod('estimate')} />
      <AppText muted size={12}>Nenhuma estimativa é calculada neste protótipo. As 1.900 kcal da demonstração são fictícias.</AppText>
    </View>,
    <View style={s.options}>
      {method === 'estimate' ? <>
        <AppText muted>Para a equação Mifflin-St Jeor, um parâmetro fisiológico deve ser informado. Ele não representa identidade de gênero.</AppText>
        <Option selected={physiology === 'a'} text="Parâmetro fisiológico A" onPress={() => setPhysiology('a')} />
        <Option selected={physiology === 'b'} text="Parâmetro fisiológico B" onPress={() => setPhysiology('b')} />
      </> : <Pill text="Meta manual selecionada" icon="checkmark-circle-outline" />}
      <AppText muted size={13}>Gestantes, lactantes e pessoas com condições médicas ou histórico de transtornos alimentares precisam de orientação profissional. Não oferecemos restrição automática neste protótipo.</AppText>
    </View>,
  ];
  const validate = (): string => {
    const number = (s: string) => Number(s.replace(',', '.'));
    if (step === 0 && !name.trim()) return 'Informe como gostaria de ser chamado.';
    if (step === 1 && (!Number.isInteger(number(age)) || number(age) < 18 || number(age) > 110)) return 'Informe uma idade válida (18 anos ou mais).';
    if (step === 2 && (number(height) < 100 || number(height) > 230)) return 'Informe uma altura válida em centímetros.';
    if (step === 3 && (number(weight) < 25 || number(weight) > 350)) return 'Informe seu peso em quilogramas.';
    if (step === 4 && (number(goal) < 25 || number(goal) > 350)) return 'Informe uma meta de peso válida.';
    if (step === 7 && method === 'estimate' && !physiology) return 'Selecione o parâmetro ou volte para a opção manual.';
    return '';
  };
  const next = () => {
    const message = validate();
    if (message) { setError(message); return; }
    setError('');
    if (step < 7) { setStep(old => old + 1); return; }
    const parse = (value: string) => Number(value.replace(',', '.'));
    setProfile({ name: name.trim(), age: parse(age), height: parse(height), initialWeight: parse(weight), goalWeight: parse(goal), activity });
    Alert.alert('Seu acompanhamento está pronto!', 'Você está entrando na demonstração. Nenhum cálculo de dieta foi realizado.', [{ text: 'Continuar', onPress: () => router.replace('/(tabs)') }]);
    if (typeof window !== 'undefined') router.replace('/(tabs)');
  };
  return <SafeAreaView style={s.root}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.shell}>
    <View style={s.top}><TouchableOpacity onPress={() => step ? setStep(step-1) : router.back()} style={s.back}><Icon name="arrow-back" color={C.ink} /></TouchableOpacity><Pill text="MODO DEMONSTRAÇÃO" icon="flask-outline" /></View>
    <View style={s.progress}><View style={[s.progressFill, { width: `${((step + 1) / 8) * 100}%` as `${number}%` }]} /></View>
    <AppText muted size={13} style={{ marginTop: 12 }}>PASSO {step+1} DE 8</AppText>
    <View style={{ marginTop: 40, flex: 1 }}>
      <View style={s.emblem}><Icon name="leaf-outline" color={C.primary} size={29} /></View>
      <AppText bold size={31} style={{ marginTop: 22, lineHeight: 39 }}>{questions[step].title}</AppText>
      <AppText muted size={15} style={{ marginTop: 9, marginBottom: 30 }}>{questions[step].hint}</AppText>
      {fields[step]}
      {error ? <AppText style={{ color: C.danger, marginTop: 12 }}>{error}</AppText> : null}
    </View>
    <View style={{ marginTop: 35 }}><Button title={step === 7 ? 'Concluir demonstração' : 'Continuar'} icon="arrow-forward" onPress={next} /></View>
  </ScrollView></SafeAreaView>;
}
function Option({ selected, text, onPress }: { selected: boolean; text: string; onPress: () => void }) {
  return <TouchableOpacity onPress={onPress} style={[s.option, selected && s.selected]}><AppText bold size={14}>{text}</AppText><Icon name={selected ? 'checkmark-circle' : 'ellipse-outline'} color={selected ? C.primary : C.muted} size={23} /></TouchableOpacity>;
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  shell: { width: '100%', maxWidth: 590, flexGrow: 1, alignSelf: 'center', padding: 24, paddingBottom: 35 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  back: { backgroundColor: C.white, width: 44, height: 44, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  progress: { width: '100%', height: 7, backgroundColor: '#DEEBE2', overflow: 'hidden', borderRadius: 20 },
  progressFill: { height: '100%', borderRadius: 20, backgroundColor: C.primary },
  emblem: { width: 68, height: 68, borderRadius: 23, justifyContent: 'center', alignItems: 'center', backgroundColor: C.primarySoft },
  options: { gap: 13 },
  option: { backgroundColor: C.white, borderRadius: 17, minHeight: 60, padding: 15, borderWidth: 1.5, borderColor: C.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  selected: { borderColor: C.primary, backgroundColor: '#F0FAF3' },
});
