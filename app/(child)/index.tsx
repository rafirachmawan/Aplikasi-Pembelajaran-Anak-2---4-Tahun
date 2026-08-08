import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
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
    badge: '⭐ 3 Level',
    route: '/(child)/colors' as const,
  },
  {
    id: 'numbers',
    title: '🔢',
    label: 'Angka',
    subLabel: 'Hitung 1 sampai 10',
    color: '#00B894',
    shadowColor: '#00876C',
    badge: '⭐ 3 Level',
    route: '/(child)/numbers' as const,
  },
  {
    id: 'letters',
    title: '🔤',
    label: 'Huruf',
    subLabel: 'Abjad A sampai Z',
    color: '#FDCB6E',
    shadowColor: '#E1A100',
    badge: '⭐ 3 Level',
    route: '/(child)/letters' as const,
  },
  {
    id: 'shapes',
    title: '🔷',
    label: 'Bentuk',
    subLabel: 'Lingkaran, Persegi & Bintang',
    color: '#6C5CE7',
    shadowColor: '#4834D4',
    badge: '⭐ 3 Level',
    route: '/(child)/shapes' as const,
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
        <View style={styles.greetingChip}>
          <Text style={styles.greetingChipText}>🌟 Halo Cerdas!</Text>
        </View>

        <Pressable
          style={styles.parentChip}
          onPress={() => router.push('/(parent)/gate')}
        >
          <Text style={styles.parentChipText}>👨‍👩‍👧 Orang Tua 🔒</Text>
        </Pressable>
      </View>

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

      {/* Bottom Footer Encouragement */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>🎈 Belajar Sambil Bermain Every Day!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF5',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
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
    flex: 1,
    justifyContent: 'center',
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
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B2BEC3',
  },
});
