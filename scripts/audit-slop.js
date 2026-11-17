#!/usr/bin/env node
/*
 * Audit anti AI slop pada deck yang sudah ter-render (tiap slide di tahap terakhir, tema terang dan gelap).
 *   node audit-slop.js deck.html
 * Aturan diadaptasi dari daftar anti-pattern impeccable.style dan aturan pemilik skill (references/anti-slop.md).
 * Temuan = alasan untuk melihat lebih dekat, bukan larangan mutlak.
 * Pengecualian yang disengaja:
 *   - satu deck:     <html data-slop-allow="hard-shadow overused-font">
 *   - satu elemen:   data-slop-ok="nested-card"
 * Exit code 1 bila ada temuan.
 */
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.resolve(process.argv[2] || 'deck.html');

const AUDIT = () => {
  const out = [];
  const root = document.querySelector('#stage .sl') || document.getElementById('stage');
  const allow = (document.documentElement.dataset.slopAllow || '').split(/\s+/);
  const add = (rule, el, msg) => {
    if (allow.includes(rule)) return;
    if (el && el.closest && el.closest(`[data-slop-ok~="${rule}"]`)) return;
    out.push({ rule, msg: msg + (el && el.className && typeof el.className === 'string' ? ` [.${el.className.trim().split(/\s+/).join('.')}]` : '') });
  };
  const parseRGB = c => { const m = /rgba?\(([^)]+)\)/.exec(c || ''); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] == null ? 1 : p[3] }; };
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const hue = c => { const r = c.r / 255, g = c.g / 255, b = c.b / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (!d) return { h: 0, s: 0 };
    let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; return { h, s: d / (1 - Math.abs(mx + mn - 1) || 1) }; };
  const bgOf = el => { for (let e = el; e; e = e.parentElement) { const c = parseRGB(getComputedStyle(e).backgroundColor); if (c && c.a > .9) return c; } return parseRGB(getComputedStyle(document.body).backgroundColor); };
  const visible = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const isBox = e => { if (e.closest('svg') || ['BUTTON', 'KBD', 'MARK', 'I', 'SPAN', 'B', 'SMALL', 'EM', 'STRONG'].includes(e.tagName)) return false;
    const cs = getComputedStyle(e), r = e.getBoundingClientRect(); if (r.width < 90 || r.height < 36) return false;
    const bw = ['Top', 'Right', 'Bottom', 'Left'].some(s => parseFloat(cs['border' + s + 'Width']) > 0);
    const bg = parseRGB(cs.backgroundColor); const pbg = e.parentElement ? bgOf(e.parentElement) : null;
    const diffBg = bg && bg.a > .5 && pbg && (Math.abs(bg.r - pbg.r) + Math.abs(bg.g - pbg.g) + Math.abs(bg.b - pbg.b)) > 6;
    return (bw || diffBg) && parseFloat(cs.borderTopLeftRadius) >= 4; };
  const els = [...root.querySelectorAll('*')].filter(e => !e.closest('svg') || e.tagName === 'svg');

  // --- Layout & kartu ---
  els.forEach(e => {
    if (!visible(e) || e.closest('svg')) return; const cs = getComputedStyle(e), r = e.getBoundingClientRect();
    // side-tab: garis aksen tebal di kiri/atas kartu
    const L = parseFloat(cs.borderLeftWidth), Tp = parseFloat(cs.borderTopWidth), R = parseFloat(cs.borderRightWidth);
    if (r.height > 30 && L >= 3 && L > R + 1 && cs.borderLeftStyle !== 'none') add('side-tab', e, `border kiri ${L}px`);
    if (r.width > 60 && Tp >= 3 && Tp > R + 1 && cs.borderTopStyle !== 'none' && r.height > 40) add('side-tab', e, `border atas ${Tp}px`);
    // border berwarna tebal pada elemen rounded
    if (isBox(e) && Math.min(L, Tp, R) >= 3) add('thick-colored-border', e, `border ${L}px pada elemen rounded`);
    // kartu bersarang
    if (isBox(e)) { for (let a = e.parentElement; a && a !== root.parentElement; a = a.parentElement) { if (isBox(a)) { add('nested-card', e, 'kotak di dalam kotak'); break; } } }
    // shadow
    if (cs.boxShadow && cs.boxShadow !== 'none') {
      cs.boxShadow.split(/,(?![^(]*\))/).forEach(sh => {
        const n = (sh.match(/-?\d+(\.\d+)?px/g) || []).map(parseFloat); const [x = 0, y = 0, blur = 0] = n;
        if (sh.includes('inset')) return;
        if ((Math.abs(x) >= 3 || Math.abs(y) >= 3) && blur === 0) add('hard-shadow', e, 'shadow offset keras ala neobrutalist');
        if (blur >= 18 && L <= 1) add('thin-border-wide-shadow', e, `border tipis + shadow blur ${blur}px`);
      });
    }
    // radius ekstrem
    if (isBox(e) && parseFloat(cs.borderTopLeftRadius) > 28 && r.height > 80) add('extreme-radius', e, `radius ${cs.borderTopLeftRadius}`);
    // gradien, halo, stripe
    const bi = cs.backgroundImage || '';
    if (/radial-gradient/.test(bi) && r.width > 300) add('radial-halo', e, 'halo radial-gradient di latar');
    if (/repeating-(linear|radial)-gradient/.test(bi)) add('gradient-stripes', e, 'stripe dari repeating-gradient');
    if (/gradient/.test(bi)) {
      const cols = (bi.match(/rgba?\([^)]+\)/g) || []).map(parseRGB).filter(Boolean);
      if (cols.some(c => { const h = hue(c); return h.s > .25 && h.h >= 250 && h.h <= 320; })) add('purple-gradient', e, 'gradien ungu');
      else if (!/repeating/.test(bi) && r.width > 200 && r.height > 60) add('decorative-gradient', e, 'gradien dekoratif pada latar/kartu');
    }
    if (cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text') add('gradient-text', e, 'teks gradien');
    if (/blur\(/.test(cs.backdropFilter || cs.webkitBackdropFilter || '') && !e.matches('.gridv')) add('glassmorphism', e, 'backdrop blur (glassmorphism)');
    // ikon dalam kotak rounded di atas heading
    if (r.width <= 72 && r.height <= 72 && e.querySelector('svg.fa') && e.children.length === 1 && isBoxSmall(e, cs)) {
      const nx = e.nextElementSibling; if (nx && /^H[1-6]$/.test(nx.tagName)) add('icon-tile-above-heading', e, 'ikon dalam kotak di atas heading');
    }
    // meluap dari stage
    const sr = document.getElementById('stage').getBoundingClientRect();
    if (!e.closest('.scroll-x') && r.width && r.right > sr.right + 2) add('overflow', e, `meluap ${Math.round(r.right - sr.right)}px ke kanan`);
    // easing bounce/elastic & animasi tak berujung
    const tf = cs.transitionTimingFunction + ',' + cs.animationTimingFunction;
    (tf.match(/cubic-bezier\(([^)]+)\)/g) || []).forEach(cb => { const v = cb.slice(13, -1).split(',').map(Number); if (v[1] > 1 || v[1] < 0 || v[3] > 1 || v[3] < 0) add('bounce-easing', e, 'easing bounce/elastic ' + cb); });
    if (e.getAnimations) e.getAnimations().forEach(a => { const t = a.effect && a.effect.getTiming && a.effect.getTiming(); if (t && t.iterations === Infinity) add('infinite-animation', e, 'animasi berulang tanpa henti (pulsing dot, kursor kedip, marquee)'); });
  });
  function isBoxSmall(e, cs) { const bg = parseRGB(cs.backgroundColor); return (bg && bg.a > .5) && parseFloat(cs.borderTopLeftRadius) >= 4; }

  // --- Tipografi & teks ---
  const textEls = els.filter(e => !e.closest('svg') && visible(e) && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1));
  const fontsSeen = new Set();
  textEls.forEach(e => {
    const cs = getComputedStyle(e), fs = parseFloat(cs.fontSize), txt = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(' ').trim();
    const fam = cs.fontFamily.split(',')[0].replace(/['"]/g, '').trim(); fontsSeen.add(fam);
    if (/^(Inter|Geist)$/i.test(fam)) add('overused-font', e, `font pasaran: ${fam}`);
    if (txt.length > 25 && fs < 14) add('tiny-text', e, `teks ${fs}px`);
    if (txt.length > 40 && cs.textTransform === 'uppercase') add('all-caps-body', e, 'teks panjang huruf kapital');
    if (cs.textAlign === 'justify') add('justified-text', e, 'teks justified');
    const lh = cs.lineHeight === 'normal' ? fs * 1.2 : parseFloat(cs.lineHeight);
    if (txt.length > 90 && lh / fs < 1.3) add('tight-line-height', e, `line-height ${(lh / fs).toFixed(2)}`);
    const ls = cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing) / fs;
    if (txt.length > 40 && ls > .05) add('wide-tracking-body', e, 'letter spacing lebar di teks panjang');
    if (/^H[1-3]$/.test(e.tagName) && ls < -.03) add('tight-tracking', e, 'letter spacing heading terlalu rapat');
    if (txt.length > 120 && e.getBoundingClientRect().width / fs > 42) add('long-line', e, `baris ${Math.round(e.getBoundingClientRect().width / fs * 2)} karakter`);
    // kontras
    const fg = parseRGB(cs.color), bg = bgOf(e);
    if (fg && bg) { const cr = ratio(fg, bg), large = fs >= 24 || (fs >= 18.6 && +cs.fontWeight >= 700);
      if (cr < (large ? 3 : 4.5)) add('low-contrast', e, `kontras ${cr.toFixed(2)}:1`);
      const hb = hue(bg), hf = hue(fg); if (hb.s > .35 && lum(bg) < .8 && hf.s < .12 && Math.abs(lum(fg) - .3) < .2) add('gray-on-color', e, 'teks abu-abu di atas latar berwarna'); }
    // copy
    if (/—/.test(txt)) add('em-dash', e, 'em-dash');
    if (/\b(bukan|not)\s+[^.!?]{1,40}[.!?]\s+(tapi|melainkan|it'?s|but)\b/i.test(txt)) add('forced-contrast', e, 'kontras paksa "Bukan X. Tapi Y."');
    if (/\b(theater|teater)\b/i.test(txt)) add('theater-word', e, 'kata "theater"');
    if (/\p{Extended_Pictographic}/u.test(txt)) add('emoji', e, 'emoji di teks');
    // satu kata sendirian di baris terakhir paragraf
    if (e.tagName === 'P' && txt.length > 60) { const rg = document.createRange(); rg.selectNodeContents(e); const rects = [...rg.getClientRects()]; if (rects.length > 1) { const last = rects[rects.length - 1]; if (last.width < fs * 3.2 && rects.length >= 2) add('orphan-word', e, 'satu kata sendirian di baris terakhir'); } }
  });
  if (fontsSeen.size === 1) add('single-font', null, 'satu font untuk semuanya');
  // teks berulang
  const seen = {}; textEls.forEach(e => { const t = e.textContent.trim(); if (t.length > 14) seen[t] = (seen[t] || 0) + 1; });
  Object.entries(seen).forEach(([t, n]) => { if (n > 1) add('repeated-text', null, `teks sama muncul ${n}x: "${t.slice(0, 50)}"`); });
  // konten tetap tersembunyi di tahap terakhir
  root.querySelectorAll('[data-from]').forEach(e => { if (e.dataset.to != null) return; if (parseFloat(getComputedStyle(e).opacity) < .05 && e.textContent.trim()) add('hidden-content', e, 'konten masih tersembunyi di tahap terakhir'); });
  // ilustrasi placeholder: svg tanpa teks dan tanpa path, hanya bentuk dasar
  root.querySelectorAll('svg:not(.fa)').forEach(s => { const shapes = s.querySelectorAll('rect,circle,ellipse').length, rich = s.querySelectorAll('path,polygon,polyline,text,use').length;
    if (shapes >= 3 && rich === 0) add('placeholder-illustration', s, 'ilustrasi hanya lingkaran/kotak tanpa label'); });
  // level heading dilompati (urutan dokumen pada slide)
  let last = 0; root.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => { const l = +h.tagName[1]; if (last && l > last + 1) add('skipped-heading', h, `h${last} lalu h${l}`); last = l; });
  return out;
};

(async () => {
  const browser = await chromium.launch(); let total = 0;
  for (const theme of ['light', 'dark']) {
    const p = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await p.goto(url); await p.waitForTimeout(500);
    await p.evaluate(t => { document.documentElement.dataset.theme = t; }, theme);
    const n = await p.evaluate(() => deck.count());
    console.log(`\n== Tema ${theme} ==`);
    for (let i = 0; i < n; i++) {
      await p.evaluate(i => { deck.go(i, 'last'); }, i); await p.waitForTimeout(200);
      const f = await p.evaluate(AUDIT);
      const uniq = [...new Map(f.map(x => [x.rule + x.msg, x])).values()];
      if (uniq.length) { const t = await p.evaluate(() => deck.state().title); console.log(`slide ${i + 1} · ${t}`); uniq.forEach(x => console.log(`   [${x.rule}] ${x.msg}`)); total += uniq.length; }
    }
    await p.close();
  }
  await browser.close();
  console.log(total ? `\n${total} temuan. Perbaiki, atau tandai pengecualian bila memang disengaja.` : '\nTidak ada temuan.');
  process.exit(total ? 1 : 0);
})();
