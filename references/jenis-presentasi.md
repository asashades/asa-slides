# Jenis presentasi

Tanyakan jenisnya di Fase 2. Jenis menentukan nama bagian (`DECK.sections`), default kuis dan timer, serta nada isi. Semua default boleh diubah user.

| Jenis | Bagian (usulan proporsi menit) | Kuis/latihan | Timer |
|---|---|---|---|
| Kuliah | Pembuka 10–15%, Inti 65–70%, Penutup 15–20% | Ya: kuis kilat di akhir tiap konsep besar | Ya |
| Pelatihan | Pembuka, Konsep, Praktik, Penutup | Ya: latihan dengan hitung mundur, polling | Ya |
| Presentasi project | Masalah 15%, Pendekatan 30%, Hasil 35%, Dampak dan langkah lanjut 20% | Tidak | Opsional |
| Sidang atau seminar skripsi | Latar belakang dan rumusan masalah, Tinjauan dan metode, Hasil dan pembahasan, Kesimpulan dan saran, Cadangan | Tidak | Ya, sesuai batas waktu |

## Presentasi project

- Buka dengan masalah atau angka hasil yang paling kuat, bukan agenda.
- Explainer dipakai untuk cara kerja (alur, arsitektur, perbandingan sebelum/sesudah) dan hasil (angka, tren), bukan sebagai hiasan.
- Tutup dengan keputusan atau permintaan yang jelas: apa yang diminta dari audiens.

## Sidang atau seminar skripsi

- Isi hanya dari naskah: angka, tabel, dan kutipan mengikuti naskah. Jangan menambah klaim, dan beri label "ilustrasi" pada contoh buatan.
- Satu slide kira-kira 1,5–2 menit. Metode dan alur analisis cocok untuk E3, E22, E23; hasil untuk E2, E6, E10, E15, E16.
- Bagian "Cadangan" (beri `min:1` agar tampil di progres) memuat data pendukung, asumsi, batasan, dan jawaban untuk pertanyaan yang sudah bisa diduga. Dibuka lewat menu grid (G) atau ketik nomor lalu Enter, jadi tidak mengganggu alur utama.
- Slide terakhir sebelum Cadangan: kesimpulan yang menjawab rumusan masalah satu per satu, lalu saran. Tanpa kuis, tanpa slide "terima kasih" kosong.

## Isi `DECK` per jenis

| Kolom | Kuliah / pelatihan | Presentasi project | Sidang / seminar |
|---|---|---|---|
| `course` | nama mata kuliah atau pelatihan | nama project | judul skripsi (ringkas) |
| `meeting` | Pertemuan n | Presentasi project | Sidang skripsi |
| `presenter` | nama dosen atau pemateri | nama presenter | nama mahasiswa |
| `timer` | `true` | `true` atau `false` | `true` |

Ganti label "Dosen" di slide sampul sesuai jenis (Pemateri, Presenter, Mahasiswa).
