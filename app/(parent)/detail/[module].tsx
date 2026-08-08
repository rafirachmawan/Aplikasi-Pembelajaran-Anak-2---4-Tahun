import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getProgress, type AppProgress, type LevelProgress } from '@/lib/storage';

const MODULE_META: Record<string, { emoji: string; label: string; color: string }> = {
  colors: { emoji: '🎨', label: 'Warna', color: '#FF5252' },
  numbers: { emoji: '🔢', label: 'Angka', color: '#00B894' },
  letters: { emoji: '🔤', label: 'Huruf', color: '#FDCB6E' },
  shapes: { emoji: '🔷', label: 'Bentuk', color: '#6C5CE7' },
};

const LEVEL_IDS = ['1', '2', '3', '4', '5'];

export default function ModuleDetail() {
  const { module } = useLocalSearchParams<{ module: string }>();
  const router = useRouter();
  const meta = MODULE_META[module] || MODULE_META.colors;
  const [moduleProgress, setModuleProgress] = useState<Record<string, LevelProgress>>({});

  useFocusEffect(
    useCallback(() => {
      getProgress().then((progress) => {
        const modKey = module as keyof AppProgress;
        setModuleProgress(progress[modKey] || {});
      });
    }, [module])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>⬅️</Text>
        </Pressable>
        <Text style={styles.title}>{meta.emoji} Detail {meta.label}</Text>
      </View>

      <View style={styles.levelList}>
        {LEVEL_IDS.map((levelId) => {
          const levelProgress = moduleProgress[levelId];
          const attempted = !!levelProgress?.completed;
          const score = levelProgress?.score ?? null;
          const totalQ = levelProgress?.totalQuestions ?? null;

          return (
            <View key={levelId} style={styles.levelCard}>
              <View style={[styles.levelDot, { backgroundColor: attempted ? meta.color : '#DFE6E9' }]} />
              <View style={styles.levelInfo}>
                <Text style={styles.levelTitle}>Level {levelId}</Text>
                <Text style={styles.levelScore}>
                  {attempted ? `Skor: ${score}/${totalQ} benar` : 'Belum dicoba'}
                </Text>
              </View>
              <View style={[styles.statusBadge, attempted && { backgroundColor: '#E8FCF1' }]}>
                <Text style={[styles.statusBadgeText, attempted && { color: '#00B894' }]}>
                  {attempted ? '⭐ Selesai' : 'Belum'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
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
    borderBottomColor: '#DFE6E9',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  backIcon: { fontSize: 22 },
  title: { fontSize: 22, fontWeight: '900', color: '#2D3436' },
  levelList: { flex: 1, paddingHorizontal: 20, paddingTop: 16, gap: 14 },
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  levelDot: { width: 12, height: 12, borderRadius: 6, marginRight: 16 },
  levelInfo: { flex: 1 },
  levelTitle: { fontSize: 17, fontWeight: '800', color: '#2D3436', marginBottom: 2 },
  levelScore: { fontSize: 13, fontWeight: '600', color: '#B2BEC3' },
  statusBadge: {
    backgroundColor: '#F1F2F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  statusBadgeText: { fontSize: 12, fontWeight: '700', color: '#636E72' },
});
