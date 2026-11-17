#!/usr/bin/env node
/* Rekam tiap kartu demo di galeri-explainer.html menjadi GIF (untuk README GitHub).
   Pakai:  node scripts/rekam-gif.js <galeri.html> <folder-keluar> [--lebar=560] [--fps=12]
   Butuh: Node, Playwright, ffmpeg. Opsional: FONT_DIR (folder node_modules/@fontsource) dan THREE_JS (path three.min.js)
   bila jaringan ke Google Fonts / cdnjs diblokir. */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

const [,, src, out, ...rest] = process.argv;
if (!src || !out) { console.error('pakai: node rekam-gif.js galeri.html folder-keluar [--lebar=560] [--fps=12]'); process.exit(1); }
const opt = Object.fromEntries(rest.map(a => a.replace(/^--/, '').split('=')));
const W = +(opt.lebar || 560), FPS = +(opt.fps || 12), STEP_MS = +(opt.langkah || 1500), HOLD_MS = +(opt.tahan || 1400);
fs.mkdirSync(out, { recursive: true });

const FONTS = [
  ['Bricolage Grotesque', 'bricolage-grotesque', [600, 700]],
  ['Plus Jakarta Sans', 'plus-jakarta-sans', [400, 500, 600, 700]],
  ['JetBrains Mono', 'jetbrains-mono', [500, 600]],
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();

  if (process.env.FONT_DIR) {
    await page.route(/fonts\.googleapis\.com\/css2/, r => r.fulfill({ contentType: 'text/css', body: FONTS.flatMap(([fam, slug, ws]) => ws.map(w =>
      `@font-face{font-family:'${fam}';font-weight:${w};font-style:normal;src:url(https://fonts.local/${slug}-${w}.woff2) format('woff2')}`)).join('\n') }));
    await page.route(/fonts\.local\//, r => {
      const f = r.request().url().split('/').pop(), slug = f.replace(/-\d+\.woff2$/, ''), w = f.match(/-(\d+)\.woff2$/)[1];
      r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(path.join(process.env.FONT_DIR, slug, 'files', `${slug}-latin-${w}-normal.woff2`)) });
    });
    await page.route(/fonts\.gstatic\.com/, r => r.abort());
  }
  if (process.env.THREE_JS) await page.route(/three\.min\.js/, r => r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(process.env.THREE_JS) }));

  await page.goto('file://' + path.resolve(src), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: '.demo .use,.demo .ctl .ib{display:none!important}.demo .ctl{border-top:0!important}.demo{border-radius:14px}' }); // tombol dan teks bantu tidak ikut GIF
  await page.click('#allBtn');                       // matikan putar otomatis, kita yang menggerakkan
  const n = await page.locator('.demo').count();
  const list = [];

  for (let i = 0; i < n; i++) {
    const card = page.locator('.demo').nth(i);
    await card.scrollIntoViewIfNeeded();
    const code = (await card.locator('.code').innerText()).trim().toLowerCase();
    const is3d = await card.getAttribute('data-3d');
    const name = code + (is3d ? '-3d' : '');
    const steps = +(await card.getAttribute('data-steps'));
    const title = (await card.locator('h2').innerText()).trim();
    const dim = (await card.locator('.dim').innerText()).trim();
    if (is3d) await page.waitForTimeout(900);
    // kembali ke tahap 0
    for (let k = 0; k < steps; k++) { const s = await card.evaluate(e => e.s); if (s === 0) break; await card.evaluate(e => e.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))); }
    await page.mouse.move(0, 0);
    const dir = path.join(out, '_f_' + name); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
    const frames = []; let t0 = Date.now(), last = t0;
    const grab = async () => { const f = path.join(dir, String(frames.length).padStart(4, '0') + '.png'); await card.screenshot({ path: f }); const now = Date.now(); frames.push([f, now - last]); last = now; };
    const rec = async ms => { const end = Date.now() + ms; while (Date.now() < end) { await grab(); await page.waitForTimeout(Math.max(0, 1000 / FPS - 40)); } };
    await rec(HOLD_MS * 0.7);
    for (let s = 1; s < steps; s++) { await card.evaluate(e => e.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))); await page.mouse.move(0, 0); await rec(s === steps - 1 ? STEP_MS + HOLD_MS : STEP_MS); }
    // durasi tiap frame = jarak ke frame berikutnya
    const list_txt = frames.map(([f], idx) => `file '${path.resolve(f)}'\nduration ${(((frames[idx + 1] || [0, 600])[1]) / 1000).toFixed(3)}`).join('\n') + `\nfile '${path.resolve(frames[frames.length - 1][0])}'\n`;
    fs.writeFileSync(path.join(dir, 'list.txt'), list_txt);
    const gif = path.join(out, name + '.gif');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'list.txt'),
      '-vf', `scale=${W}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`, '-loop', '0', gif]);
    fs.rmSync(dir, { recursive: true, force: true });
    const kb = Math.round(fs.statSync(gif).size / 1024);
    list.push({ name, code: code.toUpperCase(), title, dim, steps, kb });
    console.log(name.padEnd(8), String(frames.length).padStart(3), 'frame', String(kb).padStart(5), 'KB', title);
  }
  fs.writeFileSync(path.join(out, 'daftar.json'), JSON.stringify(list, null, 1));
  await browser.close();
})();
