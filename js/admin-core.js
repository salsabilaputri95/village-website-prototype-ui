/* ==========================================================================
   ADMIN CORE — Login, RBAC Shell, Dashboard, Konten Website & Data Desa
   ========================================================================== */
(function (w) {
  'use strict';
  w.DesaApp = w.DesaApp || {};

  function statusBadge(status) {
    var meta = w.DesaApp.STATUS_META[status] || { badge: 'badge-neutral' };
    return '<span class="badge ' + meta.badge + '"><span class="badge-dot"></span>' + w.DesaApp.escapeHtml(status) + '</span>';
  }
  w.DesaApp.statusBadge = statusBadge;

  w.DesaApp.renderLoginPage = function () {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;

    return '<div class="login-shell">' +
      '<div class="login-grid">' +
        '<div class="login-brand-panel">' +
          '<div>' +
            '<div class="flex items-center gap-12">' +
              '<div class="admin-logo-sq" style="background:rgba(255,255,255,0.16)">' + icon('shield') + '</div>' +
              '<div><div style="font-weight:700;font-size:16px">Portal Admin Desa</div><div class="t-caption" style="color:#A7F3D0">' + esc(st.data.site.villageName) + '</div></div>' +
            '</div>' +
            '<h1 class="t-h1 mt-24" style="color:#FFFFFF">Satu Pusat Pengelolaan Administrasi &amp; Pelayanan Desa</h1>' +
            '<p class="t-sm mt-12" style="color:#DBEAFE">Dirancang dengan hak akses berbasis peran (RBAC) yang ditegakkan di server, log aktivitas terstruktur, serta tema tenang Perfect Squircle (Mode Terang &amp; Mode Gelap).</p>' +
          '</div>' +
          '<div class="flex-col gap-8 mt-24 t-caption" style="color:#D1FAE5">' +
            '<div>• Pemisahan tegas antara Website Publik &amp; Dashboard Internal</div>' +
            '<div>• Satu sumber data: Penduduk ↔ Surat ↔ Arsip ↔ Bantuan</div>' +
            '<div>• Mendukung mode layar perangkat desa yang nyaman dipakai lama</div>' +
          '</div>' +
        '</div>' +

        '<div class="card" style="padding:30px">' +
          '<h2 class="t-h2">Masuk ke Portal Admin</h2>' +
          '<p class="t-sm t-muted mt-4">Gunakan formulir di bawah atau pilih akun peran demo untuk menguji pembatasan hak akses (RBAC).</p>' +
          '<form class="flex-col gap-14 mt-20" data-form="admin-login">' +
            '<div class="field"><label class="field-label">Username / Email Perangkat</label><input class="input" name="username" value="budi.pelayanan" required></div>' +
            '<div class="field"><label class="field-label">Kata Sandi</label><input class="input" type="password" name="password" value="••••••••••••" required></div>' +
            '<button type="submit" class="btn btn-accent btn-lg w-full">' + icon('lock', 'icon-sm') + ' Masuk ke Dashboard</button>' +
          '</form>' +
          '<div class="mt-20" style="border-top:1px solid var(--line-subtle);padding-top:16px">' +
            '<div class="t-caption t-muted mb-8">MASUK CEPAT BERDASARKAN PERAN DEMO (7 PERAN PRD):</div>' +
            '<div class="chip-row">' +
              w.DesaApp.ROLES.map(function (r) {
                return '<button type="button" class="chip" data-action="login-as-role" data-role="' + esc(r.id) + '">' + esc(r.label) + '</button>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  };

  var ADMIN_NAV = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home', mod: 'dashboard' },
    { id: 'konten', label: 'Konten Website', icon: 'file', mod: 'konten' },
    { id: 'data-desa', label: 'Data Desa', icon: 'users', mod: 'kependudukan', altMods: ['peta', 'statistik_pub'] },
    { id: 'persuratan', label: 'Pelayanan & Persuratan', icon: 'mail', mod: 'persuratan', altMods: ['arsip', 'template_no'] },
    { id: 'bantuan', label: 'Bantuan Desa', icon: 'gift', mod: 'bantuan' },
    { id: 'laporan', label: 'Laporan', icon: 'chart', mod: 'laporan' },
    { id: 'pengguna', label: 'Pengguna & Hak Akses', icon: 'shield', mod: 'pengguna' },
    { id: 'log', label: 'Log Aktivitas', icon: 'clock', mod: 'log' },
    { id: 'pengaturan', label: 'Pengaturan Sistem', icon: 'settings', mod: 'pengaturan' }
  ];

  function hasMenuAccess(item) {
    var can = w.DesaApp.can;
    if (can(item.mod)) return true;
    if (item.altMods) {
      for (var i = 0; i < item.altMods.length; i++) {
        if (can(item.altMods[i])) return true;
      }
    }
    return false;
  }

  function renderAdminDashboard() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var charts = w.DesaApp.charts;
    var role = w.DesaApp.getRoleInfo();
    var can = w.DesaApp.can;

    var openReq = st.data.requests.filter(function (r) {
      return r.status === 'Diajukan' || r.status === 'Menunggu Verifikasi' || r.status === 'Sedang Diproses' || r.status === 'Disetujui';
    });
    var actionQueue = st.data.requests.filter(function (r) {
      if (st.currentRole === 'kepala_desa') return r.status === 'Sedang Diproses';
      return r.status === 'Diajukan' || r.status === 'Menunggu Verifikasi' || r.status === 'Disetujui';
    });
    var publishedCount = st.data.requests.filter(function (r) { return r.status === 'Selesai / Diterbitkan'; }).length;

    return '<div class="flex-col gap-20">' +
      '<div class="alert alert-emerald">' +
        icon('shield') +
        '<div class="flex-1"><strong>Selamat datang, ' + esc(role.user) + ' (' + esc(role.label) + ')</strong> — ' + esc(role.desc) + ' Widget dan menu di bawah menyesuaikan hak akses Anda.</div>' +
        '<button type="button" class="btn btn-sm btn-outline" data-nav="public:home">' + icon('external', 'icon-sm') + ' Lihat Website Publik</button>' +
      '</div>' +

      '<!-- KPI Stat Cards (Role-Aware) -->' +
      '<div class="grid-4">' +
        '<div class="stat-card"><div class="stat-card-top"><div class="stat-icon-box">' + icon('users') + '</div><span class="stat-pill">Data contoh agregat</span></div><div><div class="stat-value">' + st.data.statistik.totalPenduduk.toLocaleString('id-ID') + '</div><div class="stat-label">Total Penduduk (' + st.data.statistik.totalKK.toLocaleString('id-ID') + ' KK)</div></div></div>' +
        '<div class="stat-card"><div class="stat-card-top"><div class="stat-icon-box is-info">' + icon('mail') + '</div><span class="stat-pill">Antrean Aktif</span></div><div><div class="stat-value">' + openReq.length + '</div><div class="stat-label">Pengajuan Perlu Proses</div></div></div>' +
        '<div class="stat-card"><div class="stat-card-top"><div class="stat-icon-box">' + icon('archive') + '</div><span class="stat-pill">Otomatis Terarsip</span></div><div><div class="stat-value">' + st.data.archives.length + '</div><div class="stat-label">Arsip Digital (' + publishedCount + ' Terbit)</div></div></div>' +
        '<div class="stat-card"><div class="stat-card-top"><div class="stat-icon-box is-warning">' + icon('gift') + '</div><span class="stat-pill">4 Program Aktif</span></div><div><div class="stat-value">554</div><div class="stat-label">KPM Tersalurkan (Agregat)</div></div></div>' +
      '</div>' +

      '<!-- Antrean Perlu Tindakan & Grafik -->' +
      '<div class="grid-asym-main">' +
        '<div class="card">' +
          '<div class="card-header">' +
            '<div><h2 class="t-h3">Pengajuan yang Membutuhkan Tindakan</h2><div class="t-caption t-muted">Disesuaikan dengan peran ' + esc(role.label) + '</div></div>' +
            (can('persuratan') ? '<button type="button" class="btn btn-sm btn-soft" data-nav="admin:persuratan">Kelola Semua</button>' : '') +
          '</div>' +
          (actionQueue.length && can('persuratan') ? (
            '<div class="table-wrap"><table class="table"><thead><tr><th>No. Reg</th><th>Pemohon &amp; Layanan</th><th>Status</th><th>Aksi</th></tr></thead><tbody>' +
              actionQueue.slice(0, 5).map(function (r) {
                return '<tr>' +
                  '<td class="t-mono" style="font-size:12.5px;font-weight:600">' + esc(r.regNo) + '</td>' +
                  '<td><div style="font-weight:600">' + esc(r.applicantName) + '</div><div class="t-caption t-muted">' + esc(r.serviceName) + '</div></td>' +
                  '<td>' + statusBadge(r.status) + '</td>' +
                  '<td><button type="button" class="btn btn-sm btn-outline" data-action="open-req-drawer" data-id="' + esc(r.id) + '">Proses</button></td>' +
                '</tr>';
              }).join('') +
            '</tbody></table></div>'
          ) : '<div class="empty-state" style="padding:26px"><p class="t-sm t-muted">' + (can('persuratan') ? 'Tidak ada antrean mendesak untuk peran ini.' : 'Menu persuratan tidak termasuk kewenangan peran ' + esc(role.label) + '.') + '</p></div>') +
        '</div>' +

        '<div class="card">' +
          '<h2 class="t-h3 mb-16">Statistik Pengajuan Surat per Status</h2>' +
          charts.hBar([
            { label: 'Diajukan / Menunggu Verifikasi', value: st.data.requests.filter(function (r) { return r.status === 'Diajukan' || r.status === 'Menunggu Verifikasi'; }).length, color: '#007AFF' },
            { label: 'Perlu Perbaikan', value: st.data.requests.filter(function (r) { return r.status === 'Perlu Perbaikan'; }).length, color: '#D97706' },
            { label: 'Sedang Diproses / Disetujui', value: st.data.requests.filter(function (r) { return r.status === 'Sedang Diproses' || r.status === 'Disetujui'; }).length, color: '#1B3A5C' },
            { label: 'Selesai / Diterbitkan', value: publishedCount, color: '#1E7A5F' }
          ]) +
        '</div>' +
      '</div>' +

      '<!-- Ringkasan Konten & Aktivitas Terbaru -->' +
      '<div class="grid-2">' +
        '<div class="card">' +
          '<div class="card-header"><h2 class="t-h3">Ringkasan Konten &amp; Publikasi</h2><span class="badge badge-navy">' + st.data.news.length + ' Berita • ' + st.data.announcements.length + ' Pengumuman</span></div>' +
          charts.vBar(st.data.profil.geografis.dusun.map(function (d) { return { label: d.nama, short: d.nama.replace('Dusun ', ''), value: d.jiwa }; }), { height: 185 }) +
        '</div>' +
        '<div class="card">' +
          '<div class="card-header"><h2 class="t-h3">Aktivitas Sistem Terbaru</h2>' +
            (can('log') ? '<button type="button" class="btn btn-sm btn-outline" data-nav="admin:log">Semua Log</button>' : '') +
          '</div>' +
          '<div class="flex-col gap-10">' +
            st.data.logs.slice(0, 5).map(function (l) {
              return '<div class="flex items-start justify-between gap-12" style="padding:8px 0;border-bottom:1px solid var(--line-subtle)">' +
                '<div><div class="t-sm"><strong>' + esc(l.action) + '</strong> — ' + esc(l.target) + '</div><div class="t-caption t-muted">' + esc(l.actor) + ' • ' + esc(l.detail) + '</div></div>' +
                '<span class="t-caption t-muted" style="white-space:nowrap">' + esc(l.time) + '</span>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderAdminKonten() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var tab = st.kontenTab;
    var isRO = !w.DesaApp.can('konten', 'K');

    var tabs = [
      { id: 'home', label: 'Home' },
      { id: 'profil', label: 'Profil & Perangkat' },
      { id: 'berita', label: 'Berita' },
      { id: 'pengumuman', label: 'Pengumuman' },
      { id: 'gallery', label: 'Gallery' },
      { id: 'layanan', label: 'Layanan Desa' },
      { id: 'potensi', label: 'Potensi Desa' }
    ];

    if (st.currentRole === 'petugas_pelayanan') {
      tabs = [{ id: 'layanan', label: 'Layanan Desa' }];
      tab = 'layanan';
    }

    var body = '';
    if (tab === 'home') {
      var s = st.data.site;
      body = '<form class="card flex-col gap-16" data-form="admin-home-content">' +
        '<div class="card-header"><h3 class="t-h3">Kelola Konten Halaman Utama &amp; Sambutan (Satu Sumber BR-K04)</h3><button type="button" class="btn btn-sm btn-outline" data-nav="public:home">Pratinjau Home</button></div>' +
        '<div class="field"><label class="field-label">Judul Hero Utama</label><input class="input" name="heroTitle" value="' + esc(s.heroTitle) + '" ' + (isRO ? 'disabled' : '') + '></div>' +
        '<div class="field"><label class="field-label">Pesan Singkat Hero</label><textarea class="textarea" name="heroDesc" ' + (isRO ? 'disabled' : '') + '>' + esc(s.heroDesc) + '</textarea></div>' +
        '<div class="field"><label class="field-label">Sekilas Tentang Desa</label><textarea class="textarea" name="aboutSummary" ' + (isRO ? 'disabled' : '') + '>' + esc(s.aboutSummary) + '</textarea></div>' +
        '<div class="field"><label class="field-label">Sambutan Kepala Desa (Sinkron ke Home &amp; Profil)</label><textarea class="textarea" name="kadesGreeting" ' + (isRO ? 'disabled' : '') + '>' + esc(s.kadesGreeting) + '</textarea></div>' +
        (!isRO ? '<div class="flex justify-end"><button type="submit" class="btn btn-accent">Simpan &amp; Sinkronkan ke Publik</button></div>' : '') +
      '</form>';
    } else if (tab === 'profil') {
      body = '<div class="card"><div class="card-header"><h3 class="t-h3">Data Perangkat Desa (Tampil di Profil Desa)</h3>' +
        (!isRO ? '<button type="button" class="btn btn-sm btn-accent" data-action="open-add-perangkat">' + icon('plus', 'icon-sm') + ' Tambah Perangkat</button>' : '') +
        '</div><div class="table-wrap"><table class="table"><thead><tr><th>Nama</th><th>Jabatan</th><th>Bidang</th><th>Masa Jabatan</th></tr></thead><tbody>' +
        st.data.profil.perangkat.map(function (p) {
          return '<tr><td><strong>' + esc(p.nama) + '</strong></td><td><span class="badge badge-emerald">' + esc(p.jabatan) + '</span></td><td>' + esc(p.bidang) + '</td><td>' + esc(p.masa) + '</td></tr>';
        }).join('') +
        '</tbody></table></div></div>';
    } else if (tab === 'berita') {
      body = '<div class="card"><div class="card-header"><h3 class="t-h3">Manajemen Berita (Draft / Terjadwal / Dipublikasikan)</h3>' +
        (!isRO ? '<button type="button" class="btn btn-sm btn-accent" data-action="open-add-news">' + icon('plus', 'icon-sm') + ' Tulis Berita Baru</button>' : '') +
        '</div><div class="table-wrap"><table class="table"><thead><tr><th>Judul Berita</th><th>Kategori</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr></thead><tbody>' +
        st.data.news.map(function (n) {
          return '<tr><td><strong>' + esc(n.title) + '</strong></td><td>' + esc(n.category) + '</td><td>' + esc(n.date) + '</td><td><span class="badge ' + (n.status === 'Dipublikasikan' ? 'badge-emerald' : n.status === 'Terjadwal' ? 'badge-info' : 'badge-neutral') + '">' + esc(n.status) + '</span></td><td>' +
            (!isRO ? '<button type="button" class="btn btn-sm btn-outline" data-action="cycle-news-status" data-id="' + esc(n.id) + '">Ubah Status</button>' : '-') + '</td></tr>';
        }).join('') +
        '</tbody></table></div></div>';
    } else if (tab === 'pengumuman') {
      body = '<div class="card"><div class="card-header"><h3 class="t-h3">Manajemen Pengumuman &amp; Masa Berlaku</h3>' +
        (!isRO ? '<button type="button" class="btn btn-sm btn-accent" data-action="open-add-ann">' + icon('plus', 'icon-sm') + ' Tambah Pengumuman</button>' : '') +
        '</div><div class="table-wrap"><table class="table"><thead><tr><th>Judul</th><th>Penanda</th><th>Berlaku s.d.</th><th>Status</th><th>Aksi</th></tr></thead><tbody>' +
        st.data.announcements.map(function (a) {
          return '<tr><td><strong>' + esc(a.title) + '</strong></td><td>' + (a.important ? '<span class="badge badge-warning">PENTING</span>' : '<span class="badge badge-neutral">Normal</span>') + '</td><td>' + esc(a.validUntil) + '</td><td><span class="badge ' + (a.status === 'Dipublikasikan' ? 'badge-emerald' : 'badge-neutral') + '">' + esc(a.status) + '</span></td><td>' +
            (!isRO ? '<button type="button" class="btn btn-sm btn-outline" data-action="toggle-ann-imp" data-id="' + esc(a.id) + '">Toggle Penting</button>' : '-') + '</td></tr>';
        }).join('') +
        '</tbody></table></div></div>';
    } else if (tab === 'gallery') {
      body = '<div class="card"><div class="card-header"><h3 class="t-h3">Manajemen Album Foto &amp; Tautan Video</h3>' +
        (!isRO ? '<button type="button" class="btn btn-sm btn-accent" data-action="open-add-gallery">' + icon('plus', 'icon-sm') + ' Tambah Album/Video</button>' : '') +
        '</div><div class="table-wrap"><table class="table"><thead><tr><th>Judul</th><th>Tipe</th><th>Kategori</th><th>Lokasi</th><th>Status</th></tr></thead><tbody>' +
        st.data.gallery.map(function (g) {
          return '<tr><td><strong>' + esc(g.title) + '</strong></td><td><span class="badge badge-navy">' + esc(g.type) + '</span></td><td>' + esc(g.category) + '</td><td>' + esc(g.location) + '</td><td><span class="badge badge-emerald">' + esc(g.status) + '</span></td></tr>';
        }).join('') +
        '</tbody></table></div></div>';
    } else if (tab === 'layanan') {
      body = '<div class="card"><div class="card-header"><h3 class="t-h3">Manajemen Layanan Desa &amp; Sakelar Pengajuan Online (LYN-04)</h3><span class="t-caption t-muted">Mematikan sakelar langsung menyembunyikan tombol Ajukan Online di Website Publik</span></div>' +
        '<div class="table-wrap"><table class="table"><thead><tr><th>Nama Layanan</th><th>Kategori</th><th>Estimasi</th><th>Unduh PDF Warga</th><th>Opsi Online Aktif</th></tr></thead><tbody>' +
        st.data.services.map(function (sv) {
          return '<tr><td><strong>' + esc(sv.name) + '</strong></td><td>' + esc(sv.kategori) + '</td><td>' + esc(sv.estimate) + '</td><td>' + (sv.allowCitizenDownload ? 'Diizinkan' : 'Fisik Saja') + '</td>' +
            '<td><label class="switch"><input type="checkbox" ' + (sv.onlineEnabled ? 'checked' : '') + ' ' + (isRO ? 'disabled' : '') + ' data-action="toggle-service-online" data-id="' + esc(sv.id) + '"><span class="switch-track"><span class="switch-thumb"></span></span><span class="t-caption">' + (sv.onlineEnabled ? 'Aktif' : 'Nonaktif') + '</span></label></td></tr>';
        }).join('') +
        '</tbody></table></div></div>';
    } else {
      body = '<div class="card"><div class="card-header"><h3 class="t-h3">Manajemen Katalog Potensi Desa</h3><button type="button" class="btn btn-sm btn-outline" data-nav="public:potensi">Lihat Katalog Publik</button></div>' +
        '<div class="table-wrap"><table class="table"><thead><tr><th>Nama Potensi</th><th>Kategori</th><th>Lokasi</th><th>Marker Peta</th><th>Status</th></tr></thead><tbody>' +
        st.data.potentials.map(function (p) {
          return '<tr><td><strong>' + esc(p.name) + '</strong></td><td>' + esc(p.category) + '</td><td>' + esc(p.location) + '</td><td>' + (p.markerId ? '<span class="badge badge-navy">' + esc(p.markerId) + '</span>' : '<span class="t-muted">-</span>') + '</td><td><span class="badge badge-emerald">' + esc(p.status) + '</span></td></tr>';
        }).join('') +
        '</tbody></table></div></div>';
    }

    return '<div class="flex-col gap-16">' +
      '<div class="flex items-center justify-between flex-wrap gap-12">' +
        '<div class="seg-tabs">' + tabs.map(function (t) {
          return '<button type="button" class="seg-tab' + (tab === t.id ? ' is-active' : '') + '" data-action="set-tab" data-key="kontenTab" data-val="' + t.id + '">' + t.label + '</button>';
        }).join('') + '</div>' +
        (isRO ? '<span class="badge badge-neutral">Mode Lihat Saja (Read-Only)</span>' : '') +
      '</div>' +
      body +
    '</div>';
  }

  function renderAdminDataDesa() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var can = w.DesaApp.can;

    var allowedTabs = [];
    if (can('kependudukan')) allowedTabs.push('kependudukan');
    if (can('statistik_pub') || can('kependudukan')) allowedTabs.push('statistik');
    if (can('peta')) allowedTabs.push('peta');
    var tab = allowedTabs.indexOf(st.dataDesaTab) !== -1 ? st.dataDesaTab : (allowedTabs[0] || 'peta');

    var allowFullNik = st.currentRole === 'operator_data' || st.currentRole === 'kepala_desa' || st.currentRole === 'super_admin';

    var resList = st.data.residents.filter(function (r) {
      var dOk = st.residentDusunFilter === 'Semua' || r.dusun === st.residentDusunFilter;
      var q = st.residentSearch.trim().toLowerCase();
      var qOk = !q || r.name.toLowerCase().indexOf(q) !== -1 || r.nik.indexOf(q) !== -1 || r.dusun.toLowerCase().indexOf(q) !== -1;
      return dOk && qOk;
    });

    var body = '';
    if (tab === 'kependudukan') {
      var editK = can('kependudukan', 'K');
      body = '<div class="flex-col gap-16">' +
        '<div class="alert alert-info">' + icon('shield') + '<div><strong>Batasan Kewenangan (BR-P01–P08):</strong> Modul ini bukan pengganti sistem resmi Dukcapil dan tidak melakukan sinkronisasi otomatis ke Dukcapil. NIK/KK hanya tampil ter-masking untuk staf yang tidak membutuhkan tampilan penuh.</div></div>' +
        '<div class="card">' +
          '<div class="flex items-center justify-between flex-wrap gap-12 mb-16">' +
            '<div class="flex items-center gap-10 flex-wrap flex-1">' +
              '<div class="input-with-icon filter-control">' + icon('search', 'icon-sm icon-left') + '<input class="input" placeholder="Cari nama atau NIK..." value="' + esc(st.residentSearch) + '" data-action="filter-search" data-key="residentSearch"></div>' +
              '<select class="select filter-control" data-action="set-select" data-key="residentDusunFilter">' +
                ['Semua', 'Dusun Krajan', 'Dusun Sawah Indah', 'Dusun Bukit Makmur', 'Dusun Sumber Jaya'].map(function (d) {
                  return '<option value="' + d + '"' + (st.residentDusunFilter === d ? ' selected' : '') + '>' + d + '</option>';
                }).join('') +
              '</select>' +
              (allowFullNik ? '<label class="switch"><input type="checkbox" ' + (st.showFullNik ? 'checked' : '') + ' data-action="toggle-full-nik"><span class="switch-track"><span class="switch-thumb"></span></span><span class="t-caption">Tampilkan NIK Utuh</span></label>' : '<span class="badge badge-neutral">NIK Disamarkan (Least Privilege)</span>') +
            '</div>' +
            '<div class="flex gap-8">' +
              (editK ? '<button type="button" class="btn btn-sm btn-outline" data-action="open-import-modal">' + icon('upload', 'icon-sm') + ' Impor Excel/CSV (2 Tahap)</button>' : '') +
              (editK ? '<button type="button" class="btn btn-sm btn-accent" data-action="open-add-resident">' + icon('plus', 'icon-sm') + ' Tambah Penduduk</button>' : '') +
            '</div>' +
          '</div>' +
          '<div class="table-wrap"><table class="table"><thead><tr><th>NIK (Contoh)</th><th>Nama Lengkap</th><th>L/P</th><th>Wilayah</th><th>Pekerjaan</th><th>Status</th><th>Aksi</th></tr></thead><tbody>' +
            resList.map(function (r) {
              return '<tr>' +
                '<td class="t-mono" style="font-size:12.5px">' + esc(w.DesaApp.formatNik(r.nik)) + '</td>' +
                '<td><strong>' + esc(r.name) + '</strong><div class="t-caption t-muted">' + esc(r.ttl) + '</div></td>' +
                '<td>' + esc(r.gender) + '</td>' +
                '<td>' + esc(r.dusun) + ' <span class="t-caption t-muted">RT ' + esc(r.rt) + '/RW ' + esc(r.rw) + '</span></td>' +
                '<td>' + esc(r.job) + '</td>' +
                '<td><span class="badge ' + (r.status === 'Aktif' ? 'badge-emerald' : 'badge-neutral') + '">' + esc(r.status) + '</span></td>' +
                '<td><button type="button" class="btn btn-sm btn-outline" data-action="open-resident-detail" data-id="' + esc(r.id) + '">Detail &amp; Riwayat</button></td>' +
              '</tr>';
            }).join('') +
          '</tbody></table></div>' +
        '</div>' +
      '</div>';
    } else if (tab === 'statistik') {
      var stat = st.data.statistik;
      body = '<div class="card flex-col gap-16">' +
        '<div class="flex items-center justify-between flex-wrap gap-12">' +
          '<div><h3 class="t-h3">Persetujuan Snapshot Statistik Publik (BR-T01–T04)</h3><p class="t-sm t-muted">Diperbarui otomatis dari Data Kependudukan internal. Hanya Kepala Desa yang berwenang menyetujui penayangan ke halaman publik.</p></div>' +
          '<div class="flex items-center gap-10">' +
            '<span class="badge ' + (stat.published ? 'badge-emerald' : 'badge-warning') + '">' + (stat.published ? 'Dipublikasikan (' + esc(stat.approvedAt) + ')' : 'Menunggu Persetujuan Kades') + '</span>' +
            '<button type="button" class="btn btn-sm ' + (stat.published ? 'btn-outline' : 'btn-accent') + '" data-action="admin-approve-stat" data-val="' + (stat.published ? '0' : '1') + '">' + (stat.published ? 'Tarik ke Empty State' : 'Setujui Publikasi Statistik') + '</button>' +
          '</div>' +
        '</div>' +
        w.DesaApp.charts.hBar(stat.pekerjaan.map(function (p) { return { label: p.label, value: p.jumlah, suffix: 'jiwa' }; })) +
      '</div>';
    } else {
      body = '<div class="card flex-col gap-16">' +
        '<div class="flex items-center justify-between flex-wrap gap-12">' +
          '<div><h3 class="t-h3">Kelola Titik Lokasi &amp; Batas Wilayah Peta Administrasi</h3><p class="t-sm t-muted">Titik potensi ekonomi di sini tersinkronisasi dengan katalog Potensi Desa.</p></div>' +
          '<div class="flex items-center gap-12">' +
            '<label class="switch"><input type="checkbox" ' + (st.data.mapConfig.officialBoundaryAvailable ? 'checked' : '') + ' data-action="toggle-map-boundary"><span class="switch-track"><span class="switch-thumb"></span></span><span class="t-caption">Data Batas Sah Tersedia</span></label>' +
            '<button type="button" class="btn btn-sm btn-outline" data-nav="public:peta">Buka Peta Publik</button>' +
          '</div>' +
        '</div>' +
        '<div class="table-wrap"><table class="table"><thead><tr><th>ID</th><th>Nama Lokasi</th><th>Kategori</th><th>Dusun</th><th>Koordinat (Contoh)</th></tr></thead><tbody>' +
          st.data.mapMarkers.map(function (m) {
            return '<tr><td class="t-mono t-caption">' + esc(m.id) + '</td><td><strong>' + esc(m.name) + '</strong></td><td><span class="badge badge-navy">' + esc(m.category) + '</span></td><td>' + esc(m.dusun) + '</td><td class="t-mono t-caption">' + esc(m.coords) + '</td></tr>';
          }).join('') +
        '</tbody></table></div>' +
      '</div>';
    }

    return '<div class="flex-col gap-16">' +
      '<div class="seg-tabs">' +
        (can('kependudukan') ? '<button type="button" class="seg-tab' + (tab === 'kependudukan' ? ' is-active' : '') + '" data-action="set-tab" data-key="dataDesaTab" data-val="kependudukan">Data Kependudukan</button>' : '') +
        (can('statistik_pub') || can('kependudukan') ? '<button type="button" class="seg-tab' + (tab === 'statistik' ? ' is-active' : '') + '" data-action="set-tab" data-key="dataDesaTab" data-val="statistik">Statistik Kependudukan</button>' : '') +
        (can('peta') ? '<button type="button" class="seg-tab' + (tab === 'peta' ? ' is-active' : '') + '" data-action="set-tab" data-key="dataDesaTab" data-val="peta">Peta Administrasi</button>' : '') +
      '</div>' +
      body +
    '</div>';
  }

  w.DesaApp.renderAdminShell = function () {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var role = w.DesaApp.getRoleInfo();
    var page = st.adminPage;

    var unreadCount = st.data.notifications.filter(function (n) { return n.unread; }).length;
    var pendingLetterCount = st.data.requests.filter(function (r) {
      return r.status === 'Diajukan' || r.status === 'Menunggu Verifikasi' || r.status === 'Sedang Diproses';
    }).length;

    var activeNav = ADMIN_NAV.find(function (n) { return n.id === page; }) || ADMIN_NAV[0];
    var allowed = hasMenuAccess(activeNav);

    var mainView = '';
    if (!allowed) {
      mainView = '<div class="empty-state">' +
        '<div class="empty-state-icon" style="background:var(--status-error-soft);color:var(--status-error)">' + icon('lock', 'icon-lg') + '</div>' +
        '<h2 class="t-h2">403 — Akses Dibatasi oleh Kebijakan RBAC Server</h2>' +
        '<p class="t-sm t-muted" style="max-width:520px">Peran aktif saat ini (<strong>' + esc(role.label) + '</strong>) tidak memiliki izin untuk membuka modul <strong>' + esc(activeNav.label) + '</strong> (PRD Bagian 11). Pembatasan ini ditegakkan di server, bukan hanya menyembunyikan menu.</p>' +
        '<button type="button" class="btn btn-primary mt-8" data-nav="admin:dashboard">Kembali ke Dashboard Ringkasan</button>' +
      '</div>';
    } else {
      switch (page) {
        case 'konten': mainView = renderAdminKonten(); break;
        case 'data-desa': mainView = renderAdminDataDesa(); break;
        case 'persuratan': mainView = w.DesaApp.renderAdminPersuratan(); break;
        case 'bantuan': mainView = w.DesaApp.renderAdminBantuan(); break;
        case 'laporan': mainView = w.DesaApp.renderAdminLaporan(); break;
        case 'pengguna': mainView = w.DesaApp.renderAdminPengguna(); break;
        case 'log': mainView = w.DesaApp.renderAdminLog(); break;
        case 'pengaturan': mainView = w.DesaApp.renderAdminPengaturan(); break;
        default: mainView = renderAdminDashboard();
      }
    }

    return '<div class="admin-shell" data-admin-theme="' + esc(st.adminTheme) + '">' +
      (st.adminSidebarOpen ? '<div class="admin-sidebar-backdrop" data-action="close-mobile-menus"></div>' : '') +
      '<aside class="admin-sidebar' + (st.adminSidebarOpen ? ' is-open' : '') + '">' +
        '<div class="admin-sidebar-head">' +
          '<div class="admin-logo-sq">' + icon('building') + '</div>' +
          '<div class="flex-1"><div style="font-weight:700;font-size:14.5px">Portal Admin Desa</div><div class="t-caption t-muted">' + esc(st.data.site.villageName) + '</div></div>' +
          '<button type="button" class="icon-circle-btn admin-sidebar-close" data-action="close-mobile-menus" aria-label="Tutup menu admin">' + icon('x', 'icon-sm') + '</button>' +
        '</div>' +

        '<nav class="admin-nav" aria-label="Navigasi Admin">' +
          ADMIN_NAV.filter(hasMenuAccess).map(function (item) {
            var active = page === item.id ? ' is-active' : '';
            var badge = item.id === 'persuratan' && pendingLetterCount ? '<span class="admin-nav-count">' + pendingLetterCount + '</span>' : '';
            return '<button type="button" class="admin-nav-btn' + active + '" data-nav="admin:' + item.id + '">' +
              '<span class="admin-nav-left">' + icon(item.icon, 'icon-sm') + '<span>' + esc(item.label) + '</span></span>' +
              badge +
            '</button>';
          }).join('') +
        '</nav>' +

        '<div class="admin-sidebar-foot">' +
          '<div class="t-caption t-muted">Peran Aktif: <strong style="color:var(--ink)">' + esc(role.label) + '</strong></div>' +
          '<button type="button" class="btn btn-sm btn-outline w-full" data-nav="public:home">' + icon('external', 'icon-sm') + ' Website Publik</button>' +
          '<button type="button" class="btn btn-sm btn-ghost w-full" data-nav="login">' + icon('lock', 'icon-sm') + ' Keluar (Login)</button>' +
        '</div>' +
      '</aside>' +

      '<div class="admin-main-col">' +
        '<header class="admin-topbar">' +
          '<div class="flex items-center gap-12" style="min-width:0">' +
            '<button type="button" class="icon-circle-btn admin-menu-toggle" data-action="toggle-admin-sidebar" aria-label="Buka menu admin" aria-expanded="' + (st.adminSidebarOpen ? 'true' : 'false') + '">' + icon('menu', 'icon-sm') + '</button>' +
            '<h1 class="t-h3" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(activeNav.id === 'dashboard' ? 'Dashboard Ringkasan' : activeNav.label) + '</h1>' +
            '<span class="badge badge-neutral admin-stage-badge">Tahap 1–5 Terintegrasi</span>' +
          '</div>' +
          '<div class="admin-topbar-right">' +
            '<button type="button" class="cmdk-trigger" data-action="open-cmdk" aria-label="Pencarian cepat">' +
              '<span class="flex items-center gap-8">' + icon('search', 'icon-sm') + ' <span class="cmdk-label">Cari cepat...</span></span>' +
              '<span class="kbd-pill">Ctrl+K</span>' +
            '</button>' +

            '<button type="button" class="icon-circle-btn" title="Ganti Mode Terang / Gelap" data-action="toggle-admin-theme">' +
              icon(st.adminTheme === 'dark' ? 'sun' : 'moon', 'icon-sm') +
            '</button>' +

            '<div style="position:relative">' +
              '<button type="button" class="icon-circle-btn" title="Notifikasi" data-action="toggle-notif">' +
                icon('bell', 'icon-sm') +
                (unreadCount ? '<span class="notif-dot"></span>' : '') +
              '</button>' +
              (st.notifOpen ? '<div class="notif-popover">' +
                '<div class="flex items-center justify-between" style="padding:12px 16px;border-bottom:1px solid var(--line-subtle)"><strong>Notifikasi (' + unreadCount + ')</strong><button type="button" class="btn btn-sm btn-ghost" data-action="mark-notif-read">Tandai Dibaca</button></div>' +
                '<div class="flex-col" style="max-height:280px;overflow-y:auto">' +
                  st.data.notifications.slice(0, 5).map(function (nt) {
                    return '<button type="button" class="cmdk-item" style="border-radius:0;border-bottom:1px solid var(--line-subtle)" data-nav="admin:' + esc(nt.target) + '">' +
                      '<div><div class="t-sm" style="font-weight:600">' + esc(nt.title) + '</div><div class="t-caption t-muted">' + esc(nt.body) + '</div></div>' +
                      '<span class="t-caption t-muted">' + esc(nt.time) + '</span>' +
                    '</button>';
                  }).join('') +
                '</div>' +
              '</div>' : '') +
            '</div>' +

            '<div class="role-pill-select" title="Ganti Peran RBAC untuk Simulasi">' +
              '<span class="role-avatar-dot">' + esc(role.badge) + '</span>' +
              '<select aria-label="Pilih Peran RBAC" data-action="switch-role">' +
                w.DesaApp.ROLES.map(function (r) {
                  return '<option value="' + esc(r.id) + '"' + (st.currentRole === r.id ? ' selected' : '') + '>' + esc(r.label) + '</option>';
                }).join('') +
              '</select>' +
            '</div>' +
          '</div>' +
        '</header>' +

        '<main class="admin-content">' + mainView + '</main>' +
      '</div>' +
    '</div>';
  };
})(window);
