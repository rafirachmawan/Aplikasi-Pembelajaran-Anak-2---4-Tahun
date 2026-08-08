import { View, Text, StyleSheet, Pressable, Animated, ScrollView } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef } from 'react';

const LEVELS = [
  { id: 1, title: 'Level 1', description: 'Kendaraan Darat', badge: '🚗 🚌 🏍️ 🚲 🚛', color: '#0984E3', shadowColor: '#005691' },
  { id: 2, title: 'Level 2', description: 'Udara & Air', badge: '✈️ 🚁 🚢 🛶 🚀', color: '#00CEC9', shadowColor: '#00B894' },
  { id: 3, title: 'Level 3', description: 'Rel & Jalur Khusus', badge: '🚂 🚑 🚒 🚓 🚕', color: '#E17055', shadowColor: '#D63031' },
  { id: 4, title: 'Level 4', description: 'Tempat Berjalan', badge: '✈️ 🚢 🚂 🚀 🚲', color: '#6C5CE7', shadowColor: '#4834D4' },
  { id: 5, title: 'Level 5', description: 'Master Kendaraan', badge: '🚢 🚀 🚑 🛶 ✈️', color: '#FDCB6E', shadowColor: '#E1A100' },
];

function LevelCardItem({ level }: { level: typeof LEVELS[0] }) {
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
      onPress={() => router.push(`/(child)/vehicles/${level.id}` as Href)}
    >
      <Animated.View
        style={[
          styles.levelCard,
          { backgroundColor: level.color, borderBottomColor: level.shadowColor },
          { transform: [{ scale: scaleAnim }, { translateY: translateYAnim }] },
        ]}
      >
        <View style={styles.badgeCircle}>
          <Text style={styles.badgeEmoji}>{level.id}</Text>
        </View>

        <View style={styles.levelInfo}>
          <Text style={styles.levelTitle}>{level.title}</Text>
          <Text style={styles.levelDescription}>{level.description}</Text>
          <Text style={styles.levelItemsBadge}>{level.badge}</Text>
        </View>

        <View style={styles.playButtonCircle}>
          <Text style={styles.playIcon}>▶️</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function VehiclesLevelSelect() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>⬅️</Text>
        </Pressable>
        <Text style={styles.title}>🚗 Kendaraan</Text>
      </View>

      {/* Level List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.levelList}>
          {LEVELS.map((level) => (
            <LevelCardItem key={level.id} level={level} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF5FB',
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
    borderBottomColor: '#AED6F1',
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
    color: '#0984E3',
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
  badgeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.95)',
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
