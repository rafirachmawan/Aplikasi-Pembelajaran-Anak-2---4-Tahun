# PRD — Aplikasi Pembelajaran Anak Pra-Sekolah

**Versi:** 0.1 (Draft MVP)
**Tanggal:** 8 Agustus 2026
**Platform:** Android (via Expo / React Native)
**Status:** Draft — beberapa keputusan masih perlu dikonfirmasi (lihat bagian _Open Questions_)

---

## 1. Latar Belakang & Tujuan

Aplikasi ini dibuat untuk membantu orang tua memberikan stimulasi belajar dasar kepada anak usia pra-sekolah (2–4 tahun) melalui aktivitas interaktif yang sederhana, menyenangkan, dan bisa dilakukan mandiri di rumah tanpa koneksi internet.

**Tujuan utama:**

- Mengenalkan konsep dasar (warna, angka, huruf) kepada anak usia 2–4 tahun melalui interaksi sentuh yang sederhana.
- Memberi orang tua alat bantu belajar yang aman, ringan, dan mudah digunakan tanpa perlu pengawasan teknis yang rumit.

**Tujuan non-fungsional:**

- Aplikasi berjalan sepenuhnya offline (tanpa backend/cloud) untuk versi MVP.
- **Tanpa login/akun.** Aplikasi langsung bisa dipakai setelah dipasang, tanpa proses pendaftaran atau autentikasi apa pun.
- **1 aplikasi = 1 profil anak.** Tidak ada konsep multi-akun atau multi-profil; data yang tersimpan di perangkat berlaku untuk satu anak yang menggunakan aplikasi tersebut.
- Aman untuk anak (tidak ada iklan, tidak ada tautan keluar aplikasi, tidak ada pembelian dalam aplikasi yang bisa diakses anak).

---

## 2. Target Pengguna

| Peran                | Deskripsi                                                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Anak (2–4 tahun)** | Pengguna utama konten belajar. Belum bisa membaca, interaksi terbatas pada tap/drag sederhana, membutuhkan instruksi audio. |
| **Orang tua**        | Mengelola aplikasi: memasang, mengatur profil anak, memantau progres, membuka/menutup akses ke mode anak.                   |

---

## 3. Ruang Lingkup MVP (Versi 1)

### 3.1 Masuk dalam Scope

- Mode Anak dengan 3 modul belajar inti: **Warna**, **Angka (1–10)**, **Huruf (A–Z)**
- Mode Orang Tua dengan gerbang kunci sederhana (parental gate)
- Penyimpanan progres secara lokal di perangkat (offline)
- Feedback interaktif (suara + animasi) saat anak menjawab benar/salah
- Dashboard progres dasar untuk orang tua

### 3.2 Di Luar Scope (MVP)

- Backend/cloud, sinkronisasi antar perangkat
- Sistem kesulitan adaptif (penyesuaian otomatis berdasarkan performa anak)
- Konten tambahan di luar 3 modul inti (misal: bentuk, hewan, puzzle)
- Artikel/tips parenting
- Monetisasi (iklan, in-app purchase)

> **Catatan:** Aplikasi memang didesain **tanpa login dan tanpa multi-profil** sejak awal (bukan sekadar "belum termasuk" — ini keputusan produk). Satu instalasi aplikasi = satu anak.

---

## 4. Fitur Utama

### 4.1 Mode Anak (Child Mode)

**Menu Utama Anak**

- Tampilan 3 kartu besar berwarna-warni: Warna, Angka, Huruf
- Anak bebas memilih modul mana saja tanpa urutan wajib (free-choice, bukan alur harian terstruktur)
- Tidak ada teks panjang; navigasi berbasis ikon dan warna

**Modul: Kenal Warna**

- Anak diminta menyentuh warna yang disebutkan lewat instruksi suara ("Sentuh yang berwarna merah!")
- Variasi: drag objek ke wadah dengan warna yang sesuai
- 5–10 pertanyaan per level, beberapa level dengan warna berbeda

**Modul: Kenal Angka**

- Mengenali angka 1–10 lewat tap
- Menghitung jumlah objek di layar dan mencocokkan dengan angka
- 5–10 pertanyaan per level

**Modul: Kenal Huruf**

- Mengenali huruf A–Z lewat tap
- Mencocokkan huruf dengan gambar (misal: "A" dengan gambar Ayam)
- 5–10 pertanyaan per level

**Feedback Sistem**

- Jawaban benar: animasi (bintang/karakter lucu) + suara positif ("Yeay! Pintar!")
- Jawaban salah: tidak ada hukuman, cukup dorongan lembut untuk coba lagi ("Coba lagi ya!")
- Level statis (tidak ada penyesuaian kesulitan otomatis di MVP)

