import { View, Text, StyleSheet, Pressable, Animated, ScrollView } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef } from 'react';

const MODULES = [
  {
    id: 'colors',
    title: '🎨',
    label: 'Warna',
    subLabel: 'Merah, Biru, Kuning',
    color: '#FF5252',
    shadowColor: '#D32F2F',
    badge: '⭐ 5 Level',
    route: '/(child)/colors' as const,
  },
  {
    id: 'numbers',
    title: '🔢',
    label: 'Angka',
    subLabel: 'Hitung 1 sampai 10',
    color: '#00B894',
    shadowColor: '#00876C',
    badge: '⭐ 5 Level',
    route: '/(child)/numbers' as const,
  },
  {
    id: 'letters',
    title: '🔤',
    label: 'Huruf',
    subLabel: 'Abjad A sampai Z',
    color: '#FDCB6E',
    shadowColor: '#E1A100',
    badge: '⭐ 5 Level',
    route: '/(child)/letters' as const,
  },
  {
    id: 'shapes',
    title: '🔷',
    label: 'Bentuk',
    subLabel: 'Lingkaran, Persegi & Bintang',
    color: '#6C5CE7',
    shadowColor: '#4834D4',
    badge: '⭐ 5 Level',
    route: '/(child)/shapes' as const,
  },
  {
    id: 'animals',
    title: '🐾',
    label: 'Hewan',
    subLabel: 'Kucing, Gajah & Suara Hewan',
    color: '#FD79A8',
    shadowColor: '#E84393',
    badge: '⭐ 5 Level',
    route: '/(child)/animals' as const,
  },
  {
    id: 'fruits',
    title: '🍎',
    label: 'Buah & Sayur',
    subLabel: 'Apel, Wortel & Sayuran',
    color: '#FF7675',
    shadowColor: '#D63031',
    badge: '⭐ 5 Level',
    route: '/(child)/fruits' as const,
  },
  {
    id: 'bodyparts',
    title: '🦶',
    label: 'Bagian Tubuh',
    subLabel: 'Mata, Hidung & Panca Indera',
    color: '#00CEC9',
    shadowColor: '#00B894',
    badge: '⭐ 5 Level',
    route: '/(child)/bodyparts' as const,
  },
  {
    id: 'vehicles',
    title: '🚗',
    label: 'Kendaraan',
    subLabel: 'Mobil, Pesawat & Kereta',
    color: '#0984E3',
    shadowColor: '#005691',
    badge: '⭐ 5 Level',
    route: '/(child)/vehicles' as const,
  },
  {
    id: 'jobs',
    title: '👨‍⚕️',
    label: 'Profesi',
    subLabel: 'Guru, Dokter & Astronot',
    color: '#E17055',
    shadowColor: '#D63031',
    badge: '⭐ 5 Level',
    route: '/(child)/jobs' as const,
  },
];

const GAMES = [
  {
    id: 'balloon',
    emoji: '🎈',
    label: 'Pecah Balon',
    desc: 'Melatih respon & warna',
    color: '#FF7675',
    shadowColor: '#D63031',
    route: '/(child)/balloon' as const,
  },
  {
    id: 'sorting',
    emoji: '🧺',
    label: 'Seret & Sortir',
    desc: 'Pilah benda ke wadah',
    color: '#00CEC9',
    shadowColor: '#00B894',
    route: '/(child)/sorting' as const,
  },
  {
    id: 'tracing',
    emoji: '✏️',
    label: 'Belajar Menulis',
    desc: 'Tulis huruf & angka',
    color: '#FDCB6E',
    shadowColor: '#E1A100',
    route: '/(child)/tracing' as const,
  },
  {
    id: 'soundboard',
    emoji: '🔊',
    label: 'Papan Suara',
    desc: 'Suara hewan & benda',
    color: '#6C5CE7',
    shadowColor: '#4834D4',
    route: '/(child)/soundboard' as const,
  },
];

