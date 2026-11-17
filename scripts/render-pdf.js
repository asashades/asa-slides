#!/usr/bin/env node
/*
 * Ekspor deck ke PDF: satu halaman 16:9 per slide, tiap slide di tahap terakhir (lengkap),
 * kuis dengan jawaban terbuka, kontrol navigasi/timer disembunyikan. Teks tetap bisa diseleksi.
 *   node render-pdf.js deck.html hasil.pdf
 * Penggabung halaman: pdf-lib (npm) bila terpasang, kalau tidak qpdf atau pdfunite.
 */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs'), os = require('os'), { execFileSync } = require('child_process');
const src = path.resolve(process.argv[2] || 'deck.html'), out = path.resolve(process.argv[3] || src.replace(/\.html?$/, '') + '.pdf');

(async () => {
  const browser = await chromium.launch();
  const p = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await p.emulateMedia({ media: 'screen' });
  await p.goto('file://' + src); await p.waitForTimeout(600);
  await p.evaluate(() => deck.print(true));
  await p.addStyleTag({ content: '@page{size:1280px 720px;margin:0}html,body{height:720px;overflow:hidden}#app{height:720px}' });
  const n = await p.evaluate(() => deck.count());
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'deckpdf-')); const parts = [];
  for (let i = 0; i < n; i++) {
    await p.evaluate(i => deck.go(i, 'last'), i);
    await p.waitForTimeout(250);
    // beri kesempatan adegan 3D/canvas menggambar frame akhir
    await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    const f = path.join(tmp, String(i + 1).padStart(3, '0') + '.pdf');
    await p.pdf({ path: f, width: '1280px', height: '720px', printBackground: true, pageRanges: '1' });
    parts.push(f);
  }
  await browser.close();
  let merged = false;
  try {
    const { PDFDocument } = require('pdf-lib'); const doc = await PDFDocument.create();
    for (const f of parts) { const d = await PDFDocument.load(fs.readFileSync(f)); (await doc.copyPages(d, [0])).forEach(pg => doc.addPage(pg)); }
    fs.writeFileSync(out, await doc.save()); merged = true;
  } catch (e) {}
  if (!merged) { try { execFileSync('qpdf', ['--empty', '--pages', ...parts, '--', out]); merged = true; } catch (e) {} }
  if (!merged) { try { execFileSync('pdfunite', [...parts, out]); merged = true; } catch (e) {} }
  if (!merged) { console.error('Tidak ada penggabung PDF. Pasang salah satu: npm i pdf-lib, qpdf, atau poppler (pdfunite). Halaman terpisah ada di ' + tmp); process.exit(1); }
  console.log(`PDF ${n} halaman: ${out}`);
})();
