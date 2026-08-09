import { View, Text, StyleSheet, Pressable, Animated, ActivityIndicator, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'has_seen_onboarding_v3';

function RoleCard({
  title,
  subtitle,
  badgeText,
  emoji,
  color,
  shadowColor,
  tagText,
  onPress,
}: {
  title: string;
  subtitle: string;
  badgeText: string;
  emoji: string;
  color: string;
  shadowColor: string;
  tagText?: string;
  onPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }),
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
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.roleCard,
          { backgroundColor: color, borderBottomColor: shadowColor },
          { transform: [{ scale: scaleAnim }, { translateY: translateYAnim }] },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.emojiCircle}>
            <Text style={styles.emojiText}>{emoji}</Text>
          </View>
          {tagText && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{tagText}</Text>
            </View>
          )}
        </View>

        <Text style={styles.roleTitle}>{title}</Text>
        <Text style={styles.roleSubtitle}>{subtitle}</Text>

        <View style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>{badgeText}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function checkOnboardingStatus() {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (!hasSeenOnboarding) {
          router.replace('/onboarding');
          return;
        }
        if (isMounted) {
          setIsCheckingOnboarding(false);
        }
      } catch {
        if (isMounted) {
          setIsCheckingOnboarding(false);
        }
      }
    }
    checkOnboardingStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isCheckingOnboarding) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative Ambient Circles */}
      <View style={[styles.bgCircle, styles.bgCircle1]} />
      <View style={[styles.bgCircle, styles.bgCircle2]} />

      {/* Main Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.push('/onboarding')}
          style={styles.appBadge}
        >
          <Text style={styles.appBadgeText}>🎈 Dunia Si Kecil 2-4 Tahun • Panduan 📖</Text>
        </Pressable>
        <Text style={styles.welcomeTitle}>Selamat Datang! 👋</Text>
        <Text style={styles.welcomeSubtitle}>Siapa yang sedang membuka aplikasi?</Text>
      </View>

      {/* Options */}
      <View style={styles.roleContainer}>
        <RoleCard
          title="Mode Anak 👶"
          subtitle="Belajar Warna, Angka & Huruf sambil bermain seru!"
          badgeText="Masuk Main ▶"
          emoji="🚀"
          color="#FF5252"
          shadowColor="#D63031"
          tagText="Paling Seru!"
          onPress={() => router.push('/(child)')}
        />

        <RoleCard
          title="Mode Orang Tua 👨‍👩‍👧"
          subtitle="Pantau perkembangan belajar & laporan progres anak"
          badgeText="Masuk Dashboard 🛡️"
          emoji="📊"
          color="#6C5CE7"
          shadowColor="#4834D4"
          tagText="🔒 Dilindungi Soal"
          onPress={() => router.push('/(parent)/gate')}
        />
      </View>

      {/* Footer hint & Startup Website Link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>💡 Anda bisa berpindah mode kapan saja di dalam aplikasi</Text>
        <Pressable
          onPress={() => Linking.openURL('https://www.gapaidigital.my.id/')}
          style={styles.startupLinkBtn}
        >
          <Text style={styles.startupLinkText}>🌐 Gapai Digital • www.gapaidigital.my.id</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDF5',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFDF5',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.25,
  },
  bgCircle1: {
    width: 220,
    height: 220,
    backgroundColor: '#FFD93D',
    top: -50,
    right: -50,
  },
  bgCircle2: {
    width: 180,
    height: 180,
    backgroundColor: '#74B9FF',
    bottom: 20,
    left: -40,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  appBadge: {
    backgroundColor: '#FFEAA7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  appBadgeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#D63031',
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#636E72',
    textAlign: 'center',
  },
  roleContainer: {
    gap: 20,
    marginVertical: 20,
  },
  roleCard: {
    borderRadius: 28,
    padding: 22,
    borderBottomWidth: 6,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  emojiCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 26,
  },
  tagBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  actionBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    elevation: 2,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2D3436',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B2BEC3',
    textAlign: 'center',
  },
  startupLinkBtn: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
  },
  startupLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

