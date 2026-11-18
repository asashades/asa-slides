# Katalog explainer animation

Explainer = **motion graphic: adegan gambar (SVG untuk 2D, three.js untuk 3D) yang objeknya bergerak atau berubah untuk memperlihatkan mekanisme**. Teks atau kartu yang sekadar muncul satu per satu bukan explainer.

Dipakai di Fase 3 (pilih explainer): untuk tiap konsep kunci materi, agen merekomendasikan 2–3 kode dari katalog ini beserta alasannya, user memilih.

## Kode explainer

| Kode | Nama | Cocok untuk konsep yang… | Gerak utama | 2D / 3D |
|---|---|---|---|---|
| E1 | Bongkar benda (exploded view) | tersusun dari komponen | bagian terlepas dan melayang, diberi label | 3D lebih kuat |
| E2 | Menara proporsi | komposisi angka, porsi | balok/batang bertumpuk tumbuh, kurung total tergambar | 2D atau 3D |
| E3 | Alur dengan token bergerak | berupa proses berurutan | token berpindah antartahap, garis penghubung tergambar | 2D |
| E4 | Sortir ke kotak | klasifikasi, memilah | item berjalan ke kotak kategori, yang salah tercoret | 2D |
| E5 | Bejana dan aliran | akumulasi, persediaan, kebocoran | isi naik/turun, aliran masuk/keluar, tetes bocor | 2D atau 3D |
| E6 | Kurva menggambar sendiri | perilaku terhadap variabel, tren | garis tergambar, titik bergerak di sumbu | 2D |
| E7 | Timbangan | trade-off, titik impas | lengan miring sesuai beban yang ditambah | 2D |
| E8 | Gunung es / tersingkap | yang terlihat vs tersembunyi | kabut memudar lapis demi lapis | 2D |
| E9 | Struk terisi | hitungan bertahap | baris struk muncul, angka total berjalan | 2D |
| E10 | Split sebelum/sesudah | perbandingan skenario | dua panel berubah bersamaan, selisih disorot | 2D |
| E11 | Irisan hidup | konsep yang tumpang tindih | dua bingkai bergeser hingga beririsan, irisan menyala | 2D atau 3D |
| E12 | Pohon tumbuh | taksonomi, peta konsep | cabang tumbuh dari akar ke daun | 2D |
| E13 | Tokoh dan analogi | analogi, cerita, sebab-akibat sehari-hari | tokoh berubah ekspresi/keadaan, objek di sekitarnya berubah | 2D |
| **Grafik hidup** | | | | |
| E14 | Corong (funnel) | tahapan yang menyusut (pembeli, proses seleksi) | titik jatuh, sebagian keluar di tiap lapis, angka lapis berjalan | 2D |
| E15 | Waterfall | perubahan nilai dari awal ke akhir | batang naik/turun berurutan, garis penghubung | 2D |
| E16 | Pareto | sedikit penyebab, dampak besar | batang terurut tumbuh, garis kumulatif tergambar ke 80% | 2D |
| E17 | Piktogram (unit chart) | proporsi yang perlu terasa nyata | 100 ikon, sebagian berubah warna/pergi | 2D |
| E18 | Donat mengisi | komposisi persen | potongan tumbuh satu per satu, persen berjalan | 2D |
| E19 | Batang berubah antarperiode | perubahan peringkat/nilai waktu ke waktu | batang memanjang/memendek dan bertukar urutan | 2D |
| E20 | Sankey | aliran nilai yang bercabang | pita tergambar dengan lebar sesuai nilai | 2D |
| E21 | Gauge | satu indikator terhadap batas aman | jarum berputar ke zona merah/kuning/hijau | 2D |
| **Proses dan sistem** | | | | |
| E22 | Siklus berputar | proses berulang (PDCA, siklus akuntansi) | tahap menyala bergiliran, panah melingkar | 2D |
| E23 | Fishbone tumbuh | akar penyebab per kategori | tulang utama tergambar, cabang 6M muncul | 2D |
| E24 | Antrian | kedatangan, layanan, bottleneck | pelanggan datang, antre, dilayani, antrean berubah | 2D |
| E25 | Denah aliran material | tata letak, jarak perpindahan | garis aliran menggambar di atas denah, jarak dijumlah | 2D atau 3D |
| E26 | Gantt bergerak | penjadwalan, jalur kritis | batang tugas muncul, garis hari ini bergeser | 2D |
| E27 | Roda gigi | ketergantungan antarbagian | satu gigi memutar gigi lain | 2D atau 3D |
| **Perbandingan dan keputusan** | | | | |
| E28 | Matriks 2×2 | klasifikasi dua kriteria | titik berpindah ke kuadran | 2D |
| E29 | Domino sebab-akibat | rantai dampak | keping jatuh berurutan | 2D atau 3D |
| E30 | Zoom bertingkat | hubungan makro ke mikro | kamera memperbesar bertahap ke detail | 2D atau 3D |

