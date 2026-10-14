import React, { createContext, useContext, useMemo, useState } from 'react';

export type Category = 'Café da manhã' | 'Almoço' | 'Jantar' | 'Lanches';
export type Meal = { id: string; title: string; category: Category; kcal: number; day: string };
export type Weight = { id: string; value: number; day: string };
export type ProgressPhoto = { id: string; uri: string; day: string };
export type Profile = { name: string; age: number; height: number; initialWeight: number; goalWeight: number; calorieGoal: number; activity: string };

export function localDay(date = new Date()): string {
  const year = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return year + '-' + m + '-' + d;
}
export function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return localDay(d);
}
export function formatDay(day: string): string {
  const [year, month, date] = day.split('-');
  return date + '/' + month + '/' + year;
}
export const kcal = (n: number) => Math.round(n).toLocaleString('pt-BR');
const initialProfile: Profile = { name: 'Ana', age: 29, height: 165, initialWeight: 84.2, goalWeight: 76, calorieGoal: 1900, activity: 'Leve' };
function seedMeals(): Meal[] {
  return [
    { id: 'm1', title: 'Café da manhã de exemplo', category: 'Café da manhã', kcal: 285, day: localDay() },
    { id: 'm2', title: 'Almoço de exemplo', category: 'Almoço', kcal: 565, day: localDay() },
  ];
}
function seedWeights(): Weight[] {
  return [
    { id: 'w1', value: 84.2, day: daysAgo(21) },
    { id: 'w2', value: 83.7, day: daysAgo(14) },
    { id: 'w3', value: 82.9, day: daysAgo(7) },
    { id: 'w4', value: 82.3, day: localDay() },
  ];
}
type DemoState = {
  profile: Profile; setProfile: (p: Partial<Profile>) => void;
  meals: Meal[]; addMeal: (data: Omit<Meal, 'id'>) => void; deleteMeal: (id: string) => void;
  weights: Weight[]; addWeight: (value: number) => void; deleteWeight: (id: string) => void;
  photos: ProgressPhoto[]; addPhoto: (uri: string) => void; deletePhoto: (id: string) => void;
  reset: () => void;
};
const Context = createContext<DemoState | null>(null);
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [profile, updateProfile] = useState<Profile>(initialProfile);
  const [meals, setMeals] = useState<Meal[]>(seedMeals);
  const [weights, setWeights] = useState<Weight[]>(seedWeights);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const state = useMemo<DemoState>(() => ({
    profile, setProfile: p => updateProfile(old => ({ ...old, ...p })),
    meals,
    addMeal: item => setMeals(old => [{ ...item, id: String(Date.now()) + Math.random() }, ...old]),
    deleteMeal: id => setMeals(old => old.filter(x => x.id !== id)),
    weights,
    addWeight: value => setWeights(old => [...old, { id: String(Date.now()), day: localDay(), value }]),
    deleteWeight: id => setWeights(old => old.filter(x => x.id !== id)),
    photos,
    addPhoto: uri => setPhotos(old => [{ id: String(Date.now()), day: localDay(), uri }, ...old]),
    deletePhoto: id => setPhotos(old => old.filter(x => x.id !== id)),
    reset: () => { updateProfile(initialProfile); setMeals(seedMeals()); setWeights(seedWeights()); setPhotos([]); },
  }), [profile, meals, weights, photos]);
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export function useDemo() {
  const value = useContext(Context);
  if (!value) throw new Error('useDemo deve ser utilizado dentro do DemoProvider');
  return value;
}
