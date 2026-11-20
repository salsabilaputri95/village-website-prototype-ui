/* ==========================================================================
   DESIGN SYSTEM SHOWCASE — Mirrors Reference Images 1 & 2
   ========================================================================== */
(function (w) {
  'use strict';
  w.DesaApp = w.DesaApp || {};

  w.DesaApp.renderDesignSystemPage = function () {
    var icon = w.DesaApp.icon;
    var esc = w.DesaApp.escapeHtml;

    var lightSwatches = [
      { name: 'brand-primary', hex: '#1B3A5C' },
      { name: 'brand-accent', hex: '#1E7A5F' },
      { name: 'accent-soft', hex: '#EEF6F3' },
      { name: 'navy-soft', hex: '#E8EFF6' },
      { name: 'bg-canvas', hex: '#F2F2F7' },
      { name: 'bg-surface', hex: '#FFFFFF' },
      { name: 'text-primary', hex: '#1C1C1E' },
      { name: 'border-default', hex: '#D1D1D6' }
    ];

    var statusDarkSwatches = [
      { name: 'status-success', hex: '#1E7A5F' },
      { name: 'status-warning', hex: '#D97706' },
      { name: 'status-error', hex: '#DC2626' },
      { name: 'status-info', hex: '#007AFF' },
      { name: 'dark-canvas', hex: '#000000' },
      { name: 'dark-surface', hex: '#1C1C1E' },
      { name: 'dark-surface-alt', hex: '#2C2C2E' },
      { name: 'dark-accent', hex: '#30D158' }
    ];

    function renderSwatches(arr) {
      return '<div class="swatch-grid">' + arr.map(function (s) {
        return '<button type="button" class="swatch-card" data-action="copy-hex" data-hex="' + s.hex + '">' +
          '<div class="swatch-chip" style="background:' + s.hex + '"></div>' +
          '<div style="font-size:12px;font-weight:600;color:var(--text-primary)">' + esc(s.name) + '</div>' +
          '<div class="t-mono t-caption t-muted">' + esc(s.hex) + '</div>' +
        '</button>';
      }).join('') + '</div>';
    }

    return '<div class="container ds-shell flex-col gap-24">' +
      '<div class="ds-hero-banner">' +
        '<div class="t-caption" style="letter-spacing:0.08em;color:#A7F3D0;text-transform:uppercase">Design System &amp; Komponen Utama</div>' +
        '<h1 class="t-h1 mt-8" style="color:#FFFFFF">Website dan Sistem Informasi Desa Terintegrasi</h1>' +
        '<p class="t-sm mt-8" style="color:#DBEAFE">Palet Hijau Zamrud &amp; Biru Navy • Gaya Perfect Squircle (tenang, presisi, nyaman dipakai lama di mode terang maupun gelap). Klik swatch warna mana saja untuk menyalin kode HEX.</p>' +
      '</div>' +

      '<!-- 1. Palet Warna -->' +
      '<section class="card flex-col gap-16">' +
        '<h2 class="t-h2" style="color:var(--brand-primary)">1. Palet Warna Semantik &amp; Mode Gelap Admin</h2>' +
        '<div>' +
          '<div class="t-sm t-muted mb-8" style="font-weight:600">Identitas &amp; Permukaan (Light)</div>' +
          renderSwatches(lightSwatches) +
        '</div>' +
        '<div>' +
          '<div class="t-sm t-muted mb-8" style="font-weight:600">Status Pengajuan (7 Status Resmi) &amp; Mode Gelap Admin</div>' +
          renderSwatches(statusDarkSwatches) +
        '</div>' +
      '</section>' +

      '<!-- 2. Skala Tipografi & 3. Sudut Elevasi -->' +
      '<div class="grid-2">' +
        '<section class="card flex-col gap-16">' +
          '<h2 class="t-h2" style="color:var(--brand-primary)">2. Skala Tipografi (Inter)</h2>' +
          '<div><div class="t-caption t-muted">Display / 40px Bold</div><div class="t-display">Pelayanan Desa Modern</div></div>' +
          '<div><div class="t-caption t-muted">Heading H1 / 28px Bold</div><div class="t-h1">Website Resmi Desa [Nama Desa]</div></div>' +
          '<div><div class="t-caption t-muted">Heading H2 / 22px Semi Bold</div><div class="t-h2">Pengajuan Surat Online &amp; Cek Status</div></div>' +
          '<div><div class="t-caption t-muted">Heading H3 / 18px Semi Bold</div><div class="t-h3">Statistik Agregat Tervalidasi</div></div>' +
          '<div><div class="t-caption t-muted">Body Regular / 15px Regular</div><div class="t-body">Masyarakat dapat membaca syarat layanan tanpa perlu login.</div></div>' +
          '<div><div class="t-caption t-muted">Caption / 12px Medium</div><div class="t-caption t-muted">Data Contoh — Tidak Menampilkan Data Pribadi Warga</div></div>' +
        '</section>' +

        '<section class="card flex-col gap-16">' +
          '<h2 class="t-h2" style="color:var(--brand-primary)">3. Sudut &amp; Elevasi (Perfect Squircle)</h2>' +
          '<div class="grid-4" style="gap:12px">' +
            '<div class="squircle-demo-box" style="border-radius:10px">Input (10px)</div>' +
            '<div class="squircle-demo-box" style="border-radius:14px">Tombol (14px)</div>' +
            '<div class="squircle-demo-box" style="border-radius:22px">Kartu (22px)</div>' +
            '<div class="squircle-demo-box" style="border-radius:9999px">Badge (Pill)</div>' +
          '</div>' +
          '<div>' +
            '<div class="t-sm t-muted mb-12" style="font-weight:600">Bayangan Lembut (Soft Elevation)</div>' +
            '<div class="grid-3" style="gap:12px">' +
              '<div class="card" style="padding:16px;border-radius:16px;box-shadow:var(--shadow-sm);text-align:center"><span class="t-caption">Soft-SM (Baris/Input)</span></div>' +
              '<div class="card" style="padding:16px;border-radius:16px;box-shadow:var(--shadow-md);text-align:center"><span class="t-caption">Soft-MD (Kartu Layanan)</span></div>' +
              '<div class="card" style="padding:16px;border-radius:16px;box-shadow:var(--shadow-lg);text-align:center"><span class="t-caption">Soft-LG (Modal/Hero)</span></div>' +
            '</div>' +
          '</div>' +
        '</section>' +
      '</div>' +

      '<!-- 4. Komponen UI Inti (Reference Image 2) -->' +
      '<section class="card flex-col gap-24">' +
        '<div class="flex items-center justify-between flex-wrap gap-12">' +
          '<h2 class="t-h2" style="color:var(--brand-primary)">4. Tombol, 7 Status Resmi, Input &amp; Kartu Statistik</h2>' +
          '<div class="flex gap-8">' +
            '<button type="button" class="btn btn-sm btn-accent" data-nav="public:home">Buka Website Publik</button>' +
            '<button type="button" class="btn btn-sm btn-primary" data-nav="admin:dashboard">Buka Portal Admin</button>' +
          '</div>' +
        '</div>' +

        '<div class="flex flex-wrap gap-12">' +
          '<button type="button" class="btn btn-accent">Ajukan Surat Online</button>' +
          '<button type="button" class="btn btn-primary">Ajukan Surat Online</button>' +
          '<button type="button" class="btn btn-outline">Ajukan Surat Online</button>' +
          '<button type="button" class="btn btn-soft">Ajukan Surat Online</button>' +
          '<button type="button" class="btn btn-outline" disabled>Status Nonaktif</button>' +
        '</div>' +

        '<div class="flex flex-wrap gap-8">' +
          '<span class="badge badge-navy"><span class="badge-dot"></span>Diajukan</span>' +
          '<span class="badge badge-info"><span class="badge-dot"></span>Menunggu Verifikasi</span>' +
          '<span class="badge badge-warning"><span class="badge-dot"></span>Perlu Perbaikan</span>' +
          '<span class="badge badge-navy"><span class="badge-dot"></span>Sedang Diproses</span>' +
          '<span class="badge badge-emerald"><span class="badge-dot"></span>Disetujui</span>' +
          '<span class="badge badge-danger"><span class="badge-dot"></span>Ditolak</span>' +
          '<span class="badge badge-done"><span class="badge-dot"></span>Selesai / Diterbitkan</span>' +
        '</div>' +

        '<div class="grid-2" style="align-items:start">' +
          '<div class="field">' +
            '<label class="field-label" for="ds-sample-input">Nama Lengkap Pemohon <span class="field-req">*</span></label>' +
            '<input id="ds-sample-input" class="input" type="text" placeholder="Masukkan nama sesuai KTP">' +
            '<span class="field-help">Sesuai dokumen kependudukan yang berlaku</span>' +
          '</div>' +
          '<div class="stat-card" style="max-width:260px">' +
            '<div class="stat-card-top">' +
              '<div class="stat-icon-box">' + icon('users') + '</div>' +
              '<span class="stat-pill">Data contoh agregat</span>' +
            '</div>' +
            '<div>' +
              '<div class="stat-value">3.420</div>' +
              '<div class="stat-label">Total Penduduk</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<!-- 5. Preview Komponen Navigasi & Shell (Referensi Gambar 2) -->' +
      '<section class="card flex-col gap-20">' +
        '<h2 class="t-h2" style="color:var(--brand-primary)">5. Preview Komponen Navigasi &amp; Shell (Halaman Publik &amp; Portal Admin)</h2>' +
        '<div>' +
          '<div class="t-caption t-muted mb-8">NAVBAR WEBSITE PUBLIK &amp; FOOTER NAVY</div>' +
          '<div style="border:1px solid var(--border-subtle);border-radius:16px;overflow:hidden;box-shadow:var(--shadow-sm)">' +
            '<div style="background:#FFFFFF;padding:12px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid var(--border-subtle)">' +
              '<div class="flex items-center gap-10">' +
                '<div class="pub-logo-sq" style="width:34px;height:34px">' + icon('building', 'icon-sm') + '</div>' +
                '<div><div style="font-size:13px;font-weight:700">Desa [Nama Desa]</div><div style="font-size:11px;color:var(--text-muted)">Kabupaten [Nama Kabupaten]</div></div>' +
              '</div>' +
              '<div class="flex items-center gap-12 t-caption" style="color:var(--text-secondary)">' +
                '<span style="color:var(--brand-accent);font-weight:700">Home</span><span>Profil Desa</span><span>Data Desa</span><span>Layanan Desa</span><span>Informasi</span><span>Info Bantuan</span><span>Gallery</span><span>Kontak</span>' +
              '</div>' +
              '<button type="button" class="btn btn-sm btn-accent" data-nav="public:ajukan-surat">Ajukan Surat</button>' +
            '</div>' +
            '<div style="background:var(--brand-primary);color:#CBD5E1;padding:16px 20px;display:flex;justify-content:space-between;align-items:center">' +
              '<span class="t-caption" style="color:#FFFFFF;font-weight:600">Footer Resmi Desa (#1B3A5C) • Tautan Penting, Kontak &amp; Media Sosial</span>' +
              '<span class="t-caption">Domain .desa.id atas nama Pemerintah Desa</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div>' +
          '<div class="t-caption t-muted mb-8">PORTAL ADMIN DESA (SIDEBAR KIRI + TOPBAR + PENCARIAN CTRL+K)</div>' +
          '<div style="display:grid;grid-template-columns:230px 1fr;gap:16px;background:var(--bg-canvas);padding:16px;border-radius:18px;border:1px solid var(--border-subtle)">' +
            '<div style="background:#FFFFFF;border-radius:16px;padding:14px;border:1px solid var(--border-subtle);display:flex;flex-direction:column;gap:4px">' +
              '<div class="flex items-center gap-8 mb-8" style="padding-bottom:10px;border-bottom:1px solid var(--border-subtle)">' +
                '<div class="admin-logo-sq" style="width:30px;height:30px;border-radius:9px">' + icon('building', 'icon-sm') + '</div>' +
                '<div><div style="font-size:12.5px;font-weight:700">Portal Admin Desa</div><div style="font-size:10.5px;color:var(--text-muted)">Desa [Nama Desa]</div></div>' +
              '</div>' +
              '<div class="admin-nav-btn is-active" style="padding:7px 10px;font-size:12.5px">' + icon('home', 'icon-sm') + ' Dashboard</div>' +
              ['Konten Website', 'Data Desa', 'Pelayanan & Persuratan', 'Bantuan Desa', 'Laporan', 'Pengguna & Hak Akses', 'Log Aktivitas', 'Pengaturan Sistem'].map(function (lbl) {
                return '<div class="admin-nav-btn" style="padding:6px 10px;font-size:12px">' + esc(lbl) + '</div>';
              }).join('') +
            '</div>' +
            '<div style="background:#FFFFFF;border-radius:16px;padding:14px 18px;border:1px solid var(--border-subtle);height:56px;display:flex;align-items:center;justify-content:space-between">' +
              '<strong class="t-sm">Dashboard Ringkasan</strong>' +
              '<div class="flex items-center gap-8">' +
                '<span class="cmdk-trigger" style="min-width:160px;height:30px;font-size:11.5px">Cari cepat... <span class="kbd-pill">Ctrl+K</span></span>' +
                '<span class="icon-circle-btn" style="width:30px;height:30px">' + icon('bell', 'icon-sm') + '</span>' +
                '<span class="badge badge-navy">[Kepala Desa / Petugas]</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +
    '</div>';
  };
})(window);
