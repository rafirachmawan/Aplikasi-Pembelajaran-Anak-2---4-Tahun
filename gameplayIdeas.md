# 🎮 Panduan Implementasi Gameplay Interaktif (Anak 2-4 Tahun)

Dokumen ini berisi panduan konsep, struktur data, dan template kode dasar untuk 4 gameplay interaktif baru yang sangat ramah anak usia dini.

---

## 📅 Rencana Struktur Rute (Expo Router)
Untuk menambah game ini nantinya, Anda bisa menyusun foldernya seperti berikut:
```text
app/
├── (child)/
│   ├── balloon/           # 1. Game Pecahkan Balon
│   │   ├── index.tsx      # Halaman pilih kategori balon
│   │   └── [category].tsx # Arena bermain balon
│   ├── sorting/           # 2. Game Seret & Letakkan (Drag & Drop)
│   │   ├── index.tsx
│   │   └── [level].tsx
│   ├── tracing/           # 3. Game Menulis & Menggambar (Tracing)
│   │   ├── index.tsx
│   │   └── [char].tsx
│   └── soundboard/        # 4. Papan Suara Interaktif (Exploration)
│       └── index.tsx
```

---

## 1. 🎈 Game Pecahkan Balon (Balloon Pop)

### 💡 Konsep
Balon berwarna-warni melayang dari bawah ke atas layar. Anak mendengarkan instruksi suara (misal: *"Pecahkan balon merah!"*) dan harus mengetuk balon yang benar sebelum melayang keluar dari layar.

### 🛠️ Pendekatan Teknis
Menggunakan API `Animated` bawaan React Native untuk menggerakkan koordinat `translateY` balon ke atas. Deteksi tabrakan/klik sederhana menggunakan komponen `<Pressable>` yang dibungkus `<Animated.View>`.

### 📄 Template Kode Dasar (`app/(child)/balloon/[category].tsx`)
```tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { speakText } from '@/lib/audio';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const BALON_WARNA = [
  { id: 1, color: '#FF5252', label: 'Merah' },
  { id: 2, color: '#74B9FF', label: 'Biru' },
  { id: 3, color: '#FDCB6E', label: 'Kuning' },
  { id: 4, color: '#2ECC71', label: 'Hijau' },
];

export default function BalloonGame() {
  const [targetColor, setTargetColor] = useState(BALON_WARNA[0]);
  const [score, setScore] = useState(0);
  
  // Animasi posisi balon ke atas
  const balloonY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [currentBalloon, setCurrentBalloon] = useState(BALON_WARNA[0]);
  const [randomX, setRandomX] = useState(100);

  const startBalloonAnimation = () => {
    // Reset posisi ke bawah layar
    balloonY.setValue(SCREEN_HEIGHT);
    
    // Pilih warna balon acak & posisi X acak
    const randColor = BALON_WARNA[Math.floor(Math.random() * BALON_WARNA.length)];
    const randX = Math.random() * (SCREEN_WIDTH - 120) + 20;
    
    setCurrentBalloon(randColor);
    setRandomX(randX);

    // Jalankan animasi melayang ke atas
    Animated.timing(balloonY, {
      toValue: -150,
      duration: 4500, // Kecepatan melayang (4.5 detik)
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        // Jika balon lolos tanpa dipecahkan, ulangi lagi
        startBalloonAnimation();
      }
    });
  };

  useEffect(() => {
    speakText(`Ayo cari dan pecahkan balon berwarna ${targetColor.label}!`);
    startBalloonAnimation();
  }, [targetColor]);

  const handlePop = () => {
    if (currentBalloon.id === targetColor.id) {
      speakText('Hore! Pintar sekali!');
      setScore(score + 1);
      
      // Pilih target warna baru
      const nextTarget = BALON_WARNA[Math.floor(Math.random() * BALON_WARNA.length)];
      setTargetColor(nextTarget);
    } else {
      speakText('Bukan yang itu, coba cari lagi!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.scoreText}>Skor: {score}</Text>
      <Text style={styles.instruction}>Pecahkan Balon: {targetColor.label}</Text>

      {/* Balon Interaktif */}
      <Animated.View
        style={[
          styles.balloonFrame,
          {
            left: randomX,
            transform: [{ translateY: balloonY }],
          },
        ]}
      >
        <Pressable onPress={handlePop}>
          <View style={[styles.balloon, { backgroundColor: currentBalloon.color }]} />
          <View style={styles.string} />
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EBF5FB', alignItems: 'center' },
  scoreText: { fontSize: 24, fontWeight: '900', color: '#2C3E50', marginTop: 20 },
  instruction: { fontSize: 20, fontWeight: '800', color: '#E74C3C', marginVertical: 10 },
  balloonFrame: { position: 'absolute', width: 80, height: 120 },
  balloon: { width: 80, height: 100, borderRadius: 40, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  string: { width: 2, height: 30, backgroundColor: '#7F8C8D', alignSelf: 'center' },
});
```

---

## 2. 🧺 Seret & Letakkan (Drag and Drop / Sorting)

### 💡 Konsep
Anak mengelompokkan benda ke wadah yang sesuai (misal: menyortir buah apel ke keranjang merah dan pisang ke keranjang kuning).

