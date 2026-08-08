# Tech Stack — Aplikasi Pembelajaran Anak Pra-Sekolah

**Versi:** 0.1 (Draft MVP)
**Tanggal:** 8 Agustus 2026
**Terkait:** PRD.md, USER_FLOW.md
**Platform target:** Android (build via Expo/EAS)

---

## 1. Prinsip Pemilihan Stack

- **Offline-first** — tidak ada dependency yang mewajibkan koneksi internet untuk fungsi utama
- **Ringan** — anak usia 2-4 tahun butuh transisi cepat, hindari library berat yang bikin app lag di HP low-end
- **Minim setup native** — sebisa mungkin tetap di jalur **Expo Managed Workflow**, hindari custom native module dulu di MVP supaya build tetap simpel lewat EAS
- **Tanpa backend** — sesuai keputusan PRD, semua data tersimpan lokal di perangkat

---

## 2. Core Framework

| Komponen         | Pilihan                                  | Keterangan                                                                                       |
| ---------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Framework        | **Expo (SDK terbaru, Managed Workflow)** | Base React Native, memudahkan build Android tanpa perlu Android Studio penuh selama development  |
| Bahasa           | **TypeScript**                           | Type-safety, memudahkan maintain terutama untuk data soal/level yang terstruktur                 |
| Routing/Navigasi | **expo-router**                          | File-based routing, cocok untuk struktur Mode Anak vs Mode Orang Tua sebagai grup route terpisah |

---

## 3. Penyimpanan Data Lokal

| Kebutuhan                                 | Library                                                | Keterangan                                                                                               |
| ----------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Simpan progres anak (level selesai, skor) | **@react-native-async-storage/async-storage**          | Key-value storage sederhana, cukup untuk kebutuhan MVP (1 profil, data kecil)                            |
| Struktur data soal per modul              | **File JSON statis lokal** (bundled di `assets/data/`) | Tidak perlu database (SQLite dsb) di MVP karena konten soal tidak sering berubah dan tidak terlalu besar |

> **Catatan:** Kalau nanti scope berkembang (misal butuh multi-profil atau riwayat detail per sesi), baru pertimbangkan **expo-sqlite** sebagai upgrade dari AsyncStorage.

---

## 4. Audio & Media

| Kebutuhan                                     | Library        | Keterangan                                                                 |
| --------------------------------------------- | -------------- | -------------------------------------------------------------------------- |
| Pemutaran suara (instruksi, efek benar/salah) | **expo-av**    | Untuk audio instruksi dan sound effect feedback                            |
| Gambar (ilustrasi objek, huruf, dsb)          | **expo-image** | Loading & caching gambar lebih cepat dibanding `Image` bawaan React Native |
| Font custom (jika perlu font ramah anak)      | **expo-font**  | Untuk load font custom seperti font tebal/bulat yang child-friendly        |

---

## 5. Animasi & Interaksi

| Kebutuhan                                        | Library                                                                          | Keterangan                                                                                              |
| ------------------------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Animasi umum (transisi, tap feedback)            | **react-native-reanimated**                                                      | Performa animasi native, penting untuk transisi terasa halus di HP low-end                              |
| Animasi reward (bintang, karakter melompat)      | **lottie-react-native**                                                          | Render file Lottie (.json) dari LottieFiles untuk animasi reward yang kompleks tanpa perlu bikin manual |
| Drag & drop (untuk modul warna versi drag objek) | **react-native-gesture-handler** (biasanya sudah include lewat reanimated setup) | Menangani gesture drag yang smooth                                                                      |

---

## 6. UI & Styling

| Kebutuhan | Pilihan                                                            | Keterangan                                                                                                                  |
| --------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Styling   | **StyleSheet React Native bawaan**, atau **NativeWind** (opsional) | Untuk MVP, StyleSheet biasa sudah cukup dan lebih ringan; NativeWind bisa dipertimbangkan kalau tim sudah terbiasa Tailwind |
| Icon      | **@expo/vector-icons**                                             | Sudah termasuk dalam Expo, cukup untuk ikon UI orang tua (bukan konten belajar anak)                                        |

---

## 7. Build & Deployment

| Kebutuhan                          | Tools                                                                                                                              | Keterangan                                                                                                                         |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Build APK Android                  | **EAS Build** (`eas build --platform android`)                                                                                     | Cloud build dari Expo, tidak perlu setup Android Studio lokal                                                                      |
| Testing selama development         | **Expo Go** (untuk fitur JS-only) + **Development Build** (kalau sudah pakai library dengan native code seperti reanimated/lottie) | Development build direkomendasikan begitu reanimated & lottie masuk, karena Expo Go standar kadang tidak cover semua native module |
| Distribusi awal (testing internal) | **APK langsung** (share file) atau **Internal Testing Track** di Google Play Console                                               | Tidak perlu publish publik dulu selama masih tahap MVP/testing                                                                     |

---

## 8. Struktur Folder (Diselaraskan dengan expo-router)

```
app/
  (child)/
    _layout.tsx
    index.tsx              // Menu Utama Anak
    colors/
      index.tsx            // Pilih Level - Warna
      [level].tsx           // Layar Soal - Warna
    numbers/
      index.tsx
      [level].tsx
    letters/
      index.tsx
      [level].tsx
  (parent)/
    _layout.tsx
    gate.tsx                // Parental Gate
    dashboard.tsx           // Dashboard Orang Tua
    detail/[module].tsx     // Detail Progres per Modul
  _layout.tsx                // Root layout

components/
  ModuleCard.tsx
  ProgressStar.tsx
  FeedbackAnimation.tsx
  AudioButton.tsx

lib/
  storage.ts                // wrapper AsyncStorage (get/set progres)
  audio.ts                  // helper play suara via expo-av

assets/
  data/
    colors.json
    numbers.json
    letters.json
  images/
  sounds/
  lottie/
```

---

## 9. Ringkasan Dependency Utama (untuk `package.json` nanti)

```
expo
expo-router
expo-av
expo-image
expo-font
react-native-reanimated
react-native-gesture-handler
lottie-react-native
@react-native-async-storage/async-storage
@expo/vector-icons
```

---

## 10. Keputusan Final (Open Questions — Resolved)

1. **Styling: StyleSheet bawaan atau NativeWind?** — ✅ **StyleSheet bawaan React Native.** Untuk MVP dengan ±10-15 screen, StyleSheet sudah cukup. Tidak ada overhead setup tambahan, lebih ringan di bundle size. UI anak yang mostly custom (kartu besar, warna-warni, animasi) tidak banyak diuntungkan oleh utility class Tailwind.

2. **Development Build sejak awal atau Expo Go?** — ✅ **Langsung Development Build sejak awal.** Karena `react-native-reanimated` dan `lottie-react-native` sudah pasti dipakai dan keduanya membutuhkan native module, setup Dev Build sekali di awal menghindari friction migrasi di tengah jalan.

3. **Minimum Android version?** — ✅ **Android 8.0 (API 26 — Oreo).** Cover 95%+ perangkat aktif. Mendukung fitur berguna seperti Adaptive Icons. HP low-end masa kini umumnya sudah Android 10+, jadi API 26 memberikan jaring pengaman yang cukup luas tanpa mengorbankan fitur modern.
