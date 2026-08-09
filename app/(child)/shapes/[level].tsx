import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { saveLevelProgress } from '@/lib/storage';
import { speakText, stopSound } from '@/lib/audio';
import shapesData from '@/assets/data/shapes.json';

type ShapeOption = {
  label: string;
  color: string;
  shadowColor: string;
  correct: boolean;
};

type Question = {
  id: number;
  instruction: string;
  options: ShapeOption[];
};

type FeedbackState = 'none' | 'correct' | 'wrong';

function ShapeOptionButton({
  option,
  onPress,
}: {
  option: ShapeOption;
  onPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }),
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
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.shapeOption,
          { backgroundColor: option.color, borderBottomColor: option.shadowColor },
          { transform: [{ scale: scaleAnim }, { translateY: translateYAnim }] },
        ]}
      >
        <Text style={styles.shapeOptionText}>{option.label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function ShapeQuestion() {
  const { level } = useLocalSearchParams<{ level: string }>();
  const router = useRouter();

  // Load questions from JSON based on level param
  const levelId = parseInt(level) || 1;
  const levelData = shapesData.levels.find((l) => l.id === levelId);
  const questions: Question[] = (levelData?.questions || []) as Question[];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>('none');
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question = questions[currentQuestion];

  // Auto speak instruction on question change
  useEffect(() => {
    if (question && !isFinished) {
      speakText(question.instruction);
    }
    return () => {
      stopSound();
    };
  }, [currentQuestion, question, isFinished]);

  const handleAnswer = (correct: boolean) => {
    if (feedback !== 'none') return;
    if (correct) {
      setFeedback('correct');
      speakText('Hore! Jawabanmu benar!');
      const newScore = score + 1;
      setScore(newScore);
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
          setFeedback('none');
        } else {
          setIsFinished(true);
          speakText('Luar biasa! Kamu pintar sekali!');
          saveLevelProgress('shapes', String(levelId), newScore, questions.length);
        }
      }, 1600);
    } else {
      setFeedback('wrong');
      speakText('Coba lagi ya!');
      setTimeout(() => setFeedback('none'), 1200);
    }
  };

  if (!question && !isFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.finishContainer}>
          <Text style={styles.finishEmoji}>⚠️</Text>
          <Text style={styles.finishTitle}>Level belum tersedia</Text>
          <Pressable
            style={[styles.finishButton, { backgroundColor: '#FF5252', borderBottomColor: '#D32F2F' }]}
            onPress={() => router.back()}
          >
            <Text style={styles.finishButtonText}>🏠 Kembali</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (isFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.finishContainer}>
          <Text style={styles.finishEmoji}>🎉 🔷 🎉</Text>
          <Text style={styles.finishTitle}>Pintar Kenal Bentuk!</Text>
          <Text style={styles.finishScore}>
            Berhasil menjawab {score} dari {questions.length} pertanyaan!
          </Text>

          <View style={styles.finishButtons}>
            <Pressable
              style={[styles.finishButton, { backgroundColor: '#6C5CE7', borderBottomColor: '#4834D4' }]}
              onPress={() => { setCurrentQuestion(0); setScore(0); setFeedback('none'); setIsFinished(false); }}
            >
              <Text style={styles.finishButtonText}>🔄 Main Lagi</Text>
            </Pressable>

            <Pressable
              style={[styles.finishButton, { backgroundColor: '#FF5252', borderBottomColor: '#D32F2F' }]}
              onPress={() => router.back()}
            >
              <Text style={styles.finishButtonText}>🏠 Halaman Utama</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>⬅️</Text>
        </Pressable>

        <View style={styles.progressPill}>
          <Text style={styles.progressText}>
            Soal {currentQuestion + 1} / {questions.length}
          </Text>
        </View>
      </View>

      {/* Instruction Banner Box */}
      <View style={styles.instructionBox}>
        <Text style={styles.instruction}>{question.instruction}</Text>

        <Pressable style={styles.audioButton} onPress={() => speakText(question.instruction)}>
          <Text style={styles.audioIcon}>🔊 Putar Suara</Text>
        </Pressable>
      </View>

      {/* Options Container */}
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <ShapeOptionButton
            key={`${question.id}-${index}`}
            option={option}
            onPress={() => handleAnswer(option.correct)}
          />
        ))}
      </View>

      {/* Feedback Popups */}
      {feedback === 'correct' && (
        <View style={styles.feedbackOverlay}>
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackEmoji}>⭐ 🎈 ⭐</Text>
            <Text style={styles.feedbackText}>Hore! Bentuk Yang Benar! 🎉</Text>
          </View>
        </View>
      )}

      {feedback === 'wrong' && (
        <View style={styles.feedbackOverlay}>
          <View style={[styles.feedbackCard, { backgroundColor: '#FFEAA7' }]}>
            <Text style={styles.feedbackEmoji}>💪😊</Text>
            <Text style={styles.feedbackTextWrong}>Cari bentuknya lagi ya!</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3E5F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#E1BEE7',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backIcon: { fontSize: 22 },
  progressPill: {
    backgroundColor: '#E1BEE7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#6C5CE7',
  },
  instructionBox: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  instruction: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 10,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C5CE7',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    elevation: 2,
  },
  audioIcon: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 16,
    paddingVertical: 16,
  },
  shapeOption: {
    borderRadius: 24,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 6,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  shapeOptionText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  feedbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  feedbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: 'center',
    elevation: 10,
    width: '100%',
  },
  feedbackEmoji: { fontSize: 54, marginBottom: 12 },
  feedbackText: { fontSize: 26, fontWeight: '900', color: '#00B894', textAlign: 'center' },
  feedbackTextWrong: { fontSize: 24, fontWeight: '900', color: '#D63031', textAlign: 'center' },
  finishContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  finishEmoji: { fontSize: 64, marginBottom: 16 },
  finishTitle: { fontSize: 32, fontWeight: '900', color: '#2D3436', marginBottom: 8 },
  finishScore: { fontSize: 17, fontWeight: '700', color: '#636E72', marginBottom: 32 },
  finishButtons: { width: '100%', gap: 16 },
  finishButton: {
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: 'center',
    borderBottomWidth: 6,
    elevation: 4,
  },
  finishButtonText: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
});