### 4.2 Mode Orang Tua (Parent Mode)

**Parental Gate**

- Soal sederhana (misal operasi hitung dasar) sebagai gerbang sebelum masuk mode orang tua, agar anak tidak bisa mengakses sendiri

**Dashboard Progres**

- Menampilkan modul apa saja yang sudah dicoba anak
- Menampilkan level tertinggi yang sudah diselesaikan per modul
- Data bersifat lokal, tanpa login, khusus untuk 1 anak yang menggunakan aplikasi di perangkat tersebut

---

## 5. Alur Pengguna (User Flow) Ringkas

```
Buka Aplikasi
   └─ Menu Utama Anak (default)
         ├─ Pilih Modul Warna/Angka/Huruf → Level → Soal → Feedback → kembali ke menu modul
         └─ Tombol "Orang Tua" (kecil, di pojok) → Parental Gate → Dashboard Orang Tua
```

---

## 6. Kebutuhan Teknis (High-Level)

| Kebutuhan         | Pendekatan                                   |
| ----------------- | -------------------------------------------- |
| Framework         | Expo (React Native), target Android          |
| Navigasi          | expo-router                                  |
| Penyimpanan lokal | @react-native-async-storage/async-storage    |
| Audio             | expo-av                                      |
| Animasi           | react-native-reanimated, lottie-react-native |
| Gambar            | expo-image                                   |
| Backend           | Tidak ada (offline-only untuk MVP)           |

---

## 7. Kriteria Sukses MVP

- Anak dapat menyelesaikan minimal 1 level di masing-masing dari 3 modul tanpa bantuan orang tua untuk memahami instruksi (audio-first design berhasil)
- Orang tua dapat melihat progres anak di dashboard tanpa kebingungan
- Aplikasi tetap berfungsi penuh tanpa koneksi internet
- Tidak ada crash pada interaksi utama (tap, drag, transisi antar layar)

---

## 8. Keputusan Final (Open Questions — Resolved)

1. **Alur sesi belajar** — ✅ **Free-choice.** Anak bebas memilih modul mana saja tanpa urutan wajib. Alasan: anak usia 2–4 tahun bersifat mood-driven dengan attention span pendek, pendekatan free-choice lebih sesuai dengan prinsip play-based learning.

2. **Kesulitan level** — ✅ **Statis untuk MVP.** Level tidak menyesuaikan otomatis berdasarkan performa anak. Sistem kesulitan adaptif direncanakan untuk v2, menggunakan data progres yang terkumpul dari MVP sebagai dasar desain.

3. **Batas waktu layar (screen time limit)** — ✅ **Tidak termasuk MVP.** Akan ditambahkan di v1.1 sebagai fitur pengingat lembut setelah 15 menit (bukan hard-lock). Alasan: menambah kompleksitas yang tidak menguji hipotesis utama MVP, tetapi menjadi prioritas tinggi di update awal karena concern orang tua terhadap screen time.

4. **Sumber aset final** — ✅ **Diputuskan per kategori:**

   | Jenis Aset | Sumber | Alasan |
   |---|---|---|
   | Ilustrasi objek (buah, hewan, dsb) | Freepik / Flaticon | Konsisten style, banyak pilihan flat/cute |
   | Suara instruksi (narasi Bahasa Indonesia) | ElevenLabs TTS | Kualitas natural, generate variasi cepat |
   | Sound effect (benar/salah/perayaan) | Freesound / Pixabay Audio | Gratis, banyak SFX ramah anak |
   | Animasi reward (bintang, confetti) | LottieFiles | Siap pakai format Lottie, sesuai tech stack |
   | Ikon UI | @expo/vector-icons (built-in) | Sudah include di Expo |

---

## 9. Roadmap Post-MVP

| Versi | Fitur | Catatan |
|---|---|---|
| v1.1 | Pengingat screen time (15 menit) | Reminder lembut, bukan hard-lock |
| v2 | Sistem kesulitan adaptif | Berdasarkan data progres MVP |
| v2 | Tombol reset progres di Dashboard Orang Tua | Dengan konfirmasi berlapis (parental gate + ketik "RESET") |
| v2 | Modul tambahan (bentuk, hewan, puzzle) | Perluasan konten di luar 3 modul inti |

---

## 10. Rencana Selanjutnya

1. ~~Finalisasi keputusan pada Open Questions~~ ✅ Selesai
2. Setup project Expo + struktur folder
3. Kumpulkan aset minimal (10 warna, 10 angka, 10 huruf sample) untuk mulai development modul pertama (disarankan mulai dari modul Warna sebagai modul percontohan)
4. Development iteratif per modul
