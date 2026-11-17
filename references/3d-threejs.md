# Adegan 3D dengan three.js

Pakai hanya bila user memilih 3D atau campuran, dan hanya untuk adegan yang memang lebih jelas di ruang.

## Aturan isi (explainer, bukan dekorasi)

- **Objek bermakna dan dikenali.** Rakit dari primitif sampai terbaca sebagai benda nyata dari materi (tas, ember berlubang, rak gudang, mesin dan bagiannya, lapisan tanah). Kubus, bola, atau partikel berputar tanpa makna dilarang, begitu juga latar 3D dekoratif.
- **Label di dalam adegan.** Tiap objek penting diberi label: elemen HTML yang diproyeksikan ke posisi objek, dengan garis penunjuk bila perlu.
- **3D harus punya alasan:** struktur berlapis, bagian dalam tersembunyi (cut-away), pandangan terurai (exploded view), aliran di ruang, perbandingan volume. Jika 2D sama jelasnya, pakai 2D dan sebutkan di plan.
- **Kamera ikut menjelaskan.** Tiap tahap boleh menggerakkan kamera dengan tujuan (mendekat, memutar ke sisi tersembunyi, mundur ke gambaran utuh). Tidak ada putaran otomatis terus-menerus.
- **Bertahap dengan panah:** minimal 3 tahap, satu gagasan dan satu keterangan per tahap, tahap terakhir memperlihatkan keseluruhan.

## Integrasi dengan mesin slide

```js
// muat sekali di <head>: <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
let G = null;                                      // state adegan
add(3, {
  title: 'Jadi tas ini sebenarnya berapa?', steps: 5, caps: [/* ... */],
  html: () => head() + '<div class="scene three" id="t3"><canvas></canvas><div class="lbl3"></div><img class="fallback" alt="..." hidden></div>',
  bind: root => { G = make3D(root.querySelector('#t3')); },   // buat renderer, scene, kamera, objek
  step: (s, c) => { G && G.to(STATE[s], c.anim); },          // tween posisi/rotasi/kamera ke target tahap s
  leave: () => { G && G.dispose(); G = null; }               // hentikan loop, dispose geometri/material/renderer
});
```

Aturan teknis:
- Kunci versi three.js (contoh di atas r128 build global). Bila deck harus bisa dibuka offline, sisipkan pustakanya inline.
- Tween antartahap di `requestAnimationFrame`, 0,6–1,2 detik, easing ease-out. Bila `c.anim` false (mode cetak, reduced motion), langsung lompat ke target.
- Warna dari token tema (`getComputedStyle(document.documentElement).getPropertyValue('--accent')`), termasuk mode gelap. Cahaya ambient + satu directional, material rata, tanpa glow.
- Kinerja: satu renderer per adegan, `setPixelRatio(Math.min(devicePixelRatio, 2))`, render hanya saat tween berjalan, ikut ukuran kontainer saat resize.
- `preserveDrawingBuffer:true` supaya PDF dan tangkapan layar menangkap frame.
- Cadangan: bila WebGL tidak tersedia atau reduced motion aktif, tampilkan gambar statis keadaan akhir (SVG 2D atau gambar) dengan label yang sama.

## Uji tambahan

- Kanvas benar-benar tergambar di browser headless (jalankan Chromium dengan `--use-gl=swiftshader` atau `--enable-unsafe-swiftshader` bila perlu).
- Tiap tahap mengubah adegan (bandingkan tangkapan layar tahap awal, tengah, akhir).
- Tiap objek punya label; tidak ada objek abstrak.
- Cadangan statis muncul saat WebGL dimatikan.
