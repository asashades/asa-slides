#!/usr/bin/env node
/* Rekam beberapa slide sebuah deck menjadi satu GIF (hero README).
   Pakai:  node scripts/rekam-deck-gif.js deck.html hero.gif --slides=0,1,3 [--lebar=760] [--fps=10]
   --slides = nomor slide mulai dari 0; tiap slide direkam dari tahap pertama sampai terakhir.
   Env opsional: FONT_DIR, THREE_JS (lihat rekam-gif.js). */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const [,, src, out, ...rest] = process.argv;
if (!src || !out) { console.error('pakai: node rekam-deck-gif.js deck.html hero.gif --slides=0,1,3'); process.exit(1); }
const opt = Object.fromEntries(rest.map(a => a.replace(/^--/, '').split('=')));
const W = +(opt.lebar || 760), FPS = +(opt.fps || 10), STEP = +(opt.langkah || 1150), HOLD = +(opt.tahan || 1000);
const FONTS = [['Bricolage Grotesque', 'bricolage-grotesque', [600, 700]], ['Plus Jakarta Sans', 'plus-jakarta-sans', [400, 500, 600, 700]], ['JetBrains Mono', 'jetbrains-mono', [500, 600]]];
(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
  if (process.env.FONT_DIR) {
    await page.route(/fonts\.googleapis\.com\/css2/, r => r.fulfill({ contentType: 'text/css', body: FONTS.flatMap(([f, s, ws]) => ws.map(w => `@font-face{font-family:'${f}';font-weight:${w};src:url(https://fonts.local/${s}-${w}.woff2) format('woff2')}`)).join('\n') }));
    await page.route(/fonts\.local\//, r => { const f = r.request().url().split('/').pop(), s = f.replace(/-\d+\.woff2$/, ''), w = f.match(/-(\d+)\.woff2$/)[1]; r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(path.join(process.env.FONT_DIR, s, 'files', `${s}-latin-${w}-normal.woff2`)) }); });
  }
  if (process.env.THREE_JS) await page.route(/three\.min\.js/, r => r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(process.env.THREE_JS) }));
  await page.goto('file://' + path.resolve(src)); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
  await page.addStyleTag({ content: '.timer,#tPlay{pointer-events:none}' });
  const dir = path.join(path.dirname(path.resolve(out)), '_hero'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const frames = []; let last = Date.now();
  const grab = async () => { const f = path.join(dir, String(frames.length).padStart(4, '0') + '.png'); await page.screenshot({ path: f }); const t = Date.now(); frames.push([f, t - last]); last = t; };
  const rec = async ms => { const end = Date.now() + ms; while (Date.now() < end) { await grab(); await page.waitForTimeout(Math.max(0, 1000 / FPS - 60)); } };
  for (const i of (opt.slides || '0').split(',').map(Number)) {
    await page.evaluate(i => deck.go(i), i); await page.mouse.move(0, 0); await page.waitForTimeout(250);
    const steps = Math.max(1, await page.locator('#stage .dots i').count());
    await rec(steps === 1 ? HOLD * 1.6 : HOLD * 0.6);
    for (let s = 1; s < steps; s++) { await page.keyboard.press('ArrowRight'); await rec(s === steps - 1 ? STEP + HOLD : STEP); }
  }
  fs.writeFileSync(path.join(dir, 'list.txt'), frames.map(([f], k) => `file '${f}'\nduration ${(((frames[k + 1] || [0, 700])[1]) / 1000).toFixed(3)}`).join('\n') + `\nfile '${frames[frames.length - 1][0]}'\n`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'list.txt'),
    '-vf', `scale=${W}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`, '-loop', '0', out]);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(path.basename(out), frames.length, 'frame', Math.round(fs.statSync(out).size / 1024), 'KB');
  await browser.close();
})();