### 🛠️ Pendekatan Teknis
Menggunakan `PanResponder` bawaan React Native atau pustaka luar `@shopify/react-native-skia` / `react-native-reanimated` + `react-native-gesture-handler`.

### 📄 Template Kode Dasar (`app/(child)/sorting/[level].tsx`)
```tsx
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { speakText } from '@/lib/audio';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DragDropGame() {
  const [basketColor, setBasketColor] = useState('Merah');
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        // Deteksi tabrakan dengan keranjang (misalnya keranjang berada di dasar layar)
        if (gestureState.moveY > 500 && gestureState.moveX < SCREEN_WIDTH / 2) {
          speakText('Keranjang Merah! Benar!');
          // Aksi jika masuk keranjang kiri
        } else {
          // Reset posisi objek ke tengah jika diletakkan di luar target
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.instruction}>Masukkan apel merah ke keranjang merah!</Text>

      {/* Apel yang bisa diseret */}
      <Animated.View
        style={[pan.getLayout(), styles.draggableObject]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.emoji}>🍎</Text>
      </Animated.View>

      {/* Wadah Keranjang di Bawah */}
      <View style={styles.basketContainer}>
        <View style={[styles.basket, { backgroundColor: '#FF5252' }]}>
          <Text style={styles.basketText}>Keranjang Merah</Text>
        </View>
        <View style={[styles.basket, { backgroundColor: '#FDCB6E' }]}>
          <Text style={styles.basketText}>Keranjang Kuning</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9EBEA', justifyContent: 'space-between', alignItems: 'center' },
  instruction: { fontSize: 18, fontWeight: '800', textAlign: 'center', marginTop: 20, paddingHorizontal: 20 },
  draggableObject: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 60 },
  basketContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginBottom: 40 },
  basket: { width: 140, height: 100, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  basketText: { color: 'white', fontWeight: '900', fontSize: 14 },
});
```

---

## 3. 🎨 Menggambar & Menelusuri Garis (Tracing Letters)

### 💡 Konsep
Anak melatih gerakan jari mereka dengan menelusuri garis huruf atau bentuk. Sangat bagus untuk belajar huruf A-Z awal.

### 🛠️ Pendekatan Teknis
Menangkap titik koordinat sentuh layar (`touch events`) lewat view utama. Paling optimal menggunakan modul `react-native-svg` untuk merender garis putus-putus dan garis usapan anak.

### 📄 Template Kode Dasar (`app/(child)/tracing/[char].tsx`)
```tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text, PanResponder } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function TracingGame() {
  const [path, setPath] = useState<string>('');

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setPath(`M ${locationX} ${locationY}`);
    },
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setPath((prevPath) => `${prevPath} L ${locationX} ${locationY}`);
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Text style={styles.bgLetter}>A</Text>

      <Svg style={StyleSheet.absoluteFill}>
        <Path
          d={path}
          fill="none"
          stroke="#FF7675"
          strokeWidth={16}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  bgLetter: { fontSize: 260, fontWeight: '900', color: '#DFE6E9', opacity: 0.8 },
});
```

---

## 4. 🔊 Papan Suara Interaktif (Soundboard Exploration)

### 💡 Konsep
Mode santai di mana anak secara aktif menjelajahi kebun binatang atau kota virtual. Mengetuk ikon apapun langsung mengeluarkan suara nyata dan nama hewannya.

### 🛠️ Pendekatan Teknis
Merupakan menu berformat kisi-kisi (`grid layout`) dengan tombol berukuran besar yang kaya animasi getaran (`Haptic Feedback`) saat ditekan.

### 📄 Template Kode Dasar (`app/(child)/soundboard/index.tsx`)
```tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { speakText } from '@/lib/audio';

const HEWAN = [
  { id: '1', emoji: '🦁', name: 'Singa', soundDesc: 'Auuuum!' },
  { id: '2', emoji: '🐄', name: 'Sapi', soundDesc: 'Moooo!' },
  { id: '3', emoji: '🦆', name: 'Bebek', soundDesc: 'Kwek kwek!' },
  { id: '4', emoji: '🐔', name: 'Ayam', soundDesc: 'Kukuruyuk!' },
];

export default function SoundboardGame() {
  const handlePlaySound = (item: typeof HEWAN[0]) => {
    // Contoh memutar nama hewan & efek suaranya
    speakText(`${item.name}. ${item.soundDesc}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🔊 Tekan & Dengarkan Suara!</Text>
      
      <ScrollView contentContainerStyle={styles.grid}>
        {HEWAN.map((item) => (
          <Pressable 
            key={item.id} 
            style={styles.card}
            onPress={() => handlePlaySound(item)}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.label}>{item.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9E6' },
  header: { fontSize: 22, fontWeight: '900', color: '#D35400', textAlign: 'center', marginTop: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20, padding: 20 },
  card: {
    width: 140,
    height: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    borderBottomWidth: 5,
    borderBottomColor: '#F39C12',
  },
  emoji: { fontSize: 60 },
  label: { fontSize: 16, fontWeight: '800', color: '#2C3E50', marginTop: 8 },
});
```