## Contoh pemetaan (materi biaya produksi)

| Konsep | Rekomendasi |
|---|---|
| Biaya apa saja dari satu tas | E1 tas terurai (3D) atau E12 pohon biaya |
| Nota mana yang ikut biaya produksi | E4 sortir nota |
| Biaya produksi vs biaya periode | E5 dua bejana (persediaan vs laba rugi) |
| FOH tetap vs variabel | E6 kurva terhadap volume |
| Prime cost dan conversion cost | E11 irisan DL, atau E2 menara 3D dengan dua bingkai |
| Biaya per tas bila produksi naik | E10 500 vs 800 tas |

## Resep E14–E30

Kode ini belum punya demo di galeri; bangun langsung dari resep berikut. Semua angka di demo/latihan diberi label ilustrasi kecuali berasal dari materi.

- **E14 Corong.** Trapesium bertumpuk (satu `path` per lapis, lebar sebanding nilai). Tahap: lapis demi lapis muncul; di tiap tahap sekelompok titik (`circle` kecil dengan `data-move`) keluar ke samping berwarna `--bad` dengan label jumlah yang hilang; angka lapis pakai `count()`. Tahap akhir: sorot lapis dengan kebocoran terbesar (`data-now`).
- **E15 Waterfall.** Batang awal penuh, lalu batang mengambang untuk tiap pengurang/penambah (`.grow-y`; pengurang tumbuh ke bawah dengan `transform-origin` atas), garis putus penghubung `.draw` antarbatang, batang akhir berwarna beda. Satu pos per tahap.
- **E16 Pareto.** Batang diurutkan dari terbesar, tumbuh bergiliran (`.grow-y` + stagger), lalu garis kumulatif `.draw` dengan titik per batang, garis horizontal 80%, dan batang yang masuk 80% disorot.
- **E17 Piktogram.** Grid 10×10 ikon (`<use href="#fa-user">` atau `rect`), warna netral. Tiap tahap mengubah warna sekelompok ikon atau menggeser keluar (`data-move`), angka grup berjalan. Hindari lebih dari 3 warna.
- **E18 Donat.** Lingkaran `stroke` dengan `pathLength="100"`, tiap potongan pakai `stroke-dasharray:"p 100"` dan `stroke-dashoffset` kumulatif; tumbuh lewat transisi dasharray dari 0. Label persen di luar donat, total di tengah dengan `count()`.
- **E19 Batang antarperiode.** Batang horizontal dengan label; tiap tahap = satu periode: lebar diubah (`transform:scaleX`) dan posisi y ditukar (`transform:translateY`) sesuai peringkat. Label periode besar di sudut.
- **E20 Sankey.** Simpul kiri→kanan, pita berupa `path` kurva dengan `stroke-width` sebanding nilai, digambar `.draw` per cabang per tahap. Warna pita mengikuti kategori tujuan. Batasi 2 tingkat, maksimal ±8 pita.
- **E21 Gauge.** Busur setengah lingkaran dibagi zona `--bad`/`--warn`/`--good`, jarum `line` diputar dengan `transform:rotate()` per tahap (`transform-origin` di pusat), angka di bawah jarum berjalan. Satu tahap per skenario.
- **E22 Siklus.** 4–6 simpul di lingkaran, panah busur antarsimpul `.draw`. Tiap tahap menyalakan satu simpul (`data-now`) dan menggambar panah ke simpul berikutnya; tahap akhir menutup lingkaran dan memberi tanda putaran berikutnya.
- **E23 Fishbone.** Kepala (masalah) di kanan, tulang utama `.draw`, lalu tiap tahap satu kategori (Man, Machine, Method, Material, Measurement, Environment) dengan 1–3 penyebab sebagai ranting. Tahap akhir menyorot akar yang dipilih.
- **E24 Antrian.** Pintu masuk, jalur antre, loket. Pelanggan (ikon/`circle`) muncul dan bergeser ke posisi antre (`data-move`); tahap berikut menambah loket atau mempercepat layanan sehingga antrean memendek. Tampilkan angka waktu tunggu yang berubah.
- **E25 Denah aliran.** Denah sederhana dari `rect` stasiun berlabel. Garis aliran barang `.draw` mengikuti urutan proses; tahap pembanding menampilkan tata letak baru dengan garis lebih pendek, total jarak dihitung dengan `count()`.
- **E26 Gantt.** Sumbu waktu, baris tugas, batang `.grow-x` muncul berurutan sesuai dependensi, panah dependensi `.draw`, garis "hari ini" bergeser (`data-move`), jalur kritis disorot `--bad`.
- **E27 Roda gigi.** Gigi dari `path` bergigi berlabel bagian sistem; tiap tahap memutar gigi berikutnya (`transform:rotate` dengan arah berlawanan dan rasio ukuran). Animasi putar boleh berulang hanya saat tahapnya aktif; beri `data-slop-ok="infinite-animation"`.
- **E28 Matriks 2×2.** Dua sumbu berlabel, empat kuadran dengan nama. Item (`circle` + label) mulai di luar, lalu tiap tahap memindahkan satu item ke posisinya (`data-move`); tahap akhir menyorot kuadran prioritas.
- **E29 Domino.** Deretan keping berlabel sebab-akibat. Tiap tahap merobohkan satu keping (`transform:rotate` dengan `transform-origin` di sudut bawah) dan menampilkan dampaknya. Tahap akhir: keping pertama diberi label akar.
- **E30 Zoom.** Satu SVG besar berisi beberapa tingkat detail; tiap tahap mengubah `viewBox` (tween di `step()` dengan `requestAnimationFrame`) atau `transform:scale` grup ke area yang dibahas. Tingkat yang tidak aktif diredupkan.

