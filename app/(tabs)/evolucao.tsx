import React, { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText, Button, Card, Heading, Icon, Input, Pill, Screen, Section } from '@/src/ui';
import { C } from '@/src/theme';
import { formatDay, useDemo } from '@/src/demo';

const asKg = (value: number) => value.toFixed(1).replace('.', ',');
export default function Evolution() {
  const { peso, foto } = useLocalSearchParams<{ peso?: string; foto?: string }>();
  const { profile, weights, addWeight, deleteWeight, photos, addPhoto, deletePhoto } = useDemo();
  const [editing, setEditing] = useState(false);
  const [weightText, setWeightText] = useState('');
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => { if (peso === '1') setEditing(true); }, [peso]);
  const current = weights.length ? weights[weights.length-1].value : profile.initialWeight;
  const initial = profile.initialWeight;
  const raw = initial === profile.goalWeight ? 0 : (initial-current)/(initial-profile.goalWeight);
  const progress = Math.max(0,Math.min(1, raw));
  const recent = useMemo(() => weights.slice(-8), [weights]);
  const min = Math.min(...recent.map(x => x.value), profile.goalWeight)-1.5;
  const max = Math.max(...recent.map(x => x.value), initial)+1.5;
  const save = () => {
    const value = Number(weightText.replace(',', '.'));
    if (!Number.isFinite(value) || value < 25 || value > 350) { setError('Informe um peso válido em quilogramas.'); return; }
    addWeight(value); setWeightText(''); setError(''); setEditing(false);
  };
  const selectPicture = async (source: 'camera' | 'library') => {
    try {
      if (source === 'camera' && Platform.OS === 'web') { setError('Use a galeria no navegador. A câmera estará disponível no aplicativo instalado.'); return; }
      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) { setError('Permissão de câmera não concedida.'); return; }
      }
      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1, allowsEditing: false })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1, allowsEditing: false });
      if (!result.canceled && result.assets?.[0]?.uri) { addPhoto(result.assets[0].uri); setError(''); }
    } catch { setError('Não foi possível abrir as imagens neste dispositivo.'); }
  };
  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]);
  const compared = selected.map(id => photos.find(p => p.id === id)).filter((p): p is typeof photos[number] => Boolean(p));
  return <Screen>
    <Pill text="EVOLUÇÃO DEMONSTRATIVA" icon="flask-outline" />
    <View style={{ height: 12 }} /><Heading title="Sua evolução" subtitle="Seu progresso vai além de um número." />
    <Card>
      <View style={s.top}><View><AppText muted size={12}>PESO MAIS RECENTE</AppText><AppText size={36} bold>{asKg(current)} <AppText muted size={18}>kg</AppText></AppText></View><View style={s.leaf}><Icon name="leaf" size={28} color={C.primary} /></View></View>
      <View style={s.stats}>
        <View><AppText muted size={11}>INICIAL</AppText><AppText bold size={18}>{asKg(initial)} kg</AppText></View>
        <View><AppText muted size={11}>META</AppText><AppText bold size={18}>{asKg(profile.goalWeight)} kg</AppText></View>
        <View><AppText muted size={11}>VARIAÇÃO</AppText><AppText bold size={18}>{(current-initial)>0?'+':''}{asKg(current-initial)} kg</AppText></View>
      </View>
      <View style={s.progressLine}><View style={[s.progressValue, { width: (progress * 100) + '%' }]} /></View>
      <AppText muted size={12}>{Math.round(progress*100)}% do caminho entre o início e a meta, conforme seus registros ilustrativos.</AppText>
    </Card>
    <Section title="Histórico de peso" />
    <Card>
      <AppText bold size={15}>Últimos registros</AppText>
      <View style={s.chart}>{recent.map((entry, i) => {
        const height = 24 + Math.max(0, (entry.value-min)/(max-min)) * 105;
        return <View key={entry.id + i} style={s.chartBar}><AppText size={10} bold>{asKg(entry.value)}</AppText><View style={[s.bar,{height, backgroundColor: i===recent.length-1 ? C.primary : C.mint }]} /><AppText muted size={10}>{entry.day.slice(8) + '/' + entry.day.slice(5,7)}</AppText></View>;
      })}</View>
      {weights.slice().reverse().map(entry => <View key={entry.id} style={s.entry}><View style={{ flex:1 }}><AppText bold size={14}>{asKg(entry.value)} kg</AppText><AppText muted size={11}>{formatDay(entry.day)}</AppText></View><TouchableOpacity onPress={() => deleteWeight(entry.id)} accessibilityLabel="Excluir registro de peso" style={{ padding: 10 }}><Icon name="trash-outline" color={C.danger} size={18} /></TouchableOpacity></View>)}
      {editing ? <>
        <AppText bold size={13} style={{ marginTop: 15 }}>Novo peso ilustrativo (kg)</AppText><Input value={weightText} onChangeText={setWeightText} keyboardType="decimal-pad" placeholder="Ex.: 81,8" />
        {error ? <AppText style={{ color: C.danger }}>{error}</AppText> : null}
        <Button title="Salvar registro" icon="checkmark-outline" onPress={save} />
        <View style={{ height: 8 }} /><Button title="Cancelar" outline onPress={() => { setEditing(false); setError(''); }} />
      </> : <View style={{ marginTop: 15 }}><Button title="Registrar novo peso" icon="add-circle-outline" onPress={() => setEditing(true)} /></View>}
    </Card>
    <Section title="Fotos de acompanhamento" />
    <Card>
      <View style={s.photoHeader}><View style={s.photoIcon}><Icon name="images-outline" size={25} color={C.primary} /></View><View style={{ flex: 1 }}><AppText bold size={16}>Sua linha do tempo</AppText><AppText muted size={12}>Uma foto por semana é uma sugestão, não uma obrigação.</AppText></View></View>
      <AppText muted size={12} style={{ marginBottom: 13 }}>As fotos selecionadas são exibidas somente na memória desta sessão. Não há envio ou armazenamento privado até a Fase 3.</AppText>
      <Button title="Adicionar foto da galeria" icon="image-outline" onPress={() => void selectPicture('library')} />
      <View style={{ height: 8 }} /><Button title="Usar câmera (Android/iOS)" icon="camera-outline" outline onPress={() => void selectPicture('camera')} />
      {error ? <AppText size={12} style={{ color: C.danger, marginTop: 12 }}>{error}</AppText> : null}
      {photos.length === 0 ? <View style={s.empty}><Icon name="camera-outline" size={32} color={C.muted} /><AppText bold size={14} style={{ marginTop: 10 }}>Sua galeria começa aqui</AppText><AppText muted size={12} style={{ textAlign: 'center', marginTop: 5 }}>Nenhuma fotografia foi adicionada. Use a sua própria imagem para testar.</AppText></View> : <View style={s.photos}>{photos.map(photo => <View key={photo.id} style={s.photoCard}><TouchableOpacity onPress={() => toggle(photo.id)} style={[s.thumbnail, selected.includes(photo.id) && { borderColor: C.primary, borderWidth: 3 }]}><Image source={{ uri: photo.uri }} style={s.img} resizeMode="contain" /><View style={s.check}><Icon name={selected.includes(photo.id) ? 'checkmark-circle' : 'ellipse-outline'} color={selected.includes(photo.id) ? C.primary : C.white} size={25} /></View></TouchableOpacity><AppText muted size={11}>{formatDay(photo.day)}</AppText><TouchableOpacity onPress={() => { deletePhoto(photo.id); setSelected(prev => prev.filter(x => x!==photo.id)); }}><AppText size={12} style={{ color: C.danger }}>Excluir</AppText></TouchableOpacity></View>)}</View>}
      {compared.length === 2 ? <><Section title="Comparar duas fotos" /><View style={s.compare}>{compared.map(p => <View key={p.id} style={s.comparePhoto}><Image source={{ uri: p.uri }} resizeMode="contain" style={{ width: '100%', height: 185 }} /><AppText muted size={11} style={{ textAlign: 'center' }}>{formatDay(p.day)}</AppText></View>)}</View></> : <AppText muted size={12} style={{ marginTop: 18 }}>Escolha duas fotografias da galeria para compará-las lado a lado, sem filtros ou alterações.</AppText>}
    </Card>
    <View style={s.reminder}><Icon name="heart-outline" color={C.primary} size={21} /><AppText size={13} style={{ flex: 1 }}>Oscilações são naturais. Seu bem-estar não deve ser reduzido ao peso ou à aparência.</AppText></View>
  </Screen>;
}
const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  leaf: { backgroundColor: C.primarySoft, width: 60, height: 60, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  stats: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 22, paddingBottom: 21 },
  progressLine: { height: 10, borderRadius: 10, backgroundColor: C.primarySoft, marginBottom: 9, overflow: 'hidden' },
  progressValue: { height: 10, backgroundColor: C.primary, borderRadius: 10 },
  chart: { marginTop: 18, height: 180, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', gap: 4, paddingBottom: 9, borderBottomWidth: 1, borderBottomColor: C.line, marginBottom: 14 },
  chartBar: { alignItems: 'center', gap: 5, flex: 1 },
  bar: { width: '74%', borderTopLeftRadius: 11, borderTopRightRadius: 11 },
  entry: { flexDirection: 'row', paddingVertical: 11, borderBottomColor: C.line, borderBottomWidth: 1, alignItems: 'center' },
  photoHeader: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 14 },
  photoIcon: { backgroundColor: C.primarySoft, width: 53, height: 53, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  empty: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: C.line, padding: 27, marginTop: 18, borderRadius: 22, alignItems: 'center' },
  photos: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', paddingTop: 18 },
  photoCard: { width: '47%', gap: 6 },
  thumbnail: { borderColor: C.line, borderWidth: 1, borderRadius: 15, overflow: 'hidden' },
  img: { height: 160, width: '100%', backgroundColor: C.bg },
  check: { position: 'absolute', right: 8, top: 8 },
  compare: { flexDirection: 'row', gap: 10, paddingTop: 5 },
  comparePhoto: { flex: 1, borderRadius: 15, backgroundColor: C.bg, padding: 8 },
  reminder: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: C.primarySoft, padding: 17, borderRadius: 18 },
});
