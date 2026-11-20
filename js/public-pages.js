/* ==========================================================================
   PUBLIC PAGES — All 8 Public Website Menus & Citizen Letter Workflows
   ========================================================================== */
(function (w) {
  'use strict';
  w.DesaApp = w.DesaApp || {};

  function statusBadge(status) {
    var meta = w.DesaApp.STATUS_META[status] || { badge: 'badge-neutral' };
    return '<span class="badge ' + meta.badge + '"><span class="badge-dot"></span>' + w.DesaApp.escapeHtml(status) + '</span>';
  }

  function renderPublicNavbar() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var page = st.publicPage;

    function isActive(arr) { return arr.indexOf(page) !== -1 ? ' is-active' : ''; }

    return '<header class="pub-header">' +
      '<div class="pub-header-inner">' +
        '<a href="#public/home" class="pub-brand" data-nav="public:home">' +
          '<div class="pub-logo-sq">' + icon('building') + '</div>' +
          '<div>' +
            '<div class="pub-brand-name">' + esc(st.data.site.villageName) + '</div>' +
            '<div class="pub-brand-sub">' + esc(st.data.site.regencyName) + '</div>' +
          '</div>' +
        '</a>' +

        '<nav class="pub-nav" aria-label="Navigasi Publik">' +
          '<button type="button" class="pub-nav-link' + isActive(['home']) + '" data-nav="public:home">Home</button>' +
          '<button type="button" class="pub-nav-link' + isActive(['profil']) + '" data-nav="public:profil">Profil Desa</button>' +

          '<div class="pub-nav-item">' +
            '<button type="button" class="pub-nav-link' + isActive(['statistik', 'potensi', 'peta']) + '" data-dropdown-toggle="dd-data">Data Desa ' + icon('chevronDown', 'icon-sm') + '</button>' +
            '<div class="pub-dropdown" id="dd-data">' +
              '<button type="button" class="pub-drop-link" data-nav="public:statistik"><span>Statistik Kependudukan</span>' + icon('chart', 'icon-sm') + '</button>' +
              '<button type="button" class="pub-drop-link" data-nav="public:potensi"><span>Potensi Desa</span>' + icon('leaf', 'icon-sm') + '</button>' +
              '<button type="button" class="pub-drop-link" data-nav="public:peta"><span>Peta Administrasi</span>' + icon('map', 'icon-sm') + '</button>' +
            '</div>' +
          '</div>' +

          '<div class="pub-nav-item">' +
            '<button type="button" class="pub-nav-link' + isActive(['layanan', 'ajukan-surat', 'cek-status']) + '" data-dropdown-toggle="dd-layanan">Layanan Desa ' + icon('chevronDown', 'icon-sm') + '</button>' +
            '<div class="pub-dropdown" id="dd-layanan">' +
              '<button type="button" class="pub-drop-link" data-nav="public:layanan"><span>Informasi Layanan (Tanpa Login)</span>' + icon('file', 'icon-sm') + '</button>' +
              '<button type="button" class="pub-drop-link" data-nav="public:ajukan-surat"><span>Pengajuan Surat Online</span>' + icon('upload', 'icon-sm') + '</button>' +
              '<button type="button" class="pub-drop-link" data-nav="public:cek-status"><span>Cek Status Pengajuan</span>' + icon('search', 'icon-sm') + '</button>' +
            '</div>' +
          '</div>' +

          '<div class="pub-nav-item">' +
            '<button type="button" class="pub-nav-link' + isActive(['berita', 'pengumuman']) + '" data-dropdown-toggle="dd-info">Informasi ' + icon('chevronDown', 'icon-sm') + '</button>' +
            '<div class="pub-dropdown" id="dd-info">' +
              '<button type="button" class="pub-drop-link" data-nav="public:berita"><span>Berita Desa</span>' + icon('newspaper', 'icon-sm') + '</button>' +
              '<button type="button" class="pub-drop-link" data-nav="public:pengumuman"><span>Pengumuman Resmi</span>' + icon('megaphone', 'icon-sm') + '</button>' +
            '</div>' +
          '</div>' +

          '<button type="button" class="pub-nav-link' + isActive(['bantuan']) + '" data-nav="public:bantuan">Info Bantuan</button>' +
          '<button type="button" class="pub-nav-link' + isActive(['gallery']) + '" data-nav="public:gallery">Gallery</button>' +
          '<button type="button" class="pub-nav-link' + isActive(['kontak']) + '" data-nav="public:kontak">Kontak</button>' +
        '</nav>' +

        '<div class="pub-nav-actions">' +
          '<button type="button" class="pub-search-icon-btn" title="Cari informasi desa" data-action="open-public-search">' + icon('search') + '</button>' +
          '<button type="button" class="btn btn-accent" data-nav="public:ajukan-surat">Ajukan Surat</button>' +
        '</div>' +
      '</div>' +
    '</header>';
  }

  function renderPublicFooter() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var s = st.data.site;

    return '<footer class="pub-footer">' +
      '<div class="container">' +
        '<div class="pub-footer-grid">' +
          '<div>' +
            '<div class="flex items-center gap-12 mb-12">' +
              '<div class="pub-logo-sq" style="background:var(--brand-accent)">' + icon('building') + '</div>' +
              '<div><div style="font-weight:700;color:#fff">' + esc(s.villageName) + '</div><div class="t-caption" style="color:#94A3B8">' + esc(s.districtName) + ', ' + esc(s.regencyName) + '</div></div>' +
            '</div>' +
            '<p class="t-sm" style="color:#CBD5E1;line-height:1.6">' + esc(s.aboutSummary) + '</p>' +
            '<div class="mt-12"><span class="badge" style="background:rgba(255,255,255,0.1);color:#A7F3D0">Data Contoh / Placeholder • Tanpa Data Pribadi Warga</span></div>' +
          '</div>' +

          '<div>' +
            '<h4>Navigasi Utama</h4>' +
            '<button type="button" class="pub-footer-link" data-nav="public:profil">Profil &amp; Perangkat Desa</button>' +
            '<button type="button" class="pub-footer-link" data-nav="public:berita">Berita Desa</button>' +
            '<button type="button" class="pub-footer-link" data-nav="public:pengumuman">Pengumuman Resmi</button>' +
            '<button type="button" class="pub-footer-link" data-nav="public:gallery">Gallery Kegiatan</button>' +
            '<button type="button" class="pub-footer-link" data-nav="public:kontak">Kontak Kantor Desa</button>' +
          '</div>' +

          '<div>' +
            '<h4>Data &amp; Layanan Warga</h4>' +
            '<button type="button" class="pub-footer-link" data-nav="public:layanan">Syarat Layanan (Tanpa Login)</button>' +
            '<button type="button" class="pub-footer-link" data-nav="public:ajukan-surat">Pengajuan Surat Online</button>' +
            '<button type="button" class="pub-footer-link" data-nav="public:cek-status">Cek Status Pengajuan</button>' +
            '<button type="button" class="pub-footer-link" data-nav="public:statistik">Statistik Kependudukan</button>' +
            '<button type="button" class="pub-footer-link" data-nav="public:potensi">Potensi &amp; Peta Desa</button>' +
          '</div>' +

          '<div>' +
            '<h4>Kantor &amp; Kanal Resmi</h4>' +
            '<p class="t-sm" style="color:#CBD5E1">' + esc(s.officeAddress) + '</p>' +
            '<p class="t-sm mt-8" style="color:#CBD5E1">Telp: ' + esc(s.phone) + '<br>Email: ' + esc(s.email) + '<br>Jam: ' + esc(s.officeHours) + '</p>' +
            '<div class="flex flex-wrap gap-8 mt-12">' +
              '<button type="button" class="btn btn-sm" style="background:rgba(255,255,255,0.12);color:#fff" data-nav="login">' + icon('lock', 'icon-sm') + ' Portal Perangkat Desa</button>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="pub-footer-bottom">' +
          '<span>© 2026 Pemerintah ' + esc(s.villageName) + ' — Prototipe Website dan Sistem Informasi Desa Terintegrasi.</span>' +
          '<span>' + esc(s.domainNotice) + '</span>' +
        '</div>' +
      '</div>' +
    '</footer>';
  }

  function renderHome() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var ill = w.DesaApp.illustrations;
    var s = st.data.site;
    var stat = st.data.statistik;

    var pubNews = st.data.news.filter(function (n) { return n.status === 'Dipublikasikan'; }).slice(0, 3);
    var pubAnns = st.data.announcements.filter(function (a) { return a.status === 'Dipublikasikan'; })
      .sort(function (a, b) { return (b.important ? 1 : 0) - (a.important ? 1 : 0); }).slice(0, 3);
    var pubPots = st.data.potentials.filter(function (p) { return p.status === 'Dipublikasikan'; }).slice(0, 4);
    var pubGal = st.data.gallery.filter(function (g) { return g.status === 'Dipublikasikan'; }).slice(0, 3);
    var topServices = st.data.services.slice(0, 4);

    var statsBlock = stat.published
      ? '<div class="grid-4">' +
          '<div class="stat-card"><div class="stat-card-top"><div class="stat-icon-box">' + icon('users') + '</div><span class="stat-pill">Data contoh agregat</span></div><div><div class="stat-value">' + stat.totalPenduduk.toLocaleString('id-ID') + '</div><div class="stat-label">Total Penduduk</div></div></div>' +
          '<div class="stat-card"><div class="stat-card-top"><div class="stat-icon-box is-navy">' + icon('home') + '</div><span class="stat-pill">Data per ' + esc(stat.approvedAt) + '</span></div><div><div class="stat-value">' + stat.totalKK.toLocaleString('id-ID') + '</div><div class="stat-label">Kepala Keluarga (KK)</div></div></div>' +
          '<div class="stat-card"><div class="stat-card-top"><div class="stat-icon-box is-info">' + icon('user') + '</div><span class="stat-pill">Tervalidasi Kades</span></div><div><div class="stat-value">' + stat.lakiLaki.toLocaleString('id-ID') + '</div><div class="stat-label">Penduduk Laki-laki</div></div></div>' +
          '<div class="stat-card"><div class="stat-card-top"><div class="stat-icon-box">' + icon('user') + '</div><span class="stat-pill">Tervalidasi Kades</span></div><div><div class="stat-value">' + stat.perempuan.toLocaleString('id-ID') + '</div><div class="stat-label">Penduduk Perempuan</div></div></div>' +
        '</div>'
      : '<div class="empty-state">' +
          '<div class="empty-state-icon">' + icon('chart', 'icon-lg') + '</div>' +
          '<h3 class="t-h3">Data sedang diperbarui</h3>' +
          '<p class="t-sm t-muted" style="max-width:520px">Sesuai aturan PRD (BR-T02/T03), statistik kependudukan publik hanya menampilkan angka agregat setelah diperiksa dan disetujui Kepala Desa.</p>' +
        '</div>';

    return '<div class="hero-wrap"><div class="container">' +
      '<div class="hero-card">' +
        '<div>' +
          '<div class="hero-eyebrow">' + icon('shield', 'icon-sm') + ' Website Resmi &amp; Informasi Terintegrasi</div>' +
          '<h1 class="t-display" style="color:#FFFFFF">' + esc(s.heroTitle) + '</h1>' +
          '<p class="hero-subtitle">' + esc(s.heroDesc) + '</p>' +
          '<form class="hero-search" data-form="hero-search">' +
            icon('search', 'icon-sm') +
            '<input type="text" name="q" placeholder="Cari syarat surat, berita desa, pengumuman, atau potensi..." aria-label="Pencarian cepat">' +
            '<button type="submit" class="btn btn-accent btn-sm">Cari</button>' +
          '</form>' +
          '<div class="hero-ctas">' +
            '<button type="button" class="btn btn-accent" data-nav="public:ajukan-surat">' + icon('file', 'icon-sm') + ' Ajukan Surat Online</button>' +
            '<button type="button" class="btn" style="background:rgba(255,255,255,0.16);color:#fff;border:1px solid rgba(255,255,255,0.28)" data-nav="public:cek-status">' + icon('search', 'icon-sm') + ' Cek Status Pengajuan</button>' +
            '<button type="button" class="btn" style="background:#FFFFFF;color:var(--brand-primary)" data-nav="public:layanan">Lihat Persyaratan Layanan</button>' +
          '</div>' +
        '</div>' +
        '<div class="hero-art">' + ill.heroVillage() + '</div>' +
      '</div>' +
    '</div></div>' +

    '<!-- Statistik Agregat -->' +
    '<section class="pub-section"><div class="container">' +
      '<div class="section-head">' +
        '<div><div class="section-eyebrow">Satu Sumber Data Tervalidasi</div><h2 class="t-h2">Ringkasan Statistik Kependudukan</h2></div>' +
        '<button type="button" class="btn btn-sm btn-outline" data-nav="public:statistik">Lihat Grafik Lengkap ' + icon('arrowRight', 'icon-sm') + '</button>' +
      '</div>' +
      statsBlock +
    '</div></section>' +

    '<!-- Pintasan Layanan Desa -->' +
    '<section class="pub-section"><div class="container">' +
      '<div class="section-head">' +
        '<div><div class="section-eyebrow">Pelayanan Publik Inklusif</div><h2 class="t-h2">Pintasan Layanan Administrasi Desa</h2></div>' +
        '<button type="button" class="btn btn-sm btn-soft" data-nav="public:layanan">Semua 8 Layanan Desa ' + icon('arrowRight', 'icon-sm') + '</button>' +
      '</div>' +
      '<div class="grid-4">' +
        topServices.map(function (sv) {
          return '<button type="button" class="shortcut-card" data-action="open-service-detail" data-id="' + esc(sv.id) + '">' +
            '<div class="flex items-center justify-between w-full">' +
              '<div class="stat-icon-box" style="width:36px;height:36px;border-radius:10px">' + icon('file', 'icon-sm') + '</div>' +
              '<span class="badge ' + (sv.onlineEnabled ? 'badge-emerald' : 'badge-neutral') + '">' + (sv.onlineEnabled ? 'Online Aktif' : 'Loket Tatap Muka') + '</span>' +
            '</div>' +
            '<div style="font-weight:700;font-size:15px;color:var(--ink)">' + esc(sv.name) + '</div>' +
            '<div class="t-caption t-muted">' + esc(sv.estimate) + ' • ' + esc(sv.fee) + '</div>' +
          '</button>';
        }).join('') +
      '</div>' +
    '</div></section>' +

    '<!-- Berita & Pengumuman Terbaru -->' +
    '<section class="pub-section"><div class="container">' +
      '<div class="grid" style="grid-template-columns:1.35fr 0.95fr;gap:24px;align-items:start">' +
        '<div>' +
          '<div class="section-head">' +
            '<div><div class="section-eyebrow">Kabar Terkini</div><h2 class="t-h2">Berita Desa Terbaru</h2></div>' +
            '<button type="button" class="btn btn-sm btn-outline" data-nav="public:berita">Semua Berita</button>' +
          '</div>' +
          '<div class="flex-col gap-16">' +
            pubNews.map(function (n) {
              return '<article class="card card-interactive flex gap-16 items-center" style="padding:14px;cursor:pointer" data-action="open-news-detail" data-id="' + esc(n.id) + '">' +
                '<div style="width:170px;flex-shrink:0" class="news-thumb">' + ill.cardScene(n.scene, n.title) + '</div>' +
                '<div class="flex-1">' +
                  '<div class="flex items-center gap-8 mb-8"><span class="badge badge-navy">' + esc(n.category) + '</span><span class="t-caption t-muted">' + esc(n.date) + '</span></div>' +
                  '<h3 class="t-h3" style="font-size:16px">' + esc(n.title) + '</h3>' +
                  '<p class="t-sm t-muted mt-4">' + esc(n.summary) + '</p>' +
                '</div>' +
              '</article>';
            }).join('') +
          '</div>' +
        '</div>' +

        '<div>' +
          '<div class="section-head">' +
            '<div><div class="section-eyebrow">Informasi Resmi</div><h2 class="t-h2">Pengumuman Terbaru</h2></div>' +
            '<button type="button" class="btn btn-sm btn-outline" data-nav="public:pengumuman">Semua Pengumuman</button>' +
          '</div>' +
          '<div class="flex-col gap-12">' +
            pubAnns.map(function (a) {
              return '<div class="' + (a.important ? 'ann-pinned' : 'card') + '" style="padding:16px;cursor:pointer" data-action="open-ann-detail" data-id="' + esc(a.id) + '">' +
                '<div class="flex items-center justify-between gap-8 mb-8">' +
                  (a.important ? '<span class="badge badge-warning"><span class="badge-dot"></span>PENTING</span>' : '<span class="badge badge-neutral">' + esc(a.category) + '</span>') +
                  '<span class="t-caption t-muted">Berlaku s.d. ' + esc(a.validUntil) + '</span>' +
                '</div>' +
                '<div style="font-weight:700;font-size:15px;color:var(--ink)">' + esc(a.title) + '</div>' +
                '<p class="t-sm t-secondary mt-4">' + esc(a.body.slice(0, 118)) + '…</p>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div></section>' +

    '<!-- Sambutan Kades & Sekilas Desa (Satu Sumber dengan Profil Desa BR-K04) -->' +
    '<section class="pub-section"><div class="container">' +
      '<div class="card sambutan-card">' +
        '<div class="kades-portrait">' + ill.avatar('AS', '#1B3A5C') + '</div>' +
        '<div>' +
          '<div class="section-eyebrow">Sambutan Kepala Desa (Satu Sumber dengan Profil Desa)</div>' +
          '<h2 class="t-h2 mt-4">' + esc(s.kadesName) + '</h2>' +
          '<div class="t-caption t-muted mb-12">' + esc(s.kadesTitle) + ' • ' + esc(s.kadesPeriod) + '</div>' +
          '<p class="t-body t-secondary" style="font-style:italic">“' + esc(s.kadesGreeting) + '”</p>' +
          '<div class="flex items-center gap-12 mt-16">' +
            '<button type="button" class="btn btn-sm btn-primary" data-nav="public:profil">Baca Profil Lengkap Desa</button>' +
            '<button type="button" class="btn btn-sm btn-outline" data-nav="public:kontak">Hubungi Kantor Desa</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div></section>' +

    '<!-- Potensi Unggulan & Galeri Pilihan -->' +
    '<section class="pub-section"><div class="container">' +
      '<div class="section-head">' +
        '<div><div class="section-eyebrow">Ekonomi &amp; Wisata</div><h2 class="t-h2">Potensi Unggulan Desa</h2></div>' +
        '<div class="flex gap-8">' +
          '<button type="button" class="btn btn-sm btn-outline" data-nav="public:peta">' + icon('map', 'icon-sm') + ' Peta Desa</button>' +
          '<button type="button" class="btn btn-sm btn-soft" data-nav="public:potensi">Katalog Potensi</button>' +
        '</div>' +
      '</div>' +
      '<div class="grid-4">' +
        pubPots.map(function (p) {
          return '<div class="card card-interactive flex-col gap-12" style="padding:14px;cursor:pointer" data-action="open-potensi-detail" data-id="' + esc(p.id) + '">' +
            '<div class="news-thumb">' + ill.cardScene(p.scene, p.name) + '</div>' +
            '<div>' +
              '<span class="badge badge-emerald">' + esc(p.category) + '</span>' +
              '<h3 class="t-h3 mt-8" style="font-size:15.5px">' + esc(p.name) + '</h3>' +
              '<div class="t-caption t-muted mt-4">' + esc(p.location) + '</div>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +

      '<div class="section-head mt-32">' +
        '<div><div class="section-eyebrow">Dokumentasi</div><h2 class="t-h2">Galeri Foto &amp; Video Pilihan</h2></div>' +
        '<button type="button" class="btn btn-sm btn-outline" data-nav="public:gallery">Lihat Semua Galeri</button>' +
      '</div>' +
      '<div class="grid-3">' +
        pubGal.map(function (g) {
          return '<div class="card card-interactive flex-col gap-12" style="padding:14px;cursor:pointer" data-action="open-gallery-detail" data-id="' + esc(g.id) + '">' +
            '<div class="news-thumb">' + ill.cardScene(g.scene, g.title) + '</div>' +
            '<div class="flex items-center justify-between"><span class="badge badge-navy">' + esc(g.type) + '</span><span class="t-caption t-muted">' + esc(g.date) + '</span></div>' +
            '<div style="font-weight:600;font-size:15px">' + esc(g.title) + '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div></section>';
  }

  function renderProfil() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var ill = w.DesaApp.illustrations;
    var s = st.data.site;
    var pr = st.data.profil;
    var tab = st.profilTab;

    var tabs = [
      { id: 'identitas', label: 'Identitas & Sejarah' },
      { id: 'visimisi', label: 'Visi & Misi' },
      { id: 'pemerintahan', label: 'Pemerintahan & Perangkat' },
      { id: 'geografis', label: 'Geografis & Demografis' },
      { id: 'dokumen', label: 'Dokumen Publik' }
    ];

    var body = '';
    if (tab === 'identitas') {
      body = '<div class="grid-2">' +
        '<div class="card flex-col gap-12">' +
          '<h2 class="t-h2">Identitas Resmi Desa (Placeholder)</h2>' +
          '<table class="table"><tbody>' +
            '<tr><td class="t-muted" style="width:160px">Nama Desa</td><td><strong>' + esc(s.villageName) + '</strong></td></tr>' +
            '<tr><td class="t-muted">Kecamatan</td><td>' + esc(s.districtName) + '</td></tr>' +
            '<tr><td class="t-muted">Kabupaten</td><td>' + esc(s.regencyName) + '</td></tr>' +
            '<tr><td class="t-muted">Alamat Kantor</td><td>' + esc(s.officeAddress) + '</td></tr>' +
            '<tr><td class="t-muted">Kontak &amp; Jam</td><td>' + esc(s.phone) + ' • ' + esc(s.officeHours) + '</td></tr>' +
          '</tbody></table>' +
        '</div>' +
        '<div class="card flex-col gap-12">' +
          '<h2 class="t-h2">Sejarah Singkat Desa</h2>' +
          '<p class="t-body t-secondary">' + esc(pr.sejarah) + '</p>' +
          '<div class="alert alert-info mt-8">' + icon('info') + '<div><strong>Satu Sumber Sambutan:</strong> “' + esc(s.kadesGreeting.slice(0, 150)) + '…” — <em>' + esc(s.kadesName) + '</em></div></div>' +
        '</div>' +
      '</div>';
    } else if (tab === 'visimisi') {
      body = '<div class="grid" style="grid-template-columns:1fr 1.3fr;gap:20px">' +
        '<div class="card" style="background:linear-gradient(145deg,#1B3A5C,#1E7A5F);color:#fff">' +
          '<div class="t-caption" style="color:#A7F3D0;text-transform:uppercase">Visi Pemerintah Desa</div>' +
          '<h2 class="t-h2 mt-12" style="color:#fff;line-height:1.45">“' + esc(pr.visi) + '”</h2>' +
        '</div>' +
        '<div class="card">' +
          '<h2 class="t-h2 mb-16">Misi Pembangunan &amp; Pelayanan</h2>' +
          '<div class="flex-col gap-12">' +
            pr.misi.map(function (m, i) {
              return '<div class="flex gap-12 items-start"><span class="badge badge-emerald">' + (i + 1) + '</span><p class="t-body">' + esc(m) + '</p></div>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>';
    } else if (tab === 'pemerintahan') {
      body = '<div class="card mb-20">' +
        '<h2 class="t-h2 mb-16">Struktur Pemerintahan Desa (Bagian dari Profil Desa)</h2>' +
        '<div class="org-tree">' +
          '<div class="org-node is-head"><div class="t-caption" style="color:#A7F3D0">Kepala Desa</div><div style="font-weight:700">' + esc(s.kadesName) + '</div></div>' +
          '<div class="org-node"><div class="t-caption t-muted">Sekretaris Desa</div><div style="font-weight:700">Drs. Wahyu Hidayat</div></div>' +
          '<div class="org-row">' +
            '<div class="org-node"><div class="t-caption t-muted">Kasi Pelayanan</div><div style="font-weight:600">Budi Santoso</div></div>' +
            '<div class="org-node"><div class="t-caption t-muted">Kasi Kesejahteraan</div><div style="font-weight:600">Hendra Wijaya</div></div>' +
            '<div class="org-node"><div class="t-caption t-muted">Kaur TU &amp; Perencanaan</div><div style="font-weight:600">Siti Aminah &amp; Dewi Lestari</div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<h2 class="t-h2 mb-16">Perangkat Desa</h2>' +
      '<div class="grid-4">' +
        pr.perangkat.map(function (p) {
          return '<div class="card flex-col items-center" style="text-align:center">' +
            '<div style="width:76px;height:76px;margin-bottom:10px">' + ill.avatar(p.inisial, p.warna) + '</div>' +
            '<div style="font-weight:700">' + esc(p.nama) + '</div>' +
            '<div class="badge badge-emerald mt-4">' + esc(p.jabatan) + '</div>' +
            '<div class="t-caption t-muted mt-8">' + esc(p.bidang) + '</div>' +
          '</div>';
        }).join('') +
      '</div>';
    } else if (tab === 'geografis') {
      var g = pr.geografis;
      body = '<div class="grid-2 mb-20">' +
        '<div class="card">' +
          '<h2 class="t-h2 mb-12">Kondisi Geografis &amp; Batas Wilayah (Contoh)</h2>' +
          '<table class="table"><tbody>' +
            '<tr><td class="t-muted">Luas Wilayah</td><td><strong>' + esc(g.luas) + '</strong></td></tr>' +
            '<tr><td class="t-muted">Ketinggian</td><td>' + esc(g.ketinggian) + '</td></tr>' +
            '<tr><td class="t-muted">Sebelah Utara</td><td>' + esc(g.batasUtara) + '</td></tr>' +
            '<tr><td class="t-muted">Sebelah Selatan</td><td>' + esc(g.batasSelatan) + '</td></tr>' +
            '<tr><td class="t-muted">Sebelah Barat / Timur</td><td>' + esc(g.batasBarat) + ' / ' + esc(g.batasTimur) + '</td></tr>' +
          '</tbody></table>' +
        '</div>' +
        '<div class="card">' +
          '<h2 class="t-h2 mb-12">Pembagian Wilayah (Dusun / RW / RT)</h2>' +
          '<table class="table"><thead><tr><th>Dusun</th><th>RW</th><th>RT</th><th>KK</th><th>Jiwa (Agregat)</th></tr></thead><tbody>' +
            g.dusun.map(function (d) {
              return '<tr><td><strong>' + esc(d.nama) + '</strong></td><td>' + d.rw + '</td><td>' + d.rt + '</td><td>' + d.kk + '</td><td>' + d.jiwa.toLocaleString('id-ID') + '</td></tr>';
            }).join('') +
          '</tbody></table>' +
        '</div>' +
      '</div>' +
      '<div class="card"><h2 class="t-h2 mb-12">Sarana dan Prasarana Desa</h2>' +
        '<table class="table"><thead><tr><th>Fasilitas</th><th>Jumlah</th><th>Kondisi</th><th>Lokasi</th></tr></thead><tbody>' +
          pr.sarpras.map(function (sp) {
            return '<tr><td><strong>' + esc(sp.nama) + '</strong></td><td>' + esc(sp.jumlah) + '</td><td><span class="badge badge-navy">' + esc(sp.kondisi) + '</span></td><td>' + esc(sp.lokasi) + '</td></tr>';
          }).join('') +
        '</tbody></table>' +
      '</div>';
    } else {
      body = '<div class="card">' +
        '<h2 class="t-h2 mb-16">Dokumen Profil Desa yang Boleh Dipublikasikan</h2>' +
        '<div class="flex-col gap-12">' +
          pr.dokumen.map(function (doc) {
            return '<div class="flex items-center justify-between gap-16" style="padding:14px;border:1px solid var(--line-subtle);border-radius:14px">' +
              '<div class="flex items-center gap-12"><div class="stat-icon-box">' + icon('file') + '</div><div><div style="font-weight:600">' + esc(doc.judul) + '</div><div class="t-caption t-muted">' + esc(doc.ukuran) + ' • Tahun ' + esc(doc.tahun) + ' • ' + esc(doc.ket) + '</div></div></div>' +
              '<button type="button" class="btn btn-sm btn-outline" data-action="toast" data-msg="Simulasi unduh dokumen publik: ' + esc(doc.judul) + '">' + icon('download', 'icon-sm') + ' Unduh</button>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>';
    }

    return '<section class="page-banner"><div class="container">' +
      '<div class="breadcrumb"><button type="button" data-nav="public:home">Home</button><span>/</span><span>Profil Desa</span></div>' +
      '<h1 class="t-h1">Profil Resmi ' + esc(s.villageName) + '</h1>' +
      '<p class="t-secondary t-sm mt-4">Identitas desa, sejarah, visi-misi, struktur pemerintahan, perangkat desa, kondisi geografis, dan dokumen publik.</p>' +
      '<div class="seg-tabs mt-16">' +
        tabs.map(function (t) {
          return '<button type="button" class="seg-tab' + (tab === t.id ? ' is-active' : '') + '" data-action="set-tab" data-key="profilTab" data-val="' + t.id + '">' + t.label + '</button>';
        }).join('') +
      '</div>' +
    '</div></section>' +
    '<div class="container" style="padding-bottom:36px">' + body + '</div>';
  }

  function renderStatistik() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var charts = w.DesaApp.charts;
    var stat = st.data.statistik;

    return '<section class="page-banner"><div class="container">' +
      '<div class="breadcrumb"><button type="button" data-nav="public:home">Home</button><span>/</span><span>Data Desa</span><span>/</span><span>Statistik Kependudukan</span></div>' +
      '<div class="flex items-center justify-between flex-wrap gap-16">' +
        '<div>' +
          '<h1 class="t-h1">Statistik Kependudukan Publik (Agregat)</h1>' +
          '<p class="t-secondary t-sm mt-4">Bersumber dari satu modul Data Kependudukan internal dan hanya tampil setelah disetujui Kepala Desa.</p>' +
        '</div>' +
        '<label class="switch card card-flat" style="padding:10px 14px;border-radius:14px">' +
          '<input type="checkbox" ' + (stat.published ? 'checked' : '') + ' data-action="toggle-pub-stat">' +
          '<span class="switch-track"><span class="switch-thumb"></span></span>' +
          '<span class="t-caption">Simulasi Persetujuan Publikasi: <strong>' + (stat.published ? 'Disetujui' : 'Belum Disetujui (Empty State)') + '</strong></span>' +
        '</label>' +
      '</div>' +
    '</div></section>' +
    '<div class="container" style="padding-bottom:36px">' +
      '<div class="alert alert-info mb-20">' + icon('shield') + '<div><strong>Jaminan Privasi (PRD 8.8 &amp; UU PDP):</strong> Endpoint dan halaman publik <strong>tidak pernah</strong> menampilkan NIK, Nomor KK, nama, atau alamat rinci warga. Kelompok dengan jumlah sangat kecil (&lt;' + st.data.site.smallGroupThreshold + ' jiwa) disembunyikan otomatis.</div></div>' +
      (stat.published ? (
        '<div class="grid-4 mb-20">' +
          '<div class="stat-card"><div class="stat-card-top"><div class="stat-icon-box">' + icon('users') + '</div><span class="stat-pill">Data contoh per ' + esc(stat.approvedAt) + '</span></div><div><div class="stat-value">' + stat.totalPenduduk.toLocaleString('id-ID') + '</div><div class="stat-label">Total Penduduk</div></div></div>' +
          '<div class="stat-card"><div class="stat-card-top"><div class="stat-icon-box is-navy">' + icon('home') + '</div><span class="stat-pill">Agregat</span></div><div><div class="stat-value">' + stat.totalKK.toLocaleString('id-ID') + '</div><div class="stat-label">Kepala Keluarga</div></div></div>' +
          '<div class="stat-card"><div class="stat-card-top"><div class="stat-icon-box is-info">' + icon('user') + '</div><span class="stat-pill">50,7%</span></div><div><div class="stat-value">' + stat.lakiLaki.toLocaleString('id-ID') + '</div><div class="stat-label">Laki-laki</div></div></div>' +
          '<div class="stat-card"><div class="stat-card-top"><div class="stat-icon-box">' + icon('user') + '</div><span class="stat-pill">49,3%</span></div><div><div class="stat-value">' + stat.perempuan.toLocaleString('id-ID') + '</div><div class="stat-label">Perempuan</div></div></div>' +
        '</div>' +
        '<div class="grid-2 mb-20">' +
          '<div class="card"><h2 class="t-h3 mb-16">Komposisi Jenis Kelamin</h2>' +
            charts.donut([
              { label: 'Laki-laki', value: stat.lakiLaki, color: '#1B3A5C' },
              { label: 'Perempuan', value: stat.perempuan, color: '#1E7A5F' }
            ], stat.totalPenduduk.toLocaleString('id-ID'), 'Total Jiwa') +
          '</div>' +
          '<div class="card"><h2 class="t-h3 mb-16">Persebaran Penduduk per Dusun</h2>' +
            charts.vBar(st.data.profil.geografis.dusun.map(function (d) { return { label: d.nama, short: d.nama.replace('Dusun ', ''), value: d.jiwa }; }), { title: 'Penduduk per Dusun' }) +
          '</div>' +
        '</div>' +
        '<div class="grid-2">' +
          '<div class="card"><h2 class="t-h3 mb-16">Penduduk per Kelompok Usia</h2>' +
            charts.hBar(stat.kelompokUsia.map(function (u) { return { label: u.label, value: u.jumlah, suffix: 'jiwa' }; })) +
          '</div>' +
          '<div class="card"><h2 class="t-h3 mb-16">Ringkasan Tingkat Pendidikan</h2>' +
            charts.hBar(stat.pendidikan.map(function (p) { return { label: p.label, value: p.jumlah, suffix: 'jiwa', color: '#1B3A5C' }; })) +
          '</div>' +
        '</div>'
      ) : (
        '<div class="empty-state">' +
          '<div class="empty-state-icon">' + icon('chart', 'icon-lg') + '</div>' +
          '<h2 class="t-h2">Data sedang diperbarui</h2>' +
          '<p class="t-sm t-muted" style="max-width:520px">Belum ada snapshot statistik yang disetujui untuk dipublikasikan. Sistem tidak menampilkan angka perkiraan seolah-olah data resmi (BR-T03).</p>' +
        '</div>'
      )) +
    '</div>';
  }

  function renderPotensi() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var ill = w.DesaApp.illustrations;
    var cats = ['Semua', 'Pertanian', 'Perkebunan', 'Peternakan', 'Perikanan', 'Pariwisata', 'UMKM dan industri lokal', 'Kerajinan dan produk unggulan', 'Budaya dan tradisi', 'SDA', 'SDM', 'Ekonomi lainnya'];

    var list = st.data.potentials.filter(function (p) {
      if (p.status !== 'Dipublikasikan') return false;
      var cOk = st.potensiCategory === 'Semua' || p.category === st.potensiCategory;
      var q = st.potensiSearch.trim().toLowerCase();
      var qOk = !q || p.name.toLowerCase().indexOf(q) !== -1 || p.desc.toLowerCase().indexOf(q) !== -1 || p.location.toLowerCase().indexOf(q) !== -1;
      return cOk && qOk;
    });

    return '<section class="page-banner"><div class="container">' +
      '<div class="breadcrumb"><button type="button" data-nav="public:home">Home</button><span>/</span><span>Data Desa</span><span>/</span><span>Potensi Desa</span></div>' +
      '<div class="flex items-center justify-between flex-wrap gap-16">' +
        '<div><h1 class="t-h1">Katalog Potensi Desa</h1><p class="t-secondary t-sm mt-4">Informasi pertanian, UMKM, kerajinan, wisata, dan budaya desa yang terhubung ke Peta Administrasi.</p></div>' +
        '<div class="input-with-icon" style="width:300px">' + icon('search', 'icon-sm icon-left') +
          '<input class="input" type="text" placeholder="Cari produk, wisata, atau dusun..." value="' + esc(st.potensiSearch) + '" data-action="filter-search" data-key="potensiSearch">' +
        '</div>' +
      '</div>' +
      '<div class="chip-row mt-16">' +
        cats.map(function (c) {
          return '<button type="button" class="chip' + (st.potensiCategory === c ? ' is-active' : '') + '" data-action="set-tab" data-key="potensiCategory" data-val="' + esc(c) + '">' + esc(c) + '</button>';
        }).join('') +
      '</div>' +
    '</div></section>' +
    '<div class="container" style="padding-bottom:36px">' +
      (list.length ? '<div class="grid-3">' + list.map(function (p) {
        return '<div class="card card-interactive flex-col gap-12" style="padding:16px">' +
          '<div class="news-thumb">' + ill.cardScene(p.scene, p.name) + '</div>' +
          '<div class="flex items-center justify-between gap-8"><span class="badge badge-emerald">' + esc(p.category) + '</span><span class="t-caption t-muted">' + esc(p.location) + '</span></div>' +
          '<h2 class="t-h3">' + esc(p.name) + '</h2>' +
          '<p class="t-sm t-secondary">' + esc(p.desc) + '</p>' +
          '<div class="t-caption t-muted">Produk: <strong>' + esc(p.product) + '</strong></div>' +
          '<div class="flex gap-8 mt-8">' +
            '<button type="button" class="btn btn-sm btn-primary flex-1" data-action="open-potensi-detail" data-id="' + esc(p.id) + '">Detail Potensi</button>' +
            (p.markerId ? '<button type="button" class="btn btn-sm btn-soft" data-action="jump-map-marker" data-marker="' + esc(p.markerId) + '">' + icon('pin', 'icon-sm') + ' Peta</button>' : '') +
          '</div>' +
        '</div>';
      }).join('') + '</div>' : '<div class="empty-state"><div class="empty-state-icon">' + icon('leaf', 'icon-lg') + '</div><h3 class="t-h3">Belum ada item potensi pada kategori ini</h3><p class="t-sm t-muted">Coba pilih kategori lain atau hapus kata kunci pencarian.</p></div>') +
    '</div>';
  }

  function renderLayanan() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;

    var list = st.data.services.filter(function (sv) {
      if (st.layananFilter === 'Online') return sv.onlineEnabled;
      if (st.layananFilter === 'Tatap Muka') return !sv.onlineEnabled;
      return true;
    });

    return '<section class="page-banner"><div class="container">' +
      '<div class="breadcrumb"><button type="button" data-nav="public:home">Home</button><span>/</span><span>Layanan Desa</span><span>/</span><span>Informasi Layanan</span></div>' +
      '<div class="flex items-center justify-between flex-wrap gap-16">' +
        '<div>' +
          '<h1 class="t-h1">Informasi &amp; Persyaratan Layanan Desa</h1>' +
          '<p class="t-secondary t-sm mt-4">Seluruh syarat, alur, estimasi waktu, dan keterangan biaya gratis dapat dibaca publik <strong>tanpa perlu login</strong> (LYN-03).</p>' +
        '</div>' +
        '<div class="flex gap-8">' +
          '<button type="button" class="btn btn-outline" data-nav="public:cek-status">' + icon('search', 'icon-sm') + ' Cek Status Surat</button>' +
          '<button type="button" class="btn btn-accent" data-nav="public:ajukan-surat">' + icon('upload', 'icon-sm') + ' Ajukan Surat Online</button>' +
        '</div>' +
      '</div>' +
      '<div class="seg-tabs mt-16">' +
        ['Semua', 'Online', 'Tatap Muka'].map(function (f) {
          return '<button type="button" class="seg-tab' + (st.layananFilter === f ? ' is-active' : '') + '" data-action="set-tab" data-key="layananFilter" data-val="' + f + '">' + (f === 'Semua' ? 'Semua Layanan (' + st.data.services.length + ')' : f === 'Online' ? 'Bisa Ajukan Online' : 'Khusus Loket Tatap Muka') + '</button>';
        }).join('') +
      '</div>' +
    '</div></section>' +
    '<div class="container" style="padding-bottom:36px">' +
      '<div class="alert alert-emerald mb-20">' + icon('info') + '<div><strong>Pelayanan Tetap Inklusif (BR-S14):</strong> Warga yang tidak bisa menggunakan layanan online tetap dilayani langsung di loket Kantor Desa dengan alur verifikasi dan arsip yang seragam. Tombol <em>Ajukan Online</em> hanya tampil pada layanan yang diaktifkan admin (LYN-04).</div></div>' +
      '<div class="grid-2">' +
        list.map(function (sv) {
          return '<div class="card flex-col gap-12">' +
            '<div class="flex items-start justify-between gap-12">' +
              '<div>' +
                '<span class="badge badge-navy">' + esc(sv.kategori) + '</span>' +
                '<h2 class="t-h3 mt-8">' + esc(sv.name) + '</h2>' +
              '</div>' +
              '<span class="badge ' + (sv.onlineEnabled ? 'badge-emerald' : 'badge-neutral') + '"><span class="badge-dot"></span>' + (sv.onlineEnabled ? 'Online Aktif' : 'Tatap Muka Saja') + '</span>' +
            '</div>' +
            '<p class="t-sm t-secondary">' + esc(sv.desc) + '</p>' +
            '<div class="flex flex-wrap gap-16 t-caption t-muted" style="padding:10px 12px;background:var(--surface-alt);border-radius:12px">' +
              '<span><strong>Estimasi:</strong> ' + esc(sv.estimate) + '</span>' +
              '<span><strong>Biaya:</strong> ' + esc(sv.fee) + '</span>' +
              '<span><strong>Unduh PDF Warga:</strong> ' + (sv.allowCitizenDownload ? 'Diizinkan' : 'Ambil Fisik') + '</span>' +
            '</div>' +
            '<div><div class="t-caption t-muted mb-4">PERSYARATAN UTAMA:</div><ul class="t-sm flex-col gap-4">' +
              sv.requirements.map(function (rq) { return '<li class="flex items-center gap-8">' + icon('check', 'icon-sm') + '<span>' + esc(rq) + '</span></li>'; }).join('') +
            '</ul></div>' +
            '<div class="flex items-center justify-between gap-10 mt-8">' +
              '<button type="button" class="btn btn-sm btn-outline" data-action="open-service-detail" data-id="' + esc(sv.id) + '">Lihat Alur &amp; Detail</button>' +
              (sv.onlineEnabled
                ? '<button type="button" class="btn btn-sm btn-accent" data-action="start-online-letter" data-id="' + esc(sv.id) + '">Ajukan Online ' + icon('arrowRight', 'icon-sm') + '</button>'
                : '<span class="t-caption t-muted">Silakan hadir di loket kantor desa</span>'
              ) +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
  }

  function renderAjukanSurat() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var onlineServices = st.data.services.filter(function (s) { return s.onlineEnabled; });
    var d = st.wizardDraft;
    var selectedSvc = onlineServices.find(function (s) { return s.id === d.serviceId; }) || onlineServices[0];
    if (selectedSvc && d.serviceId !== selectedSvc.id) d.serviceId = selectedSvc.id;

    var content = '';
    if (!onlineServices.length) {
      content = '<div class="empty-state" style="max-width:700px;margin:0 auto">' +
        '<div class="empty-state-icon">' + icon('building', 'icon-lg') + '</div>' +
        '<h2 class="t-h2">Pengajuan Online Sedang Dinonaktifkan Sementara</h2>' +
        '<p class="t-sm t-muted" style="max-width:520px">Saat ini belum ada layanan dengan opsi pengajuan online aktif (LYN-04). Pelayanan administrasi tetap dilayani langsung di loket Kantor Desa pada jam kerja.</p>' +
        '<div class="flex gap-8 mt-8"><button type="button" class="btn btn-primary" data-nav="public:layanan">Lihat Syarat Layanan</button><button type="button" class="btn btn-outline" data-nav="public:kontak">Jam &amp; Lokasi Kantor</button></div>' +
      '</div>';
    } else if (st.wizardStep === 4 && st.lastSubmittedRegNo) {
      content = '<div class="card" style="max-width:700px;margin:0 auto;text-align:center;padding:34px">' +
        '<div class="empty-state-icon" style="margin:0 auto 12px;background:var(--accent-soft);color:var(--brand-accent)">' + icon('checkCircle', 'icon-xl') + '</div>' +
        '<h2 class="t-h1">Pengajuan Berhasil Dikirim!</h2>' +
        '<p class="t-body t-secondary mt-8">Simpan Nomor Registrasi unik di bawah ini untuk memantau status verifikasi, memperbaiki berkas bila diminta petugas, atau mengunduh surat.</p>' +
        '<div class="card card-flat mt-20" style="background:var(--navy-soft);border-color:var(--brand-primary)">' +
          '<div class="t-caption t-muted">NOMOR REGISTRASI UNIK ANDA</div>' +
          '<div class="t-h1 t-mono mt-4" style="color:var(--brand-primary);letter-spacing:0.04em">' + esc(st.lastSubmittedRegNo) + '</div>' +
          '<div class="t-sm mt-8">' + statusBadge('Diajukan') + '</div>' +
        '</div>' +
        '<div class="flex justify-center gap-12 mt-24">' +
          '<button type="button" class="btn btn-accent" data-nav="public:cek-status">' + icon('search', 'icon-sm') + ' Lacak di Cek Status Sekarang</button>' +
          '<button type="button" class="btn btn-outline" data-action="reset-wizard">Ajukan Surat Lain</button>' +
        '</div>' +
      '</div>';
    } else {
      content = '<div class="card" style="max-width:860px;margin:0 auto">' +
        '<div class="stepper mb-24">' +
          '<div class="step-item ' + (st.wizardStep >= 1 ? (st.wizardStep > 1 ? 'is-done' : 'is-active') : '') + '"><div class="step-circle">1</div><div><div class="t-sm" style="font-weight:600">Pilih Layanan</div><div class="t-caption t-muted">Syarat &amp; ketentuan</div></div><div class="step-line"></div></div>' +
          '<div class="step-item ' + (st.wizardStep >= 2 ? (st.wizardStep > 2 ? 'is-done' : 'is-active') : '') + '"><div class="step-circle">2</div><div><div class="t-sm" style="font-weight:600">Data &amp; Berkas</div><div class="t-caption t-muted">Identitas &amp; lampiran</div></div><div class="step-line"></div></div>' +
          '<div class="step-item ' + (st.wizardStep >= 3 ? 'is-active' : '') + '"><div class="step-circle">3</div><div><div class="t-sm" style="font-weight:600">Konfirmasi</div><div class="t-caption t-muted">Kirim ke petugas</div></div></div>' +
        '</div>' +

        (st.wizardStep === 1 ? (
          '<div class="flex-col gap-16">' +
            '<div class="field">' +
              '<label class="field-label" for="wiz-service">Jenis Layanan Surat (Hanya yang opsi online-nya aktif)</label>' +
              '<select id="wiz-service" class="select" data-action="wiz-select-service">' +
                onlineServices.map(function (sv) {
                  return '<option value="' + esc(sv.id) + '"' + (selectedSvc && selectedSvc.id === sv.id ? ' selected' : '') + '>' + esc(sv.name) + ' (' + esc(sv.estimate) + ')</option>';
                }).join('') +
              '</select>' +
            '</div>' +
            (selectedSvc ? '<div class="card card-flat" style="background:var(--surface-alt)">' +
              '<h3 class="t-h3">' + esc(selectedSvc.name) + '</h3>' +
              '<p class="t-sm t-secondary mt-4">' + esc(selectedSvc.desc) + '</p>' +
              '<div class="t-caption t-muted mt-12 mb-8">DOKUMEN YANG HARUS DISIAPKAN:</div>' +
              '<ul class="flex-col gap-6 t-sm">' + selectedSvc.requirements.map(function (r) { return '<li class="flex items-center gap-8">' + icon('check', 'icon-sm') + esc(r) + '</li>'; }).join('') + '</ul>' +
            '</div>' : '') +
            '<div class="flex justify-end"><button type="button" class="btn btn-accent" data-action="wiz-next" data-step="2">Lanjut Isi Data Pemohon ' + icon('arrowRight', 'icon-sm') + '</button></div>' +
          '</div>'
        ) : st.wizardStep === 2 ? (
          '<form class="flex-col gap-16" data-form="wizard-step2">' +
            '<div class="grid-2">' +
              '<div class="field"><label class="field-label">Nama Lengkap Pemohon <span class="field-req">*</span></label><input class="input" name="applicantName" required placeholder="Masukkan nama sesuai KTP" value="' + esc(d.applicantName) + '"><span class="field-help">Gunakan data contoh untuk demo (mis. Andi Pratama)</span></div>' +
              '<div class="field"><label class="field-label">Tanggal Lahir Pemohon <span class="field-req">*</span></label><input class="input" type="date" name="dob" required value="' + esc(d.dob) + '"><span class="field-help">Dipakai sebagai verifikasi kedua saat Cek Status (9.2.2)</span></div>' +
              '<div class="field"><label class="field-label">NIK Pemohon (Opsional / Internal)</label><input class="input" name="nik" maxlength="16" placeholder="16 digit angka (contoh)" value="' + esc(d.nik) + '"><span class="field-help">Tidak pernah ditampilkan di halaman publik</span></div>' +
              '<div class="field"><label class="field-label">No. Telepon / WhatsApp <span class="field-req">*</span></label><input class="input" name="phone" required placeholder="08xx-xxxx-xxxx" value="' + esc(d.phone) + '"></div>' +
              '<div class="field"><label class="field-label">Email Notifikasi (Opsional)</label><input class="input" type="email" name="email" placeholder="nama@email.com (tidak wajib)" value="' + esc(d.email) + '"><span class="field-help">Bila diisi, notifikasi perubahan status dikirim via email tanpa data sensitif (BR-E01)</span></div>' +
              '<div class="field"><label class="field-label">Alamat / Dusun / RT / RW <span class="field-req">*</span></label><input class="input" name="address" required placeholder="Mis. Dusun Krajan RT 02 / RW 01" value="' + esc(d.address) + '"></div>' +
            '</div>' +
            '<div class="field"><label class="field-label">Keperluan Surat <span class="field-req">*</span></label><textarea class="textarea" name="purpose" required placeholder="Jelaskan keperluan pembuatan surat...">' + esc(d.purpose) + '</textarea></div>' +
            '<div class="field">' +
              '<label class="field-label">Unggah Dokumen Persyaratan (PDF/JPG/PNG maks 5 MB)</label>' +
              '<div class="dropzone" data-action="wiz-add-sample-doc">' +
                icon('upload', 'icon-lg') +
                '<div class="t-sm mt-8" style="font-weight:600">Klik untuk simulasi lampirkan berkas KTP, KK &amp; Pengantar RT/RW</div>' +
                '<div class="t-caption t-muted mt-4">' + (d.docs.length ? 'Terlampir: ' + esc(d.docs.join(', ')) : 'Belum ada file dipilih (klik kotak ini untuk melampirkan contoh berkas)') + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="flex justify-between">' +
              '<button type="button" class="btn btn-outline" data-action="wiz-next" data-step="1">' + icon('arrowLeft', 'icon-sm') + ' Kembali</button>' +
              '<button type="submit" class="btn btn-accent">Pratinjau &amp; Konfirmasi ' + icon('arrowRight', 'icon-sm') + '</button>' +
            '</div>' +
          '</form>'
        ) : (
          '<div class="flex-col gap-16">' +
            '<div class="alert alert-info">' + icon('info') + '<div>Pengajuan yang dikirim tidak otomatis disetujui. Berkas akan diperiksa oleh Petugas Pelayanan dan disetujui Kepala Desa sesuai ketentuan (BR-S04).</div></div>' +
            '<table class="table"><tbody>' +
              '<tr><td class="t-muted" style="width:180px">Layanan</td><td><strong>' + esc(selectedSvc ? selectedSvc.name : '') + '</strong></td></tr>' +
              '<tr><td class="t-muted">Nama Pemohon</td><td>' + esc(d.applicantName) + '</td></tr>' +
              '<tr><td class="t-muted">Tanggal Lahir</td><td>' + esc(d.dob) + '</td></tr>' +
              '<tr><td class="t-muted">Alamat</td><td>' + esc(d.address) + '</td></tr>' +
              '<tr><td class="t-muted">Keperluan</td><td>' + esc(d.purpose) + '</td></tr>' +
              '<tr><td class="t-muted">Dokumen</td><td>' + esc((d.docs.length ? d.docs : ['KTP_Pemohon.jpg', 'Pengantar_RT.jpg']).join(', ')) + '</td></tr>' +
            '</tbody></table>' +
            '<div class="flex justify-between">' +
              '<button type="button" class="btn btn-outline" data-action="wiz-next" data-step="2">' + icon('arrowLeft', 'icon-sm') + ' Ubah Isian</button>' +
              '<button type="button" class="btn btn-accent btn-lg" data-action="wiz-submit">' + icon('check', 'icon-sm') + ' Kirim Pengajuan Sekarang</button>' +
            '</div>' +
          '</div>'
        )) +
      '</div>';
    }

    return '<section class="page-banner"><div class="container">' +
      '<div class="breadcrumb"><button type="button" data-nav="public:home">Home</button><span>/</span><span>Layanan Desa</span><span>/</span><span>Pengajuan Surat Online</span></div>' +
      '<h1 class="t-h1">Pengajuan Surat Online (Tanpa Akun — Opsi B)</h1>' +
      '<p class="t-secondary t-sm mt-4">Warga dapat mengajukan permohonan langsung tanpa pendaftaran akun yang rumit; pelacakan memakai Nomor Registrasi unik + Tanggal Lahir.</p>' +
    '</div></section>' +
    '<div class="container" style="padding-bottom:44px">' + content + '</div>';
  }

  function renderCekStatus() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;

    var req = st.data.requests.find(function (r) { return r.id === st.cekResultId; });
    var svc = req ? st.data.services.find(function (s) { return s.id === req.serviceId; }) : null;

    var demoChips = st.data.requests.map(function (r) {
      return '<button type="button" class="chip' + (req && req.id === r.id ? ' is-active' : '') + '" data-action="quick-cek" data-id="' + esc(r.id) + '">' +
        '<span class="t-mono" style="font-size:11.5px">' + esc(r.regNo) + '</span> • ' + esc(r.status) +
      '</button>';
    }).join('');

    return '<section class="page-banner"><div class="container">' +
      '<div class="breadcrumb"><button type="button" data-nav="public:home">Home</button><span>/</span><span>Layanan Desa</span><span>/</span><span>Cek Status Pengajuan</span></div>' +
      '<h1 class="t-h1">Cek Status &amp; Riwayat Pengajuan Surat</h1>' +
      '<p class="t-secondary t-sm mt-4">Gunakan Nomor Registrasi unik dan Tanggal Lahir pemohon (faktor verifikasi kedua agar status orang lain tidak dapat diintip).</p>' +
    '</div></section>' +
    '<div class="container" style="padding-bottom:44px">' +
      '<div class="card mb-20">' +
        '<form class="grid" style="grid-template-columns:1.2fr 1fr auto;gap:14px;align-items:end" data-form="cek-status">' +
          '<div class="field"><label class="field-label">Nomor Registrasi Unik</label><input class="input t-mono" name="regNo" placeholder="REG-2026-XXXXX" value="' + esc(st.cekRegInput) + '" required></div>' +
          '<div class="field"><label class="field-label">Tanggal Lahir Pemohon (Verifikasi Kedua)</label><input class="input" type="date" name="dob" value="' + esc(st.cekDobInput) + '" required></div>' +
          '<button type="submit" class="btn btn-primary" style="height:41px">' + icon('search', 'icon-sm') + ' Lacak Status</button>' +
        '</form>' +
        (st.cekError ? '<div class="alert alert-danger mt-12">' + icon('alert') + '<div>' + esc(st.cekError) + '</div></div>' : '') +
        '<div class="mt-16"><div class="t-caption t-muted mb-8">PILIH CEPAT CONTOH KODE PELACAKAN (7 STATUS RESMI):</div><div class="chip-row">' + demoChips + '</div></div>' +
      '</div>' +

      (req ? (
        '<div class="grid" style="grid-template-columns:1.25fr 0.75fr;gap:20px;align-items:start">' +
          '<div class="card flex-col gap-16">' +
            '<div class="flex items-start justify-between flex-wrap gap-12">' +
              '<div>' +
                '<div class="t-mono t-caption t-muted">' + esc(req.regNo) + ' • ' + esc(req.channel) + '</div>' +
                '<h2 class="t-h2 mt-4">' + esc(req.serviceName) + '</h2>' +
                '<div class="t-sm t-secondary mt-4">Pemohon: <strong>' + esc(req.applicantName) + '</strong> • ' + esc(req.address) + '</div>' +
              '</div>' +
              statusBadge(req.status) +
            '</div>' +

            (req.reasonNote ? '<div class="alert ' + (req.status === 'Ditolak' ? 'alert-danger' : req.status === 'Perlu Perbaikan' ? 'alert-warning' : 'alert-emerald') + '">' +
              icon(req.status === 'Ditolak' || req.status === 'Perlu Perbaikan' ? 'alert' : 'info') +
              '<div><strong>Catatan Petugas / Pejabat:</strong><br>' + esc(req.reasonNote) + '</div>' +
            '</div>' : '') +

            (req.status === 'Perlu Perbaikan' ? (
              '<form class="card card-flat" style="background:var(--status-warning-soft);border-color:#F59E0B" data-form="citizen-revision" data-id="' + esc(req.id) + '">' +
                '<h3 class="t-h3" style="color:#92400E">Kirim Perbaikan Dokumen (BR-S06)</h3>' +
                '<p class="t-sm mt-4" style="color:#92400E">Unggah perbaikan berkas sesuai catatan di atas agar petugas dapat memverifikasi ulang.</p>' +
                '<div class="grid-2 mt-12">' +
                  '<div class="field"><label class="field-label">Nama Berkas Perbaikan (Simulasi)</label><input class="input" name="docName" value="Pengantar_RT_Jelas_Terbaru.jpg (920 KB)" required></div>' +
                  '<div class="field"><label class="field-label">Pesan untuk Petugas</label><input class="input" name="note" value="Sudah diunggah ulang dengan stempel RT lengkap." required></div>' +
                '</div>' +
                '<button type="submit" class="btn btn-accent mt-12">' + icon('upload', 'icon-sm') + ' Kirim Perbaikan Sekarang</button>' +
              '</form>'
            ) : '') +

            (req.status === 'Selesai / Diterbitkan' ? (
              '<div class="card card-flat" style="background:var(--accent-soft);border-color:var(--brand-accent)">' +
                '<div class="flex items-center justify-between flex-wrap gap-12">' +
                  '<div><div class="t-caption" style="color:var(--brand-accent);font-weight:700">NOMOR SURAT RESMI</div><div class="t-h3 t-mono mt-4">' + esc(req.letterNumber) + '</div></div>' +
                  (svc && !svc.allowCitizenDownload
                    ? '<span class="badge badge-navy">Pengambilan Fisik di Kantor Desa (BR-S13)</span>'
                    : '<button type="button" class="btn btn-accent" data-action="open-pdf-preview" data-id="' + esc(req.id) + '">' + icon('download', 'icon-sm') + ' Pratinjau &amp; Unduh Surat PDF</button>'
                  ) +
                '</div>' +
                '<p class="t-caption t-muted mt-8">Catatan keabsahan (BR-S10): PDF yang dihasilkan sistem bukan tanda tangan elektronik yang otomatis sah; pengesahan tetap mengikuti prosedur resmi desa.</p>' +
              '</div>'
            ) : '') +

            '<div>' +
              '<h3 class="t-h3 mb-12">Riwayat Proses Permohonan</h3>' +
              '<div class="timeline">' +
                req.history.map(function (h) {
                  return '<div class="timeline-item"><span class="timeline-dot"></span><div class="t-sm"><strong>' + esc(h.to) + '</strong> <span class="t-caption t-muted">• ' + esc(h.at) + '</span></div><div class="t-caption t-muted">' + esc(h.actor) + '</div><div class="t-sm t-secondary mt-4">' + esc(h.note) + '</div></div>';
                }).join('') +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div class="card flex-col gap-12">' +
            '<h3 class="t-h3">Dokumen Terlampir</h3>' +
            req.docs.map(function (doc) {
              return '<div class="flex items-center gap-10" style="padding:10px;border:1px solid var(--line-subtle);border-radius:12px">' + icon('file', 'icon-sm') + '<span class="t-sm">' + esc(doc) + '</span></div>';
            }).join('') +
            '<div class="alert alert-info mt-8">' + icon('info') + '<div class="t-caption">Sub-status internal seperti <em>Menunggu Persetujuan Pejabat</em> diringkas sebagai <strong>Sedang Diproses</strong> di sisi warga agar tidak membingungkan.</div></div>' +
          '</div>' +
        '</div>'
      ) : '') +
    '</div>';
  }

  function renderBerita() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var ill = w.DesaApp.illustrations;
    var cats = ['Semua', 'Pembangunan', 'Kesehatan', 'Ekonomi & UMKM', 'Pertanian', 'Pemerintahan'];

    var filtered = st.data.news.filter(function (n) {
      if (n.status !== 'Dipublikasikan') return false;
      var cOk = st.beritaCategory === 'Semua' || n.category === st.beritaCategory;
      var q = st.beritaSearch.trim().toLowerCase();
      var qOk = !q || n.title.toLowerCase().indexOf(q) !== -1 || n.summary.toLowerCase().indexOf(q) !== -1;
      return cOk && qOk;
    });

    var perPage = 4;
    var totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    var curPage = Math.min(st.beritaPage, totalPages);
    var items = filtered.slice((curPage - 1) * perPage, curPage * perPage);

    return '<section class="page-banner"><div class="container">' +
      '<div class="breadcrumb"><button type="button" data-nav="public:home">Home</button><span>/</span><span>Informasi</span><span>/</span><span>Berita Desa</span></div>' +
      '<div class="flex items-center justify-between flex-wrap gap-16">' +
        '<div><h1 class="t-h1">Berita &amp; Artikel Kegiatan Desa</h1><p class="t-secondary t-sm mt-4">Publikasi program pembangunan, kegiatan masyarakat, dan perkembangan desa terbaru.</p></div>' +
        '<div class="input-with-icon" style="width:280px">' + icon('search', 'icon-sm icon-left') +
          '<input class="input" type="text" placeholder="Cari berita desa..." value="' + esc(st.beritaSearch) + '" data-action="filter-search" data-key="beritaSearch">' +
        '</div>' +
      '</div>' +
      '<div class="chip-row mt-16">' +
        cats.map(function (c) {
          return '<button type="button" class="chip' + (st.beritaCategory === c ? ' is-active' : '') + '" data-action="set-tab" data-key="beritaCategory" data-val="' + esc(c) + '">' + esc(c) + '</button>';
        }).join('') +
      '</div>' +
    '</div></section>' +
    '<div class="container" style="padding-bottom:36px">' +
      (items.length ? '<div class="grid-2">' + items.map(function (n) {
        return '<article class="card card-interactive flex-col gap-12" style="padding:16px;cursor:pointer" data-action="open-news-detail" data-id="' + esc(n.id) + '">' +
          '<div class="news-thumb">' + ill.cardScene(n.scene, n.title) + '</div>' +
          '<div class="flex items-center justify-between"><span class="badge badge-navy">' + esc(n.category) + '</span><span class="t-caption t-muted">' + esc(n.date) + ' • ' + esc(n.author) + '</span></div>' +
          '<h2 class="t-h3">' + esc(n.title) + '</h2>' +
          '<p class="t-sm t-secondary">' + esc(n.summary) + '</p>' +
        '</article>';
      }).join('') + '</div>' : '<div class="empty-state"><h3 class="t-h3">Tidak ada berita ditemukan</h3></div>') +
      '<div class="pagination">' +
        '<span class="t-caption t-muted">Menampilkan ' + items.length + ' dari ' + filtered.length + ' berita terpublikasi</span>' +
        '<div class="page-nums">' +
          Array.from({ length: totalPages }, function (_, idx) {
            var p = idx + 1;
            return '<button type="button" class="page-btn' + (p === curPage ? ' is-active' : '') + '" data-action="set-tab" data-key="beritaPage" data-val="' + p + '">' + p + '</button>';
          }).join('') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderPengumuman() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;

    var items = st.data.announcements.filter(function (a) {
      if (st.pengumumanTab === 'aktif' && a.status !== 'Dipublikasikan') return false;
      if (st.pengumumanTab === 'arsip' && a.status !== 'Diarsipkan') return false;
      var q = st.pengumumanSearch.trim().toLowerCase();
      return !q || a.title.toLowerCase().indexOf(q) !== -1 || a.body.toLowerCase().indexOf(q) !== -1;
    }).sort(function (a, b) { return (b.important ? 1 : 0) - (a.important ? 1 : 0); });

    return '<section class="page-banner"><div class="container">' +
      '<div class="breadcrumb"><button type="button" data-nav="public:home">Home</button><span>/</span><span>Informasi</span><span>/</span><span>Pengumuman</span></div>' +
      '<div class="flex items-center justify-between flex-wrap gap-16">' +
        '<div><h1 class="t-h1">Pengumuman &amp; Agenda Resmi Desa</h1><p class="t-secondary t-sm mt-4">Pengumuman bertanda <strong>PENTING</strong> tampil teratas; pengumuman kedaluwarsa otomatis berpindah ke arsip tetapi tetap dapat dicari (BR-K02/K03).</p></div>' +
        '<div class="input-with-icon" style="width:280px">' + icon('search', 'icon-sm icon-left') +
          '<input class="input" type="text" placeholder="Cari pengumuman..." value="' + esc(st.pengumumanSearch) + '" data-action="filter-search" data-key="pengumumanSearch">' +
        '</div>' +
      '</div>' +
      '<div class="seg-tabs mt-16">' +
        '<button type="button" class="seg-tab' + (st.pengumumanTab === 'aktif' ? ' is-active' : '') + '" data-action="set-tab" data-key="pengumumanTab" data-val="aktif">Pengumuman Aktif</button>' +
        '<button type="button" class="seg-tab' + (st.pengumumanTab === 'arsip' ? ' is-active' : '') + '" data-action="set-tab" data-key="pengumumanTab" data-val="arsip">Arsip / Lewat Masa Berlaku</button>' +
      '</div>' +
    '</div></section>' +
    '<div class="container flex-col gap-16" style="padding-bottom:36px">' +
      (items.length ? items.map(function (a) {
        return '<div class="' + (a.important && a.status === 'Dipublikasikan' ? 'ann-pinned' : 'card') + '">' +
          '<div class="flex items-start justify-between gap-16">' +
            '<div>' +
              '<div class="flex items-center gap-8 mb-8">' +
                (a.important ? '<span class="badge badge-warning"><span class="badge-dot"></span>PENTING</span>' : '<span class="badge badge-navy">' + esc(a.category) + '</span>') +
                '<span class="t-caption t-muted">Terbit: ' + esc(a.date) + ' • Berlaku s.d. ' + esc(a.validUntil) + '</span>' +
              '</div>' +
              '<h2 class="t-h3">' + esc(a.title) + '</h2>' +
              '<p class="t-sm t-secondary mt-8">' + esc(a.body) + '</p>' +
              (a.attachment ? '<div class="mt-12"><span class="badge badge-neutral">' + icon('file', 'icon-sm') + ' Lampiran: ' + esc(a.attachment) + '</span></div>' : '') +
            '</div>' +
            '<button type="button" class="btn btn-sm btn-outline" data-action="open-ann-detail" data-id="' + esc(a.id) + '">Detail</button>' +
          '</div>' +
        '</div>';
      }).join('') : '<div class="empty-state"><h3 class="t-h3">Tidak ada pengumuman pada tab ini</h3></div>') +
    '</div>';
  }

  function renderBantuanPublic() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var pubPrograms = st.data.aidPrograms.filter(function (p) { return p.publicPublish; });

    return '<section class="page-banner"><div class="container">' +
      '<div class="breadcrumb"><button type="button" data-nav="public:home">Home</button><span>/</span><span>Informasi Bantuan</span></div>' +
      '<h1 class="t-h1">Informasi Program &amp; Rekap Penyaluran Bantuan</h1>' +
      '<p class="t-secondary t-sm mt-4">Transparansi program bantuan dan ringkasan penyaluran agregat yang diperbolehkan untuk dipublikasikan.</p>' +
      '<div class="seg-tabs mt-16">' +
        '<button type="button" class="seg-tab' + (st.bantuanPublicTab === 'program' ? ' is-active' : '') + '" data-action="set-tab" data-key="bantuanPublicTab" data-val="program">Daftar Program Bantuan</button>' +
        '<button type="button" class="seg-tab' + (st.bantuanPublicTab === 'rekap' ? ' is-active' : '') + '" data-action="set-tab" data-key="bantuanPublicTab" data-val="rekap">Rekap Penyaluran Publik (Agregat)</button>' +
      '</div>' +
    '</div></section>' +
    '<div class="container" style="padding-bottom:36px">' +
      '<div class="alert alert-info mb-20">' + icon('shield') + '<div><strong>Batasan Kewenangan &amp; Privasi (BR-B01 &amp; BR-B06):</strong> Sistem ini hanya mencatat penyaluran berdasarkan keputusan pihak berwenang (tidak menentukan kelayakan kemiskinan). Daftar nama penerima, NIK, alamat rinci, dan nominal individu <strong>tidak ditampilkan</strong> di halaman publik.</div></div>' +
      (st.bantuanPublicTab === 'program' ? (
        '<div class="grid-2">' +
          st.data.aidPrograms.map(function (p) {
            return '<div class="card flex-col gap-12">' +
              '<div class="flex items-center justify-between"><span class="badge badge-navy">' + esc(p.source) + '</span><span class="badge ' + (p.publicPublish ? 'badge-emerald' : 'badge-neutral') + '">' + (p.publicPublish ? 'Dipublikasikan' : 'Rekap Internal') + '</span></div>' +
              '<h2 class="t-h3">' + esc(p.name) + '</h2>' +
              '<p class="t-sm t-secondary">' + esc(p.desc) + '</p>' +
              '<div class="t-caption t-muted">Bentuk: <strong>' + esc(p.bentuk) + '</strong> • Besaran Acuan: <strong>' + esc(p.unit) + '</strong></div>' +
            '</div>';
          }).join('') +
        '</div>'
      ) : (
        '<div class="card">' +
          '<h2 class="t-h2 mb-16">Rekapitulasi Agregat Penyaluran (Periode Berjalan 2026)</h2>' +
          '<table class="table"><thead><tr><th>Program Bantuan</th><th>Instansi Sumber</th><th>Bentuk</th><th>Target KPM</th><th>Tersalurkan</th><th>Capaian</th></tr></thead><tbody>' +
            pubPrograms.map(function (p) {
              var pct = Math.round((p.disalurkan / p.kuota) * 100);
              return '<tr><td><strong>' + esc(p.name) + '</strong></td><td>' + esc(p.source) + '</td><td>' + esc(p.bentuk) + '</td><td>' + p.kuota + ' KPM</td><td><strong>' + p.disalurkan + ' KPM</strong></td><td><span class="badge badge-emerald">' + pct + '%</span></td></tr>';
            }).join('') +
          '</tbody></table>' +
        '</div>'
      )) +
    '</div>';
  }

  function renderGallery() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var ill = w.DesaApp.illustrations;

    var items = st.data.gallery.filter(function (g) {
      if (g.status !== 'Dipublikasikan') return false;
      if (st.galleryTab === 'foto' && g.type !== 'Foto') return false;
      if (st.galleryTab === 'video' && g.type !== 'Video') return false;
      var q = st.gallerySearch.trim().toLowerCase();
      return !q || g.title.toLowerCase().indexOf(q) !== -1 || g.category.toLowerCase().indexOf(q) !== -1;
    });

    return '<section class="page-banner"><div class="container">' +
      '<div class="breadcrumb"><button type="button" data-nav="public:home">Home</button><span>/</span><span>Gallery</span></div>' +
      '<div class="flex items-center justify-between flex-wrap gap-16">' +
        '<div><h1 class="t-h1">Galeri Foto &amp; Video Kegiatan Desa</h1><p class="t-secondary t-sm mt-4">Dokumentasi pembangunan, budaya, fasilitas, serta tautan video resmi desa.</p></div>' +
        '<div class="input-with-icon" style="width:280px">' + icon('search', 'icon-sm icon-left') +
          '<input class="input" type="text" placeholder="Cari dokumentasi..." value="' + esc(st.gallerySearch) + '" data-action="filter-search" data-key="gallerySearch">' +
        '</div>' +
      '</div>' +
      '<div class="seg-tabs mt-16">' +
        ['semua', 'foto', 'video'].map(function (t) {
          return '<button type="button" class="seg-tab' + (st.galleryTab === t ? ' is-active' : '') + '" data-action="set-tab" data-key="galleryTab" data-val="' + t + '">' + (t === 'semua' ? 'Semua Media' : t === 'foto' ? 'Album Foto' : 'Tautan Video') + '</button>';
        }).join('') +
      '</div>' +
    '</div></section>' +
    '<div class="container" style="padding-bottom:36px">' +
      '<div class="grid-3">' +
        items.map(function (g) {
          return '<div class="card card-interactive flex-col gap-12" style="padding:14px;cursor:pointer" data-action="open-gallery-detail" data-id="' + esc(g.id) + '">' +
            '<div class="news-thumb">' + ill.cardScene(g.scene, g.title) + '</div>' +
            '<div class="flex items-center justify-between">' +
              '<span class="badge ' + (g.type === 'Foto' ? 'badge-emerald' : 'badge-navy') + '">' + (g.type === 'Foto' ? g.count + ' Foto' : 'Tautan Video') + '</span>' +
              '<span class="t-caption t-muted">' + esc(g.date) + '</span>' +
            '</div>' +
            '<h2 class="t-h3" style="font-size:16px">' + esc(g.title) + '</h2>' +
            '<div class="t-caption t-muted">' + esc(g.location) + ' • ' + esc(g.category) + '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
  }

  function renderKontak() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var s = st.data.site;

    return '<section class="page-banner"><div class="container">' +
      '<div class="breadcrumb"><button type="button" data-nav="public:home">Home</button><span>/</span><span>Kontak</span></div>' +
      '<h1 class="t-h1">Kontak &amp; Informasi Kantor Desa</h1>' +
      '<p class="t-secondary t-sm mt-4">Informasi alamat kantor, jam pelayanan tatap muka, serta formulir pesan atau pertanyaan warga.</p>' +
    '</div></section>' +
    '<div class="container" style="padding-bottom:44px">' +
      '<div class="grid-2">' +
        '<div class="card flex-col gap-16">' +
          '<h2 class="t-h2">Kantor Pemerintah ' + esc(s.villageName) + '</h2>' +
          '<div class="flex-col gap-12 t-sm">' +
            '<div class="flex items-start gap-12"><div class="stat-icon-box">' + icon('pin') + '</div><div><strong>Alamat Kantor</strong><div class="t-secondary">' + esc(s.officeAddress) + '</div></div></div>' +
            '<div class="flex items-start gap-12"><div class="stat-icon-box is-navy">' + icon('clock') + '</div><div><strong>Jam Pelayanan</strong><div class="t-secondary">' + esc(s.officeHours) + '</div></div></div>' +
            '<div class="flex items-start gap-12"><div class="stat-icon-box">' + icon('phone') + '</div><div><strong>Telepon &amp; WhatsApp</strong><div class="t-secondary">' + esc(s.phone) + ' / ' + esc(s.whatsapp) + '</div></div></div>' +
            '<div class="flex items-start gap-12"><div class="stat-icon-box is-info">' + icon('mail') + '</div><div><strong>Email Resmi</strong><div class="t-secondary">' + esc(s.email) + '</div></div></div>' +
          '</div>' +
          '<div class="alert alert-emerald mt-8">' + icon('info') + '<div>Warga yang mengalami kendala pengajuan surat online atau lupa nomor registrasi dapat datang langsung ke loket kantor desa pada jam kerja.</div></div>' +
          '<button type="button" class="btn btn-outline" data-nav="public:peta">' + icon('map', 'icon-sm') + ' Lihat Lokasi Kantor di Peta Administrasi</button>' +
        '</div>' +

        '<form class="card flex-col gap-14" data-form="contact-message">' +
          '<h2 class="t-h2">Kirim Pesan / Pertanyaan ke Desa</h2>' +
          '<div class="field"><label class="field-label">Nama Lengkap <span class="field-req">*</span></label><input class="input" name="name" required placeholder="Nama pengirim"></div>' +
          '<div class="field"><label class="field-label">No. Telepon / Email <span class="field-req">*</span></label><input class="input" name="contact" required placeholder="Nomor WhatsApp atau email"></div>' +
          '<div class="field"><label class="field-label">Isi Pertanyaan / Masukan <span class="field-req">*</span></label><textarea class="textarea" name="msg" required placeholder="Tulis pertanyaan Anda..."></textarea></div>' +
          '<button type="submit" class="btn btn-accent">Kirim Pesan</button>' +
        '</form>' +
      '</div>' +
    '</div>';
  }

  w.DesaApp.renderPublicShell = function () {
    var page = w.DesaApp.state.publicPage;
    var content = '';
    switch (page) {
      case 'profil': content = renderProfil(); break;
      case 'statistik': content = renderStatistik(); break;
      case 'potensi': content = renderPotensi(); break;
      case 'peta': content = w.DesaApp.renderPublicMapPage(); break;
      case 'layanan': content = renderLayanan(); break;
      case 'ajukan-surat': content = renderAjukanSurat(); break;
      case 'cek-status': content = renderCekStatus(); break;
      case 'berita': content = renderBerita(); break;
      case 'pengumuman': content = renderPengumuman(); break;
      case 'bantuan': content = renderBantuanPublic(); break;
      case 'gallery': content = renderGallery(); break;
      case 'kontak': content = renderKontak(); break;
      default: content = renderHome();
    }
    return '<div class="public-shell">' + renderPublicNavbar() + '<main class="public-main">' + content + '</main>' + renderPublicFooter() + '</div>';
  };
})(window);