## Koreografi Imersif, Metafora Objek Fisik & Brainstorming Kreatif

Kode `E1–E30` adalah **kosakata gerak dasar**, bukan satu-satunya adegan yang kaku. Untuk membuat explainer yang imersif dan berkelas (*high-craft*), agen harus merancang **koreografi cerita visual** yang menggabungkan beberapa teknik gerak sekaligus.

### 1. Prinsip "Benda Nyata & Metafora Fisik, Bukan Kotak + Teks"
Jangan pernah menggambar konsep abstrak hanya dengan kotak berlabel dan panah datar. Ubah input, proses, dan output menjadi **benda fisik yang bentuk dan mekanismenya langsung menceritakan konsep** meski seluruh teks dihapus:

- **Contoh A (Klasifikasi Pembatasan Dana / 4 Transaksi -> 2 Wadah Kontras):**
  Empat jenis transaksi ditampilkan sebagai 4 ilustrasi objek nyata yang bergerak satu per satu (`--i` stagger + `data-move`) menuju 2 wadah yang bentuk fisiknya berbeda kontras: **Kotak A (Tanpa Pembatasan)** digambar sebagai **1 peti kayu besar terbuka lebar** (dana bebas dipakai), sedangkan **Kotak B (Dengan Pembatasan)** digambar sebagai **3 kotak kecil terkunci gembok / bersekat** (tiap dana terikat peruntukannya).
