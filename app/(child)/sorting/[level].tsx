import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, PanResponder, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { speakText } from '@/lib/audio';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type SortItem = {
  emoji: string;
  label: string;
  targetBasket: 'left' | 'right';
};

type BasketPair = {
  left: { label: string; color: string; shadowColor: string };
  right: { label: string; color: string; shadowColor: string };
};

type LevelData = {
  instruction: string;
  baskets: BasketPair;
  items: SortItem[];
};

const LEVELS: Record<string, LevelData> = {
  buah: {
    instruction: 'Letakkan buah ke keranjang yang benar!',
    baskets: {
      left: { label: '🍎 Merah', color: '#FF5252', shadowColor: '#D32F2F' },
      right: { label: '🍌 Kuning', color: '#FDCB6E', shadowColor: '#E1A100' },
    },
    items: [
      { emoji: '🍎', label: 'Apel', targetBasket: 'left' },
      { emoji: '🍌', label: 'Pisang', targetBasket: 'right' },
      { emoji: '🍓', label: 'Strawberry', targetBasket: 'left' },
      { emoji: '🍋', label: 'Lemon', targetBasket: 'right' },
      { emoji: '🍒', label: 'Ceri', targetBasket: 'left' },
      { emoji: '⭐', label: 'Bintang', targetBasket: 'right' },
    ],
  },
  hewan: {
    instruction: 'Hewan darat ke kiri, hewan air ke kanan!',
    baskets: {
      left: { label: '🌳 Darat', color: '#00B894', shadowColor: '#00876C' },
      right: { label: '🌊 Air', color: '#74B9FF', shadowColor: '#0984E3' },
    },
    items: [
      { emoji: '🐶', label: 'Anjing', targetBasket: 'left' },
      { emoji: '🐟', label: 'Ikan', targetBasket: 'right' },
      { emoji: '🐱', label: 'Kucing', targetBasket: 'left' },
      { emoji: '🐬', label: 'Lumba-lumba', targetBasket: 'right' },
      { emoji: '🐘', label: 'Gajah', targetBasket: 'left' },
      { emoji: '🐢', label: 'Penyu', targetBasket: 'right' },
    ],
  },
  warna: {
    instruction: 'Kelompokkan benda sesuai warnanya!',
    baskets: {
      left: { label: '🔴 Merah', color: '#FF5252', shadowColor: '#D32F2F' },
      right: { label: '🔵 Biru', color: '#74B9FF', shadowColor: '#0984E3' },
    },
    items: [
      { emoji: '❤️', label: 'Hati', targetBasket: 'left' },
      { emoji: '💎', label: 'Berlian', targetBasket: 'right' },
      { emoji: '🌹', label: 'Mawar', targetBasket: 'left' },
      { emoji: '🧊', label: 'Es', targetBasket: 'right' },
      { emoji: '🍅', label: 'Tomat', targetBasket: 'left' },
      { emoji: '🫐', label: 'Blueberry', targetBasket: 'right' },
    ],
  },
};

function DraggableItem({
  item,
  onCorrectDrop,
  onWrongDrop,
}: {
  item: SortItem;
  onCorrectDrop: () => void;
  onWrongDrop: () => void;
}) {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.spring(scaleAnim, { toValue: 1.15, useNativeDriver: false }).start();
      },
      onPanResponderMove: (_e, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (_e, gestureState) => {
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: false }).start();

        const dropX = gestureState.moveX;
        const dropY = gestureState.moveY;
        const isLeftDrop = dropX < SCREEN_WIDTH / 2;
        const droppedSide = isLeftDrop ? 'left' : 'right';

        if (dropY > SCREEN_HEIGHT * 0.45 && droppedSide === item.targetBasket) {
          pan.setValue({ x: 0, y: 0 });
          onCorrectDrop();
        } else if (dropY > SCREEN_HEIGHT * 0.45) {
          pan.setValue({ x: 0, y: 0 });
          onWrongDrop();
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.draggableItem,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: scaleAnim },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Text style={styles.draggableEmoji}>{item.emoji}</Text>
      <Text style={styles.draggableLabel}>{item.label}</Text>
    </Animated.View>
  );
}

