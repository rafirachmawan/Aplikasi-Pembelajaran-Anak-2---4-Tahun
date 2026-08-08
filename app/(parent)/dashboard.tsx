import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getProgress, type AppProgress } from '@/lib/storage';

const MODULE_META = [
  { id: 'colors' as const, emoji: '🎨', label: 'Warna', color: '#FF5252', shadowColor: '#D32F2F', levelsTotal: 5 },
  { id: 'numbers' as const, emoji: '🔢', label: 'Angka', color: '#00B894', shadowColor: '#00876C', levelsTotal: 5 },
  { id: 'letters' as const, emoji: '🔤', label: 'Huruf', color: '#FDCB6E', shadowColor: '#E1A100', levelsTotal: 5 },
  { id: 'shapes' as const, emoji: '🔷', label: 'Bentuk', color: '#6C5CE7', shadowColor: '#4834D4', levelsTotal: 5 },
];

export default function ParentDashboard() {
  const router = useRouter();
  const [progress, setProgress] = useState<AppProgress | null>(null);

  // Reload progress every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      getProgress().then(setProgress);
    }, [])
  );

  const getModuleCompleted = (moduleId: keyof AppProgress) => {
    if (!progress) return 0;
    return Object.values(progress[moduleId]).filter((l) => l.completed).length;
  };

  const getTotalCompleted = () => {
    if (!progress) return 0;
    return MODULE_META.reduce((sum, mod) => sum + getModuleCompleted(mod.id), 0);
  };

  const getTotalStars = () => {
    if (!progress) return 0;
    let stars = 0;
    for (const mod of MODULE_META) {
      const moduleProgress = progress[mod.id];
      for (const level of Object.values(moduleProgress)) {
        stars += level.score;
      }
    }
    return stars;
  };

  const totalLevels = MODULE_META.reduce((sum, mod) => sum + mod.levelsTotal, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar with Back Button */}
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/(child)')} style={styles.backButton}>
          <Text style={styles.backIcon}>⬅️</Text>
        </Pressable>

        <View style={styles.headerTitleGroup}>
          <Text style={styles.title}>📊 Dashboard Orang Tua</Text>
          <Text style={styles.subtitle}>Pantau aktivitas & progres belajar anak</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Stats Overview Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <View style={styles.summaryIconBadge}>
              <Text style={styles.summaryEmoji}>🏆</Text>
            </View>
            <Text style={styles.summaryValue}>{getTotalCompleted()} / {totalLevels}</Text>
            <Text style={styles.summaryLabel}>Total Level Selesai</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIconBadge}>
              <Text style={styles.summaryEmoji}>⭐</Text>
            </View>
            <Text style={styles.summaryValue}>{getTotalStars()} Bintang</Text>
            <Text style={styles.summaryLabel}>Total Pengumpulan</Text>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Modul Pembelajaran</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>{MODULE_META.length} Modul</Text>
          </View>
        </View>

        {/* Module Progress List */}
        <View style={styles.moduleList}>
          {MODULE_META.map((mod) => {
            const completed = getModuleCompleted(mod.id);
            const percent = Math.round((completed / mod.levelsTotal) * 100);

            return (
              <Pressable
                key={mod.id}
                style={styles.moduleCard}
                onPress={() => router.push(`/(parent)/detail/${mod.id}`)}
              >
                <View style={[styles.moduleIcon, { backgroundColor: mod.color, borderBottomColor: mod.shadowColor }]}>
                  <Text style={styles.moduleEmoji}>{mod.emoji}</Text>
                </View>

                <View style={styles.moduleInfo}>
                  <View style={styles.moduleRow}>
                    <Text style={styles.moduleLabel}>{mod.label}</Text>
                    <Text style={styles.modulePercent}>{percent}%</Text>
                  </View>

                  <Text style={styles.moduleProgress}>
                    {completed} dari {mod.levelsTotal} level selesai
                  </Text>

                  <View style={styles.progressBar}>
                    <View style={[
                      styles.progressFill,
                      { backgroundColor: mod.color, width: `${percent}%` },
                    ]} />
                  </View>
                </View>

                <View style={styles.arrowCircle}>
                  <Text style={styles.arrowIcon}>▶</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Switch Mode Button */}
      <View style={styles.footer}>
        <Pressable style={styles.modeButton} onPress={() => router.replace('/(child)')}>
          <Text style={styles.modeButtonText}>👶 Kembali ke Mode Anak</Text>
        </Pressable>
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
  headerTitleGroup: { flex: 1 },
  title: { fontSize: 22, fontWeight: '900', color: '#2D3436' },
  subtitle: { fontSize: 13, fontWeight: '600', color: '#B2BEC3', marginTop: 2 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 8,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(108,92,231,0.12)',
  },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1F2F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryEmoji: { fontSize: 20 },
  summaryValue: { fontSize: 18, fontWeight: '900', color: '#6C5CE7', marginBottom: 2 },
  summaryLabel: { fontSize: 12, fontWeight: '700', color: '#B2BEC3', textAlign: 'center' },
  summaryDivider: { width: 1, height: 44, backgroundColor: '#DFE6E9' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#2D3436' },
  statusPill: {
    backgroundColor: '#E8E8FC',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  statusPillText: { fontSize: 12, fontWeight: '800', color: '#6C5CE7' },
  moduleList: { gap: 14 },
  moduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  moduleIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderBottomWidth: 4,
  },
  moduleEmoji: { fontSize: 26 },
  moduleInfo: { flex: 1 },
  moduleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  moduleLabel: { fontSize: 17, fontWeight: '900', color: '#2D3436' },
  modulePercent: { fontSize: 13, fontWeight: '800', color: '#6C5CE7' },
  moduleProgress: { fontSize: 12, fontWeight: '600', color: '#B2BEC3', marginTop: 2, marginBottom: 8 },
  progressBar: {
    height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4 },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F2F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  arrowIcon: { fontSize: 11, fontWeight: '900', color: '#6C5CE7' },
  footer: { paddingHorizontal: 20, paddingBottom: 16 },
  modeButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: '#4834D4',
    elevation: 4,
  },
  modeButtonText: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' },
});
