/* ==========================================================================
   ADMIN MODULES — Persuratan & Arsip, Bantuan, Laporan, Pengguna, Log, Pengaturan
   ========================================================================== */
(function (w) {
  'use strict';
  w.DesaApp = w.DesaApp || {};

  w.DesaApp.renderAdminPersuratan = function () {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var can = w.DesaApp.can;
    var statusBadge = w.DesaApp.statusBadge;
    var allowedTabs = [];
    if (can('persuratan')) allowedTabs.push('pengajuan');
    if (can('template_no')) { allowedTabs.push('template'); allowedTabs.push('penomoran'); }
    if (can('arsip')) allowedTabs.push('arsip');
    var tab = allowedTabs.indexOf(st.persuratanTab) !== -1 ? st.persuratanTab : (allowedTabs[0] || 'arsip');

    var statuses = ['Semua', 'Diajukan', 'Menunggu Verifikasi', 'Perlu Perbaikan', 'Sedang Diproses', 'Disetujui', 'Ditolak', 'Selesai / Diterbitkan'];
    var filteredReqs = st.data.requests.filter(function (r) {
      var sOk = st.adminRequestFilter === 'Semua' || r.status === st.adminRequestFilter;
      var q = st.adminRequestSearch.trim().toLowerCase();
      var qOk = !q || r.regNo.toLowerCase().indexOf(q) !== -1 || r.applicantName.toLowerCase().indexOf(q) !== -1 || r.serviceName.toLowerCase().indexOf(q) !== -1;
      return sOk && qOk;
    });

    var body = '';
    if (tab === 'pengajuan') {
      body = '<div class="flex-col gap-16">' +
        '<div class="card">' +
          '<div class="flex items-center justify-between flex-wrap gap-12 mb-16">' +
            '<div class="flex items-center gap-10 flex-wrap flex-1">' +
              '<div class="input-with-icon filter-control">' + icon('search', 'icon-sm icon-left') + '<input class="input" placeholder="Cari No. Reg atau nama pemohon..." value="' + esc(st.adminRequestSearch) + '" data-action="filter-search" data-key="adminRequestSearch"></div>' +
              '<select class="select filter-control" data-action="set-select" data-key="adminRequestFilter">' +
                statuses.map(function (s) { return '<option value="' + esc(s) + '"' + (st.adminRequestFilter === s ? ' selected' : '') + '>' + esc(s) + '</option>'; }).join('') +
              '</select>' +
            '</div>' +
            (st.currentRole === 'petugas_pelayanan'
              ? '<button type="button" class="btn btn-sm btn-accent" data-action="open-walkin-modal">' + icon('plus', 'icon-sm') + ' Catat Pengajuan Tatap Muka (BR-S14)</button>'
              : '<span class="badge badge-navy">Peran aktif: ' + esc(w.DesaApp.getRoleInfo().label) + '</span>') +
          '</div>' +
          '<div class="table-wrap"><table class="table"><thead><tr><th>No. Registrasi</th><th>Pemohon</th><th>Layanan &amp; Kanal</th><th>Status</th><th>No. Surat</th><th>Aksi</th></tr></thead><tbody>' +
            filteredReqs.map(function (r) {
              return '<tr>' +
                '<td class="t-mono" style="font-weight:600;font-size:12.5px">' + esc(r.regNo) + '</td>' +
                '<td><strong>' + esc(r.applicantName) + '</strong><div class="t-caption t-muted">' + esc(r.address) + '</div></td>' +
                '<td><div>' + esc(r.serviceName) + '</div><div class="t-caption t-muted">' + esc(r.channel) + ' • ' + esc(r.submittedAt) + '</div></td>' +
                '<td>' + statusBadge(r.status) + (r.subStatus ? '<div class="t-caption t-muted mt-4">Sub: ' + esc(r.subStatus) + '</div>' : '') + '</td>' +
                '<td class="t-mono t-caption">' + (r.letterNumber ? esc(r.letterNumber) : '<span class="t-muted">-</span>') + '</td>' +
                '<td><button type="button" class="btn btn-sm btn-primary" data-action="open-req-drawer" data-id="' + esc(r.id) + '">Periksa &amp; Proses</button></td>' +
              '</tr>';
            }).join('') +
          '</tbody></table></div>' +
        '</div>' +
      '</div>';
    } else if (tab === 'template') {
      body = '<div class="card"><div class="card-header"><h3 class="t-h3">Template Surat Resmi Desa</h3><span class="t-caption t-muted">Dapat disesuaikan dengan format resmi pemerintah desa</span></div>' +
        '<div class="grid-2">' +
          st.data.templates.map(function (t) {
            return '<div class="card card-flat" style="background:var(--surface-alt)">' +
              '<div class="flex items-center justify-between"><span class="badge badge-navy">' + esc(t.code) + ' • Kode ' + esc(t.klasifikasiKode) + '</span><span class="t-caption t-muted">' + esc(t.penandatangan) + '</span></div>' +
              '<h4 class="t-h3 mt-8">' + esc(t.name) + '</h4>' +
              '<pre class="t-caption t-secondary mt-8" style="white-space:pre-wrap;font-family:var(--font-mono);background:var(--surface);padding:10px;border-radius:10px;border:1px solid var(--line-subtle)">' + esc(t.body) + '</pre>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>';
    } else if (tab === 'penomoran') {
      var nc = st.data.numberingConfig;
      body = '<div class="card flex-col gap-16">' +
        '<h3 class="t-h3">Aturan Penomoran Surat (BR-N01 s.d. BR-N05)</h3>' +
        '<div class="alert alert-info">' + icon('info') + '<div>Nomor surat dialokasikan secara <strong>atomik saat penerbitan</strong> (bukan saat draf), sehingga tidak pernah ada nomor ganda atau nomor urut terbuang.</div></div>' +
        '<form class="grid-2" data-form="numbering-config">' +
          '<div class="field"><label class="field-label">Pola Format Nomor Surat</label><input class="input t-mono" name="pattern" value="' + esc(nc.pattern) + '"></div>' +
          '<div class="field"><label class="field-label">Kode Desa</label><input class="input t-mono" name="kodeDesa" value="' + esc(nc.kodeDesa) + '"></div>' +
          '<div class="field"><label class="field-label">Nomor Urut Berikutnya</label><input class="input t-mono" type="number" name="nextSequence" value="' + nc.nextSequence + '"></div>' +
          '<div class="field"><label class="field-label">Kebijakan Reset</label><input class="input" name="resetPolicy" value="' + esc(nc.resetPolicy) + '"></div>' +
          '<div style="grid-column:1/-1;background:var(--accent-soft)" class="flex items-center justify-between card card-flat">' +
            '<div><div class="t-caption t-muted">PRATINJAU NOMOR BERIKUTNYA:</div><div class="t-h3 t-mono mt-4">470/' + String(nc.nextSequence).padStart(nc.padDigits, '0') + '/' + esc(nc.kodeDesa) + '-XI/2026</div></div>' +
            '<button type="submit" class="btn btn-accent">Simpan Aturan Nomor</button>' +
          '</div>' +
        '</form>' +
      '</div>';
    } else {
      var arCats = ['Semua', 'Surat Masuk', 'Surat Keluar', 'Surat Keterangan Terbit', 'Surat Keputusan', 'Surat Undangan', 'Surat Tugas', 'Dokumen Persuratan Lainnya'];
      var arsList = st.data.archives.filter(function (a) {
        var cOk = st.archiveCategoryFilter === 'Semua' || a.category === st.archiveCategoryFilter;
        var q = st.archiveSearch.trim().toLowerCase();
        var qOk = !q || a.number.toLowerCase().indexOf(q) !== -1 || a.subject.toLowerCase().indexOf(q) !== -1 || a.party.toLowerCase().indexOf(q) !== -1;
        return cOk && qOk;
      });
      body = '<div class="card flex-col gap-16">' +
        '<div class="flex items-center justify-between flex-wrap gap-12">' +
          '<div class="flex items-center gap-10 flex-wrap flex-1">' +
            '<div class="input-with-icon filter-control">' + icon('search', 'icon-sm icon-left') + '<input class="input" placeholder="Cari nomor / perihal arsip..." value="' + esc(st.archiveSearch) + '" data-action="filter-search" data-key="archiveSearch"></div>' +
            '<select class="select filter-control" data-action="set-select" data-key="archiveCategoryFilter">' +
              arCats.map(function (c) { return '<option value="' + esc(c) + '"' + (st.archiveCategoryFilter === c ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('') +
            '</select>' +
          '</div>' +
          (can('arsip', 'K') ? '<button type="button" class="btn btn-sm btn-accent" data-action="open-add-archive">' + icon('plus', 'icon-sm') + ' Tambah Arsip Manual</button>' : '') +
        '</div>' +
        '<div class="table-wrap"><table class="table"><thead><tr><th>Nomor Surat</th><th>Kategori &amp; Perihal</th><th>Tanggal</th><th>Pihak Terkait</th><th>Klasifikasi Akses</th><th>Aksi</th></tr></thead><tbody>' +
          arsList.map(function (a) {
            var accCls = a.access === 'Rahasia' ? 'badge-danger' : a.access === 'Terbatas' ? 'badge-warning' : 'badge-emerald';
            return '<tr>' +
              '<td class="t-mono t-caption" style="font-weight:600">' + esc(a.number) + '</td>' +
              '<td><div><strong>' + esc(a.subject) + '</strong></div><div class="t-caption t-muted">' + esc(a.category) + (a.sourceReq ? ' • Otomatis dari ' + esc(a.sourceReq) : '') + '</div></td>' +
              '<td class="t-caption">' + esc(a.letterDate) + '</td>' +
              '<td class="t-sm">' + esc(a.party) + '</td>' +
              '<td><span class="badge ' + accCls + '">' + esc(a.access) + '</span></td>' +
              '<td><button type="button" class="btn btn-sm btn-outline" data-action="open-archive-preview" data-id="' + esc(a.id) + '">' + icon('eye', 'icon-sm') + ' Pratinjau</button></td>' +
            '</tr>';
          }).join('') +
        '</tbody></table></div>' +
      '</div>';
    }

    return '<div class="flex-col gap-16">' +
      '<div class="seg-tabs">' +
        (can('persuratan') ? '<button type="button" class="seg-tab' + (tab === 'pengajuan' ? ' is-active' : '') + '" data-action="set-tab" data-key="persuratanTab" data-val="pengajuan">Pengajuan Surat (' + st.data.requests.length + ')</button>' : '') +
        (can('template_no') ? '<button type="button" class="seg-tab' + (tab === 'template' ? ' is-active' : '') + '" data-action="set-tab" data-key="persuratanTab" data-val="template">Template Surat</button>' : '') +
        (can('template_no') ? '<button type="button" class="seg-tab' + (tab === 'penomoran' ? ' is-active' : '') + '" data-action="set-tab" data-key="persuratanTab" data-val="penomoran">Penomoran Surat</button>' : '') +
        (can('arsip') ? '<button type="button" class="seg-tab' + (tab === 'arsip' ? ' is-active' : '') + '" data-action="set-tab" data-key="persuratanTab" data-val="arsip">Arsip Persuratan (' + st.data.archives.length + ')</button>' : '') +
      '</div>' +
      body +
    '</div>';
  };

  w.DesaApp.renderAdminBantuan = function () {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var canK = w.DesaApp.can('bantuan', 'K');
    var tab = st.bantuanTab;

    var body = '';
    if (tab === 'penerima' || tab === 'riwayat') {
      body = '<div class="card flex-col gap-16">' +
        '<div class="flex items-center justify-between flex-wrap gap-12">' +
          '<div><h3 class="t-h3">' + (tab === 'penerima' ? 'Data Penerima &amp; Deteksi Catatan Ganda (BR-B03)' : 'Riwayat Penyaluran &amp; Bukti Terbatas') + '</h3><p class="t-caption t-muted">Sistem hanya mencatat sesuai keputusan berwenang (tidak menilai kelayakan kemiskinan).</p></div>' +
          (canK ? '<button type="button" class="btn btn-sm btn-accent" data-action="open-add-bantuan">' + icon('plus', 'icon-sm') + ' Catat Penyaluran Baru</button>' : '') +
        '</div>' +
        '<div class="table-wrap"><table class="table"><thead><tr><th>Penerima (Terhubung Penduduk)</th><th>Program &amp; Periode</th><th>Bentuk / Nilai</th><th>Status &amp; Peringatan</th><th>Aksi</th></tr></thead><tbody>' +
          st.data.aidRecipients.map(function (b) {
            var prg = st.data.aidPrograms.find(function (p) { return p.id === b.programId; });
            var per = st.data.aidPeriods.find(function (p) { return p.id === b.periodId; });
            var stCls = b.status === 'Disalurkan' ? 'badge-emerald' : b.status === 'Tidak Diambil' ? 'badge-danger' : 'badge-warning';
            return '<tr>' +
              '<td><strong>' + esc(b.residentName) + '</strong><div class="t-caption t-muted">' + esc(b.residentId) + ' • ' + esc(b.dusun) + '</div></td>' +
              '<td><div>' + esc(prg ? prg.name : b.programId) + '</div><div class="t-caption t-muted">' + esc(per ? per.label : b.periodId) + ' • ' + esc(b.distDate) + '</div></td>' +
              '<td><div>' + esc(b.bentuk) + '</div><div class="t-caption t-muted">' + esc(b.amount) + '</div></td>' +
              '<td><span class="badge ' + stCls + '">' + esc(b.status) + '</span>' + (b.duplicateWarning ? '<div class="mt-4"><span class="badge badge-danger">' + icon('alert', 'icon-sm') + ' Peringatan Ganda</span></div>' : '') + '</td>' +
              '<td><button type="button" class="btn btn-sm btn-outline" data-action="open-aid-history" data-resident="' + esc(b.residentId) + '">Riwayat Penerima</button></td>' +
            '</tr>';
          }).join('') +
        '</tbody></table></div>' +
      '</div>';
    } else if (tab === 'jenis') {
      body = '<div class="grid-2">' + st.data.aidPrograms.map(function (p) {
        return '<div class="card flex-col gap-10">' +
          '<div class="flex justify-between items-center"><span class="badge badge-navy">' + esc(p.source) + '</span><span class="t-caption t-muted">' + esc(p.bentuk) + '</span></div>' +
          '<h3 class="t-h3">' + esc(p.name) + '</h3>' +
          '<p class="t-sm t-secondary">' + esc(p.desc) + '</p>' +
          '<div class="t-caption t-muted">Kuota: ' + p.kuota + ' KPM • Tersalurkan: ' + p.disalurkan + ' KPM</div>' +
        '</div>';
      }).join('') + '</div>';
    } else if (tab === 'periode') {
      body = '<div class="card"><h3 class="t-h3 mb-12">Periode Penyaluran Bantuan</h3>' +
        '<div class="table-wrap"><table class="table"><thead><tr><th>ID</th><th>Label Periode</th><th>Rentang Tanggal</th><th>Status</th></tr></thead><tbody>' +
        st.data.aidPeriods.map(function (p) {
          return '<tr><td class="t-mono t-caption">' + esc(p.id) + '</td><td><strong>' + esc(p.label) + '</strong></td><td>' + esc(p.dateRange) + '</td><td><span class="badge ' + (p.status === 'Aktif Berjalan' ? 'badge-emerald' : 'badge-neutral') + '">' + esc(p.status) + '</span></td></tr>';
        }).join('') +
        '</tbody></table></div></div>';
    } else {
      body = '<div class="card flex-col gap-16">' +
        '<h3 class="t-h3">Rekapitulasi &amp; Pengaturan Publikasi Agregat (BR-B06)</h3>' +
        '<div class="table-wrap"><table class="table"><thead><tr><th>Program</th><th>Tersalurkan / Kuota</th><th>Tampilkan Agregat di Website Publik?</th></tr></thead><tbody>' +
        st.data.aidPrograms.map(function (p) {
          return '<tr><td><strong>' + esc(p.name) + '</strong></td><td>' + p.disalurkan + ' / ' + p.kuota + ' KPM</td>' +
            '<td><label class="switch"><input type="checkbox" ' + (p.publicPublish ? 'checked' : '') + ' ' + (!canK ? 'disabled' : '') + ' data-action="toggle-aid-public" data-id="' + esc(p.id) + '"><span class="switch-track"><span class="switch-thumb"></span></span><span class="t-caption">' + (p.publicPublish ? 'Publik (Agregat)' : 'Internal Saja') + '</span></label></td></tr>';
        }).join('') +
        '</tbody></table></div>' +
      '</div>';
    }

    return '<div class="flex-col gap-16">' +
      '<div class="seg-tabs">' +
        [['penerima', 'Data Penerima'], ['jenis', 'Jenis Bantuan'], ['periode', 'Periode Penyaluran'], ['riwayat', 'Riwayat Penyaluran'], ['rekap', 'Rekapitulasi']].map(function (t) {
          return '<button type="button" class="seg-tab' + (tab === t[0] ? ' is-active' : '') + '" data-action="set-tab" data-key="bantuanTab" data-val="' + t[0] + '">' + t[1] + '</button>';
        }).join('') +
      '</div>' +
      body +
    '</div>';
  };

  w.DesaApp.renderAdminLaporan = function () {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var charts = w.DesaApp.charts;
    var canE = w.DesaApp.can('laporan', 'E');

    var reportTypes = [
      { id: 'kependudukan', label: 'Statistik Kependudukan' },
      { id: 'pengajuan', label: 'Pengajuan Surat' },
      { id: 'terbit', label: 'Surat Diterbitkan' },
      { id: 'arsip', label: 'Arsip Persuratan' },
      { id: 'bantuan', label: 'Penyaluran Bantuan' },
      { id: 'aktivitas', label: 'Aktivitas Pengguna' }
    ];

    return '<div class="flex-col gap-16">' +
      '<div class="card">' +
        '<div class="flex items-center justify-between flex-wrap gap-12 mb-16">' +
          '<div class="seg-tabs">' +
            reportTypes.map(function (rt) {
              return '<button type="button" class="seg-tab' + (st.laporanType === rt.id ? ' is-active' : '') + '" data-action="set-tab" data-key="laporanType" data-val="' + rt.id + '">' + rt.label + '</button>';
            }).join('') +
          '</div>' +
          '<div class="flex gap-8">' +
            '<button type="button" class="btn btn-sm btn-outline" ' + (!canE ? 'disabled' : '') + ' data-action="toast" data-msg="Ekspor Excel/CSV berhasil disiapkan untuk peran Anda.">' + icon('download', 'icon-sm') + ' Ekspor CSV/Excel</button>' +
            '<button type="button" class="btn btn-sm btn-primary" ' + (!canE ? 'disabled' : '') + ' data-action="toast" data-msg="Ekspor Laporan PDF resmi berhasil disiapkan.">' + icon('printer', 'icon-sm') + ' Cetak PDF</button>' +
          '</div>' +
        '</div>' +
        '<div class="grid-2">' +
          '<div>' + charts.vBar(st.data.profil.geografis.dusun.map(function (d) { return { label: d.nama, short: d.nama.replace('Dusun ', ''), value: d.jiwa }; }), { height: 210 }) + '</div>' +
          '<div class="flex-col gap-12">' +
            '<h3 class="t-h3">Ringkasan Laporan: ' + esc((reportTypes.find(function (r) { return r.id === st.laporanType; }) || reportTypes[0]).label) + '</h3>' +
            '<p class="t-sm t-secondary">Seluruh laporan ditarik otomatis dari satu basis data terintegrasi tanpa input ulang (G-5, G-7). Ekspor hanya aktif untuk peran berwenang sesuai matriks RBAC.</p>' +
            '<div class="table-wrap"><table class="table"><thead><tr><th>Metrik</th><th>Nilai</th></tr></thead><tbody>' +
              '<tr><td>Total Penduduk Tercatat</td><td><strong>' + st.data.statistik.totalPenduduk.toLocaleString('id-ID') + ' jiwa</strong></td></tr>' +
              '<tr><td>Total Pengajuan Surat</td><td><strong>' + st.data.requests.length + ' permohonan</strong></td></tr>' +
              '<tr><td>Total Arsip Digital</td><td><strong>' + st.data.archives.length + ' dokumen</strong></td></tr>' +
              '<tr><td>Catatan Penyaluran Bantuan</td><td><strong>' + st.data.aidRecipients.length + ' entri contoh</strong></td></tr>' +
            '</tbody></table></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  };

  w.DesaApp.renderAdminPengguna = function () {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;

    var modLabels = [
      ['konten', 'Konten Website'], ['kependudukan', 'Data Kependudukan'], ['statistik_pub', 'Persetujuan Statistik'],
      ['peta', 'Peta Administrasi'], ['persuratan', 'Pengajuan Surat'], ['template_no', 'Template & Penomoran'],
      ['arsip', 'Arsip Persuratan'], ['bantuan', 'Bantuan Desa'], ['laporan', 'Laporan'],
      ['pengguna', 'Pengguna & Hak Akses'], ['log', 'Log Aktivitas'], ['pengaturan', 'Pengaturan Sistem']
    ];

    return '<div class="flex-col gap-20">' +
      '<div class="card">' +
        '<div class="card-header"><h3 class="t-h3">Daftar Akun Pengguna Internal (Multi-Peran Didukung)</h3><button type="button" class="btn btn-sm btn-accent" data-action="open-add-user">' + icon('plus', 'icon-sm') + ' Tambah Pengguna</button></div>' +
        '<div class="table-wrap"><table class="table"><thead><tr><th>Nama &amp; Username</th><th>Email</th><th>Peran (RBAC)</th><th>Login Terakhir</th><th>Status</th></tr></thead><tbody>' +
          st.data.users.map(function (u) {
            return '<tr><td><strong>' + esc(u.name) + '</strong><div class="t-mono t-caption t-muted">' + esc(u.username) + '</div></td><td class="t-sm">' + esc(u.email) + '</td><td>' +
              u.roles.map(function (rid) { return '<span class="badge badge-navy" style="margin-right:4px">' + esc(w.DesaApp.getRoleInfo(rid).label) + '</span>'; }).join('') +
              '</td><td class="t-caption">' + esc(u.lastLogin) + '</td><td><span class="badge badge-emerald">' + (u.active ? 'Aktif' : 'Nonaktif') + '</span></td></tr>';
          }).join('') +
        '</tbody></table></div>' +
      '</div>' +

      '<div class="card">' +
        '<div class="card-header"><div><h3 class="t-h3">Matriks Hak Akses (RBAC PRD Bagian 11)</h3><div class="t-caption t-muted">K = Kelola (CRUD) • L = Lihat • S = Setujui/Tolak • E = Ekspor</div></div></div>' +
        '<div class="table-wrap"><table class="table"><thead><tr><th>Modul / Fungsi</th>' +
          w.DesaApp.ROLES.map(function (r) { return '<th>' + esc(r.label) + '</th>'; }).join('') +
        '</tr></thead><tbody>' +
          modLabels.map(function (m) {
            return '<tr><td><strong>' + esc(m[1]) + '</strong></td>' +
              w.DesaApp.ROLES.map(function (r) {
                var perms = (w.DesaApp.RBAC_MATRIX[m[0]] || {})[r.id] || [];
                return '<td>' + (perms.length ? '<span class="badge badge-emerald">' + esc(perms.join(', ')) + '</span>' : '<span class="t-muted">–</span>') + '</td>';
              }).join('') +
            '</tr>';
          }).join('') +
        '</tbody></table></div>' +
      '</div>' +
    '</div>';
  };

  w.DesaApp.renderAdminLog = function () {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var logs = st.data.logs.filter(function (l) {
      return st.logFilter === 'Semua' || l.action.toLowerCase().indexOf(st.logFilter.toLowerCase()) !== -1;
    });

    return '<div class="card flex-col gap-16">' +
      '<div class="flex items-center justify-between flex-wrap gap-12">' +
        '<div><h3 class="t-h3">Log Aktivitas Audit (Tidak Dapat Diubah Pengguna Biasa)</h3><p class="t-caption t-muted">Setiap aksi yang Anda lakukan di prototipe ini otomatis tercatat di sini (LOG-01).</p></div>' +
        '<select class="select filter-control" data-action="set-select" data-key="logFilter">' +
          ['Semua', 'Pengajuan', 'Perubahan Status', 'Penerbitan', 'Login', 'Impor', 'Bantuan', 'Backup'].map(function (f) {
            return '<option value="' + f + '"' + (st.logFilter === f ? ' selected' : '') + '>' + f + '</option>';
          }).join('') +
        '</select>' +
      '</div>' +
      '<div class="table-wrap"><table class="table"><thead><tr><th>Waktu</th><th>Pengguna</th><th>Tindakan</th><th>Objek Terdampak</th><th>Keterangan</th></tr></thead><tbody>' +
        logs.map(function (l) {
          return '<tr><td class="t-caption" style="white-space:nowrap">' + esc(l.time) + '</td><td><strong>' + esc(l.actor) + '</strong></td><td><span class="badge badge-navy">' + esc(l.action) + '</span></td><td>' + esc(l.target) + '</td><td class="t-sm t-secondary">' + esc(l.detail) + '</td></tr>';
        }).join('') +
      '</tbody></table></div>' +
    '</div>';
  };

  w.DesaApp.renderAdminPengaturan = function () {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var s = st.data.site;
    var tab = st.pengaturanTab;

    var tabs = [
      ['identitas', 'Identitas & Logo'], ['kontak', 'Kontak & Navbar/Footer'],
      ['notifikasi', 'Notifikasi & Email'], ['backup', 'Backup & Pemulihan'],
      ['keamanan', 'Keamanan & Retensi'], ['umum', 'Peta & Umum']
    ];

    var body = '';
    if (tab === 'identitas' || tab === 'kontak') {
      body = '<form class="card flex-col gap-14" data-form="admin-settings">' +
        '<h3 class="t-h3">' + (tab === 'identitas' ? 'Identitas Resmi &amp; Domain Desa' : 'Kontak Resmi &amp; Jam Loket') + '</h3>' +
        '<div class="grid-2">' +
          '<div class="field"><label class="field-label">Nama Desa</label><input class="input" name="villageName" value="' + esc(s.villageName) + '"></div>' +
          '<div class="field"><label class="field-label">Kabupaten</label><input class="input" name="regencyName" value="' + esc(s.regencyName) + '"></div>' +
          '<div class="field"><label class="field-label">Telepon Kantor</label><input class="input" name="phone" value="' + esc(s.phone) + '"></div>' +
          '<div class="field"><label class="field-label">Email Pengirim Resmi</label><input class="input" name="email" value="' + esc(s.email) + '"></div>' +
        '</div>' +
        '<div class="field"><label class="field-label">Alamat Kantor Desa</label><input class="input" name="officeAddress" value="' + esc(s.officeAddress) + '"></div>' +
        '<div class="field"><label class="field-label">Catatan Domain Resmi</label><input class="input" name="domainNotice" value="' + esc(s.domainNotice) + '"></div>' +
        '<div class="flex justify-end"><button type="submit" class="btn btn-accent">Simpan Pengaturan</button></div>' +
      '</form>';
    } else if (tab === 'notifikasi') {
      body = '<div class="card flex-col gap-16">' +
        '<h3 class="t-h3">Konfigurasi Notifikasi Dashboard &amp; Email Antrean (BR-E01–E06)</h3>' +
        '<div class="alert alert-info">' + icon('mail') + '<div>Email dikirim melalui queue agar kegagalan SMTP tidak menggagalkan perubahan status surat, dan isi email <strong>tidak pernah memuat NIK, KK, atau dokumen privat</strong>.</div></div>' +
        '<label class="switch"><input type="checkbox" ' + (s.notificationEmailEnabled ? 'checked' : '') + ' data-action="toggle-email-notif"><span class="switch-track"><span class="switch-thumb"></span></span><span class="t-sm">Aktifkan Email Notifikasi ke Pemohon &amp; Petugas (' + esc(s.smtpProvider) + ')</span></label>' +
      '</div>';
    } else if (tab === 'backup') {
      body = '<div class="card flex-col gap-16">' +
        '<div class="card-header"><div><h3 class="t-h3">Cadangan Data Terjadwal &amp; Uji Pemulihan (RPO ≤ 24 Jam, RTO ≤ 8 Jam)</h3><div class="t-caption t-muted">Database PostgreSQL + Dokumen Privat disimpan terenkripsi ke penyimpanan di luar VPS.</div></div>' +
          '<div class="flex gap-8"><button type="button" class="btn btn-sm btn-accent" data-action="run-backup">' + icon('database', 'icon-sm') + ' Jalankan Backup Sekarang</button></div>' +
        '</div>' +
        '<div class="table-wrap"><table class="table"><thead><tr><th>Waktu</th><th>Ukuran</th><th>Cakupan</th><th>Lokasi</th><th>Status</th><th>Uji Restore</th></tr></thead><tbody>' +
          st.data.backups.map(function (b) {
            return '<tr><td><strong>' + esc(b.time) + '</strong></td><td>' + esc(b.size) + '</td><td class="t-sm">' + esc(b.type) + '</td><td class="t-sm">' + esc(b.location) + '</td><td><span class="badge badge-emerald">' + esc(b.status) + '</span></td><td><button type="button" class="btn btn-sm btn-outline" data-action="toast" data-msg="Simulasi uji pemulihan (restore check) untuk ' + esc(b.id) + ' lulus.">Uji Restore</button></td></tr>';
          }).join('') +
        '</tbody></table></div>' +
      '</div>';
    } else {
      body = '<div class="card flex-col gap-12">' +
        '<h3 class="t-h3">Keamanan Akun, Retensi Dokumen &amp; Pengaturan Umum</h3>' +
        '<div class="table-wrap"><table class="table"><tbody>' +
          '<tr><td>Pembatasan Percobaan Login</td><td><strong>Aktif</strong> (Maks 5 kali gagal, kunci sementara 15 menit)</td></tr>' +
          '<tr><td>Ambang Penyembunyian Statistik Kecil (BR-T04)</td><td><strong>&lt; ' + s.smallGroupThreshold + ' jiwa</strong></td></tr>' +
          '<tr><td>Retensi Dokumen Persyaratan Pengajuan</td><td><strong>' + s.retentionMonths + ' bulan</strong> (sesuai kesepakatan pemerintah desa)</td></tr>' +
          '<tr><td>Mode Tema Panel Admin</td><td><strong>Perfect Squircle</strong> (' + (st.adminTheme === 'dark' ? 'Gelap' : 'Terang') + ')</td></tr>' +
        '</tbody></table></div>' +
      '</div>';
    }

    return '<div class="flex-col gap-16">' +
      '<div class="seg-tabs">' + tabs.map(function (t) {
        return '<button type="button" class="seg-tab' + (tab === t[0] ? ' is-active' : '') + '" data-action="set-tab" data-key="pengaturanTab" data-val="' + t[0] + '">' + t[1] + '</button>';
      }).join('') + '</div>' +
      body +
    '</div>';
  };
})(window);
