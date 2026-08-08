import { View, Text, StyleSheet, Pressable, Animated, ScrollView } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef } from 'react';

const CHARS = [
  { id: 'A', color: '#FF5252', shadowColor: '#D32F2F' },
  { id: 'B', color: '#74B9FF', shadowColor: '#0984E3' },
  { id: 'C', color: '#FDCB6E', shadowColor: '#E1A100' },
  { id: 'D', color: '#00B894', shadowColor: '#00876C' },
  { id: 'E', color: '#A29BFE', shadowColor: '#6C5CE7' },
  { id: '1', color: '#FD79A8', shadowColor: '#E84393' },
  { id: '2', color: '#E17055', shadowColor: '#D63031' },
  { id: '3', color: '#00CEC9', shadowColor: '#00B894' },
  { id: '⭐', color: '#F1C40F', shadowColor: '#D4AC0D' },
  { id: '♥', color: '#FF7675', shadowColor: '#D63031' },
  { id: '●', color: '#0984E3', shadowColor: '#005691' },
  { id: '▲', color: '#00B894', shadowColor: '#00876C' },
];

function CharCard({ char }: { char: typeof CHARS[0] }) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
      onPress={() => router.push(`/(child)/tracing/${encodeURIComponent(char.id)}` as Href)}
    >
      <Animated.View
        style={[
          styles.charCard,
          { backgroundColor: char.color, borderBottomColor: char.shadowColor },
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.charText}>{char.id}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function TracingSelect() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>⬅️</Text>
        </Pressable>
        <Text style={styles.title}>✏️ Belajar Menulis</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Pilih huruf, angka, atau bentuk untuk ditulis! ✍️</Text>

        <Text style={styles.sectionTitle}>🔤 Huruf</Text>
        <View style={styles.grid}>
          {CHARS.filter((c) => /[A-E]/.test(c.id)).map((char) => (
            <CharCard key={char.id} char={char} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>🔢 Angka</Text>
        <View style={styles.grid}>
          {CHARS.filter((c) => /[1-3]/.test(c.id)).map((char) => (
            <CharCard key={char.id} char={char} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>🔷 Bentuk</Text>
        <View style={styles.grid}>
          {CHARS.filter((c) => ['⭐', '♥', '●', '▲'].includes(c.id)).map((char) => (
            <CharCard key={char.id} char={char} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF3E0' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  backButton: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
    borderBottomWidth: 4, borderBottomColor: '#DFE6E9', elevation: 4,
  },
  backIcon: { fontSize: 22 },
  title: { fontSize: 28, fontWeight: '900', color: '#D35400' },
  subtitle: { fontSize: 16, fontWeight: '700', color: '#636E72', textAlign: 'center', marginBottom: 20 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#2D3436', marginTop: 16, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'flex-start' },
  charCard: {
    width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 5, elevation: 5,
  },
  charText: { fontSize: 32, fontWeight: '900', color: '#FFF' },
});
