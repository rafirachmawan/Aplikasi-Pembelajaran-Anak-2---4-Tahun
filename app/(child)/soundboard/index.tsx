import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { speakText } from '@/lib/audio';

const TABS = [
  { id: 'hewan', label: '🐾 Hewan' },
  { id: 'kendaraan', label: '🚗 Kendaraan' },
  { id: 'musik', label: '🎵 Musik' },
  { id: 'tubuh', label: '🗣️ Tubuh' },
  { id: 'rumah', label: '🏠 Rumah' },
];

type SoundItem = {
  id: string;
  emoji: string;
  name: string;
  soundDesc: string;
  color: string;
  shadowColor: string;
};

const SOUND_DATA: Record<string, SoundItem[]> = {
  hewan: [
    { id: 'h1', emoji: '🦁', name: 'Singa', soundDesc: 'Auuuum!', color: '#FDCB6E', shadowColor: '#E1A100' },
    { id: 'h2', emoji: '🐄', name: 'Sapi', soundDesc: 'Moooo!', color: '#636E72', shadowColor: '#2D3436' },
    { id: 'h3', emoji: '🦆', name: 'Bebek', soundDesc: 'Kwek kwek kwek!', color: '#00B894', shadowColor: '#00876C' },
    { id: 'h4', emoji: '🐔', name: 'Ayam', soundDesc: 'Kukuruyuuuk!', color: '#E17055', shadowColor: '#D63031' },
    { id: 'h5', emoji: '🐱', name: 'Kucing', soundDesc: 'Meoooong!', color: '#A29BFE', shadowColor: '#6C5CE7' },
    { id: 'h6', emoji: '🐶', name: 'Anjing', soundDesc: 'Guk guk guk!', color: '#74B9FF', shadowColor: '#0984E3' },
    { id: 'h7', emoji: '🐸', name: 'Katak', soundDesc: 'Kwaak kwaak!', color: '#00CEC9', shadowColor: '#00B894' },
    { id: 'h8', emoji: '🐑', name: 'Domba', soundDesc: 'Embeeek!', color: '#FD79A8', shadowColor: '#E84393' },
    { id: 'h9', emoji: '🐷', name: 'Babi', soundDesc: 'Oink oink!', color: '#FF7675', shadowColor: '#D63031' },
    { id: 'h10', emoji: '🐘', name: 'Gajah', soundDesc: 'Brrruuuuu!', color: '#636E72', shadowColor: '#2D3436' },
  ],
  kendaraan: [
    { id: 'k1', emoji: '🚗', name: 'Mobil', soundDesc: 'Bruuuum bruuum!', color: '#FF5252', shadowColor: '#D32F2F' },
    { id: 'k2', emoji: '🚂', name: 'Kereta', soundDesc: 'Tuuuut tuuuut! Syuuuu!', color: '#636E72', shadowColor: '#2D3436' },
    { id: 'k3', emoji: '✈️', name: 'Pesawat', soundDesc: 'Nguuuung!', color: '#74B9FF', shadowColor: '#0984E3' },
    { id: 'k4', emoji: '🚢', name: 'Kapal', soundDesc: 'Tuuuuut! Byuuur!', color: '#00CEC9', shadowColor: '#00B894' },
    { id: 'k5', emoji: '🏍️', name: 'Motor', soundDesc: 'Brem brem brem!', color: '#E17055', shadowColor: '#D63031' },
    { id: 'k6', emoji: '🚑', name: 'Ambulans', soundDesc: 'Wiu wiu wiu!', color: '#74B9FF', shadowColor: '#0984E3' },
    { id: 'k7', emoji: '🚒', name: 'Pemadam', soundDesc: 'Nging nging nging!', color: '#FF5252', shadowColor: '#D32F2F' },
    { id: 'k8', emoji: '🚲', name: 'Sepeda', soundDesc: 'Kring kring!', color: '#FDCB6E', shadowColor: '#E1A100' },
  ],
  musik: [
    { id: 'm1', emoji: '🥁', name: 'Drum', soundDesc: 'Dug dug dug dag!', color: '#FF5252', shadowColor: '#D32F2F' },
    { id: 'm2', emoji: '🎹', name: 'Piano', soundDesc: 'Ting ting ting ting!', color: '#2D3436', shadowColor: '#000000' },
    { id: 'm3', emoji: '🎸', name: 'Gitar', soundDesc: 'Jreng jreng jreng!', color: '#FDCB6E', shadowColor: '#E1A100' },
    { id: 'm4', emoji: '🎺', name: 'Terompet', soundDesc: 'Tut tut turuuuut!', color: '#00B894', shadowColor: '#00876C' },
    { id: 'm5', emoji: '🎻', name: 'Biola', soundDesc: 'Ngiiiing ngiiing!', color: '#E17055', shadowColor: '#D63031' },
    { id: 'm6', emoji: '🔔', name: 'Lonceng', soundDesc: 'Kling kling kling!', color: '#FDCB6E', shadowColor: '#E1A100' },
  ],
  tubuh: [
    { id: 't1', emoji: '😆', name: 'Tertawa', soundDesc: 'Ha ha ha ha!', color: '#FDCB6E', shadowColor: '#E1A100' },
    { id: 't2', emoji: '🤧', name: 'Bersin', soundDesc: 'Haaapshu!', color: '#74B9FF', shadowColor: '#0984E3' },
    { id: 't3', emoji: '👏', name: 'Tepuk Tangan', soundDesc: 'Prok prok prok!', color: '#00B894', shadowColor: '#00876C' },
    { id: 't4', emoji: '😷', name: 'Batuk', soundDesc: 'Uhuk uhuk!', color: '#E17055', shadowColor: '#D63031' },
    { id: 't5', emoji: '😭', name: 'Menangis', soundDesc: 'Oeeek oeeek!', color: '#A29BFE', shadowColor: '#6C5CE7' },
    { id: 't6', emoji: '😴', name: 'Mendengkur', soundDesc: 'Krooook kroook!', color: '#636E72', shadowColor: '#2D3436' },
  ],
  rumah: [
    { id: 'r1', emoji: '🔔', name: 'Bel Pintu', soundDesc: 'Diiing dooong!', color: '#FF7675', shadowColor: '#D63031' },
    { id: 'r2', emoji: '⏰', name: 'Jam Dinding', soundDesc: 'Tik tak tik tak!', color: '#00CEC9', shadowColor: '#00B894' },
    { id: 'r3', emoji: '🚰', name: 'Air Mengalir', soundDesc: 'Gojos gojos!', color: '#74B9FF', shadowColor: '#0984E3' },
    { id: 'r4', emoji: '☎️', name: 'Telepon', soundDesc: 'Kring kring kring!', color: '#FDCB6E', shadowColor: '#E1A100' },
    { id: 'r5', emoji: '🌀', name: 'Kipas Angin', soundDesc: 'Wuuush wuuush!', color: '#A29BFE', shadowColor: '#6C5CE7' },
    { id: 'r6', emoji: '🚪', name: 'Pintu Ketuk', soundDesc: 'Tok tok tok!', color: '#E17055', shadowColor: '#D63031' },
  ],
};