export default function SortingGame() {
  const { level } = useLocalSearchParams<{ level: string }>();
  const router = useRouter();
  const levelData = LEVELS[level] || LEVELS.buah;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  const currentItem = levelData.items[currentIndex];

  useEffect(() => {
    if (!isFinished && currentItem) {
      speakText(`Letakkan ${currentItem.label}!`);
    }
  }, [currentIndex, isFinished]);

  const handleCorrectDrop = () => {
    setFeedback('correct');
    speakText('Benar! Pintar sekali!');
    setScore((prev) => prev + 1);

    setTimeout(() => {
      setFeedback('none');
      if (currentIndex < levelData.items.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
        speakText('Kamu berhasil menyelesaikan semua! Hebat!');
      }
    }, 1200);
  };

  const handleWrongDrop = () => {
    setFeedback('wrong');
    speakText('Bukan yang itu! Coba letakkan di keranjang lainnya!');
    setTimeout(() => setFeedback('none'), 1000);
  };

  if (isFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.finishContainer}>
          <Text style={styles.finishEmoji}>🧺 🎉 🧺</Text>
          <Text style={styles.finishTitle}>Selesai! Kamu Hebat!</Text>
          <Text style={styles.finishScore}>
            {score} dari {levelData.items.length} benda disortir dengan benar!
          </Text>
          <View style={styles.finishButtons}>
            <Pressable
              style={[styles.finishBtn, { backgroundColor: '#00B894', borderBottomColor: '#00876C' }]}
              onPress={() => { setCurrentIndex(0); setScore(0); setIsFinished(false); }}
            >
              <Text style={styles.finishBtnText}>🔄 Main Lagi</Text>
            </Pressable>
            <Pressable
              style={[styles.finishBtn, { backgroundColor: '#FF5252', borderBottomColor: '#D32F2F' }]}
              onPress={() => router.back()}
            >
              <Text style={styles.finishBtnText}>🏠 Kembali</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>⬅️</Text>
        </Pressable>
        <View style={styles.progressPill}>
          <Text style={styles.progressText}>{currentIndex + 1} / {levelData.items.length}</Text>
        </View>
      </View>

      {/* Instruction */}
      <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>{levelData.instruction}</Text>
      </View>

      {/* Drag Area */}
      <View style={styles.dragArea}>
        <Text style={styles.hintText}>👆 Seret {currentItem?.label} ke keranjang!</Text>
        {currentItem && (
          <DraggableItem
            key={`${currentIndex}-${currentItem.emoji}`}
            item={currentItem}
            onCorrectDrop={handleCorrectDrop}
            onWrongDrop={handleWrongDrop}
          />
        )}
      </View>

      {/* Baskets */}
      <View style={styles.basketRow}>
        <View style={[styles.basket, { backgroundColor: levelData.baskets.left.color, borderBottomColor: levelData.baskets.left.shadowColor }]}>
          <Text style={styles.basketText}>{levelData.baskets.left.label}</Text>
        </View>
        <View style={[styles.basket, { backgroundColor: levelData.baskets.right.color, borderBottomColor: levelData.baskets.right.shadowColor }]}>
          <Text style={styles.basketText}>{levelData.baskets.right.label}</Text>
        </View>
      </View>

      {/* Feedback */}
      {feedback === 'correct' && (
        <View style={styles.feedbackOverlay}>
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackEmoji}>⭐🎈⭐</Text>
            <Text style={[styles.feedbackText, { color: '#00B894' }]}>Benar! Pintar! 🎉</Text>
          </View>
        </View>
      )}
      {feedback === 'wrong' && (
        <View style={styles.feedbackOverlay}>
          <View style={[styles.feedbackCard, { backgroundColor: '#FFEAA7' }]}>
            <Text style={styles.feedbackEmoji}>💪😊</Text>
            <Text style={[styles.feedbackText, { color: '#D63031' }]}>Coba keranjang lainnya!</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9E6' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8,
  },
  backBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF',
    alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 4, borderBottomColor: '#DFE6E9', elevation: 4,
  },
  backIcon: { fontSize: 22 },
  progressPill: { backgroundColor: '#FFEAA7', paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20 },
  progressText: { fontSize: 14, fontWeight: '900', color: '#D35400' },
  instructionBox: {
    backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 20,
    paddingVertical: 14, paddingHorizontal: 16, elevation: 3, alignItems: 'center',
  },
  instructionText: { fontSize: 18, fontWeight: '900', color: '#2D3436', textAlign: 'center' },
  dragArea: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 20,
  },
  hintText: { fontSize: 16, fontWeight: '700', color: '#636E72', marginBottom: 16 },
  draggableItem: {
    width: 120, height: 120, borderRadius: 28, backgroundColor: '#FFF',
    alignItems: 'center', justifyContent: 'center',
    elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8,
    borderWidth: 3, borderColor: '#DFE6E9',
  },
  draggableEmoji: { fontSize: 50 },
  draggableLabel: { fontSize: 14, fontWeight: '900', color: '#2D3436', marginTop: 4 },
  basketRow: {
    flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, paddingBottom: 30,
  },
  basket: {
    width: 150, height: 110, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 6, elevation: 6,
  },
  basketText: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  feedbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20,
  },
  feedbackCard: {
    backgroundColor: '#FFF', borderRadius: 32, paddingVertical: 32, paddingHorizontal: 28,
    alignItems: 'center', elevation: 10, width: '100%',
  },
  feedbackEmoji: { fontSize: 54, marginBottom: 12 },
  feedbackText: { fontSize: 26, fontWeight: '900', textAlign: 'center' },
  finishContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  finishEmoji: { fontSize: 64, marginBottom: 16 },
  finishTitle: { fontSize: 32, fontWeight: '900', color: '#2D3436', marginBottom: 8 },
  finishScore: { fontSize: 17, fontWeight: '700', color: '#636E72', marginBottom: 32, textAlign: 'center' },
  finishButtons: { width: '100%', gap: 16 },
  finishBtn: { borderRadius: 24, paddingVertical: 18, alignItems: 'center', borderBottomWidth: 6, elevation: 4 },
  finishBtnText: { fontSize: 20, fontWeight: '900', color: '#FFF' },
});
