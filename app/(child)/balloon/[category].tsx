import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { speakText } from '@/lib/audio';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

type BalloonItem = {
  label: string;
  color: string;
};

const CATEGORIES: Record<string, { instruction: string; items: BalloonItem[] }> = {
  warna: {
    instruction: 'Pecahkan balon warna',
    items: [
      { label: 'Merah', color: '#FF5252' },
      { label: 'Biru', color: '#74B9FF' },
      { label: 'Kuning', color: '#FDCB6E' },
      { label: 'Hijau', color: '#00B894' },
      { label: 'Ungu', color: '#A29BFE' },
      { label: 'Oranye', color: '#E17055' },
    ],
  },
  angka: {
    instruction: 'Pecahkan balon angka',
    items: [
      { label: '1', color: '#FF5252' },
      { label: '2', color: '#74B9FF' },
      { label: '3', color: '#FDCB6E' },
      { label: '4', color: '#00B894' },
      { label: '5', color: '#A29BFE' },
    ],
  },
  huruf: {
    instruction: 'Pecahkan balon huruf',
    items: [
      { label: 'A', color: '#FF5252' },
      { label: 'B', color: '#74B9FF' },
      { label: 'C', color: '#FDCB6E' },
      { label: 'D', color: '#00B894' },
      { label: 'E', color: '#A29BFE' },
    ],
  },
};

type ActiveBalloon = {
  id: number;
  item: BalloonItem;
  x: number;
  animY: Animated.Value;
};

const TOTAL_ROUNDS = 8;
const MAX_LIVES = 3;