function SoundCard({ item, onPress }: { item: SoundItem; onPress?: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.15, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();

    Animated.sequence([
      Animated.timing(bounceAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(bounceAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(bounceAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();

    if (onPress) {
      onPress();
    } else {
      speakText(`${item.name}! ${item.soundDesc}`);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.soundCard,
          { backgroundColor: item.color, borderBottomColor: item.shadowColor },
          {
            transform: [
              { scale: scaleAnim },
              {
                rotate: bounceAnim.interpolate({
                  inputRange: [-10, 10],
                  outputRange: ['-6deg', '6deg'],
                }),
              },
            ],
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
  const [activeTab, setActiveTab] = useState('hewan');
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore');

  // Quiz State
  const [score, setScore] = useState(0);
  const [quizTarget, setQuizTarget] = useState<SoundItem | null>(null);
  const [quizOptions, setQuizOptions] = useState<SoundItem[]>([]);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const soundItems = SOUND_DATA[activeTab] || SOUND_DATA.hewan;

  // Generate Quiz Question
  const generateQuizQuestion = (categoryKey = activeTab) => {
    const items = SOUND_DATA[categoryKey] || SOUND_DATA.hewan;
    if (items.length < 3) return;

    const targetIdx = Math.floor(Math.random() * items.length);
    const target = items[targetIdx];

    const remaining = items.filter((_, idx) => idx !== targetIdx);
    const shuffled = [...remaining].sort(() => 0.5 - Math.random());
    const distractors = shuffled.slice(0, 2);

    const options = [target, ...distractors].sort(() => 0.5 - Math.random());

    setQuizTarget(target);
    setQuizOptions(options);
    setQuizFeedback(null);

    setTimeout(() => {
      speakText(`Manakah suara ${target.name}? ${target.soundDesc}`);
    }, 300);
  };

  useEffect(() => {
    if (mode === 'quiz') {
      generateQuizQuestion(activeTab);
    }
  }, [mode, activeTab]);

  const handleQuizAnswer = (selected: SoundItem) => {
    if (!quizTarget) return;

    if (selected.id === quizTarget.id) {
      setScore((prev) => prev + 1);
      setQuizFeedback('🎉 Hore! Benar sekali!');
      speakText(`Hore! Benar sekali! Itu suara ${quizTarget.name}!`);

      setTimeout(() => {
        generateQuizQuestion(activeTab);
      }, 1800);
    } else {
      setQuizFeedback('😅 Bukan yang itu, coba lagi ya!');
      speakText(`Bukan yang item itu, coba cari suara ${quizTarget.name}!`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>⬅️</Text>
        </Pressable>
        <Text style={styles.title}>🔊 Papan Suara</Text>
      </View>

      {/* Prominent Mode Selection Banner Bar (Very User Friendly) */}
      <View style={styles.modeBarContainer}>
        <Pressable
          style={[styles.modeBannerBtn, mode === 'explore' && styles.modeBannerActiveExplore]}
          onPress={() => {
            setMode('explore');
            speakText('Mode Bebas. Tekan gambar untuk mendengar suaranya!');
          }}
        >
          <Text style={[styles.modeBannerText, mode === 'explore' && styles.modeBannerTextActive]}>
            🔊 Eksplorasi
          </Text>
        </Pressable>

        <Pressable
          style={[styles.modeBannerBtn, mode === 'quiz' && styles.modeBannerActiveQuiz]}
          onPress={() => {
            setMode('quiz');
            setScore(0);
          }}
        >
          <Text style={[styles.modeBannerText, mode === 'quiz' && styles.modeBannerTextActive]}>
            🎯 Kuis Suara ⭐ {score}
          </Text>
        </Pressable>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
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
        </ScrollView>
      </View>

      {/* Content Area */}
      {mode === 'explore' ? (
        <>
          <Text style={styles.subtitle}>Tekan gambar untuk mendengar suaranya! 🔉</Text>
          <ScrollView contentContainerStyle={styles.gridScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {soundItems.map((item) => (
                <SoundCard key={item.id} item={item} />
              ))}
            </View>
          </ScrollView>
        </>
      ) : (
        /* Quiz Mode */
        <View style={styles.quizContainer}>
          {quizTarget && (
            <View style={styles.quizQuestionCard}>
              <Pressable
                style={styles.replaySoundBtn}
                onPress={() => speakText(`Dengar suaranya: ${quizTarget.soundDesc}. Manakah ${quizTarget.name}?`)}
              >
                <Text style={styles.replayIcon}>🔊 Putar Suara Ulang</Text>
                <Text style={styles.quizSoundText}>"{quizTarget.soundDesc}"</Text>
              </Pressable>
              <Text style={styles.quizPrompt}>Tebak gambar manakah suaranya? 🧐</Text>
            </View>
          )}

          {quizFeedback && <Text style={styles.feedbackText}>{quizFeedback}</Text>}

          {/* Quiz 3 Options */}
          <View style={styles.quizOptionsGrid}>
            {quizOptions.map((item) => (
              <SoundCard key={item.id} item={item} onPress={() => handleQuizAnswer(item)} />
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9E6' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6,
  },
  backBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF',
    alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 4, borderBottomColor: '#DFE6E9', elevation: 4, marginRight: 14,
  },
  backIcon: { fontSize: 22 },
  title: { fontSize: 26, fontWeight: '900', color: '#D35400' },

  // Big User Friendly Mode Selector Banner
  modeBarContainer: {
    flexDirection: 'row', gap: 10, marginHorizontal: 20, marginTop: 6, marginBottom: 10,
    backgroundColor: '#F1F2F6', borderRadius: 20, padding: 5, elevation: 2,
  },
  modeBannerBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  modeBannerActiveExplore: {
    backgroundColor: '#FF7675', elevation: 3, borderBottomWidth: 3, borderBottomColor: '#D63031',
  },
  modeBannerActiveQuiz: {
    backgroundColor: '#00B894', elevation: 3, borderBottomWidth: 3, borderBottomColor: '#00876C',
  },
  modeBannerText: { fontSize: 14, fontWeight: '900', color: '#636E72' },
  modeBannerTextActive: { color: '#FFF' },

  tabRow: {
    paddingHorizontal: 20, marginBottom: 8, height: 44,
  },
  tab: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16,
    backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 3, borderBottomColor: '#DFE6E9', elevation: 2,
  },
  tabActive: { backgroundColor: '#FDCB6E', borderBottomColor: '#E1A100' },
  tabText: { fontSize: 13, fontWeight: '900', color: '#636E72' },
  tabTextActive: { color: '#D35400' },

  subtitle: {
    fontSize: 14, fontWeight: '700', color: '#636E72',
    textAlign: 'center', marginBottom: 10,
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
  quizContainer: {
    flex: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', paddingBottom: 30,
  },
  quizQuestionCard: {
    backgroundColor: '#FFF', borderRadius: 28, padding: 18, width: '100%',
    alignItems: 'center', elevation: 6, marginBottom: 16,
    borderWidth: 3, borderColor: '#FDCB6E', borderStyle: 'dashed',
  },
  replaySoundBtn: {
    backgroundColor: '#FF7675', borderRadius: 20, paddingVertical: 12, paddingHorizontal: 24,
    alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#D63031', elevation: 4,
  },
  replayIcon: { fontSize: 16, fontWeight: '900', color: '#FFF' },
  quizSoundText: { fontSize: 24, fontWeight: '900', color: '#FFF', marginTop: 4 },
  quizPrompt: { fontSize: 16, fontWeight: '800', color: '#2D3436', marginTop: 14 },
  feedbackText: {
    fontSize: 18, fontWeight: '900', color: '#D35400', marginBottom: 16, textAlign: 'center',
  },
  quizOptionsGrid: {
    flexDirection: 'row', gap: 14, justifyContent: 'center', flexWrap: 'wrap',
  },
});
