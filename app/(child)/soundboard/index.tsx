import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { speakText } from '@/lib/audio';

const TABS = [
  { id: 'hewan', label: '🐾 Hewan' },
  { id: 'kendaraan', label: '🚗 Kendaraan' },
  { id: 'musik', label: '🎵 Musik' },
];

type SoundItem = {
  emoji: string;
  name: string;
  soundDesc: string;
  color: string;
  shadowColor: string;
};

const SOUND_DATA: Record<string, SoundItem[]> = {
  hewan: [
    { emoji: '🦁', name: 'Singa', soundDesc: 'Auuuum!', color: '#FDCB6E', shadowColor: '#E1A100' },
    { emoji: '🐄', name: 'Sapi', soundDesc: 'Moooo!', color: '#636E72', shadowColor: '#2D3436' },
    { emoji: '🦆', name: 'Bebek', soundDesc: 'Kwek kwek kwek!', color: '#00B894', shadowColor: '#00876C' },
    { emoji: '🐔', name: 'Ayam', soundDesc: 'Kukuruyuuuk!', color: '#E17055', shadowColor: '#D63031' },
    { emoji: '🐱', name: 'Kucing', soundDesc: 'Meoooong!', color: '#A29BFE', shadowColor: '#6C5CE7' },
    { emoji: '🐶', name: 'Anjing', soundDesc: 'Guk guk guk!', color: '#74B9FF', shadowColor: '#0984E3' },
    { emoji: '🐸', name: 'Katak', soundDesc: 'Kwaak kwaak!', color: '#00CEC9', shadowColor: '#00B894' },
    { emoji: '🐑', name: 'Domba', soundDesc: 'Embeeek!', color: '#FD79A8', shadowColor: '#E84393' },
    { emoji: '🐷', name: 'Babi', soundDesc: 'Oink oink!', color: '#FF7675', shadowColor: '#D63031' },
    { emoji: '🦅', name: 'Elang', soundDesc: 'Kiiiik!', color: '#2D3436', shadowColor: '#000000' },
    { emoji: '🐘', name: 'Gajah', soundDesc: 'Brrruuuuu!', color: '#636E72', shadowColor: '#2D3436' },
    { emoji: '🐓', name: 'Jago', soundDesc: 'Kukuruyuuuuk!', color: '#FF5252', shadowColor: '#D32F2F' },
  ],
  kendaraan: [
    { emoji: '🚗', name: 'Mobil', soundDesc: 'Bruuuum bruuum!', color: '#FF5252', shadowColor: '#D32F2F' },
    { emoji: '🚂', name: 'Kereta', soundDesc: 'Tuuuut tuuuut! Syuuuu!', color: '#636E72', shadowColor: '#2D3436' },
    { emoji: '✈️', name: 'Pesawat', soundDesc: 'Nguuuung!', color: '#74B9FF', shadowColor: '#0984E3' },
    { emoji: '🚢', name: 'Kapal', soundDesc: 'Tuuuuut! Byuuur!', color: '#00CEC9', shadowColor: '#00B894' },
    { emoji: '🏍️', name: 'Motor', soundDesc: 'Brem brem brem!', color: '#E17055', shadowColor: '#D63031' },
    { emoji: '🚑', name: 'Ambulans', soundDesc: 'Wiu wiu wiu!', color: '#74B9FF', shadowColor: '#0984E3' },
    { emoji: '🚒', name: 'Pemadam', soundDesc: 'Nging nging nging!', color: '#FF5252', shadowColor: '#D32F2F' },
    { emoji: '🚁', name: 'Helikopter', soundDesc: 'Wop wop wop wop!', color: '#00B894', shadowColor: '#00876C' },
    { emoji: '🚲', name: 'Sepeda', soundDesc: 'Kring kring!', color: '#FDCB6E', shadowColor: '#E1A100' },
  ],
  musik: [
    { emoji: '🥁', name: 'Drum', soundDesc: 'Dug dug dug dag!', color: '#FF5252', shadowColor: '#D32F2F' },
    { emoji: '🎹', name: 'Piano', soundDesc: 'Ting ting ting ting!', color: '#2D3436', shadowColor: '#000000' },
    { emoji: '🎸', name: 'Gitar', soundDesc: 'Jreng jreng jreng!', color: '#FDCB6E', shadowColor: '#E1A100' },
    { emoji: '🎺', name: 'Terompet', soundDesc: 'Tut tut turuuuut!', color: '#00B894', shadowColor: '#00876C' },
    { emoji: '🎻', name: 'Biola', soundDesc: 'Ngiiiing ngiiing!', color: '#E17055', shadowColor: '#D63031' },
    { emoji: '🪘', name: 'Tifa', soundDesc: 'Bum bum bum!', color: '#A29BFE', shadowColor: '#6C5CE7' },
    { emoji: '📯', name: 'Horn', soundDesc: 'Puuuup puuuup!', color: '#FD79A8', shadowColor: '#E84393' },
    { emoji: '🔔', name: 'Lonceng', soundDesc: 'Kling kling kling!', color: '#FDCB6E', shadowColor: '#E1A100' },
  ],
};

function SoundCard({ item }: { item: SoundItem }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();

    // Wiggle animation
    Animated.sequence([
      Animated.timing(bounceAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(bounceAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(bounceAnim, { toValue: -4, duration: 50, useNativeDriver: true }),
      Animated.timing(bounceAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();

    speakText(`${item.name}! ${item.soundDesc}`);
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.soundCard,
          { backgroundColor: item.color, borderBottomColor: item.shadowColor },
          { transform: [{ scale: scaleAnim }, { rotate: bounceAnim.interpolate({
              inputRange: [-10, 10],
              outputRange: ['-5deg', '5deg'],
            }) }]
          },
        ]}
      >
        <Text style={styles.soundEmoji}>{item.emoji}</Text>
        <Text style={styles.soundName}>{item.name}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function SoundboardGame() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('hewan');
  const soundItems = SOUND_DATA[activeTab] || SOUND_DATA.hewan;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>⬅️</Text>
        </Pressable>
        <Text style={styles.title}>🔊 Papan Suara</Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Instruction */}
      <Text style={styles.subtitle}>Tekan gambar untuk mendengar suaranya! 🔉</Text>

      {/* Sound Grid */}
      <ScrollView contentContainerStyle={styles.gridScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {soundItems.map((item) => (
            <SoundCard key={item.name} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9E6' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
  },
  backBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF',
    alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 4, borderBottomColor: '#DFE6E9', elevation: 4, marginRight: 14,
  },
  backIcon: { fontSize: 22 },
  title: { fontSize: 28, fontWeight: '900', color: '#D35400' },
  tabRow: {
    flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginTop: 8, marginBottom: 12,
  },
  tab: {
    flex: 1, paddingVertical: 10, borderRadius: 18,
    backgroundColor: '#F1F2F6', alignItems: 'center',
  },
  tabActive: { backgroundColor: '#FDCB6E' },
  tabText: { fontSize: 14, fontWeight: '800', color: '#636E72' },
  tabTextActive: { color: '#D35400' },
  subtitle: {
    fontSize: 15, fontWeight: '700', color: '#636E72',
    textAlign: 'center', marginBottom: 12,
  },
  gridScroll: { paddingHorizontal: 20, paddingBottom: 32 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center',
  },
  soundCard: {
    width: 100, height: 110, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 5, elevation: 5,
  },
  soundEmoji: { fontSize: 42 },
  soundName: {
    fontSize: 13, fontWeight: '900', color: '#FFF', marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2,
  },
});