export default function BalloonGame() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const catData = CATEGORIES[category] || CATEGORIES.warna;

  const [target, setTarget] = useState<BalloonItem>(catData.items[0]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [round, setRound] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [popped, setPopped] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'none' | 'missed' | 'wrong'>('none');
  const [balloons, setBalloons] = useState<ActiveBalloon[]>([]);

  const balloonIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetRef = useRef<BalloonItem>(catData.items[0]);
  const livesRef = useRef(MAX_LIVES);
  const gameStateRef = useRef<'playing' | 'won' | 'lost'>('playing');

  const poppedIdsRef = useRef<Set<number>>(new Set());

  // Keep refs synchronized
  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const pickNewTarget = useCallback(() => {
    const newTarget = catData.items[Math.floor(Math.random() * catData.items.length)];
    setTarget(newTarget);
    targetRef.current = newTarget;
    speakText(`${catData.instruction} ${newTarget.label}!`);
  }, [catData]);

  const handleMiss = useCallback((reason: 'missed' | 'wrong') => {
    if (gameStateRef.current !== 'playing') return;

    const newLives = livesRef.current - 1;
    setLives(newLives);
    livesRef.current = newLives;

    if (reason === 'missed') {
      setFeedback('missed');
      speakText('Waduh, balonnya kelewatan!');
    } else {
      setFeedback('wrong');
      speakText('Oops! Salah balon!');
    }

    setTimeout(() => setFeedback('none'), 1200);

    if (newLives <= 0) {
      setGameState('lost');
      gameStateRef.current = 'lost';
      if (intervalRef.current) clearInterval(intervalRef.current);
      speakText('Kesempatan habis! Ayo coba lagi ya!');
    } else {
      setTimeout(() => pickNewTarget(), 1200);
    }
  }, [pickNewTarget]);

  const spawnBalloon = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;

    let item: BalloonItem;
    if (Math.random() < 0.4 && targetRef.current) {
      item = targetRef.current;
    } else {
      item = catData.items[Math.floor(Math.random() * catData.items.length)];
    }

    const x = Math.random() * (SCREEN_WIDTH - 100) + 20;
    const animY = new Animated.Value(SCREEN_HEIGHT + 50);
    const id = balloonIdRef.current++;

    const balloon: ActiveBalloon = { id, item, x, animY };

    setBalloons((prev) => [...prev.slice(-4), balloon]);

    Animated.timing(animY, {
      toValue: -180,
      duration: 4200 + Math.random() * 1200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setBalloons((prev) => prev.filter((b) => b.id !== id));
        if (!poppedIdsRef.current.has(id) && item.label === targetRef.current.label && gameStateRef.current === 'playing') {
          handleMiss('missed');
        }
      }
    });
  }, [catData, handleMiss]);

  // Start spawning balloons
  useEffect(() => {
    if (gameState !== 'playing') return;

    pickNewTarget();
    setTimeout(() => spawnBalloon(), 400);

    intervalRef.current = setInterval(() => {
      spawnBalloon();
    }, 1600);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameState]);

  const handlePop = (balloon: ActiveBalloon) => {
    if (gameState !== 'playing') return;
    if (poppedIdsRef.current.has(balloon.id)) return;

    poppedIdsRef.current.add(balloon.id);
    setPopped(balloon.id);
    setTimeout(() => setPopped(null), 400);

    setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));

    if (balloon.item.label === target.label) {
      speakText('Hore! Benar!');
      const newScore = score + 1;
      setScore(newScore);
      const newRound = round + 1;
      setRound(newRound);

      if (newRound >= TOTAL_ROUNDS) {
        setGameState('won');
        gameStateRef.current = 'won';
        if (intervalRef.current) clearInterval(intervalRef.current);
        speakText('Wah kamu hebat sekali! Semua balon berhasil dipecahkan!');
      } else {
        setTimeout(() => pickNewTarget(), 800);
      }
    } else {
      handleMiss('wrong');
    }
  };

  const resetGame = () => {
    poppedIdsRef.current.clear();
    setScore(0);
    setLives(MAX_LIVES);
    livesRef.current = MAX_LIVES;
    setRound(0);
    setFeedback('none');
    setBalloons([]);
    setGameState('playing');
    gameStateRef.current = 'playing';
  };

  if (gameState !== 'playing') {
    const isWon = gameState === 'won';
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.finishContainer}>
          <Text style={styles.finishEmoji}>{isWon ? '🎈🎉🎈' : '😿🎈'}</Text>
          <Text style={styles.finishTitle}>{isWon ? 'Super Hebat!' : 'Yah, Coba Lagi Ya!'}</Text>
          <Text style={styles.finishScore}>
            {isWon
              ? `Kamu memecahkan ${score} balon dengan benar! 💪`
              : `Balonnya kelewatan atau salah ditekan. Tetap semangat! ❤️`}
          </Text>
          <View style={styles.finishButtons}>
            <Pressable
              style={[styles.finishBtn, { backgroundColor: '#00B894', borderBottomColor: '#00876C' }]}
              onPress={resetGame}
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

        {/* Lives indicator */}
        <View style={styles.livesRow}>
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <Text key={i} style={styles.heartEmoji}>
              {i < lives ? '❤️' : '🖤'}
            </Text>
          ))}
        </View>

        <View style={styles.scorePill}>
          <Text style={styles.scoreText}>🎯 {score}/{TOTAL_ROUNDS}</Text>
        </View>
      </View>

      {/* Instruction */}
      <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>
          {catData.instruction} <Text style={[styles.targetText, { color: target.color }]}>{target.label}</Text>! 💥
        </Text>
        <Pressable onPress={() => speakText(`${catData.instruction} ${target.label}!`)} style={styles.speakerBtn}>
          <Text style={styles.speakerIcon}>🔊</Text>
        </Pressable>
      </View>

      {/* Balloon Arena */}
      <View style={styles.arena}>
        {balloons.map((balloon) => (
          <View
            key={balloon.id}
            style={{
              position: 'absolute',
              left: balloon.x,
              top: 0,
            }}
          >
            <Animated.View
              style={[
                styles.balloonFrame,
                {
                  transform: [{ translateY: balloon.animY }],
                },
              ]}
            >
              <Pressable onPress={() => handlePop(balloon)}>
                <View style={[styles.balloon, { backgroundColor: balloon.item.color }]}>
                  <Text style={styles.balloonLabel}>{balloon.item.label}</Text>
                </View>
                <View style={styles.balloonString} />
              </Pressable>
            </Animated.View>
          </View>
        ))}

        {/* Pop effect */}
        {popped !== null && (
          <View style={styles.popEffect}>
            <Text style={styles.popText}>💥 POP!</Text>
          </View>
        )}

        {/* Feedback overlays */}
        {feedback === 'missed' && (
          <View style={styles.feedbackOverlay}>
            <View style={[styles.feedbackCard, { backgroundColor: '#FFEAA7' }]}>
              <Text style={styles.feedbackEmoji}>🎈💨</Text>
              <Text style={styles.feedbackTextWrong}>Waduh, balonnya kelewatan!</Text>
            </View>
          </View>
        )}

        {feedback === 'wrong' && (
          <View style={styles.feedbackOverlay}>
            <View style={[styles.feedbackCard, { backgroundColor: '#FF7675' }]}>
              <Text style={styles.feedbackEmoji}>❌🎈</Text>
              <Text style={[styles.feedbackTextWrong, { color: '#FFF' }]}>Oops! Salah balon!</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F8F5' },
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
  livesRow: { flexDirection: 'row', gap: 4 },
  heartEmoji: { fontSize: 22 },
  scorePill: {
    backgroundColor: '#FFEAA7', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20,
  },
  scoreText: { fontSize: 15, fontWeight: '900', color: '#D63031' },
  instructionBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 20,
    paddingVertical: 14, paddingHorizontal: 16, elevation: 3, gap: 10,
  },
  instructionText: { fontSize: 20, fontWeight: '900', color: '#2D3436', textAlign: 'center', flex: 1 },
  targetText: { fontSize: 24, fontWeight: '900' },
  speakerBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FF7675',
    alignItems: 'center', justifyContent: 'center',
  },
  speakerIcon: { fontSize: 20 },
  arena: { flex: 1, overflow: 'hidden' },
  balloonFrame: { width: 80, alignItems: 'center' },
  balloon: {
    width: 80, height: 96, borderRadius: 40, borderBottomLeftRadius: 36, borderBottomRightRadius: 36,
    alignItems: 'center', justifyContent: 'center',
    elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 6,
  },
  balloonLabel: {
    fontSize: 22, fontWeight: '900', color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3,
  },
  balloonString: {
    width: 2, height: 30, backgroundColor: '#B2BEC3', alignSelf: 'center',
  },
  popEffect: {
    position: 'absolute', top: '40%', alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: 16,
  },
  popText: { fontSize: 32, fontWeight: '900', color: '#D63031' },
  feedbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20,
  },
  feedbackCard: {
    backgroundColor: '#FFF', borderRadius: 28, paddingVertical: 24, paddingHorizontal: 24,
    alignItems: 'center', elevation: 8, width: '90%',
  },
  feedbackEmoji: { fontSize: 44, marginBottom: 8 },
  feedbackTextWrong: { fontSize: 22, fontWeight: '900', color: '#D63031', textAlign: 'center' },
  finishContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  finishEmoji: { fontSize: 64, marginBottom: 16 },
  finishTitle: { fontSize: 32, fontWeight: '900', color: '#2D3436', marginBottom: 8 },
  finishScore: { fontSize: 17, fontWeight: '700', color: '#636E72', marginBottom: 32, textAlign: 'center' },
  finishButtons: { width: '100%', gap: 16 },
  finishBtn: {
    borderRadius: 24, paddingVertical: 18, alignItems: 'center', borderBottomWidth: 6, elevation: 4,
  },
  finishBtnText: { fontSize: 20, fontWeight: '900', color: '#FFF' },
});
