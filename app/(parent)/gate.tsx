import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

function generateQuestion() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, answer: a + b };
}

export default function ParentalGate() {
  const router = useRouter();
  const [question, setQuestion] = useState(generateQuestion());
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = () => {
    if (cooldown > 0) return;
    if (parseInt(input) === question.answer) {
      router.replace('/(parent)/dashboard');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(true);
      setInput('');
      setQuestion(generateQuestion());
      if (newAttempts >= 3) {
        setCooldown(30);
        setAttempts(0);
      }
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backIcon}>⬅️ Kembali ke Mode Anak</Text>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.lockBadge}>
            <Text style={styles.lockIcon}>🛡️</Text>
          </View>

          <Text style={styles.title}>Verifikasi Orang Tua</Text>
          <Text style={styles.subtitle}>Selesaikan penjumlahan sederhana di bawah ini untuk mengakses Halaman Orang Tua</Text>

          <View style={styles.questionBox}>
            <Text style={styles.question}>{question.a} + {question.b} = ?</Text>
          </View>

          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={input}
            onChangeText={setInput}
            placeholder="Jawaban"
            placeholderTextColor="#B2BEC3"
            editable={cooldown <= 0}
            onSubmitEditing={handleSubmit}
          />

          <Pressable
            style={[styles.submitButton, cooldown > 0 && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={cooldown > 0}
          >
            <Text style={styles.submitText}>
              {cooldown > 0 ? `Tunggu ${cooldown} Detik` : 'Masuk Dashboard'}
            </Text>
          </Pressable>

          {error && (
            <View style={styles.errorChip}>
              <Text style={styles.errorText}>⚠️ Jawaban kurang tepat, coba lagi ya</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  backButton: { paddingHorizontal: 20, paddingTop: 16 },
  backIcon: { fontSize: 15, fontWeight: '700', color: '#636E72' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  lockBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F1F2F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  lockIcon: { fontSize: 36 },
  title: { fontSize: 24, fontWeight: '900', color: '#2D3436', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, fontWeight: '600', color: '#B2BEC3', marginBottom: 24, textAlign: 'center', lineHeight: 20 },
  questionBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 36,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DFE6E9',
  },
  question: { fontSize: 36, fontWeight: '900', color: '#6C5CE7', textAlign: 'center' },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    width: '80%',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#6C5CE7',
    color: '#2D3436',
  },
  submitButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 20,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
  },
  submitDisabled: { backgroundColor: '#B2BEC3' },
  submitText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  errorChip: {
    marginTop: 16,
    backgroundColor: '#FFEAA7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  errorText: { fontSize: 13, fontWeight: '700', color: '#D63031' },
});
