// Bundles prototype/index.html + local CSS & JS into one self-contained HTML file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(__dirname, 'index.html');
const outPath = path.join(__dirname, 'website-desa-prototype.html');

let html = fs.readFileSync(indexPath, 'utf8');

html = html.replace(/<link\s+rel="stylesheet"\s+href="([^"]+)">/g, (match, href) => {
  if (/^https?:\/\//i.test(href)) return match;
  const full = path.join(__dirname, href);
  const css = fs.readFileSync(full, 'utf8');
  return `<style>\n/* === ${href} === */\n${css}\n</style>`;
});

html = html.replace(/<script\s+src="([^"]+)"><\/script>/g, (match, src) => {
  if (/^https?:\/\//i.test(src)) return match;
  const full = path.join(__dirname, src);
  const js = fs.readFileSync(full, 'utf8').replace(/<\/script>/gi, '<\\/script>');
  return `<script>\n/* === ${src} === */\n${js}\n</script>`;
});

fs.writeFileSync(outPath, html, 'utf8');
const stats = fs.statSync(outPath);
console.log(`Generated ${outPath} (${(stats.size / 1024).toFixed(1)} KB)`);
