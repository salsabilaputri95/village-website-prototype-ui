/* ==========================================================================
   MAP — Interactive Desktop Village Administrative Map (Tahap 4 / PTA)
   ========================================================================== */
(function (w) {
  'use strict';
  w.DesaApp = w.DesaApp || {};

  var CAT_COLORS = {
    'Kantor Desa': '#1B3A5C',
    'Sekolah': '#007AFF',
    'Fasilitas Kesehatan': '#DC2626',
    'Tempat Ibadah': '#7C3AED',
    'Fasilitas Umum': '#D97706',
    'Wisata': '#0D9488',
    'Potensi Ekonomi': '#1E7A5F'
  };

  w.DesaApp.MAP_CATEGORIES = Object.keys(CAT_COLORS);

  w.DesaApp.renderMapSvg = function (isAdminMode) {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var official = st.data.mapConfig.officialBoundaryAvailable;
    var markers = st.data.mapMarkers.filter(function (m) {
      var catOk = st.mapCategory === 'Semua' || m.category === st.mapCategory;
      var q = st.mapSearch.trim().toLowerCase();
      var qOk = !q || m.name.toLowerCase().indexOf(q) !== -1 || m.dusun.toLowerCase().indexOf(q) !== -1 || m.category.toLowerCase().indexOf(q) !== -1;
      return catOk && qOk;
    });

    var boundaries = official
      ? '<g id="map-official-boundaries">' +
          '<!-- Batas Wilayah Desa Sah (Contoh GeoJSON) -->' +
          '<polygon points="95,90 420,55 810,115 845,390 695,495 160,480 75,300" fill="rgba(30,122,95,0.06)" stroke="#1B3A5C" stroke-width="3" stroke-dasharray="10 6"/>' +
          '<!-- Batas 4 Dusun -->' +
          '<polygon points="95,90 420,55 435,245 110,270" fill="rgba(13,148,136,0.08)" stroke="#1E7A5F" stroke-width="1.5" stroke-dasharray="5 4"/>' +
          '<polygon points="420,55 810,115 610,260 435,245" fill="rgba(27,58,92,0.07)" stroke="#1E7A5F" stroke-width="1.5" stroke-dasharray="5 4"/>' +
          '<polygon points="110,270 435,245 465,485 160,480 75,300" fill="rgba(217,119,6,0.06)" stroke="#1E7A5F" stroke-width="1.5" stroke-dasharray="5 4"/>' +
          '<polygon points="435,245 610,260 810,115 845,390 695,495 465,485" fill="rgba(0,122,255,0.06)" stroke="#1E7A5F" stroke-width="1.5" stroke-dasharray="5 4"/>' +
          '<text x="230" y="130" font-size="13" font-weight="700" fill="#1B3A5C" opacity="0.72">DUSUN BUKIT MAKMUR</text>' +
          '<text x="515" y="122" font-size="13" font-weight="700" fill="#1B3A5C" opacity="0.72">DUSUN KRAJAN (PUSAT)</text>' +
          '<text x="215" y="348" font-size="13" font-weight="700" fill="#1B3A5C" opacity="0.72">DUSUN SAWAH INDAH</text>' +
          '<text x="615" y="455" font-size="13" font-weight="700" fill="#1B3A5C" opacity="0.72">DUSUN SUMBER JAYA</text>' +
        '</g>'
      : '';

    var pinSvg = markers.map(function (m) {
      var color = CAT_COLORS[m.category] || '#1B3A5C';
      var selected = st.selectedMarkerId === m.id;
      return '<g class="map-pin" data-action="select-marker" data-id="' + esc(m.id) + '" style="cursor:pointer" transform="translate(' + m.x + ',' + m.y + ')">' +
        (selected ? '<circle r="22" fill="' + color + '" opacity="0.22"/><circle r="15" fill="none" stroke="' + color + '" stroke-width="2.5"/>' : '') +
        '<circle r="11" fill="' + color + '" stroke="#FFFFFF" stroke-width="2.5"/>' +
        '<circle r="3.5" fill="#FFFFFF"/>' +
        '<rect x="14" y="-11" width="' + Math.min(200, Math.max(92, m.name.length * 6.4)) + '" height="22" rx="8" fill="rgba(255,255,255,0.93)" stroke="' + (selected ? color : '#CBD5E1') + '" stroke-width="1"/>' +
        '<text x="21" y="4" font-size="11" font-weight="' + (selected ? '700' : '600') + '" fill="#1C1C1E">' + esc(m.name.slice(0, 26) + (m.name.length > 26 ? '…' : '')) + '</text>' +
      '</g>';
    }).join('');

    var transform = 'translate(' + st.mapPanX + ',' + st.mapPanY + ') scale(' + st.mapZoom + ')';

    return '<svg id="village-map-svg" viewBox="0 0 920 540" width="100%" height="100%" style="display:block;min-height:540px">' +
      '<defs>' +
        '<pattern id="gridPat" width="40" height="40" patternUnits="userSpaceOnUse">' +
          '<path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(27,58,92,0.06)" stroke-width="1"/>' +
        '</pattern>' +
      '</defs>' +
      '<rect width="920" height="540" fill="#E8F2EC"/>' +
      '<rect width="920" height="540" fill="url(#gridPat)"/>' +
      '<g id="map-viewport-group" transform="' + transform + '" style="transform-origin:center center">' +
        '<!-- Terrain: Bukit, Sawah & Sungai -->' +
        '<ellipse cx="205" cy="145" rx="135" ry="70" fill="#CFE8D9" opacity="0.7"/>' +
        '<rect x="140" y="340" width="230" height="125" rx="22" fill="#D5EDD9" opacity="0.85"/>' +
        '<path d="M 40 435 Q 250 375 430 410 T 885 370" fill="none" stroke="#60A5FA" stroke-width="10" stroke-linecap="round" opacity="0.55"/>' +
        '<!-- Jaringan Jalan Desa -->' +
        '<path d="M 80 285 L 460 270 L 840 280" fill="none" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round"/>' +
        '<path d="M 80 285 L 460 270 L 840 280" fill="none" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="6 6"/>' +
        '<path d="M 460 65 L 460 490" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>' +
        '<path d="M 220 140 L 460 270 L 665 360" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>' +
        boundaries +
        pinSvg +
      '</g>' +
      (isAdminMode ? '' : '<text x="16" y="524" font-size="11" fill="#475569">Peta Dasar Interaktif (OpenStreetMap / GeoJSON Contoh) • Gunakan tombol +/- atau seret kanvas</text>') +
    '</svg>';
  };

  w.DesaApp.renderPublicMapPage = function () {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var official = st.data.mapConfig.officialBoundaryAvailable;
    var selected = st.data.mapMarkers.find(function (m) { return m.id === st.selectedMarkerId; }) || st.data.mapMarkers[0];

    var filteredList = st.data.mapMarkers.filter(function (m) {
      var catOk = st.mapCategory === 'Semua' || m.category === st.mapCategory;
      var q = st.mapSearch.trim().toLowerCase();
      var qOk = !q || m.name.toLowerCase().indexOf(q) !== -1 || m.dusun.toLowerCase().indexOf(q) !== -1;
      return catOk && qOk;
    });

    var chips = ['Semua'].concat(w.DesaApp.MAP_CATEGORIES).map(function (c) {
      var active = st.mapCategory === c ? ' is-active' : '';
      var dot = c !== 'Semua' ? '<span style="width:8px;height:8px;border-radius:50%;background:' + CAT_COLORS[c] + '"></span>' : '';
      return '<button type="button" class="chip' + active + '" data-action="map-cat" data-val="' + esc(c) + '">' + dot + esc(c) + '</button>';
    }).join('');

    return '<section class="page-banner"><div class="container">' +
      '<div class="breadcrumb"><button type="button" data-nav="public:home">Home</button><span>/</span><span>Data Desa</span><span>/</span><span>Peta Administrasi Desa</span></div>' +
      '<div class="flex items-center justify-between flex-wrap gap-16">' +
        '<div>' +
          '<h1 class="t-h1">Peta Administrasi &amp; Lokasi Penting Desa</h1>' +
          '<p class="t-secondary t-sm mt-4">Menampilkan titik kantor desa, sekolah, faskes, tempat ibadah, fasilitas umum, wisata, dan potensi ekonomi yang terhubung langsung ke katalog Potensi Desa.</p>' +
        '</div>' +
        '<label class="switch card card-flat" style="padding:10px 14px;border-radius:14px">' +
          '<input type="checkbox" ' + (official ? 'checked' : '') + ' data-action="toggle-map-boundary">' +
          '<span class="switch-track"><span class="switch-thumb"></span></span>' +
          '<span class="t-caption">Simulasi Data Batas Sah: <strong>' + (official ? 'Tersedia' : 'Belum Tersedia') + '</strong></span>' +
        '</label>' +
      '</div>' +
    '</div></section>' +
    '<div class="container" style="padding-bottom:36px">' +
      (official
        ? '<div class="alert alert-emerald mb-16">' + icon('info') + '<div><strong>Data Batas Wilayah Contoh Aktif:</strong> Batas desa dan 4 dusun ditampilkan berdasarkan berkas GeoJSON contoh. Data final menunggu pengesahan pemerintah desa.</div></div>'
        : '<div class="alert alert-warning mb-16">' + icon('alert') + '<div><strong>Batas wilayah belum ditampilkan karena menunggu data resmi.</strong> Sesuai aturan sistem (PRD 8.9 &amp; R-06), batas wilayah tidak digambar dari perkiraan visual; peta tetap menampilkan titik lokasi fasilitas resmi.</div></div>'
      ) +
      '<div class="map-layout">' +
        '<!-- Left Panel: Search, Filter & Legend -->' +
        '<aside class="card flex-col gap-16" style="padding:18px">' +
          '<div class="field">' +
            '<label class="field-label" for="map-search-input">Cari Lokasi / Dusun</label>' +
            '<div class="input-with-icon">' + icon('search', 'icon-sm icon-left') +
              '<input id="map-search-input" class="input" type="text" placeholder="Mis. Sekolah, Wisata, Krajan..." value="' + esc(st.mapSearch) + '" data-action="map-search">' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<div class="t-caption t-muted mb-8">FILTER KATEGORI &amp; LEGENDA</div>' +
            '<div class="chip-row">' + chips + '</div>' +
          '</div>' +
          '<div style="border-top:1px solid var(--line-subtle);padding-top:14px;flex:1;overflow-y:auto;max-height:310px">' +
            '<div class="t-caption t-muted mb-8">DAFTAR LOKASI (' + filteredList.length + ')</div>' +
            '<div class="flex-col gap-8">' +
              (filteredList.length ? filteredList.map(function (m) {
                var act = selected && selected.id === m.id;
                return '<button type="button" data-action="select-marker" data-id="' + esc(m.id) + '" class="btn ' + (act ? 'btn-soft' : 'btn-outline') + '" style="justify-content:flex-start;text-align:left;padding:9px 12px;width:100%">' +
                  '<span style="width:9px;height:9px;border-radius:50%;background:' + (CAT_COLORS[m.category] || '#1B3A5C') + ';flex-shrink:0"></span>' +
                  '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">' + esc(m.name) + '</span>' +
                '</button>';
              }).join('') : '<div class="t-sm t-muted">Tidak ada lokasi yang cocok.</div>') +
            '</div>' +
          '</div>' +
        '</aside>' +
        '<!-- Right Canvas: Interactive Map + Detail Popover -->' +
        '<div class="map-canvas-card">' +
          '<div class="map-zoom-controls">' +
            '<button type="button" class="map-zoom-btn" title="Perbesar" data-action="map-zoom" data-delta="0.2">+</button>' +
            '<button type="button" class="map-zoom-btn" title="Perkecil" data-action="map-zoom" data-delta="-0.2">−</button>' +
            '<button type="button" class="map-zoom-btn" title="Reset Posisi" data-action="map-reset">' + icon('refresh', 'icon-sm') + '</button>' +
          '</div>' +
          '<div class="map-svg-stage" id="map-drag-stage">' + w.DesaApp.renderMapSvg(false) + '</div>' +
          (selected ? '<div class="map-floating-detail">' +
            '<div class="flex items-start justify-between gap-12">' +
              '<div>' +
                '<span class="badge badge-navy">' + esc(selected.category) + '</span>' +
                '<h3 class="t-h3 mt-8">' + esc(selected.name) + '</h3>' +
                '<div class="t-caption t-muted mt-4">' + esc(selected.dusun) + ' • Koordinat: ' + esc(selected.coords) + '</div>' +
              '</div>' +
            '</div>' +
            '<p class="t-sm t-secondary mt-8">' + esc(selected.desc) + '</p>' +
            '<div class="flex items-center flex-wrap gap-8 mt-12">' +
              '<button type="button" class="btn btn-sm btn-outline" data-action="open-directions" data-id="' + esc(selected.id) + '">' + icon('pin', 'icon-sm') + ' Petunjuk Arah</button>' +
              (selected.potentialId ? '<button type="button" class="btn btn-sm btn-accent" data-action="open-potensi-from-map" data-pot="' + esc(selected.potentialId) + '">' + icon('leaf', 'icon-sm') + ' Buka Detail Potensi</button>' : '') +
            '</div>' +
          '</div>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
  };
})(window);