- **Contoh B (Digitalisasi e-Arsip -> 3 Laporan Standar ISAK):**
  Rantai koreografi 3 babak lintas zona: **(1)** HP memotret struk fisik dengan kilatan blitz kamera (`.only` + `scale`) -> **(2)** Struk terlipat menjadi **pesawat kertas** yang terbang mengikuti kurva lintasan (`.draw` + translasi `[data-s]`) -> **(3)** Pesawat masuk ke celah **mesin printer** yang langsung mencetak keluar **3 lembar Laporan Standar ISAK** satu per satu (`--i` stagger + *paint order* DOM).
- **Contoh C (Aliran Biaya Produksi / Harga Pokok Pesanan):**
  Peti biaya berjalan di atas sabuk konveyor masuk ke mulut mesin cetak beroda gigi berputar (`rotate`), memompa dua pita Sankey (`.draw`) ke rak Produk Jadi (HPP) dan meja WIP, sementara balok biaya jatuh menumpuk proporsional (`.blk`) berdampingan dengan Kartu Harga Pokok (`count()`).

### 2. Arsitektur Panggung Lebar Multi-Zona (`viewBox="0 0 1040 336"`)
Hindari kanvas sempit (`360×210`) yang hanya berisi satu objek di tengah. Gunakan panggung lebar (`viewBox="0 0 1040 336"`) yang dibagi menjadi 3 zona cerita:
- **Zona 1 (Pemicu / Input Fisik + Karakter Opsional):** Posisi awal objek nyata (dokumen, struk, HP, transaksi, peti bahan) dan karakter pemandu yang berganti pose tiap tahap (`data-now` + `.only`).
- **Zona 2 (Transmisi / Alat Proses / Skala Proporsional):** Wadah atau mesin transformasi (pesawat kertas terbang, sabuk konveyor, mesin beroda gigi, timbangan miring, menara balok proporsional).
- **Zona 3 (Wadah Muara / Output & Ringkasan Angka):** Wadah kontras (peti besar vs 3 kotak kecil terkunci, mesin printer yang mengeluarkan 3 lembar laporan, rak hasil + kartu angka `count()`).

### 3. Rantai Gerak Simultan per Tekanan Panah (`→`)
Setiap tahap panah (`→`) sebaiknya memicu **minimal 3 reaksi visual sekaligus**, bukan hanya satu elemen fade-in:
$$\text{Benda bergerak/berubah wujud } (\texttt{data-move} / \texttt{[data-s]}) \rightarrow \text{Alat/wadah bereaksi } (\text{gigi berputar, blitz menyala, tutup terbuka}) \rightarrow \text{Output/grafik/angka tumbuh beruntun } (\texttt{--i}, \texttt{.draw}, \texttt{.grow-y}, \texttt{count()})$$

### 4. Panduan Brainstorming Kreatif untuk Agen (4 Pertanyaan Pemicu Imajinasi)
Di Fase 3, sebelum memilih kode `E1–E30`, ajukan 4 pertanyaan ini pada tiap konsep kunci lalu usulkan minimal **2 opsi koreografi** ke user:
1. **Wujud fisik input:** Jika konsep ini benda nyata di meja kerja, apa wujudnya? (mis. 4 transaksi berbeda, struk belanja, bahan baku, kartu jam kerja).
2. **Kontras bentuk wadah:** Bagaimana bentuk wadahnya bisa memvisualkan aturan konsep? (mis. 1 peti besar terbuka vs 3 kotak kecil terkunci; timbangan berat sebelah vs seimbang; tangki bocor vs tangki penuh).
3. **Kendaraan/transmisi antar-zona:** Apa yang mengantarkan perubahan dari kiri ke kanan? (mis. blitz HP $\rightarrow$ pesawat kertas terbang $\rightarrow$ printer; sabuk konveyor $\rightarrow$ mesin; derek; pita Sankey).
4. **Reaksi mekanis di muara akhir:** Saat objek tiba, apa reaksi alat atau angkanya? (printer mencetak 3 lembar laporan satu per satu, roda gigi memutar jarum, gembok menutup, angka `count()` berdetak naik).

