/* ==========================================================================
   CHARTS — Pure Inline SVG Charts (Light & Admin Dark Mode Ready)
   ========================================================================== */
(function (w) {
  'use strict';
  w.DesaApp = w.DesaApp || {};

  w.DesaApp.charts = {
    // Vertical Bar Chart
    vBar: function (items, opts) {
      opts = opts || {};
      var esc = w.DesaApp.escapeHtml;
      var maxVal = 0;
      items.forEach(function (it) { if (it.value > maxVal) maxVal = it.value; });
      if (maxVal === 0) maxVal = 1;
      var h = opts.height || 210;
      var colW = Math.max(46, Math.floor(460 / Math.max(items.length, 1)));
      var totalW = Math.max(460, items.length * colW + 32);
      var barW = Math.min(38, colW - 18);

      var bars = items.map(function (it, idx) {
        var barH = Math.max(6, Math.round((it.value / maxVal) * (h - 54)));
        var x = 22 + idx * colW + Math.round((colW - barW) / 2);
        var y = h - 30 - barH;
        var fill = it.color || (idx % 2 === 0 ? '#1B3A5C' : '#1E7A5F');
        return '<g>' +
          '<rect x="' + x + '" y="' + y + '" width="' + barW + '" height="' + barH + '" rx="8" fill="' + fill + '" opacity="0.92">' +
            '<title>' + esc(it.label) + ': ' + esc(it.value.toLocaleString('id-ID')) + '</title>' +
          '</rect>' +
          '<text x="' + (x + barW / 2) + '" y="' + (y - 6) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="var(--ink)">' + esc(it.value.toLocaleString('id-ID')) + '</text>' +
          '<text x="' + (x + barW / 2) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="11" font-weight="500" fill="var(--ink-muted)">' + esc(it.short || it.label) + '</text>' +
        '</g>';
      }).join('');

      return '<svg viewBox="0 0 ' + totalW + ' ' + h + '" width="100%" style="overflow:visible" role="img" aria-label="' + esc(opts.title || 'Grafik Batang') + '">' +
        '<line x1="16" y1="' + (h - 30) + '" x2="' + (totalW - 12) + '" y2="' + (h - 30) + '" stroke="var(--line)" stroke-width="1"/>' +
        bars +
      '</svg>';
    },

    // Horizontal Progress / Distribution Bars
    hBar: function (items) {
      var esc = w.DesaApp.escapeHtml;
      var maxVal = 0;
      items.forEach(function (it) { if (it.value > maxVal) maxVal = it.value; });
      if (maxVal === 0) maxVal = 1;
      return '<div class="flex-col gap-12">' + items.map(function (it, idx) {
        var pct = Math.round((it.value / maxVal) * 100);
        var color = it.color || (idx % 2 === 0 ? 'var(--brand-accent)' : 'var(--brand-primary)');
        return '<div>' +
          '<div class="flex justify-between t-sm mb-8" style="margin-bottom:5px">' +
            '<span style="font-weight:500">' + esc(it.label) + '</span>' +
            '<span class="t-tabular" style="font-weight:700">' + esc(it.value.toLocaleString('id-ID')) + (it.suffix ? ' ' + esc(it.suffix) : '') + '</span>' +
          '</div>' +
          '<div style="height:10px;border-radius:999px;background:var(--surface-alt);border:1px solid var(--line-subtle);overflow:hidden">' +
            '<div style="width:' + pct + '%;height:100%;border-radius:999px;background:' + color + ';transition:width 300ms ease"></div>' +
          '</div>' +
        '</div>';
      }).join('') + '</div>';
    },

    // Donut Chart with Legend
    donut: function (segments, centerBig, centerSmall) {
      var esc = w.DesaApp.escapeHtml;
      var total = 0;
      segments.forEach(function (s) { total += s.value; });
      if (total <= 0) total = 1;
      var r = 58;
      var c = 2 * Math.PI * r;
      var offset = 0;

      var arcs = segments.map(function (s) {
        var dash = (s.value / total) * c;
        var el = '<circle cx="80" cy="80" r="' + r + '" fill="none" stroke="' + s.color + '" stroke-width="20" ' +
          'stroke-dasharray="' + dash.toFixed(2) + ' ' + c.toFixed(2) + '" ' +
          'stroke-dashoffset="' + (-offset).toFixed(2) + '" transform="rotate(-90 80 80)">' +
          '<title>' + esc(s.label) + ': ' + esc(s.value.toLocaleString('id-ID')) + '</title>' +
        '</circle>';
        offset += dash;
        return el;
      }).join('');

      var legend = segments.map(function (s) {
        var pct = Math.round((s.value / total) * 100);
        return '<div class="flex items-center justify-between gap-12 t-sm">' +
          '<div class="flex items-center gap-8">' +
            '<span style="width:10px;height:10px;border-radius:50%;background:' + s.color + ';flex-shrink:0"></span>' +
            '<span>' + esc(s.label) + '</span>' +
          '</div>' +
          '<span class="t-tabular" style="font-weight:600">' + esc(s.value.toLocaleString('id-ID')) + ' <span class="t-muted t-caption">(' + pct + '%)</span></span>' +
        '</div>';
      }).join('');

      return '<div class="flex items-center gap-24 flex-wrap">' +
        '<svg width="160" height="160" viewBox="0 0 160 160" style="flex-shrink:0" role="img" aria-label="Diagram Donat">' +
          '<circle cx="80" cy="80" r="' + r + '" fill="none" stroke="var(--surface-alt)" stroke-width="20"/>' +
          arcs +
          '<text x="80" y="76" text-anchor="middle" font-size="20" font-weight="700" fill="var(--ink)">' + esc(centerBig) + '</text>' +
          '<text x="80" y="95" text-anchor="middle" font-size="11" font-weight="500" fill="var(--ink-muted)">' + esc(centerSmall) + '</text>' +
        '</svg>' +
        '<div class="flex-1 flex-col gap-8" style="min-width:180px">' + legend + '</div>' +
      '</div>';
    }
  };
})(window);
