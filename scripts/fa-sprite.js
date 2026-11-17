#!/usr/bin/env node
/*
 * Membuat sprite SVG ikon Font Awesome Free (solid) untuk disisipkan inline ke deck.
 *
 * Pakai:
 *   npm i @fortawesome/free-solid-svg-icons@6
 *   node fa-sprite.js chevron-left border-all circle-check > sprite.html
 *   node fa-sprite.js --inject deck.html chevron-left border-all ...
 *
 * --inject mengganti blok di antara <!--FA-SPRITE--> ... <!--/FA-SPRITE--> pada file deck.
 * Ikon dipakai di HTML sebagai: <svg class="fa"><use href="#fa-nama-ikon"/></svg>
 * Lisensi ikon: Font Awesome Free, CC BY 4.0.
 */
const fs = require('fs');
let icons;
try { icons = require('@fortawesome/free-solid-svg-icons'); }
catch (e) { console.error('Pasang dulu: npm i @fortawesome/free-solid-svg-icons@6'); process.exit(1); }

const args = process.argv.slice(2);
let injectFile = null;
if (args[0] === '--inject') { injectFile = args[1]; args.splice(0, 2); }
if (!args.length) { console.error('Sebutkan nama ikon, mis. chevron-left border-all'); process.exit(1); }

const toKey = n => 'fa' + n.split('-').map(p => p[0].toUpperCase() + p.slice(1)).join('');
const missing = [];
const symbols = [...new Set(args)].map(name => {
  const ic = icons[toKey(name)];
  if (!ic) { missing.push(name); return ''; }
  const [w, h, , , d] = ic.icon;
  const path = Array.isArray(d) ? d.map(x => `<path d="${x}"/>`).join('') : `<path d="${d}"/>`;
  return `<symbol id="fa-${name}" viewBox="0 0 ${w} ${h}">${path}</symbol>`;
}).join('');
if (missing.length) { console.error('Ikon tidak ditemukan: ' + missing.join(', ')); process.exit(1); }

const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${symbols}</defs></svg>`;
if (injectFile) {
  const html = fs.readFileSync(injectFile, 'utf8');
  const re = /<!--FA-SPRITE-->[\s\S]*?<!--\/FA-SPRITE-->/;
  if (!re.test(html)) { console.error('Penanda <!--FA-SPRITE--> ... <!--/FA-SPRITE--> tidak ada di ' + injectFile); process.exit(1); }
  fs.writeFileSync(injectFile, html.replace(re, `<!--FA-SPRITE-->${sprite}<!--/FA-SPRITE-->`));
  console.error(`Sprite ${args.length} ikon disisipkan ke ${injectFile}`);
} else {
  process.stdout.write(sprite + '\n');
}