function ModuleCard({ 
  module, 
}: { 
  module: typeof MODULES[0]; 
}) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }),
      Animated.spring(translateYAnim, { toValue: 4, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      Animated.spring(translateYAnim, { toValue: 0, useNativeDriver: true }),
    ]).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => router.push(module.route as Href)}
    >
      <Animated.View 
        style={[
          styles.card, 
          { backgroundColor: module.color, borderBottomColor: module.shadowColor }, 
          { transform: [{ scale: scaleAnim }, { translateY: translateYAnim }] }
        ]}
      >
        {/* Left Emoji Badge Bubble */}
        <View style={styles.emojiCircle}>
          <Text style={styles.cardEmoji}>{module.title}</Text>
        </View>

        {/* Middle Content */}
        <View style={styles.cardContent}>
          <Text style={styles.cardLabel}>{module.label}</Text>
          <Text style={styles.cardSubLabel}>{module.subLabel}</Text>
        </View>

        {/* Right Badge */}
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>{module.badge}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function ChildHome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative Background Elements */}
      <View style={[styles.bgCircle, styles.bgCircleTopLeft]} />
      <View style={[styles.bgCircle, styles.bgCircleBottomRight]} />

      {/* Top Bar Header */}
      <View style={styles.topBar}>
        <Pressable
          style={styles.greetingChip}
          onPress={() => router.push('/')}
        >
          <Text style={styles.greetingChipText}>🏠 Pilih Mode</Text>
        </Pressable>

        <Pressable
          style={styles.greetingChip}
          onPress={() => router.push('/onboarding')}
        >
          <Text style={styles.greetingChipText}>📖 Panduan</Text>
        </Pressable>

        <Pressable
          style={styles.parentChip}
          onPress={() => router.push('/(parent)/gate')}
        >
          <Text style={styles.parentChipText}>👨‍👩‍👧 Orang Tua 🔒</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Banner Section */}
        <View style={styles.bannerContainer}>
          <Text style={styles.mainTitle}>Mau Belajar Apa?</Text>
          <Text style={styles.mainSubtitle}>Pilih salah satu tombol seru di bawah ya! 👇</Text>
        </View>

        {/* Module Cards */}
        <View style={styles.cardsContainer}>
          {MODULES.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </View>

        {/* Mini Games Section */}
        <View style={styles.gamesSection}>
          <View style={styles.gamesSectionHeader}>
            <Text style={styles.gamesSectionTitle}>🎮 Mini Games</Text>
            <View style={styles.gamesBadge}>
              <Text style={styles.gamesBadgeText}>SERU!</Text>
            </View>
          </View>

          <View style={styles.gamesGrid}>
            {GAMES.map((game) => (
              <Pressable
                key={game.id}
                onPress={() => router.push(game.route as Href)}
                style={[styles.gameCard, { backgroundColor: game.color, borderBottomColor: game.shadowColor }]}
              >
                <Text style={styles.gameEmoji}>{game.emoji}</Text>
                <Text style={styles.gameLabel}>{game.label}</Text>
                <Text style={styles.gameDesc}>{game.desc}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Bottom Footer Encouragement */}
        <View style={styles.footer}>
          <Pressable
            onPress={() => router.push('/onboarding')}
            style={styles.onboardingFooterBtn}
          >
            <Text style={styles.onboardingFooterText}>📖 Buka Panduan & Petunjuk Aplikasi</Text>
          </Pressable>
          <Text style={styles.footerText}>🎈 Belajar Sambil Bermain Every Day!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF5',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.12,
  },
  bgCircleTopLeft: {
    width: 200,
    height: 200,
    backgroundColor: '#FF5252',
    top: -50,
    left: -50,
  },
  bgCircleBottomRight: {
    width: 250,
    height: 250,
    backgroundColor: '#00B894',
    bottom: -80,
    right: -60,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  greetingChip: {
    backgroundColor: '#FFEAA7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  greetingChipText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D63031',
  },
  parentChip: {
    backgroundColor: 'rgba(45, 52, 54, 0.07)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  parentChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#636E72',
  },
  bannerContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2D3436',
    letterSpacing: -0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  mainSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#B2BEC3',
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 16,
    paddingVertical: 12,
  },
  card: {
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 6,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  emojiCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardEmoji: {
    fontSize: 34,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardSubLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
    gap: 10,
  },
  onboardingFooterBtn: {
    backgroundColor: '#FFEAA7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 2,
  },
  onboardingFooterText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D63031',
  },
  footerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B2BEC3',
  },
  gamesSection: {
    marginTop: 28,
  },
  gamesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  gamesSectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2D3436',
  },
  gamesBadge: {
    backgroundColor: '#FFEAA7',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  gamesBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#D63031',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gameCard: {
    width: '48%',
    borderRadius: 24,
    padding: 16,
    borderBottomWidth: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  gameEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  gameLabel: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  gameDesc: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
});
