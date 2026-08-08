import { View, Text, StyleSheet, Pressable, Animated, ScrollView } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef } from 'react';

const CATEGORIES = [
  { id: 'warna', title: 'Balon Warna', desc: 'Pecahkan balon sesuai warna!', emoji: '🎨', color: '#FF5252', shadowColor: '#D32F2F' },
  { id: 'angka', title: 'Balon Angka', desc: 'Pecahkan balon sesuai angka!', emoji: '🔢', color: '#00B894', shadowColor: '#00876C' },
  { id: 'huruf', title: 'Balon Huruf', desc: 'Pecahkan balon sesuai huruf!', emoji: '🔤', color: '#FDCB6E', shadowColor: '#E1A100' },
];

function CategoryCard({ cat }: { cat: typeof CATEGORIES[0] }) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
      onPress={() => router.push(`/(child)/balloon/${cat.id}` as Href)}
    >
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: cat.color, borderBottomColor: cat.shadowColor },
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.emojiCircle}>
          <Text style={styles.emoji}>{cat.emoji}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{cat.title}</Text>
          <Text style={styles.cardDesc}>{cat.desc}</Text>
        </View>
        <Text style={styles.playIcon}>▶️</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function BalloonCategorySelect() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>⬅️</Text>
        </Pressable>
        <Text style={styles.title}>🎈 Pecah Balon!</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Pilih jenis balon yang mau kamu pecahkan! 💥</Text>
        <View style={styles.list}>
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F8FF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  backButton: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
    borderBottomWidth: 4, borderBottomColor: '#DFE6E9', elevation: 4,
  },
  backIcon: { fontSize: 22 },
  title: { fontSize: 28, fontWeight: '900', color: '#D63031' },
  subtitle: { fontSize: 16, fontWeight: '700', color: '#636E72', textAlign: 'center', marginBottom: 20 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  list: { gap: 16 },
  card: {
    borderRadius: 26, paddingVertical: 20, paddingHorizontal: 18,
    flexDirection: 'row', alignItems: 'center', borderBottomWidth: 6, elevation: 6,
  },
  emojiCircle: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  emoji: { fontSize: 28 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  cardDesc: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  playIcon: { fontSize: 20, marginLeft: 10 },
});
