import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { C } from './theme';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];
export function Icon({ name, color = C.ink, size = 22 }: { name: IconName; color?: string; size?: number }) {
  return <Ionicons name={name} size={size} color={color} />;
}
export function Screen({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  return <SafeAreaView edges={['top']} style={s.safe}><View style={s.backdrop}>{scroll ? <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.scroll}>{children}</ScrollView> : <View style={s.scroll}>{children}</View>}</View></SafeAreaView>;
}
export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}
export function AppText({ children, muted = false, size = 14, bold = false, style }: { children: React.ReactNode; muted?: boolean; size?: number; bold?: boolean; style?: object }) {
  return <Text style={[{ color: muted ? C.muted : C.ink, fontSize: size, fontWeight: bold ? '700' : '400', lineHeight: size * 1.35 }, style]}>{children}</Text>;
}
export function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return <View style={{ marginBottom: 22 }}><AppText bold size={29}>{title}</AppText>{subtitle ? <AppText muted size={14} style={{ marginTop: 5 }}>{subtitle}</AppText> : null}</View>;
}
export function Section({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {
  return <View style={s.section}><AppText bold size={19}>{title}</AppText>{action && onPress ? <TouchableOpacity onPress={onPress}><AppText bold size={13} style={{ color: C.primary }}>{action}  ›</AppText></TouchableOpacity> : null}</View>;
}
export function Button({ title, onPress, icon, secondary = false, outline = false, disabled = false }: { title: string; onPress: () => void; icon?: IconName; secondary?: boolean; outline?: boolean; disabled?: boolean }) {
  return <TouchableOpacity activeOpacity={0.82} disabled={disabled} onPress={onPress} style={[s.button, secondary && { backgroundColor: C.primarySoft }, outline && { backgroundColor: C.white, borderWidth: 1, borderColor: C.line }, disabled && { opacity: .45 }]}>
    {icon ? <Icon name={icon} color={secondary || outline ? C.primary : C.white} size={19} /> : null}
    <Text style={[s.buttonText, (secondary || outline) && { color: C.primary }]}>{title}</Text>
  </TouchableOpacity>;
}
export function Pill({ text, icon }: { text: string; icon?: IconName }) {
  return <View style={s.pill}>{icon ? <Icon name={icon} color={C.primary} size={13} /> : null}<AppText size={11} bold style={{ color: C.primary }}>{text}</AppText></View>;
}
export function Input({ value, onChangeText, placeholder, keyboardType = 'default' }: { value: string; onChangeText: (text: string) => void; placeholder?: string; keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'email-address' }) {
  return <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#9AAEA4" keyboardType={keyboardType} style={s.input} selectionColor={C.primary} />;
}
export function Ring({ progress, center, label, size = 160 }: { progress: number; center: string; label: string; size?: number }) {
  const stroke = 13;
  const r = (size - stroke - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const current = Math.min(1, Math.max(0, progress));
  return <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
      <Circle cx={size/2} cy={size/2} r={r} stroke="#D4EBDD" strokeWidth={stroke} fill="none" />
      <Circle cx={size/2} cy={size/2} r={r} stroke={C.white} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={String(circumference)} strokeDashoffset={circumference*(1-current)} />
    </Svg>
    <AppText bold size={27} style={{ color: C.white }}>{center}</AppText>
    <AppText size={11} style={{ color: '#D9F4E6' }}>{label}</AppText>
  </View>;
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  backdrop: { flex: 1, backgroundColor: C.bg },
  scroll: { width: '100%', maxWidth: 620, padding: 22, paddingBottom: 44, alignSelf: 'center' },
  card: { backgroundColor: C.white, borderRadius: 24, padding: 19, marginBottom: 16, borderWidth: 1, borderColor: '#EEF1ED' },
  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 14 },
  button: { backgroundColor: C.primary, paddingHorizontal: 18, borderRadius: 17, minHeight: 51, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9 },
  buttonText: { color: C.white, fontSize: 14, fontWeight: '700' },
  pill: { backgroundColor: C.primarySoft, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start' },
  input: { minHeight: 53, borderWidth: 1, borderColor: C.line, borderRadius: 14, paddingHorizontal: 16, fontSize: 16, color: C.ink, backgroundColor: '#FBFDFC', marginVertical: 7 },
});
