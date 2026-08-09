import { View, Text, StyleSheet, Pressable, Animated, ScrollView } from 'react-native';
import { useRouter, useFocusEffect, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useState, useCallback } from 'react';
import { getProgress, type AppProgress } from '@/lib/storage';
import { speakText } from '@/lib/audio';

const LEVELS = [
  { id: 1, title: 'Level 1', description: 'Profesi di Sekitar Kita', badge: '👩‍🏫 👨‍⚕️ 👮 👨‍🍳 👨‍🚒', color: '#E17055', shadowColor: '#D63031' },
  { id: 2, title: 'Level 2', description: 'Profesi Keren Lainnya', badge: '👨‍✈️ 👨‍🚀 📮 👷 🏥', color: '#FDCB6E', shadowColor: '#E1A100' },
  { id: 3, title: 'Level 3', description: 'Profesi Seni & Olahraga', badge: '🎨 🎵 ⚽ 💃 🎂', color: '#FD79A8', shadowColor: '#E84393' },
  { id: 4, title: 'Level 4', description: 'Alat Kerja Profesi', badge: '👨‍⚕️ 👩‍🏫 👨‍🚒 👨‍🍳 👮', color: '#0984E3', shadowColor: '#005691' },
  { id: 5, title: 'Level 5', description: 'Kalau Besar Mau Jadi Apa?', badge: '👨‍⚕️ 👨‍✈️ 👨‍🍳 👩‍🏫 👨‍🚀', color: '#00B894', shadowColor: '#00876C' },
];

function LevelCardItem({
  level,
  isUnlocked,
  stars,
}: {
  level: typeof LEVELS[0];
  isUnlocked: boolean;
  stars: number;
}) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (!isUnlocked) return;
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }),
      Animated.spring(translateYAnim, { toValue: 4, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () => {
    if (!isUnlocked) return;
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      Animated.spring(translateYAnim, { toValue: 0, useNativeDriver: true }),
    ]).start();
  };

  const handlePress = () => {
    if (!isUnlocked) {
      speakText(`Selesaikan level ${level.id - 1} terlebih dahulu ya!`);
      return;
    }
    router.push(`/(child)/jobs/${level.id}` as Href);
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View
        style={[
          styles.levelCard,
          isUnlocked
            ? { backgroundColor: level.color, borderBottomColor: level.shadowColor }
            : styles.lockedCard,
          { transform: [{ scale: scaleAnim }, { translateY: translateYAnim }] },
        ]}
      >
        <View style={isUnlocked ? styles.badgeCircle : styles.lockedBadgeCircle}>
          <Text style={styles.badgeEmoji}>{isUnlocked ? level.id : '🔒'}</Text>
        </View>

        <View style={styles.levelInfo}>
          <Text style={styles.levelTitle}>{level.title}</Text>
          <Text style={styles.levelDescription}>
            {isUnlocked ? level.description : `🔒 Selesaikan Level ${level.id - 1} terlebih dahulu`}
          </Text>
          <Text style={styles.levelItemsBadge}>
            {isUnlocked ? level.badge : '🔒 Terkunci'}
          </Text>
        </View>

        <View style={styles.playButtonCircle}>
          <Text style={styles.playIcon}>
            {isUnlocked ? (stars > 0 ? '⭐' : '▶️') : '🔒'}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function JobsLevelSelect() {
  const router = useRouter();
  const [progress, setProgress] = useState<AppProgress | null>(null);

  useFocusEffect(
    useCallback(() => {
      getProgress().then(setProgress);
    }, [])
  );

  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    if (!progress) return false;
    return progress.jobs[String(levelId - 1)]?.completed === true;
  };

  const getLevelStars = (levelId: number) => {
    if (!progress) return 0;
    return progress.jobs[String(levelId)]?.score || 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>⬅️</Text>
        </Pressable>
        <Text style={styles.title}>👨‍⚕️ Profesi</Text>
      </View>

      {/* Level List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.levelList}>
          {LEVELS.map((level) => (
            <LevelCardItem
              key={level.id}
              level={level}
              isUnlocked={isLevelUnlocked(level.id)}
              stars={getLevelStars(level.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF2E9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderBottomWidth: 4,
    borderBottomColor: '#F5CBA7',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  backIcon: {
    fontSize: 22,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#D35400',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  levelList: {
    gap: 16,
  },
  levelCard: {
    borderRadius: 26,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 6,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  lockedCard: {
    backgroundColor: '#A0AEC0',
    borderBottomColor: '#718096',
    opacity: 0.85,
  },
  badgeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  lockedBadgeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  badgeEmoji: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2D3436',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  levelDescription: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  levelItemsBadge: {
    fontSize: 14,
    marginTop: 4,
  },
  playButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  playIcon: {
    fontSize: 18,
  },
});