## Syarat minimum per deck

- Tiap bagian punya minimal satu adegan explainer; keseluruhan deck minimal satu adegan per 4–5 slide. Konsep yang diminta user wajib dianimasikan.
- Tiap adegan minimal 3 tahap, minimal 2–3 jenis gerak simultan per tahap, dan memadukan benda fisik/metafora dengan mekanisme kuantitatif atau alur.
- Satu tahap = satu gagasan = satu rantai perubahan visual jelas + satu kalimat keterangan. Tahap terakhir memperlihatkan gambar lengkap (dipakai PDF).
- Uji mandiri: hapus semua teks keterangan, gambarnya masih harus bercerita.
- Jika dua slide menjelaskan gagasan yang sama, gabungkan jadi satu adegan bertahap.

## Template storyboard (dipakai di plan)

Sertakan per adegan: **Metafora objek fisik (Input -> Transmisi/Alat -> Output)**, kombinasi kode explainer, 2D/3D, intensitas (halus/sedang/ramai), karakter pemandu (ya/tidak), dan untuk 3D alasan kenapa ruang membantu.

| Tahap | Rantai gerak simultan (objek, alat, grafik, angka) | Keterangan (satu kalimat) |
|---|---|---|
| 0 | Keadaan awal: panggung, objek input fisik, dan wadah tampil | … |
| 1 | … | … |
| … | … | … |
| akhir | Gambar lengkap & seluruh angka akhir | Kesimpulan adegan |

## Teknik gerak (lihat juga mesin-slide.md)

- Menggambar garis: `.draw` + `pathLength="1"`.
- Tumbuh/menyusut: `.grow-y`, `.grow-x`, atau `transform:scale` dengan `transform-box:fill-box`.
- Berpindah: `transform:translate(...)` dipicu `.on`.
- Menyingkap: lapisan penutup memudar (`opacity`) per tahap.
- Berubah keadaan: warna/bentuk/ekspresi berganti; sorot dengan `data-now`.
- Angka bergerak: `count()` di `step(s, ctx)`.
- Berurutan: `transition-delay` bertingkat (`style="--d:.2s"` lalu `transition-delay:var(--d)`).
- Gerak hidup kecil (intensitas sedang/ramai): `@keyframes` berulang hanya bila bermakna (tetes, riak). Beri `data-slop-ok="infinite-animation"`.

Intensitas: halus ±0,4 detik dan sedikit objek; sedang ±0,6–0,8 detik; ramai sampai 1,2 detik dengan stagger dan gerak hidup.

## Galeri contoh

`assets/galeri-explainer.html` berisi demo mini E1–E13 (2D) plus E1 versi 3D (three.js). E14–E30 belum punya demo: saat merekomendasikannya, jelaskan geraknya dalam satu kalimat dari tabel di atas. Tiap demo berputar otomatis dan bisa dijalankan per tahap dengan panah. Di Fase 3:
- Agen dengan alat publikasi halaman (mis. Artifact): terbitkan galeri lalu kirim tautannya bersama tabel rekomendasi.
- Agen lain: kirim file `galeri-explainer.html` sebagai lampiran; user membukanya di browser (demo 3D butuh internet untuk memuat three.js).

Saat membangun deck, salin SVG dan CSS demo yang dipilih sebagai titik awal adegan, lalu ganti isi, label, dan jumlah tahap sesuai storyboard. Atribut `data-from`, `data-to`, `data-move`, `data-now` + `.only`, dan kelas `.draw`/`.grow-y` di galeri sama persis dengan engine. Satu bedanya: galeri memakai `.stage[data-s="n"]` untuk keadaan per tahap; di engine setel `c.root.dataset.s = s` di `step(s, c)` lalu tulis selektornya sebagai `.sl[data-s="n"] ...`.
