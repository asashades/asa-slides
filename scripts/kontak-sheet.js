#!/usr/bin/env node
/*
 * Tangkapan layar semua slide (tahap terakhir) disusun jadi lembar kontak, untuk dicek mata.
 *   node kontak-sheet.js deck.html folder-output [dark]
 * Hasil: folder-output/sheet-1.png, sheet-2.png, ... (6 slide per lembar)
 */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const src = path.resolve(process.argv[2] || 'deck.html'), dir = path.resolve(process.argv[3] || 'kontak'), dark = process.argv[4] === 'dark';
(async () => {
  fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.goto('file://' + src); await p.waitForTimeout(600);
  if (dark) await p.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  const n = await p.evaluate(() => deck.count()); const shots = [];
  for (let i = 0; i < n; i++) {
    await p.evaluate(i => deck.go(i, 'last'), i); await p.waitForTimeout(300);
    shots.push((await p.screenshot({ type: 'jpeg', quality: 80 })).toString('base64'));
  }
  const q = await b.newPage({ viewport: { width: 1280, height: 1080 } });
  for (let g = 0; g < n; g += 6) {
    const cells = shots.slice(g, g + 6).map((s, k) => `<figure><img src="data:image/jpeg;base64,${s}"><figcaption>${g + k + 1}</figcaption></figure>`).join('');
    await q.setContent(`<style>body{margin:0;background:#888;display:grid;grid-template-columns:1fr 1fr;gap:4px;font:600 14px sans-serif}figure{margin:0;position:relative}img{width:100%;display:block}figcaption{position:absolute;left:6px;top:6px;background:#000;color:#fff;padding:2px 6px}</style>${cells}`);
    await q.screenshot({ path: path.join(dir, `sheet-${g / 6 + 1}.png`), fullPage: true });
  }
  await b.close(); console.log(`Lembar kontak di ${dir}`);
})();
