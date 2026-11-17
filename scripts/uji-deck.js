#!/usr/bin/env node
/*
 * Uji fungsi deck yang dibangun dari engine-template.html.
 *   node uji-deck.js deck.html
 * Mengecek: error JS/konsol, overflow vertikal tiap slide (tahap terakhir) di 3 ukuran layar,
 * scroll horizontal di lebar HP, navigasi panah (tahap, kuis), menu grid dan lompat nomor.
 * Butuh: playwright (Chromium). Exit code 1 bila ada masalah.
 */
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.resolve(process.argv[2] || 'deck.html');

(async () => {
  const browser = await chromium.launch();
  const errs = new Set(); let problems = 0;
  const open = async (w, h) => {
    const p = await browser.newPage({ viewport: { width: w, height: h } });
    p.on('pageerror', e => errs.add(e.message));
    p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.add(m.text()); });
    p.on('requestfailed', r => { if (!/fonts\.(googleapis|gstatic)\.com/.test(r.url())) errs.add('gagal memuat: ' + r.url()); });
    await p.goto(url); await p.waitForTimeout(500);
    return p;
  };
  const report = (label, list) => { console.log(`${list.length ? 'GAGAL' : 'ok   '}  ${label}${list.length ? ': ' + list.join(', ') : ''}`); problems += list.length; };

  // 1. Overflow vertikal (tahap terakhir tiap slide)
  for (const [w, h] of [[1280, 720], [1366, 768], [1920, 1080]]) {
    const p = await open(w, h);
    const n = await p.evaluate(() => deck.count()); const bad = [];
    for (let i = 0; i < n; i++) {
      await p.evaluate(i => deck.go(i, 'last'), i); await p.waitForTimeout(60);
      const o = await p.evaluate(() => { const s = document.getElementById('stage'); return s.scrollHeight - s.clientHeight; });
      if (o > 4) bad.push(`slide ${i + 1} (+${o}px)`);
    }
    report(`overflow vertikal ${w}x${h}`, bad); await p.close();
  }

  // 2. Lebar HP: tidak boleh ada scroll horizontal
  {
    const p = await open(390, 844); const n = await p.evaluate(() => deck.count()); const bad = [];
    for (let i = 0; i < n; i++) {
      await p.evaluate(i => deck.go(i, 'last'), i); await p.waitForTimeout(40);
      const o = await p.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        let worst = document.documentElement.scrollWidth - vw;
        document.querySelectorAll('#stage *').forEach(e => {
          if (e.closest('.scroll-x') || e.closest('svg')) return;
          const r = e.getBoundingClientRect(); if (r.width && r.right - vw > worst) worst = r.right - vw;
        });
        return Math.round(worst);
      });
      if (o > 2) bad.push(`slide ${i + 1} (+${o}px)`);
    }
    report('scroll horizontal di HP 390px', bad); await p.close();
  }

  // 3. Navigasi panah
  {
    const p = await open(1280, 720); const n = await p.evaluate(() => deck.count()); const bad = [];
    const st = () => p.evaluate(() => deck.state());
    for (let i = 0; i < n; i++) {
      await p.evaluate(i => deck.go(i), i); const s0 = await st();
      if (s0.kind === 'Kuis') {
        await p.keyboard.press('ArrowDown');
        if (!(await p.$('.opt.sel'))) bad.push(`slide ${i + 1}: ↓ tidak menandai pilihan kuis`);
        await p.keyboard.press('ArrowRight');
        if (await p.$eval('.exp', e => e.hidden)) bad.push(`slide ${i + 1}: → tidak membuka jawaban`);
        await p.keyboard.press('ArrowLeft');
        if (!(await p.$eval('.exp', e => e.hidden))) bad.push(`slide ${i + 1}: ← tidak menutup jawaban`);
      } else if (s0.steps > 1) {
        for (let k = 1; k < s0.steps; k++) await p.keyboard.press('ArrowRight');
        const s1 = await st();
        if (s1.idx !== i || s1.step !== s0.steps - 1) bad.push(`slide ${i + 1}: → tidak berhenti di tiap tahap`);
        await p.keyboard.press('ArrowLeft');
        if ((await st()).step !== s0.steps - 2) bad.push(`slide ${i + 1}: ← tidak mundur satu tahap`);
        await p.keyboard.press('ArrowRight');
      }
      if (i < n - 1) {
        if (s0.kind === 'Kuis') await p.keyboard.press('ArrowRight');
        await p.keyboard.press('ArrowRight');
        if ((await st()).idx !== i + 1) bad.push(`slide ${i + 1}: → di tahap terakhir tidak pindah slide`);
      }
    }
    // grid & lompat nomor
    await p.evaluate(() => deck.go(0)); await p.keyboard.press('g');
    if (await p.$eval('#gridv', e => e.hidden)) bad.push('tombol G tidak membuka grid');
    await p.keyboard.type(String(n)); await p.keyboard.press('Enter');
    if ((await st()).idx !== n - 1) bad.push('ketik nomor + Enter di grid tidak melompat');
    await p.keyboard.type('1'); await p.keyboard.press('Enter');
    if ((await st()).idx !== 0) bad.push('ketik nomor + Enter di luar grid tidak melompat');
    report('navigasi panah, kuis, grid', bad); await p.close();
  }

  report('error JS/konsol', [...errs]);
  await browser.close();
  console.log(problems ? `\n${problems} masalah ditemukan.` : '\nSemua uji lolos.');
  process.exit(problems ? 1 : 0);
})();
