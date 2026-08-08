import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, PanResponder, Pressable, LayoutRectangle } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { speakText } from '@/lib/audio';

type Point = { x: number; y: number };
type Line = { points: Point[]; color: string };

export default function TracingGame() {
  const { char } = useLocalSearchParams<{ char: string }>();
  const router = useRouter();
  const displayChar = decodeURIComponent(char || 'A');

  const [lines, setLines] = useState<Line[]>([]);
  const [currentLinePoints, setCurrentLinePoints] = useState<Point[]>([]);
  const [strokeColor, setStrokeColor] = useState('#FF7675');
  const [canvasLayout, setCanvasLayout] = useState<LayoutRectangle | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [warningToast, setWarningToast] = useState<string | null>(null);

  const currentLineRef = useRef<Point[]>([]);
  const strokeColorRef = useRef(strokeColor);
  const canvasLayoutRef = useRef<LayoutRectangle | null>(null);

  const COLORS = ['#FF7675', '#74B9FF', '#00B894', '#FDCB6E', '#A29BFE', '#FD79A8', '#E17055'];

  useEffect(() => {
    strokeColorRef.current = strokeColor;
  }, [strokeColor]);

  useEffect(() => {
    canvasLayoutRef.current = canvasLayout;
  }, [canvasLayout]);

  useEffect(() => {
    speakText(`Ayo tulis ${displayChar} dengan jarimu!`);
  }, [displayChar]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        const layout = canvasLayoutRef.current;
        const x = layout ? gestureState.x0 - layout.x : evt.nativeEvent.locationX;
        const y = layout ? gestureState.y0 - layout.y : evt.nativeEvent.locationY;
        
        const startPoint = { x, y };
        currentLineRef.current = [startPoint];
        setCurrentLinePoints([startPoint]);
      },
      onPanResponderMove: (evt, gestureState) => {
        const layout = canvasLayoutRef.current;
        const x = layout ? gestureState.moveX - layout.x : evt.nativeEvent.locationX;
        const y = layout ? gestureState.moveY - layout.y : evt.nativeEvent.locationY;

        const newPoint = { x, y };
        currentLineRef.current = [...currentLineRef.current, newPoint];
        setCurrentLinePoints([...currentLineRef.current]);
      },
      onPanResponderRelease: () => {
        if (currentLineRef.current.length > 0) {
          const newLine: Line = {
            points: currentLineRef.current,
            color: strokeColorRef.current,
          };
          setLines((prev) => [...prev, newLine]);
        }
        currentLineRef.current = [];
        setCurrentLinePoints([]);
      },
    })
  ).current;

  const handleClear = () => {
    setLines([]);
    currentLineRef.current = [];
    setCurrentLinePoints([]);
  };

  const handleChangeColor = () => {
    const currentIdx = COLORS.indexOf(strokeColor);
    const nextIdx = (currentIdx + 1) % COLORS.length;
    setStrokeColor(COLORS[nextIdx]);
  };

  const handleFinish = () => {
    const allDrawnPoints = lines.flatMap((l) => l.points);

    // 1. Minimum stroke length check
    if (allDrawnPoints.length < 12) {
      speakText(`Yuk, tulis dulu ${displayChar} dengan jarimu!`);
      setWarningToast(`Ayo tulis dulu ${displayChar} dengan jarimu! ✏️`);
      setTimeout(() => setWarningToast(null), 2500);
      return;
    }

    if (!canvasLayout) {
      setIsFinished(true);
      return;
    }

    const { width, height } = canvasLayout;

    // Target letter region (center zone of canvas)
    const targetMinX = width * 0.12;
    const targetMaxX = width * 0.88;
    const targetMinY = height * 0.10;
    const targetMaxY = height * 0.90;

    let insideTargetCount = 0;
    let minX = width, maxX = 0, minY = height, maxY = 0;

    allDrawnPoints.forEach((pt) => {
      if (pt.x < minX) minX = pt.x;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.y > maxY) maxY = pt.y;

      if (
        pt.x >= targetMinX &&
        pt.x <= targetMaxX &&
        pt.y >= targetMinY &&
        pt.y <= targetMaxY
      ) {
        insideTargetCount++;
      }
    });

    const insideRatio = insideTargetCount / allDrawnPoints.length;
    const xSpan = maxX - minX;
    const ySpan = maxY - minY;

    // 2. Reject wild scribbles outside letter area (must have >= 70% points inside center area)
    if (insideRatio < 0.70) {
      speakText(`Yuk, telusuri di atas huruf ${displayChar} ya!`);
      setWarningToast(`Ayo telusuri di atas ${displayChar} ya! Jangan di luar garis ✏️`);
      setTimeout(() => setWarningToast(null), 2800);
      return;
    }

    // 3. Reject single line or incomplete tiny stroke
    const minYSpanRequired = height * 0.22;
    const minXSpanRequired = width * 0.15;

    if (ySpan < minYSpanRequired && xSpan < minXSpanRequired) {
      speakText(`Yuk, telusuri seluruh bentuk ${displayChar} ya!`);
      setWarningToast(`Belum lengkap nih! Ayo telusuri seluruh bentuk ${displayChar} ya! ✏️`);
      setTimeout(() => setWarningToast(null), 2800);
      return;
    }

    // Passed! Real tracing succeeds smoothly!
    setIsFinished(true);
    speakText(`Wah hebat sekali! Kamu pintar menulis ${displayChar}!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>⬅️</Text>
        </Pressable>
        <Text style={styles.title}>✏️ Tulis: {displayChar}</Text>
        <Pressable onPress={() => speakText(`Tulis ${displayChar} mebggunakan jarimu!`)} style={styles.speakerBtn}>
          <Text style={styles.speakerIcon}>🔊</Text>
        </Pressable>
      </View>

      {/* Drawing Canvas */}
      <View
        style={styles.canvasContainer}
        onLayout={(e) => setCanvasLayout(e.nativeEvent.layout)}
      >
        {/* Background letter guide */}
        <Text style={styles.bgLetter}>{displayChar}</Text>

        {/* Drawing surface */}
        <View style={styles.canvas} {...panResponder.panHandlers}>
          {/* Completed Lines */}
          {lines.map((line, lineIdx) =>
            line.points.map((pt, ptIdx) => (
              <View
                key={`line-${lineIdx}-${ptIdx}`}
                style={[
                  styles.dot,
                  {
                    left: pt.x - 12,
                    top: pt.y - 12,
                    backgroundColor: line.color,
                  },
                ]}
              />
            ))
          )}

          {/* Current Active Line */}
          {currentLinePoints.map((pt, ptIdx) => (
            <View
              key={`active-${ptIdx}`}
              style={[
                styles.dot,
                {
                  left: pt.x - 12,
                  top: pt.y - 12,
                  backgroundColor: strokeColor,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable
          style={[styles.controlBtn, { backgroundColor: '#FF5252', borderBottomColor: '#D32F2F' }]}
          onPress={handleClear}
        >
          <Text style={styles.controlText}>🗑️ Hapus</Text>
        </Pressable>

        <Pressable
          style={[styles.controlBtn, { backgroundColor: strokeColor, borderBottomColor: '#636E72' }]}
          onPress={handleChangeColor}
        >
          <Text style={styles.controlText}>🎨 Warna</Text>
        </Pressable>

        <Pressable
          style={[styles.controlBtn, { backgroundColor: '#00B894', borderBottomColor: '#00876C' }]}
          onPress={handleFinish}
        >
          <Text style={styles.controlText}>✅ Selesai</Text>
        </Pressable>
      </View>

      {/* Warning Toast */}
      {warningToast && (
        <View style={styles.toastContainer}>
          <View style={styles.toastCard}>
            <Text style={styles.toastText}>{warningToast}</Text>
          </View>
        </View>
      )}

      {/* Finish Overlay */}
      {isFinished && (
        <View style={styles.finishOverlay}>
          <View style={styles.finishCard}>
            <Text style={styles.finishEmoji}>🎉 ✍️ ⭐</Text>
            <Text style={styles.finishTitle}>Hebat Sekali!</Text>
            <Text style={styles.finishSubtitle}>
              Kamu berhasil menelusuri {displayChar} dengan sangat rapi!
            </Text>
            <View style={styles.finishButtons}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: '#00B894', borderBottomColor: '#00876C' }]}
                onPress={() => {
                  handleClear();
                  setIsFinished(false);
                }}
              >
                <Text style={styles.modalBtnText}>🔄 Tulis Lagi</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: '#74B9FF', borderBottomColor: '#0984E3' }]}
                onPress={() => router.back()}
              >
                <Text style={styles.modalBtnText}>🏠 Pilih Lainnya</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDF5' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8,
  },
  backBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF',
    alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 4, borderBottomColor: '#DFE6E9', elevation: 4,
  },
  backIcon: { fontSize: 22 },
  title: { flex: 1, fontSize: 24, fontWeight: '900', color: '#D35400', marginLeft: 14 },
  speakerBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FF7675',
    alignItems: 'center', justifyContent: 'center',
  },
  speakerIcon: { fontSize: 20 },
  canvasContainer: {
    flex: 1, marginHorizontal: 16, marginTop: 8, borderRadius: 24,
    backgroundColor: '#FFF', elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8,
    overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#DFE6E9', borderStyle: 'dashed',
  },
  bgLetter: {
    position: 'absolute', fontSize: 280, fontWeight: '900',
    color: '#F0F0F0', opacity: 0.7,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
  dot: {
    position: 'absolute', width: 24, height: 24, borderRadius: 12,
  },
  controls: {
    flexDirection: 'row', gap: 12,
    paddingHorizontal: 16, paddingVertical: 16,
  },
  controlBtn: {
    flex: 1, borderRadius: 18, paddingVertical: 14,
    alignItems: 'center', borderBottomWidth: 5, elevation: 4,
  },
  controlText: { fontSize: 14, fontWeight: '900', color: '#FFF' },
  toastContainer: {
    position: 'absolute', top: 100, left: 20, right: 20, alignItems: 'center',
  },
  toastCard: {
    backgroundColor: '#FFEAA7', borderRadius: 20, paddingVertical: 12, paddingHorizontal: 20,
    elevation: 6, borderBottomWidth: 3, borderBottomColor: '#FDCB6E',
  },
  toastText: { fontSize: 16, fontWeight: '900', color: '#D35400', textAlign: 'center' },
  finishOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20,
  },
  finishCard: {
    backgroundColor: '#FFF', borderRadius: 32, paddingVertical: 28, paddingHorizontal: 24,
    alignItems: 'center', width: '100%', elevation: 10,
  },
  finishEmoji: { fontSize: 52, marginBottom: 12 },
  finishTitle: { fontSize: 30, fontWeight: '900', color: '#2D3436', marginBottom: 8 },
  finishSubtitle: { fontSize: 16, fontWeight: '700', color: '#636E72', textAlign: 'center', marginBottom: 24 },
  finishButtons: { width: '100%', gap: 12 },
  modalBtn: {
    borderRadius: 20, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 5, elevation: 4,
  },
  modalBtnText: { fontSize: 18, fontWeight: '900', color: '#FFF' },
});
