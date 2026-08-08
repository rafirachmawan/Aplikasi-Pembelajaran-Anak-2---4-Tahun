import { View, Text, StyleSheet, Pressable, Animated, Dimensions, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ONBOARDING_KEY = 'has_seen_onboarding';

const SLIDES = [
  {
    id: '1',
    emoji: '🎈',
    title: 'Selamat Datang!',
    subtitle: 'Dunia Si Kecil',
    description: 'Aplikasi belajar interaktif untuk si kecil usia 2 sampai 4 tahun. Belajar jadi menyenangkan!',
    bgColor: '#FF5252',
    accentColor: '#FFE0E0',
    iconRow: '🎨 🔢 🔤 🔷',
  },
  {
    id: '2',
    emoji: '🎨',
    title: '4 Modul Seru',
    subtitle: 'Konten Lengkap',
    description: 'Belajar mengenal Warna, Angka, Huruf dan Bentuk dengan tampilan warna-warni yang menarik perhatian anak.',
    bgColor: '#00B894',
    accentColor: '#D4EFDF',
    iconRow: '🔴 🟦 🔺 ⭐',
  },
  {
    id: '3',
    emoji: '🔊',
    title: 'Suara Penuntun',
    subtitle: 'Audio Narasi',
    description: 'Setiap soal dibacakan otomatis dengan suara ramah berbahasa Indonesia. Anak tidak perlu bisa membaca!',
    bgColor: '#6C5CE7',
    accentColor: '#E8E0FF',
    iconRow: '🗣️ 👂 🎵 🎶',
  },
  {
    id: '4',
    emoji: '📊',
    title: 'Pantau Progres',
    subtitle: 'Mode Orang Tua',
    description: 'Orang tua bisa melihat skor dan progres belajar anak secara lengkap di Dashboard khusus yang terlindungi.',
    bgColor: '#FDCB6E',
    accentColor: '#FFF9E6',
    iconRow: '⭐ 🏆 📈 🎉',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFinish = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderSlide = ({ item }: { item: typeof SLIDES[0] }) => (
    <View style={[styles.slide, { width }]}>
      {/* Decorative background circles */}
      <View style={[styles.decorCircle1, { backgroundColor: item.accentColor }]} />
      <View style={[styles.decorCircle2, { backgroundColor: item.accentColor }]} />

      {/* Big Emoji */}
      <View style={styles.emojiContainer}>
        <View style={[styles.emojiBubble, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Text style={styles.bigEmoji}>{item.emoji}</Text>
        </View>
      </View>

      {/* Subtitle Pill */}
      <View style={[styles.subtitlePill, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
        <Text style={styles.subtitlePillText}>{item.subtitle}</Text>
      </View>

      {/* Title */}
      <Text style={styles.slideTitle}>{item.title}</Text>

      {/* Description */}
      <Text style={styles.slideDescription}>{item.description}</Text>

      {/* Icon Row */}
      <View style={styles.iconRowContainer}>
        <Text style={styles.iconRow}>{item.iconRow}</Text>
      </View>
    </View>
  );

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: SLIDES[currentIndex].bgColor }]}>
      {/* Skip Button */}
      <View style={styles.topBar}>
        <View />
        {!isLastSlide && (
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Lewati ▶▶</Text>
          </Pressable>
        )}
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Bottom Controls */}
      <View style={styles.bottomBar}>
        {/* Dot Indicators */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [(index - 1) * width, index * width, (index + 1) * width],
              outputRange: [10, 28, 10],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange: [(index - 1) * width, index * width, (index + 1) * width],
              outputRange: [0.35, 1, 0.35],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={index}
                style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]}
              />
            );
          })}
        </View>

        {/* Action Button */}
        <Pressable
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={[styles.nextButtonText, { color: SLIDES[currentIndex].bgColor }]}>
            {isLastSlide ? '🚀 Mulai Belajar!' : 'Lanjut ▶'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 4,
  },
  skipButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  decorCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -30,
    left: -40,
    opacity: 0.3,
  },
  decorCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    bottom: 20,
    right: -30,
    opacity: 0.2,
  },
  emojiContainer: {
    marginBottom: 20,
  },
  emojiBubble: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  bigEmoji: {
    fontSize: 64,
  },
  subtitlePill: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginBottom: 12,
  },
  subtitlePillText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  slideTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  slideDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  iconRowContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  iconRow: {
    fontSize: 28,
    letterSpacing: 6,
  },
  bottomBar: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '900',
  },
});
