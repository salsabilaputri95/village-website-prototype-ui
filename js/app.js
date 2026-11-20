/* ==========================================================================
   APP SHELL — Routing, Event Delegation, Modals, Drawers & Command Palette
   ========================================================================== */
(function (w) {
  'use strict';
  w.DesaApp = w.DesaApp || {};

  var modalState = null; // { type: '...', id: '...', slide: 0, ... }

  function renderDemoBar() {
    var st = w.DesaApp.state;
    var icon = w.DesaApp.icon;
    if (st.demoBarCollapsed) {
      document.body.classList.add('demo-bar-hidden');
      return '<button type="button" class="demo-fab" data-action="toggle-demo-bar">' + icon('layout', 'icon-sm') + ' Mode Demo</button>';
    }
    document.body.classList.remove('demo-bar-hidden');
    var role = w.DesaApp.getRoleInfo();
    return '<div class="demo-bar" role="region" aria-label="Bilah Navigasi Prototipe">' +
      '<div class="demo-bar-left">' +
        '<span class="demo-bar-tag">PROTOTIPE INTERAKTIF DESKTOP</span>' +
        '<span class="demo-bar-title">Website &amp; Sistem Informasi Desa Terintegrasi (12 Modul PRD)</span>' +
      '</div>' +
      '<div class="demo-bar-tabs">' +
        '<button type="button" class="demo-tab-btn' + (st.area === 'public' ? ' is-active' : '') + '" data-nav="public:home">' + icon('home', 'icon-sm') + ' Website Publik</button>' +
        '<button type="button" class="demo-tab-btn' + (st.area === 'admin' ? ' is-active' : '') + '" data-nav="admin:dashboard">' + icon('layout', 'icon-sm') + ' Portal Admin (' + w.DesaApp.escapeHtml(role.label) + ')</button>' +
        '<button type="button" class="demo-tab-btn' + (st.area === 'login' ? ' is-active' : '') + '" data-nav="login">' + icon('lock', 'icon-sm') + ' Login Perangkat</button>' +
        '<button type="button" class="demo-tab-btn' + (st.area === 'design-system' ? ' is-active' : '') + '" data-nav="design-system">' + icon('palette', 'icon-sm') + ' Design System</button>' +
      '</div>' +
      '<div class="demo-bar-right">' +
        '<button type="button" class="demo-bar-btn" data-action="toggle-demo-bar" title="Sembunyikan bilah demo">' + icon('minus', 'icon-sm') + ' Sembunyikan</button>' +
      '</div>' +
    '</div>';
  }

  function renderLetterPaperHtml(req) {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var s = st.data.site;
    var svc = st.data.services.find(function (sv) { return sv.id === req.serviceId; });
    var tpl = st.data.templates.find(function (t) { return svc && t.code === svc.code; });
    var bodyText = (tpl ? tpl.body : 'Menerangkan bahwa {{NAMA}} ({{ALAMAT}}) mengajukan {{KEPERLUAN}}.')
      .replace('{{NAMA}}', req.applicantName)
      .replace('{{NIK_MASKED}}', req.nikMasked)
      .replace('{{TTL}}', req.dob)
      .replace('{{ALAMAT}}', req.address)
      .replace('{{KEPERLUAN}}', req.purpose);

    return '<div class="letter-paper">' +
      '<div class="letter-kop">' +
        '<div style="width:54px;height:54px;border-radius:12px;background:#1B3A5C;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-family:Inter,sans-serif">DESA</div>' +
        '<div class="letter-kop-text">' +
          '<div style="font-size:13px;font-weight:700;letter-spacing:0.06em">PEMERINTAH ' + esc(s.regencyName.toUpperCase()) + '</div>' +
          '<div style="font-size:13px;font-weight:700">' + esc(s.districtName.toUpperCase()) + '</div>' +
          '<div style="font-size:17px;font-weight:700">' + esc(s.villageName.toUpperCase()) + '</div>' +
          '<div style="font-size:11px;color:#4B5563">' + esc(s.officeAddress) + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="text-align:center;margin-bottom:18px">' +
        '<div style="font-size:15px;font-weight:700;text-decoration:underline">' + esc(req.serviceName.toUpperCase()) + '</div>' +
        '<div style="font-size:13px">Nomor: ' + esc(req.letterNumber || '[DRAF — Nomor dialokasikan saat penerbitan]') + '</div>' +
      '</div>' +
      '<div style="font-size:13.5px;white-space:pre-wrap;margin-bottom:24px">' + esc(bodyText) + '</div>' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:28px;font-size:12.5px">' +
        '<div style="max-width:290px;color:#4B5563;font-family:Inter,sans-serif;font-size:11px;border:1px solid #D1D5DB;padding:8px 10px;border-radius:8px">' +
          '<strong>Keterangan Keabsahan (BR-S10):</strong> Berkas PDF dari sistem bukan tanda tangan elektronik yang otomatis sah. Pengesahan mengikuti prosedur resmi pemerintah desa.' +
        '</div>' +
        '<div style="text-align:center;min-width:210px">' +
          '<div>' + esc(s.villageName) + ', 20 November 2026</div>' +
          '<div style="font-weight:700;margin-top:4px">' + esc(s.kadesTitle) + '</div>' +
          '<div style="height:48px;display:flex;align-items:center;justify-content:center;color:#6B7280;font-style:italic">[Paraf / Pengesahan Resmi]</div>' +
          '<div style="font-weight:700;text-decoration:underline">' + esc(s.kadesName) + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderModalOrDrawer() {
    var st = w.DesaApp.state;
    var esc = w.DesaApp.escapeHtml;
    var icon = w.DesaApp.icon;
    var ill = w.DesaApp.illustrations;

    if (st.cmdkOpen) {
      var q = st.cmdkQuery.trim().toLowerCase();
      var targets = [
        { label: 'Dashboard Ringkasan', cat: 'Menu', nav: 'admin:dashboard' },
        { label: 'Konten Website (Home, Profil, Berita, Layanan)', cat: 'Menu', nav: 'admin:konten' },
        { label: 'Data Kependudukan & Impor Excel', cat: 'Menu', nav: 'admin:data-desa' },
        { label: 'Pelayanan & Persuratan', cat: 'Menu', nav: 'admin:persuratan' },
        { label: 'Bantuan Desa & Deteksi Ganda', cat: 'Menu', nav: 'admin:bantuan' },
        { label: 'Laporan & Ekspor', cat: 'Menu', nav: 'admin:laporan' },
        { label: 'Pengguna & Matriks RBAC', cat: 'Menu', nav: 'admin:pengguna' },
        { label: 'Log Aktivitas Audit', cat: 'Menu', nav: 'admin:log' },
        { label: 'Pengaturan Sistem & Backup', cat: 'Menu', nav: 'admin:pengaturan' }
      ];
      st.data.requests.forEach(function (r) {
        targets.push({ label: r.regNo + ' — ' + r.applicantName + ' (' + r.status + ')', cat: 'Pengajuan', openReq: r.id });
      });
      st.data.archives.forEach(function (a) {
        targets.push({ label: a.number + ' — ' + a.subject, cat: 'Arsip', nav: 'admin:persuratan', tab: 'arsip' });
      });
      var filtered = targets.filter(function (t) { return !q || t.label.toLowerCase().indexOf(q) !== -1 || t.cat.toLowerCase().indexOf(q) !== -1; }).slice(0, 10);

      return '<div class="modal-backdrop" data-modal-backdrop="1">' +
        '<div class="cmdk-panel" role="dialog" aria-label="Pencarian Cepat Admin">' +
          '<div class="cmdk-input-wrap">' +
            icon('search') +
            '<input id="cmdk-input-el" class="cmdk-input" type="text" placeholder="Ketik modul, nomor registrasi surat, atau arsip..." value="' + esc(st.cmdkQuery) + '" data-action="cmdk-input" autofocus>' +
            '<button type="button" class="btn btn-sm btn-ghost" data-modal-close="1">Esc</button>' +
          '</div>' +
          '<div class="cmdk-list">' +
            (filtered.length ? filtered.map(function (item) {
              return '<button type="button" class="cmdk-item" data-action="cmdk-go" data-nav="' + esc(item.nav || '') + '" data-req="' + esc(item.openReq || '') + '" data-tab="' + esc(item.tab || '') + '">' +
                '<span>' + esc(item.label) + '</span><span class="badge badge-neutral">' + esc(item.cat) + '</span>' +
              '</button>';
            }).join('') : '<div class="t-sm t-muted" style="padding:16px;text-align:center">Tidak ditemukan hasil cocok.</div>') +
          '</div>' +
        '</div>' +
      '</div>';
    }

    if (!modalState) return '';

    // Request Split Review Drawer
    if (modalState.type === 'req-drawer') {
      var req = st.data.requests.find(function (r) { return r.id === modalState.id; });
      if (!req) return '';
      var isPetugas = st.currentRole === 'petugas_pelayanan';
      var isKades = st.currentRole === 'kepala_desa';

      return '<div class="drawer-backdrop" data-modal-backdrop="1">' +
        '<div class="drawer-panel" role="dialog" aria-label="Proses Pengajuan Surat">' +
          '<div class="modal-head">' +
            '<div>' +
              '<div class="t-mono t-caption t-muted">' + esc(req.regNo) + ' • ' + esc(req.channel) + '</div>' +
              '<h2 class="t-h3 mt-4">' + esc(req.serviceName) + '</h2>' +
            '</div>' +
            '<div class="flex items-center gap-10">' + w.DesaApp.statusBadge(req.status) +
              '<button type="button" class="icon-circle-btn" data-modal-close="1">' + icon('x', 'icon-sm') + '</button>' +
            '</div>' +
          '</div>' +
          '<div class="modal-body">' +
            '<div class="split-drawer-grid">' +
              '<!-- Left: Identitas, Pencocokan Penduduk & Berkas -->' +
              '<div class="flex-col gap-16">' +
                '<div class="card card-flat" style="background:var(--surface-alt);padding:16px">' +
                  '<div class="t-caption t-muted mb-8">DATA PEMOHON &amp; RELASI KEPENDUDUKAN (BR-S15)</div>' +
                  '<div class="t-sm"><strong>Nama:</strong> ' + esc(req.applicantName) + '</div>' +
                  '<div class="t-sm mt-4"><strong>NIK (Masked):</strong> <span class="t-mono">' + esc(req.nikMasked) + '</span> • <strong>Tgl Lahir:</strong> ' + esc(req.dob) + '</div>' +
                  '<div class="t-sm mt-4"><strong>Alamat:</strong> ' + esc(req.address) + '</div>' +
                  '<div class="t-sm mt-4"><strong>Keperluan:</strong> ' + esc(req.purpose) + '</div>' +
                  '<div class="mt-12 flex items-center gap-8">' +
                    '<select class="select" id="match-res-select" style="font-size:12.5px;padding:6px 10px">' +
                      '<option value="">-- Tautkan ke Data Kependudukan --</option>' +
                      st.data.residents.map(function (p) {
                        return '<option value="' + esc(p.id) + '"' + (req.residentId === p.id ? ' selected' : '') + '>' + esc(p.id) + ' • ' + esc(p.name) + ' (' + esc(p.dusun) + ')</option>';
                      }).join('') +
                    '</select>' +
                    '<button type="button" class="btn btn-sm btn-outline" data-action="match-resident-btn" data-id="' + esc(req.id) + '">Tautkan</button>' +
                  '</div>' +
                '</div>' +

                '<div class="card card-flat" style="padding:16px">' +
                  '<div class="t-caption t-muted mb-8">DOKUMEN PERSYARATAN TERLAMPIR (' + req.docs.length + ')</div>' +
                  '<div class="flex-col gap-8">' +
                    req.docs.map(function (doc) {
                      return '<div class="flex items-center justify-between" style="padding:8px 10px;border:1px solid var(--line-subtle);border-radius:10px">' +
                        '<span class="t-sm flex items-center gap-8">' + icon('file', 'icon-sm') + esc(doc) + '</span>' +
                        '<span class="badge badge-navy">Privat (Aman)</span>' +
                      '</div>';
                    }).join('') +
                  '</div>' +
                '</div>' +

                '<div><div class="t-caption t-muted mb-8">PRATINJAU DRAF / SURAT PDF (BR-S10)</div>' + renderLetterPaperHtml(req) + '</div>' +
              '</div>' +

              '<!-- Right: Aksi Workflow & Riwayat -->' +
              '<div class="flex-col gap-16">' +
                '<div class="card card-flat" style="padding:16px">' +
                  '<div class="t-caption t-muted mb-8">TINDAKAN ALUR SURAT (PERAN: ' + esc(w.DesaApp.getRoleInfo().label.toUpperCase()) + ')</div>' +
                  '<form class="flex-col gap-12" data-form="req-transition" data-id="' + esc(req.id) + '">' +
                    '<div class="field"><label class="field-label">Catatan / Alasan (Wajib untuk Perbaikan &amp; Penolakan)</label>' +
                      '<textarea class="textarea" name="note" rows="3" placeholder="Tuliskan catatan untuk warga atau riwayat proses..."></textarea>' +
                    '</div>' +
                    '<div class="flex flex-col gap-8">' +
                      ((req.status === 'Diajukan' || req.status === 'Menunggu Verifikasi') && isPetugas ? (
                        '<button type="button" class="btn btn-primary w-full" data-action="req-step" data-id="' + esc(req.id) + '" data-next="Sedang Diproses">Berkas Lengkap → Proses &amp; Ajukan ke Kades</button>' +
                        '<button type="button" class="btn btn-warning-soft w-full" data-action="req-step" data-id="' + esc(req.id) + '" data-next="Perlu Perbaikan">Minta Perbaikan ke Warga (Alasan Wajib)</button>' +
                        '<button type="button" class="btn btn-danger-soft w-full" data-action="req-step" data-id="' + esc(req.id) + '" data-next="Ditolak">Tolak Permohonan (Alasan Wajib)</button>'
                      ) : '') +
                      (req.status === 'Sedang Diproses' ? (
                        isKades
                          ? '<button type="button" class="btn btn-accent w-full" data-action="req-step" data-id="' + esc(req.id) + '" data-next="Disetujui">Setujui Draf Surat (Kepala Desa)</button>' +
                            '<button type="button" class="btn btn-danger-soft w-full" data-action="req-step" data-id="' + esc(req.id) + '" data-next="Ditolak">Tolak Draf (Alasan Wajib)</button>'
                          : '<div class="alert alert-warning"><div>Menunggu persetujuan <strong>Kepala Desa</strong>. Peran Anda saat ini tidak berwenang menyetujui surat (Matriks 9.2.1).</div></div>' +
                            '<button type="button" class="btn btn-sm btn-outline" data-action="quick-switch-kades">Simulasikan Beralih ke Peran Kepala Desa</button>'
                      ) : '') +
                      (req.status === 'Disetujui' && (isPetugas || isKades) ? (
                        '<button type="button" class="btn btn-accent btn-lg w-full" data-action="req-step" data-id="' + esc(req.id) + '" data-next="Selesai / Diterbitkan">' + icon('printer', 'icon-sm') + ' Terbitkan PDF &amp; Arsipkan Otomatis</button>'
                      ) : '') +
                      (req.status === 'Perlu Perbaikan' ? '<div class="alert alert-warning"><div>Menunggu pemohon mengirim perbaikan dokumen melalui halaman Cek Status warga.</div></div>' : '') +
                      (req.status === 'Selesai / Diterbitkan' ? '<div class="alert alert-emerald"><div><strong>Sudah Diterbitkan!</strong> Nomor: <span class="t-mono">' + esc(req.letterNumber) + '</span> • Tercatat otomatis di Arsip (' + esc(req.archiveId) + ').</div></div>' : '') +
                    '</div>' +
                  '</form>' +
                '</div>' +

                '<div class="card card-flat" style="padding:16px">' +
                  '<div class="t-caption t-muted mb-12">RIWAYAT PERUBAHAN STATUS</div>' +
                  '<div class="timeline">' +
                    req.history.map(function (h) {
                      return '<div class="timeline-item"><span class="timeline-dot"></span><div class="t-sm"><strong>' + esc(h.to) + '</strong> <span class="t-caption t-muted">• ' + esc(h.at) + '</span></div><div class="t-caption t-muted">' + esc(h.actor) + '</div><div class="t-caption t-secondary mt-4">' + esc(h.note) + '</div></div>';
                    }).join('') +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    // Standard Modal Wrapper Helper
    function modalWrap(title, bodyHtml, footHtml, cls) {
      return '<div class="modal-backdrop" data-modal-backdrop="1">' +
        '<div class="modal-panel ' + (cls || '') + '" role="dialog" aria-modal="true">' +
          '<div class="modal-head"><h2 class="t-h3">' + title + '</h2><button type="button" class="icon-circle-btn" data-modal-close="1">' + icon('x', 'icon-sm') + '</button></div>' +
          '<div class="modal-body">' + bodyHtml + '</div>' +
          (footHtml ? '<div class="modal-foot">' + footHtml + '</div>' : '') +
        '</div>' +
      '</div>';
    }

    if (modalState.type === 'service') {
      var sv = st.data.services.find(function (s) { return s.id === modalState.id; });
      if (!sv) return '';
      return modalWrap(esc(sv.name),
        '<div class="flex items-center gap-8 mb-12"><span class="badge badge-navy">' + esc(sv.kategori) + '</span><span class="badge ' + (sv.onlineEnabled ? 'badge-emerald' : 'badge-neutral') + '">' + (sv.onlineEnabled ? 'Online Aktif' : 'Loket Tatap Muka Saja') + '</span></div>' +
        '<p class="t-body t-secondary">' + esc(sv.desc) + '</p>' +
        '<div class="grid-3 mt-16">' +
          '<div class="card card-flat" style="padding:12px"><div class="t-caption t-muted">Estimasi</div><strong>' + esc(sv.estimate) + '</strong></div>' +
          '<div class="card card-flat" style="padding:12px"><div class="t-caption t-muted">Biaya</div><strong>' + esc(sv.fee) + '</strong></div>' +
          '<div class="card card-flat" style="padding:12px"><div class="t-caption t-muted">Petugas / Jam</div><strong class="t-sm">' + esc(sv.hours) + '</strong></div>' +
        '</div>' +
        '<h3 class="t-h3 mt-20 mb-8">Dokumen Persyaratan</h3>' +
        '<ul class="flex-col gap-6 t-sm">' + sv.requirements.map(function (r) { return '<li class="flex items-center gap-8">' + icon('check', 'icon-sm') + esc(r) + '</li>'; }).join('') + '</ul>' +
        '<h3 class="t-h3 mt-20 mb-8">Prosedur Pelayanan</h3>' +
        '<ol class="flex-col gap-6 t-sm">' + sv.steps.map(function (step, i) { return '<li><strong>' + (i + 1) + '.</strong> ' + esc(step) + '</li>'; }).join('') + '</ol>',
        '<button type="button" class="btn btn-outline" data-modal-close="1">Tutup</button>' +
        (sv.onlineEnabled ? '<button type="button" class="btn btn-accent" data-action="start-online-letter" data-id="' + esc(sv.id) + '">Ajukan Online Sekarang</button>' : '')
      );
    }

    if (modalState.type === 'news') {
      var nw = st.data.news.find(function (n) { return n.id === modalState.id; });
      if (!nw) return '';
      return modalWrap(esc(nw.title),
        '<div class="news-thumb mb-16" style="max-height:240px">' + ill.cardScene(nw.scene, nw.title) + '</div>' +
        '<div class="flex items-center gap-10 mb-12"><span class="badge badge-navy">' + esc(nw.category) + '</span><span class="t-caption t-muted">Terbit: ' + esc(nw.date) + ' • Penulis: ' + esc(nw.author) + '</span></div>' +
        '<p class="t-body" style="white-space:pre-line">' + esc(nw.body) + '</p>' +
        '<div class="chip-row mt-16">' + (nw.tags || []).map(function (tg) { return '<span class="badge badge-neutral">#' + esc(tg) + '</span>'; }).join('') + '</div>',
        '<button type="button" class="btn btn-primary" data-modal-close="1">Tutup</button>'
      );
    }

    if (modalState.type === 'ann') {
      var an = st.data.announcements.find(function (a) { return a.id === modalState.id; });
      if (!an) return '';
      return modalWrap(esc(an.title),
        '<div class="flex items-center gap-10 mb-12">' + (an.important ? '<span class="badge badge-warning">PENTING</span>' : '') + '<span class="badge badge-navy">' + esc(an.category) + '</span><span class="t-caption t-muted">Berlaku s.d. ' + esc(an.validUntil) + '</span></div>' +
        '<p class="t-body">' + esc(an.body) + '</p>' +
        (an.attachment ? '<div class="alert alert-info mt-16">' + icon('file') + '<div>Lampiran Resmi: <strong>' + esc(an.attachment) + '</strong></div></div>' : ''),
        '<button type="button" class="btn btn-primary" data-modal-close="1">Tutup</button>'
      );
    }

    if (modalState.type === 'potensi') {
      var pt = st.data.potentials.find(function (p) { return p.id === modalState.id; });
      if (!pt) return '';
      return modalWrap(esc(pt.name),
        '<div class="news-thumb mb-16" style="max-height:220px">' + ill.cardScene(pt.scene, pt.name) + '</div>' +
        '<div class="flex items-center gap-8 mb-12"><span class="badge badge-emerald">' + esc(pt.category) + '</span><span class="t-caption t-muted">' + esc(pt.location) + '</span></div>' +
        '<p class="t-body">' + esc(pt.desc) + '</p>' +
        '<div class="table-wrap"><table class="table mt-16"><tbody>' +
          '<tr><td class="t-muted">Produk / Hasil</td><td><strong>' + esc(pt.product) + '</strong></td></tr>' +
          '<tr><td class="t-muted">Pengelola</td><td>' + esc(pt.manager) + '</td></tr>' +
          '<tr><td class="t-muted">Kontak Informasi</td><td>' + esc(pt.contact) + '</td></tr>' +
        '</tbody></table></div>',
        '<button type="button" class="btn btn-outline" data-modal-close="1">Tutup</button>' +
        (pt.markerId ? '<button type="button" class="btn btn-accent" data-action="jump-map-marker" data-marker="' + esc(pt.markerId) + '">' + icon('pin', 'icon-sm') + ' Lihat di Peta Administrasi</button>' : '')
      );
    }

    if (modalState.type === 'gallery') {
      var gl = st.data.gallery.find(function (g) { return g.id === modalState.id; });
      if (!gl) return '';
      var slideIdx = modalState.slide || 0;
      var slideLabel = gl.slides && gl.slides.length ? gl.slides[slideIdx % gl.slides.length] : gl.title;
      return modalWrap(esc(gl.title),
        '<div class="news-thumb mb-12" style="max-height:260px">' + ill.cardScene(gl.scene, slideLabel) + '</div>' +
        '<div class="flex items-center justify-between mb-12"><span class="badge badge-navy">' + esc(gl.type) + ' • ' + esc(gl.category) + '</span><span class="t-caption t-muted">' + esc(gl.date) + ' • ' + esc(gl.location) + '</span></div>' +
        '<p class="t-body">' + esc(gl.desc) + '</p>' +
        (gl.type === 'Foto' && gl.slides.length ? '<div class="chip-row mt-16">' + gl.slides.map(function (sl, i) {
          return '<button type="button" class="chip' + (i === slideIdx ? ' is-active' : '') + '" data-action="gallery-slide" data-idx="' + i + '">Foto ' + (i + 1) + ': ' + esc(sl) + '</button>';
        }).join('') + '</div>' : '') +
        (gl.type === 'Video' ? '<div class="alert alert-info mt-16">' + icon('video') + '<div>Tautan Video Eksternal: <span class="t-mono">' + esc(gl.videoUrl) + '</span> (sesuai batasan sistem tanpa self-hosted streaming).</div></div>' : ''),
        '<button type="button" class="btn btn-primary" data-modal-close="1">Tutup</button>'
      );
    }

    if (modalState.type === 'pdf') {
      var pReq = st.data.requests.find(function (r) { return r.id === modalState.id; });
      if (!pReq) return '';
      return modalWrap('Pratinjau Dokumen Surat PDF', renderLetterPaperHtml(pReq),
        '<button type="button" class="btn btn-outline" data-modal-close="1">Tutup</button>' +
        '<button type="button" class="btn btn-accent" data-action="print-pdf">' + icon('printer', 'icon-sm') + ' Cetak / Simpan PDF</button>', 'is-wide'
      );
    }

    if (modalState.type === 'public-search') {
      var sq = (modalState.q || '').trim().toLowerCase();
      var hits = [];
      st.data.services.forEach(function (s) { if (!sq || s.name.toLowerCase().indexOf(sq) !== -1) hits.push({ kind: 'Layanan', title: s.name, nav: 'public:layanan' }); });
      st.data.news.filter(function (n) { return n.status === 'Dipublikasikan'; }).forEach(function (n) { if (!sq || n.title.toLowerCase().indexOf(sq) !== -1) hits.push({ kind: 'Berita', title: n.title, nav: 'public:berita' }); });
      st.data.potentials.forEach(function (p) { if (!sq || p.name.toLowerCase().indexOf(sq) !== -1) hits.push({ kind: 'Potensi', title: p.name, nav: 'public:potensi' }); });
      return modalWrap('Pencarian Informasi Desa',
        '<div class="input-with-icon mb-16">' + icon('search', 'icon-sm icon-left') + '<input class="input" id="pub-search-modal-input" placeholder="Ketik kata kunci layanan, berita, atau potensi..." value="' + esc(modalState.q || '') + '" data-action="pub-search-type"></div>' +
        '<div class="flex-col gap-8">' + hits.slice(0, 8).map(function (h) {
          return '<button type="button" class="cmdk-item" data-action="pub-search-go" data-nav="' + esc(h.nav) + '"><span>' + esc(h.title) + '</span><span class="badge badge-navy">' + esc(h.kind) + '</span></button>';
        }).join('') + '</div>',
        '<button type="button" class="btn btn-outline" data-modal-close="1">Tutup</button>'
      );
    }

    if (modalState.type === 'import') {
      var rows = st.data.importPreviewRows;
      return modalWrap('Impor Excel / CSV Data Kependudukan (Validasi 2 Tahap BR-P05)',
        '<div class="alert alert-info mb-16">' + icon('info') + '<div><strong>Tahap 1 — Pratinjau &amp; Validasi:</strong> Baris error format otomatis ditolak, sedangkan baris terindikasi ganda memberi peringatan agar diputuskan oleh operator.</div></div>' +
        '<div class="table-wrap"><table class="table"><thead><tr><th>Baris</th><th>NIK (Contoh)</th><th>Nama</th><th>Dusun</th><th>Hasil Validasi</th></tr></thead><tbody>' +
          rows.map(function (r) {
            var b = r.state === 'Valid' ? 'badge-emerald' : r.state === 'Peringatan Ganda' ? 'badge-warning' : 'badge-danger';
            return '<tr><td>#' + r.row + '</td><td class="t-mono t-caption">' + esc(r.nik) + '</td><td><strong>' + esc(r.name) + '</strong><div class="t-caption t-muted">' + esc(r.note) + '</div></td><td>' + esc(r.dusun) + '</td><td><span class="badge ' + b + '">' + esc(r.state) + '</span></td></tr>';
          }).join('') +
        '</tbody></table></div>',
        '<button type="button" class="btn btn-outline" data-modal-close="1">Batal</button>' +
        '<button type="button" class="btn btn-accent" data-action="confirm-import"' + (st.importConfirmed ? ' disabled' : '') + '>' + (st.importConfirmed ? 'Sudah Diimpor' : 'Konfirmasi Simpan 3 Baris Valid') + '</button>', 'is-wide'
      );
    }

    if (modalState.type === 'resident-detail') {
      var rs = st.data.residents.find(function (p) { return p.id === modalState.id; });
      if (!rs) return '';
      return modalWrap('Detail Penduduk Internal (' + esc(rs.id) + ')',
        '<div class="table-wrap"><table class="table"><tbody>' +
          '<tr><td class="t-muted">NIK</td><td class="t-mono">' + esc(w.DesaApp.formatNik(rs.nik)) + '</td></tr>' +
          '<tr><td class="t-muted">Nama / TTL</td><td><strong>' + esc(rs.name) + '</strong> • ' + esc(rs.ttl) + '</td></tr>' +
          '<tr><td class="t-muted">Wilayah</td><td>' + esc(rs.dusun) + ' RT ' + esc(rs.rt) + ' / RW ' + esc(rs.rw) + '</td></tr>' +
          '<tr><td class="t-muted">Pendidikan / Kerja</td><td>' + esc(rs.education) + ' • ' + esc(rs.job) + '</td></tr>' +
        '</tbody></table></div>' +
        '<h3 class="t-h3 mt-16 mb-8">Riwayat Perubahan Data (BR-P06)</h3>' +
        '<ul class="flex-col gap-6 t-sm">' + rs.history.map(function (h) { return '<li>• ' + esc(h) + '</li>'; }).join('') + '</ul>',
        '<button type="button" class="btn btn-primary" data-modal-close="1">Tutup</button>'
      );
    }

    if (modalState.type === 'walkin') {
      return modalWrap('Catat Pengajuan Tatap Muka atas Nama Warga (BR-S14)',
        '<form id="walkin-form" class="flex-col gap-12" data-form="walkin-submit">' +
          '<div class="field"><label class="field-label">Jenis Layanan</label><select class="select" name="serviceId">' + st.data.services.map(function (s) { return '<option value="' + esc(s.id) + '">' + esc(s.name) + '</option>'; }).join('') + '</select></div>' +
          '<div class="grid-2"><div class="field"><label class="field-label">Nama Warga <span class="field-req">*</span></label><input class="input" name="applicantName" required></div>' +
          '<div class="field"><label class="field-label">Tanggal Lahir <span class="field-req">*</span></label><input class="input" type="date" name="dob" value="1985-05-10" required></div></div>' +
          '<div class="field"><label class="field-label">Alamat Dusun/RT/RW <span class="field-req">*</span></label><input class="input" name="address" value="Dusun Krajan RT 01 / RW 01" required></div>' +
          '<div class="field"><label class="field-label">Keperluan <span class="field-req">*</span></label><input class="input" name="purpose" required placeholder="Keperluan surat..."></div>' +
          '<div class="flex justify-end gap-8 mt-8"><button type="button" class="btn btn-outline" data-modal-close="1">Batal</button><button type="submit" class="btn btn-accent">Simpan ke Antrean</button></div>' +
        '</form>'
      );
    }

    if (modalState.type === 'add-bantuan') {
      var resId = modalState.resId || st.data.residents[2].id;
      var prgId = modalState.prgId || st.data.aidPrograms[0].id;
      var perId = modalState.perId || st.data.aidPeriods[1].id;
      var isDup = w.DesaApp.checkAidDuplicate(resId, prgId, perId);
      return modalWrap('Catat Penerima &amp; Penyaluran Bantuan',
        '<form class="flex-col gap-12" data-form="bantuan-submit">' +
          (isDup ? '<div class="alert alert-danger">' + icon('alert') + '<div><strong>Peringatan Kemungkinan Catatan Ganda (BR-B03)!</strong> Penduduk, program, dan periode ini sudah tercatat sebelumnya. Periksa ulang sebelum menyimpan.</div></div>' : '') +
          '<div class="field"><label class="field-label">Pilih Penduduk (Relasi Satu Sumber)</label><select class="select" name="residentId" data-action="bantuan-dup-check">' +
            st.data.residents.map(function (r) { return '<option value="' + esc(r.id) + '"' + (r.id === resId ? ' selected' : '') + '>' + esc(r.id) + ' — ' + esc(r.name) + ' (' + esc(r.dusun) + ')</option>'; }).join('') +
          '</select></div>' +
          '<div class="grid-2">' +
            '<div class="field"><label class="field-label">Program Bantuan</label><select class="select" name="programId" data-action="bantuan-dup-check">' + st.data.aidPrograms.map(function (p) { return '<option value="' + esc(p.id) + '"' + (p.id === prgId ? ' selected' : '') + '>' + esc(p.name) + '</option>'; }).join('') + '</select></div>' +
            '<div class="field"><label class="field-label">Periode</label><select class="select" name="periodId" data-action="bantuan-dup-check">' + st.data.aidPeriods.map(function (p) { return '<option value="' + esc(p.id) + '"' + (p.id === perId ? ' selected' : '') + '>' + esc(p.label) + '</option>'; }).join('') + '</select></div>' +
          '</div>' +
          '<div class="grid-2">' +
            '<div class="field"><label class="field-label">Status Penyaluran</label><select class="select" name="status"><option>Disalurkan</option><option>Belum Disalurkan</option><option>Tidak Diambil</option></select></div>' +
            '<div class="field"><label class="field-label">Dasar / Referensi Verifikasi</label><input class="input" name="verifyRef" value="BA Musdesus No. 05/2026" required></div>' +
          '</div>' +
          '<div class="flex justify-end gap-8 mt-8"><button type="button" class="btn btn-outline" data-modal-close="1">Batal</button><button type="submit" class="btn btn-accent">Simpan Catatan</button></div>' +
        '</form>'
      );
    }

    if (modalState.type === 'aid-history') {
      var recs = st.data.aidRecipients.filter(function (b) { return b.residentId === modalState.resId; });
      var rName = recs.length ? recs[0].residentName : modalState.resId;
      return modalWrap('Riwayat Bantuan: ' + esc(rName),
        '<div class="table-wrap"><table class="table"><thead><tr><th>Program</th><th>Periode</th><th>Bentuk</th><th>Status</th><th>Referensi</th></tr></thead><tbody>' +
          recs.map(function (b) {
            var prg = st.data.aidPrograms.find(function (p) { return p.id === b.programId; });
            return '<tr><td><strong>' + esc(prg ? prg.name : b.programId) + '</strong></td><td>' + esc(b.periodId) + '</td><td>' + esc(b.amount) + '</td><td>' + esc(b.status) + '</td><td class="t-caption">' + esc(b.verifyRef) + '</td></tr>';
          }).join('') +
        '</tbody></table></div>',
        '<button type="button" class="btn btn-primary" data-modal-close="1">Tutup</button>'
      );
    }

    if (modalState.type === 'archive-preview') {
      var ar = st.data.archives.find(function (a) { return a.id === modalState.id; });
      if (!ar) return '';
      return modalWrap('Pratinjau Arsip Digital: ' + esc(ar.number),
        '<div class="alert alert-info mb-16">' + icon('lock') + '<div>Klasifikasi Akses: <strong>' + esc(ar.access) + '</strong>. Dokumen disimpan di storage privat dan hanya dapat diunduh melalui otorisasi server (BR-A05).</div></div>' +
        '<div class="table-wrap"><table class="table mb-16"><tbody>' +
          '<tr><td class="t-muted">Perihal</td><td><strong>' + esc(ar.subject) + '</strong></td></tr>' +
          '<tr><td class="t-muted">Kategori</td><td>' + esc(ar.category) + '</td></tr>' +
          '<tr><td class="t-muted">Tanggal / Pihak</td><td>' + esc(ar.letterDate) + ' • ' + esc(ar.party) + '</td></tr>' +
          '<tr><td class="t-muted">Catatan</td><td>' + esc(ar.note) + '</td></tr>' +
        '</tbody></table></div>',
        '<button type="button" class="btn btn-primary" data-modal-close="1">Tutup</button>'
      );
    }

    if (modalState.type === 'directions') {
      var mk = st.data.mapMarkers.find(function (m) { return m.id === modalState.id; });
      if (!mk) return '';
      return modalWrap('Petunjuk Arah (Simulasi)',
        '<p class="t-body">Menuju <strong>' + esc(mk.name) + '</strong> (' + esc(mk.dusun) + ').</p><p class="t-sm t-muted mt-8">Koordinat contoh: <span class="t-mono">' + esc(mk.coords) + '</span>. Pada implementasi produksi, tautan ini membuka rute pada layanan peta pilihan pengguna.</p>',
        '<button type="button" class="btn btn-primary" data-modal-close="1">Tutup</button>', 'is-narrow'
      );
    }

    if (modalState.type === 'add-news') {
      return modalWrap('Tulis Berita Desa Baru',
        '<form class="flex-col gap-12" data-form="add-news-submit">' +
          '<div class="field"><label class="field-label">Judul Berita <span class="field-req">*</span></label><input class="input" name="title" required></div>' +
          '<div class="grid-2"><div class="field"><label class="field-label">Kategori</label><select class="select" name="category"><option>Pembangunan</option><option>Kesehatan</option><option>Ekonomi & UMKM</option><option>Pertanian</option><option>Pemerintahan</option></select></div>' +
          '<div class="field"><label class="field-label">Status Publikasi</label><select class="select" name="status"><option>Dipublikasikan</option><option>Draft</option><option>Terjadwal</option></select></div></div>' +
          '<div class="field"><label class="field-label">Ringkasan &amp; Isi Berita <span class="field-req">*</span></label><textarea class="textarea" name="body" required></textarea></div>' +
          '<div class="flex justify-end gap-8"><button type="button" class="btn btn-outline" data-modal-close="1">Batal</button><button type="submit" class="btn btn-accent">Simpan Berita</button></div>' +
        '</form>'
      );
    }

    if (modalState.type === 'add-ann') {
      return modalWrap('Tambah Pengumuman Resmi',
        '<form class="flex-col gap-12" data-form="add-ann-submit">' +
          '<div class="field"><label class="field-label">Judul Pengumuman <span class="field-req">*</span></label><input class="input" name="title" required></div>' +
          '<div class="grid-2"><div class="field"><label class="field-label">Kategori</label><select class="select" name="category"><option>Pelayanan</option><option>Bantuan Sosial</option><option>Agenda Desa</option><option>Umum</option></select></div>' +
          '<div class="field"><label class="field-label">Berlaku Sampai Tanggal</label><input class="input" type="date" name="validUntil" value="2026-12-31" required></div></div>' +
          '<label class="switch"><input type="checkbox" name="important"><span class="switch-track"><span class="switch-thumb"></span></span><span class="t-sm">Tandai sebagai Pengumuman PENTING (tampil teratas)</span></label>' +
          '<div class="field"><label class="field-label">Isi Pengumuman <span class="field-req">*</span></label><textarea class="textarea" name="body" required></textarea></div>' +
          '<div class="flex justify-end gap-8"><button type="button" class="btn btn-outline" data-modal-close="1">Batal</button><button type="submit" class="btn btn-accent">Publikasikan Pengumuman</button></div>' +
        '</form>'
      );
    }

    if (modalState.type === 'add-perangkat') {
      return modalWrap('Tambah Data Perangkat Desa',
        '<form class="flex-col gap-12" data-form="add-perangkat-submit">' +
          '<div class="grid-2"><div class="field"><label class="field-label">Nama Lengkap <span class="field-req">*</span></label><input class="input" name="nama" required></div>' +
          '<div class="field"><label class="field-label">Jabatan <span class="field-req">*</span></label><input class="input" name="jabatan" placeholder="Mis. Kepala Dusun II" required></div></div>' +
          '<div class="grid-2"><div class="field"><label class="field-label">Bidang Tugas</label><input class="input" name="bidang" placeholder="Kewilayahan / Administrasi"></div>' +
          '<div class="field"><label class="field-label">Masa Jabatan</label><input class="input" name="masa" value="2026–Sekarang"></div></div>' +
          '<div class="flex justify-end gap-8"><button type="button" class="btn btn-outline" data-modal-close="1">Batal</button><button type="submit" class="btn btn-accent">Simpan Perangkat</button></div>' +
        '</form>'
      );
    }

    if (modalState.type === 'add-resident') {
      return modalWrap('Tambah Data Penduduk Internal (Contoh)',
        '<form class="flex-col gap-12" data-form="add-resident-submit">' +
          '<div class="alert alert-info">' + icon('shield') + '<div>Data hanya tersimpan untuk administrasi internal desa dan tidak pernah dikirim ke halaman publik.</div></div>' +
          '<div class="grid-2"><div class="field"><label class="field-label">NIK (16 Digit Contoh) <span class="field-req">*</span></label><input class="input t-mono" name="nik" maxlength="16" placeholder="320101..." required></div>' +
          '<div class="field"><label class="field-label">Nama Lengkap <span class="field-req">*</span></label><input class="input" name="name" required></div></div>' +
          '<div class="grid-3"><div class="field"><label class="field-label">Jenis Kelamin</label><select class="select" name="gender"><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>' +
          '<div class="field"><label class="field-label">Dusun</label><select class="select" name="dusun"><option>Dusun Krajan</option><option>Dusun Sawah Indah</option><option>Dusun Bukit Makmur</option><option>Dusun Sumber Jaya</option></select></div>' +
          '<div class="field"><label class="field-label">Pekerjaan</label><input class="input" name="job" value="Wiraswasta / UMKM"></div></div>' +
          '<div class="flex justify-end gap-8"><button type="button" class="btn btn-outline" data-modal-close="1">Batal</button><button type="submit" class="btn btn-accent">Simpan Penduduk</button></div>' +
        '</form>'
      );
    }

    if (modalState.type === 'add-archive') {
      return modalWrap('Tambah Arsip Persuratan Manual',
        '<form class="flex-col gap-12" data-form="add-archive-submit">' +
          '<div class="grid-2"><div class="field"><label class="field-label">Nomor Surat <span class="field-req">*</span></label><input class="input t-mono" name="number" placeholder="005/044/DS-XI/2026" required></div>' +
          '<div class="field"><label class="field-label">Kategori Arsip</label><select class="select" name="category"><option>Surat Masuk</option><option>Surat Keluar</option><option>Surat Keputusan</option><option>Surat Undangan</option><option>Surat Tugas</option><option>Dokumen Persuratan Lainnya</option></select></div></div>' +
          '<div class="field"><label class="field-label">Perihal Surat <span class="field-req">*</span></label><input class="input" name="subject" required></div>' +
          '<div class="grid-2"><div class="field"><label class="field-label">Asal / Tujuan Pihak</label><input class="input" name="party" required></div>' +
          '<div class="field"><label class="field-label">Klasifikasi Akses</label><select class="select" name="access"><option>Umum Internal</option><option>Terbatas</option><option>Rahasia</option></select></div></div>' +
          '<div class="flex justify-end gap-8"><button type="button" class="btn btn-outline" data-modal-close="1">Batal</button><button type="submit" class="btn btn-accent">Simpan Arsip</button></div>' +
        '</form>'
      );
    }

    if (modalState.type === 'add-gallery') {
      return modalWrap('Tambah Album Foto / Tautan Video',
        '<form class="flex-col gap-12" data-form="add-gallery-submit">' +
          '<div class="field"><label class="field-label">Judul Dokumentasi <span class="field-req">*</span></label><input class="input" name="title" required></div>' +
          '<div class="grid-2"><div class="field"><label class="field-label">Tipe Media</label><select class="select" name="type"><option>Foto</option><option>Video</option></select></div>' +
          '<div class="field"><label class="field-label">Kategori</label><select class="select" name="category"><option>Pembangunan</option><option>Kegiatan Sosial</option><option>Pertanian & Ekonomi</option><option>UMKM & Budaya</option><option>Wisata & Alam</option></select></div></div>' +
          '<div class="field"><label class="field-label">Lokasi Dokumentasi</label><input class="input" name="location" value="Balai Desa [Nama Desa]" required></div>' +
          '<div class="field"><label class="field-label">Deskripsi Singkat / Tautan Video</label><textarea class="textarea" name="desc" required></textarea></div>' +
          '<div class="flex justify-end gap-8"><button type="button" class="btn btn-outline" data-modal-close="1">Batal</button><button type="submit" class="btn btn-accent">Simpan ke Galeri</button></div>' +
        '</form>'
      );
    }

    if (modalState.type === 'add-user') {
      return modalWrap('Tambah Akun Pengguna Internal (RBAC)',
        '<form class="flex-col gap-12" data-form="add-user-submit">' +
          '<div class="grid-2"><div class="field"><label class="field-label">Nama Perangkat <span class="field-req">*</span></label><input class="input" name="name" required></div>' +
          '<div class="field"><label class="field-label">Username <span class="field-req">*</span></label><input class="input t-mono" name="username" required></div></div>' +
          '<div class="grid-2"><div class="field"><label class="field-label">Email Dinas</label><input class="input" type="email" name="email" placeholder="staf@[namadesa].desa.id" required></div>' +
          '<div class="field"><label class="field-label">Peran Utama</label><select class="select" name="role">' +
            w.DesaApp.ROLES.map(function (r) { return '<option value="' + esc(r.id) + '">' + esc(r.label) + '</option>'; }).join('') +
          '</select></div></div>' +
          '<div class="flex justify-end gap-8"><button type="button" class="btn btn-outline" data-modal-close="1">Batal</button><button type="submit" class="btn btn-accent">Simpan Akun</button></div>' +
        '</form>'
      );
    }

    return '';
  }

  w.DesaApp.renderToasts = function () {
    var root = document.getElementById('toast-root');
    if (!root) return;
    var esc = w.DesaApp.escapeHtml;
    root.innerHTML = w.DesaApp.state.toasts.map(function (t) {
      return '<div class="toast is-' + esc(t.type) + '">' + esc(t.message) + '</div>';
    }).join('');
  };

  function render() {
    var st = w.DesaApp.state;
    var appRoot = document.getElementById('app-root');
    var modalRoot = document.getElementById('modal-root');

    var mainHtml = '';
    if (st.area === 'login') mainHtml = w.DesaApp.renderLoginPage();
    else if (st.area === 'design-system') mainHtml = w.DesaApp.renderDesignSystemPage();
    else if (st.area === 'admin') mainHtml = w.DesaApp.renderAdminShell();
    else mainHtml = w.DesaApp.renderPublicShell();

    appRoot.innerHTML = renderDemoBar() + mainHtml;
    modalRoot.innerHTML = renderModalOrDrawer();
    w.DesaApp.renderToasts();
  }

  function navigate(target) {
    var st = w.DesaApp.state;
    st.notifOpen = false;
    st.pubMobileMenuOpen = false;
    st.adminSidebarOpen = false;
    if (target === 'login') { st.area = 'login'; }
    else if (target === 'design-system') { st.area = 'design-system'; }
    else if (target.indexOf('public:') === 0) {
      st.area = 'public';
      st.publicPage = target.split(':')[1] || 'home';
    } else if (target.indexOf('admin:') === 0) {
      st.area = 'admin';
      st.adminPage = target.split(':')[1] || 'dashboard';
    }
    w.location.hash = '#' + target.replace(':', '/');
    w.scrollTo({ top: 0, behavior: 'instant' });
    render();
  }

  function parseHash() {
    var h = (w.location.hash || '').replace(/^#/, '');
    if (!h) return;
    if (h === 'login' || h === 'design-system') navigate(h);
    else if (h.indexOf('public/') === 0) navigate('public:' + h.split('/')[1]);
    else if (h.indexOf('admin/') === 0) navigate('admin:' + h.split('/')[1]);
  }

  // Unified Event Delegation
  document.addEventListener('click', function (e) {
    var st = w.DesaApp.state;

    // Close public dropdowns if clicking outside
    if (!e.target.closest('.pub-nav-item')) {
      document.querySelectorAll('.pub-nav-item.is-open').forEach(function (el) { el.classList.remove('is-open'); });
    }

    var ddBtn = e.target.closest('[data-dropdown-toggle]');
    if (ddBtn) {
      var parent = ddBtn.closest('.pub-nav-item');
      var wasOpen = parent.classList.contains('is-open');
      document.querySelectorAll('.pub-nav-item.is-open').forEach(function (el) { el.classList.remove('is-open'); });
      if (!wasOpen) parent.classList.add('is-open');
      return;
    }

    if (e.target.closest('[data-modal-close]') || (e.target.hasAttribute && e.target.hasAttribute('data-modal-backdrop'))) {
      modalState = null;
      st.cmdkOpen = false;
      render();
      return;
    }

    var navEl = e.target.closest('[data-nav]');
    if (navEl) {
      e.preventDefault();
      modalState = null;
      st.cmdkOpen = false;
      navigate(navEl.getAttribute('data-nav'));
      return;
    }

    var actEl = e.target.closest('[data-action]');
    if (!actEl) return;
    var act = actEl.getAttribute('data-action');

    switch (act) {
      case 'toggle-demo-bar':
        st.demoBarCollapsed = !st.demoBarCollapsed;
        render();
        break;
      case 'toggle-pub-menu':
        st.pubMobileMenuOpen = !st.pubMobileMenuOpen;
        st.adminSidebarOpen = false;
        render();
        break;
      case 'toggle-admin-sidebar':
        st.adminSidebarOpen = !st.adminSidebarOpen;
        st.notifOpen = false;
        render();
        break;
      case 'close-mobile-menus':
        st.pubMobileMenuOpen = false;
        st.adminSidebarOpen = false;
        render();
        break;
      case 'copy-hex':
        var hex = actEl.getAttribute('data-hex');
        if (navigator.clipboard) navigator.clipboard.writeText(hex).catch(function () {});
        w.DesaApp.toast('Kode warna ' + hex + ' disalin.', 'success');
        break;
      case 'set-tab':
        var key = actEl.getAttribute('data-key');
        var val = actEl.getAttribute('data-val');
        st[key] = key === 'beritaPage' ? parseInt(val, 10) : val;
        render();
        break;
      case 'toast':
        w.DesaApp.toast(actEl.getAttribute('data-msg') || 'Berhasil.', 'success');
        break;
      case 'open-service-detail':
        modalState = { type: 'service', id: actEl.getAttribute('data-id') };
        render();
        break;
      case 'open-news-detail':
        modalState = { type: 'news', id: actEl.getAttribute('data-id') };
        render();
        break;
      case 'open-ann-detail':
        modalState = { type: 'ann', id: actEl.getAttribute('data-id') };
        render();
        break;
      case 'open-potensi-detail':
        modalState = { type: 'potensi', id: actEl.getAttribute('data-id') };
        render();
        break;
      case 'open-gallery-detail':
        modalState = { type: 'gallery', id: actEl.getAttribute('data-id'), slide: 0 };
        render();
        break;
      case 'gallery-slide':
        if (modalState) modalState.slide = parseInt(actEl.getAttribute('data-idx'), 10) || 0;
        render();
        break;
      case 'open-public-search':
        modalState = { type: 'public-search', q: '' };
        render();
        break;
      case 'pub-search-go':
        modalState = null;
        navigate(actEl.getAttribute('data-nav'));
        break;
      case 'open-potensi-from-map':
        modalState = { type: 'potensi', id: actEl.getAttribute('data-pot') };
        render();
        break;
      case 'jump-map-marker':
        modalState = null;
        st.selectedMarkerId = actEl.getAttribute('data-marker');
        st.mapCategory = 'Semua';
        st.mapSearch = '';
        navigate('public:peta');
        break;
      case 'select-marker':
        st.selectedMarkerId = actEl.getAttribute('data-id');
        render();
        break;
      case 'map-cat':
        st.mapCategory = actEl.getAttribute('data-val');
        render();
        break;
      case 'map-zoom':
        var d = parseFloat(actEl.getAttribute('data-delta'));
        st.mapZoom = Math.max(0.7, Math.min(2.2, +(st.mapZoom + d).toFixed(2)));
        render();
        break;
      case 'map-reset':
        st.mapZoom = 1; st.mapPanX = 0; st.mapPanY = 0;
        render();
        break;
      case 'open-directions':
        modalState = { type: 'directions', id: actEl.getAttribute('data-id') };
        render();
        break;
      case 'start-online-letter':
        modalState = null;
        st.wizardDraft.serviceId = actEl.getAttribute('data-id');
        st.wizardStep = 2;
        navigate('public:ajukan-surat');
        break;
      case 'wiz-next':
        st.wizardStep = parseInt(actEl.getAttribute('data-step'), 10) || 1;
        render();
        break;
      case 'wiz-add-sample-doc':
        st.wizardDraft.docs = ['KTP_Pemohon_Contoh.jpg (940 KB)', 'KK_Pemohon_Contoh.pdf (810 KB)', 'Pengantar_RT_RW.jpg (530 KB)'];
        w.DesaApp.toast('3 berkas contoh dilampirkan.', 'success');
        render();
        break;
      case 'wiz-submit':
        var res = w.DesaApp.submitLetterRequest(st.wizardDraft, 'Online');
        if (!res.ok) { w.DesaApp.toast(res.error, 'error'); break; }
        st.wizardStep = 4;
        w.DesaApp.toast('Permohonan terkirim: ' + res.req.regNo, 'success');
        render();
        break;
      case 'reset-wizard':
        st.wizardStep = 1;
        st.wizardDraft.applicantName = '';
        st.wizardDraft.purpose = '';
        st.wizardDraft.docs = [];
        render();
        break;
      case 'quick-cek':
        var qr = st.data.requests.find(function (r) { return r.id === actEl.getAttribute('data-id'); });
        if (qr) {
          st.cekRegInput = qr.regNo;
          st.cekDobInput = qr.dob;
          st.cekResultId = qr.id;
          st.cekError = '';
          render();
        }
        break;
      case 'open-pdf-preview':
        modalState = { type: 'pdf', id: actEl.getAttribute('data-id') };
        render();
        break;
      case 'print-pdf':
        w.print();
        break;
      case 'login-as-role':
        st.currentRole = actEl.getAttribute('data-role');
        w.DesaApp.addLog('Login', 'Portal Admin', 'Masuk sebagai ' + w.DesaApp.getRoleInfo().label);
        navigate('admin:dashboard');
        w.DesaApp.toast('Masuk sebagai ' + w.DesaApp.getRoleInfo().label, 'success');
        break;
      case 'toggle-admin-theme':
        st.adminTheme = st.adminTheme === 'dark' ? 'light' : 'dark';
        render();
        break;
      case 'toggle-notif':
        st.notifOpen = !st.notifOpen;
        render();
        break;
      case 'mark-notif-read':
        st.data.notifications.forEach(function (n) { n.unread = false; });
        st.notifOpen = false;
        render();
        break;
      case 'open-cmdk':
        st.cmdkOpen = true;
        st.cmdkQuery = '';
        render();
        setTimeout(function () { var el = document.getElementById('cmdk-input-el'); if (el) el.focus(); }, 20);
        break;
      case 'cmdk-go':
        st.cmdkOpen = false;
        var reqJump = actEl.getAttribute('data-req');
        var tabJump = actEl.getAttribute('data-tab');
        if (reqJump) {
          st.area = 'admin';
          st.adminPage = 'persuratan';
          modalState = { type: 'req-drawer', id: reqJump };
          render();
        } else {
          if (tabJump) st.persuratanTab = tabJump;
          navigate(actEl.getAttribute('data-nav'));
        }
        break;
      case 'open-req-drawer':
        modalState = { type: 'req-drawer', id: actEl.getAttribute('data-id') };
        render();
        break;
      case 'match-resident-btn':
        var sel = document.getElementById('match-res-select');
        if (sel && sel.value) {
          w.DesaApp.matchApplicantToResident(actEl.getAttribute('data-id'), sel.value);
          w.DesaApp.toast('Data pemohon ditautkan ke Data Kependudukan (BR-S15).', 'success');
          render();
        }
        break;
      case 'quick-switch-kades':
        st.currentRole = 'kepala_desa';
        w.DesaApp.toast('Peran diganti ke Kepala Desa untuk menyetujui surat.', 'success');
        render();
        break;
      case 'req-step':
        var reqId = actEl.getAttribute('data-id');
        var nextSt = actEl.getAttribute('data-next');
        var formEl = actEl.closest('form');
        var noteVal = formEl ? (formEl.querySelector('[name="note"]').value || '') : '';
        var tr = w.DesaApp.transitionLetterStatus(reqId, nextSt, { note: noteVal });
        if (!tr.ok) {
          w.DesaApp.toast(tr.error, 'error');
        } else {
          w.DesaApp.toast('Status diperbarui menjadi: ' + nextSt, 'success');
          render();
        }
        break;
      case 'open-walkin-modal':
        modalState = { type: 'walkin' };
        render();
        break;
      case 'open-import-modal':
        modalState = { type: 'import' };
        render();
        break;
      case 'confirm-import':
        var cnt = w.DesaApp.confirmResidentImport();
        modalState = null;
        w.DesaApp.toast(cnt + ' baris valid berhasil diimpor. Baris error dilewati.', 'success');
        render();
        break;
      case 'open-resident-detail':
        modalState = { type: 'resident-detail', id: actEl.getAttribute('data-id') };
        render();
        break;
      case 'open-add-bantuan':
        modalState = { type: 'add-bantuan' };
        render();
        break;
      case 'open-aid-history':
        modalState = { type: 'aid-history', resId: actEl.getAttribute('data-resident') };
        render();
        break;
      case 'open-archive-preview':
        modalState = { type: 'archive-preview', id: actEl.getAttribute('data-id') };
        render();
        break;
      case 'open-add-news':
        modalState = { type: 'add-news' };
        render();
        break;
      case 'open-add-ann':
        modalState = { type: 'add-ann' };
        render();
        break;
      case 'open-add-perangkat':
        modalState = { type: 'add-perangkat' };
        render();
        break;
      case 'open-add-resident':
        modalState = { type: 'add-resident' };
        render();
        break;
      case 'open-add-archive':
        modalState = { type: 'add-archive' };
        render();
        break;
      case 'open-add-gallery':
        modalState = { type: 'add-gallery' };
        render();
        break;
      case 'open-add-user':
        modalState = { type: 'add-user' };
        render();
        break;
      case 'cycle-news-status':
        var nw = st.data.news.find(function (n) { return n.id === actEl.getAttribute('data-id'); });
        if (nw) {
          var order = ['Draft', 'Terjadwal', 'Dipublikasikan', 'Diarsipkan'];
          nw.status = order[(order.indexOf(nw.status) + 1) % order.length];
          w.DesaApp.addLog('Status Berita', nw.title, 'Diubah menjadi ' + nw.status);
          render();
        }
        break;
      case 'toggle-ann-imp':
        var an = st.data.announcements.find(function (a) { return a.id === actEl.getAttribute('data-id'); });
        if (an) { an.important = !an.important; render(); }
        break;
      case 'admin-approve-stat':
        var pub = actEl.getAttribute('data-val') === '1';
        if (w.DesaApp.approvePublicStatistics(pub)) {
          w.DesaApp.toast(pub ? 'Statistik publik disetujui tayang.' : 'Statistik ditarik ke mode pembaruan.', 'success');
          render();
        }
        break;
      case 'run-backup':
        st.data.backups.unshift({ id: 'BKP-0' + (st.data.backups.length + 1), time: '20 Nov 2026 (Baru saja)', size: '43,1 MB', type: 'Manual + Off-site', location: 'VPS + Off-site Terenkripsi', status: 'Berhasil & Teruji' });
        w.DesaApp.addLog('Backup Sistem', 'Snapshot Basis Data', 'Backup manual selesai dijalankan');
        w.DesaApp.toast('Backup database & dokumen privat selesai.', 'success');
        render();
        break;
    }
  });

  document.addEventListener('change', function (e) {
    var st = w.DesaApp.state;
    var actEl = e.target.closest('[data-action]');
    if (!actEl) return;
    var act = actEl.getAttribute('data-action');

    if (act === 'switch-role') {
      st.currentRole = e.target.value;
      w.DesaApp.toast('Peran aktif beralih ke: ' + w.DesaApp.getRoleInfo().label, 'success');
      render();
    } else if (act === 'set-select') {
      st[actEl.getAttribute('data-key')] = e.target.value;
      render();
    } else if (act === 'wiz-select-service') {
      st.wizardDraft.serviceId = e.target.value;
      render();
    } else if (act === 'toggle-service-online') {
      w.DesaApp.toggleServiceOnline(actEl.getAttribute('data-id'));
      w.DesaApp.toast('Opsi pengajuan online layanan diperbarui (sinkron ke Website Publik).', 'success');
      render();
    } else if (act === 'toggle-pub-stat') {
      st.data.statistik.published = e.target.checked;
      render();
    } else if (act === 'toggle-map-boundary') {
      w.DesaApp.toggleMapBoundaryOfficial(e.target.checked);
      render();
    } else if (act === 'toggle-full-nik') {
      st.showFullNik = e.target.checked;
      render();
    } else if (act === 'toggle-aid-public') {
      w.DesaApp.toggleAidPublicRecap(actEl.getAttribute('data-id'));
      w.DesaApp.toast('Publikasi agregat bantuan diperbarui.', 'success');
      render();
    } else if (act === 'toggle-email-notif') {
      st.data.site.notificationEmailEnabled = e.target.checked;
      w.DesaApp.toast('Pengaturan email notifikasi diperbarui.', 'success');
      render();
    } else if (act === 'bantuan-dup-check' && modalState && modalState.type === 'add-bantuan') {
      var form = e.target.closest('form');
      modalState.resId = form.querySelector('[name="residentId"]').value;
      modalState.prgId = form.querySelector('[name="programId"]').value;
      modalState.perId = form.querySelector('[name="periodId"]').value;
      render();
    }
  });

  document.addEventListener('input', function (e) {
    var st = w.DesaApp.state;
    var actEl = e.target.closest('[data-action]');
    if (!actEl) return;
    var act = actEl.getAttribute('data-action');
    if (act === 'filter-search' || act === 'map-search') {
      var key = actEl.getAttribute('data-key') || 'mapSearch';
      st[key] = e.target.value;
      if (key === 'beritaSearch') st.beritaPage = 1;
      var caret = e.target.selectionStart;
      var id = e.target.id;
      render();
      if (id) {
        var el = document.getElementById(id);
        if (el) { el.focus(); el.setSelectionRange(caret, caret); }
      }
    } else if (act === 'cmdk-input') {
      st.cmdkQuery = e.target.value;
      var cPos = e.target.selectionStart;
      render();
      var inp = document.getElementById('cmdk-input-el');
      if (inp) { inp.focus(); inp.setSelectionRange(cPos, cPos); }
    } else if (act === 'pub-search-type' && modalState) {
      modalState.q = e.target.value;
      var pPos = e.target.selectionStart;
      render();
      var pInp = document.getElementById('pub-search-modal-input');
      if (pInp) { pInp.focus(); pInp.setSelectionRange(pPos, pPos); }
    }
  });

  document.addEventListener('submit', function (e) {
    var form = e.target.closest('[data-form]');
    if (!form) return;
    e.preventDefault();
    var st = w.DesaApp.state;
    var kind = form.getAttribute('data-form');
    var fd = new FormData(form);

    if (kind === 'hero-search') {
      modalState = { type: 'public-search', q: String(fd.get('q') || '') };
      render();
    } else if (kind === 'wizard-step2') {
      st.wizardDraft.applicantName = String(fd.get('applicantName') || '');
      st.wizardDraft.dob = String(fd.get('dob') || '');
      st.wizardDraft.nik = String(fd.get('nik') || '');
      st.wizardDraft.phone = String(fd.get('phone') || '');
      st.wizardDraft.email = String(fd.get('email') || '');
      st.wizardDraft.address = String(fd.get('address') || '');
      st.wizardDraft.purpose = String(fd.get('purpose') || '');
      st.wizardStep = 3;
      render();
    } else if (kind === 'cek-status') {
      var rNo = String(fd.get('regNo') || '').trim().toUpperCase();
      var dob = String(fd.get('dob') || '').trim();
      st.cekRegInput = rNo;
      st.cekDobInput = dob;
      var match = st.data.requests.find(function (r) { return r.regNo.toUpperCase() === rNo && r.dob === dob; });
      if (!match) {
        st.cekError = 'Nomor registrasi atau tanggal lahir tidak cocok. Pastikan keduanya sesuai data pengajuan (9.2.2 Opsi B).';
        st.cekResultId = null;
      } else {
        st.cekError = '';
        st.cekResultId = match.id;
      }
      render();
    } else if (kind === 'citizen-revision') {
      var rev = w.DesaApp.submitCitizenRevision(form.getAttribute('data-id'), String(fd.get('docName') || ''), String(fd.get('note') || ''));
      if (rev.ok) {
        w.DesaApp.toast('Perbaikan berkas terkirim. Status kembali Menunggu Verifikasi.', 'success');
        render();
      } else {
        w.DesaApp.toast(rev.error, 'error');
      }
    } else if (kind === 'contact-message') {
      w.DesaApp.toast('Pesan Anda telah tercatat untuk diteruskan ke Perangkat Desa.', 'success');
      form.reset();
    } else if (kind === 'admin-login') {
      w.DesaApp.toast('Login berhasil (simulasi).', 'success');
      navigate('admin:dashboard');
    } else if (kind === 'admin-home-content') {
      st.data.site.heroTitle = String(fd.get('heroTitle') || '');
      st.data.site.heroDesc = String(fd.get('heroDesc') || '');
      st.data.site.aboutSummary = String(fd.get('aboutSummary') || '');
      st.data.site.kadesGreeting = String(fd.get('kadesGreeting') || '');
      w.DesaApp.addLog('Perbarui Konten Home', 'Halaman Utama & Sambutan', 'Disinkronkan ke Website Publik');
      w.DesaApp.toast('Konten Home & Sambutan Kepala Desa disimpan dan sinkron ke Website Publik.', 'success');
      render();
    } else if (kind === 'numbering-config') {
      st.data.numberingConfig.pattern = String(fd.get('pattern') || '');
      st.data.numberingConfig.kodeDesa = String(fd.get('kodeDesa') || 'DS');
      st.data.numberingConfig.nextSequence = parseInt(fd.get('nextSequence'), 10) || 43;
      st.data.numberingConfig.resetPolicy = String(fd.get('resetPolicy') || '');
      w.DesaApp.addLog('Ubah Aturan Nomor Surat', st.data.numberingConfig.pattern, 'Urut berikutnya: ' + st.data.numberingConfig.nextSequence);
      w.DesaApp.toast('Konfigurasi penomoran surat disimpan.', 'success');
      render();
    } else if (kind === 'walkin-submit') {
      var wk = w.DesaApp.submitLetterRequest({
        serviceId: String(fd.get('serviceId')),
        applicantName: String(fd.get('applicantName')),
        dob: String(fd.get('dob')),
        address: String(fd.get('address')),
        purpose: String(fd.get('purpose')),
        docs: ['KTP_TatapMuka.jpg', 'Pengantar_RT.jpg']
      }, 'Tatap Muka (BR-S14)');
      if (wk.ok) {
        modalState = null;
        w.DesaApp.toast('Pengajuan tatap muka dicatat: ' + wk.req.regNo, 'success');
        render();
      }
    } else if (kind === 'bantuan-submit') {
      var rs = w.DesaApp.addAidDistribution({
        residentId: String(fd.get('residentId')),
        programId: String(fd.get('programId')),
        periodId: String(fd.get('periodId')),
        status: String(fd.get('status')),
        verifyRef: String(fd.get('verifyRef')),
        hasProof: true
      });
      modalState = null;
      w.DesaApp.toast(rs.isDup ? 'Disimpan dengan Peringatan Catatan Ganda (BR-B03)!' : 'Catatan bantuan berhasil disimpan.', rs.isDup ? 'warning' : 'success');
      render();
    } else if (kind === 'add-news-submit') {
      st.data.news.unshift({
        id: 'BRT-' + (10 + st.data.news.length + 1),
        title: String(fd.get('title')),
        category: String(fd.get('category')),
        author: w.DesaApp.getRoleInfo().user,
        date: '2026-11-20',
        updated: '2026-11-20',
        status: String(fd.get('status')),
        scene: 'meet',
        tags: ['desa', 'informasi'],
        summary: String(fd.get('body')).slice(0, 110) + '…',
        body: String(fd.get('body'))
      });
      modalState = null;
      w.DesaApp.addLog('Tambah Berita', String(fd.get('title')), 'Status: ' + String(fd.get('status')));
      w.DesaApp.toast('Berita baru disimpan.', 'success');
      render();
    } else if (kind === 'add-ann-submit') {
      st.data.announcements.unshift({
        id: 'PGM-' + (10 + st.data.announcements.length + 1),
        title: String(fd.get('title')),
        category: String(fd.get('category')),
        date: '2026-11-20',
        validUntil: String(fd.get('validUntil') || '2026-12-31'),
        important: !!fd.get('important'),
        status: 'Dipublikasikan',
        attachment: '',
        body: String(fd.get('body'))
      });
      modalState = null;
      w.DesaApp.addLog('Tambah Pengumuman', String(fd.get('title')), 'Dipublikasikan ke Website');
      w.DesaApp.toast('Pengumuman dipublikasikan.', 'success');
      render();
    } else if (kind === 'add-perangkat-submit') {
      var nm = String(fd.get('nama'));
      st.data.profil.perangkat.push({
        id: 'PR-' + (st.data.profil.perangkat.length + 1),
        nama: nm,
        jabatan: String(fd.get('jabatan')),
        bidang: String(fd.get('bidang') || 'Pemerintahan Desa'),
        masa: String(fd.get('masa') || '2026–Sekarang'),
        inisial: nm.split(' ').slice(0, 2).map(function (x) { return x.charAt(0).toUpperCase(); }).join('') || 'PD',
        warna: '#1E7A5F'
      });
      modalState = null;
      w.DesaApp.addLog('Tambah Perangkat Desa', nm, String(fd.get('jabatan')));
      w.DesaApp.toast('Data perangkat desa ditambahkan (sinkron ke Profil Publik).', 'success');
      render();
    } else if (kind === 'add-resident-submit') {
      var nikVal = String(fd.get('nik') || '').replace(/\D/g, '');
      if (nikVal.length !== 16) {
        w.DesaApp.toast('Validasi Format (BR-P03): NIK harus tepat 16 digit angka.', 'error');
        return;
      }
      var newResId = 'PDD-' + (20 + st.data.residents.length + 1);
      st.data.residents.unshift({
        id: newResId,
        nik: nikVal,
        kk: '3201012011260099',
        name: String(fd.get('name')),
        ttl: '[Kabupaten], 01 Jan 1995',
        gender: String(fd.get('gender')),
        dusun: String(fd.get('dusun')),
        rw: '01',
        rt: '01',
        address: String(fd.get('dusun')),
        education: 'SMA / SMK',
        job: String(fd.get('job') || 'Wiraswasta'),
        marital: 'Kawin',
        status: 'Aktif',
        updatedAt: '2026-11-20',
        history: ['20 Nov 2026: Ditambahkan oleh ' + w.DesaApp.getRoleInfo().user]
      });
      modalState = null;
      w.DesaApp.addLog('Tambah Data Penduduk', newResId, String(fd.get('name')));
      w.DesaApp.toast('Penduduk ditambahkan ke database internal.', 'success');
      render();
    } else if (kind === 'add-archive-submit') {
      var newArId = 'ARS-' + (100 + st.data.archives.length + 1);
      st.data.archives.unshift({
        id: newArId,
        number: String(fd.get('number')),
        category: String(fd.get('category')),
        subject: String(fd.get('subject')),
        letterDate: '2026-11-20',
        ioDate: '2026-11-20',
        party: String(fd.get('party')),
        pic: w.DesaApp.getRoleInfo().user,
        access: String(fd.get('access')),
        sourceReq: '',
        note: 'Diunggah manual melalui modul Arsip Persuratan.'
      });
      modalState = null;
      w.DesaApp.addLog('Tambah Arsip Manual', String(fd.get('number')), String(fd.get('subject')));
      w.DesaApp.toast('Arsip persuratan disimpan.', 'success');
      render();
    } else if (kind === 'add-gallery-submit') {
      var gType = String(fd.get('type'));
      st.data.gallery.unshift({
        id: 'GAL-' + (10 + st.data.gallery.length + 1),
        type: gType,
        title: String(fd.get('title')),
        category: String(fd.get('category')),
        date: '2026-11-20',
        location: String(fd.get('location')),
        status: 'Dipublikasikan',
        scene: 'meet',
        count: gType === 'Foto' ? 2 : 0,
        videoUrl: gType === 'Video' ? 'https://youtube.com/@pemdes-contoh' : '',
        desc: String(fd.get('desc')),
        slides: gType === 'Foto' ? ['Dokumentasi 1', 'Dokumentasi 2'] : []
      });
      modalState = null;
      w.DesaApp.addLog('Tambah Galeri', String(fd.get('title')), 'Tipe: ' + gType);
      w.DesaApp.toast('Item galeri dipublikasikan ke Website.', 'success');
      render();
    } else if (kind === 'add-user-submit') {
      var uRole = String(fd.get('role'));
      st.data.users.push({
        id: 'USR-' + (10 + st.data.users.length + 1),
        name: String(fd.get('name')),
        username: String(fd.get('username')),
        email: String(fd.get('email')),
        roles: [uRole],
        active: true,
        lastLogin: 'Belum login'
      });
      modalState = null;
      w.DesaApp.addLog('Tambah Pengguna RBAC', String(fd.get('name')), 'Peran: ' + w.DesaApp.getRoleInfo(uRole).label);
      w.DesaApp.toast('Akun pengguna internal ditambahkan.', 'success');
      render();
    } else if (kind === 'admin-settings') {
      st.data.site.villageName = String(fd.get('villageName') || '');
      st.data.site.regencyName = String(fd.get('regencyName') || '');
      st.data.site.phone = String(fd.get('phone') || '');
      st.data.site.email = String(fd.get('email') || '');
      st.data.site.officeAddress = String(fd.get('officeAddress') || '');
      st.data.site.domainNotice = String(fd.get('domainNotice') || '');
      w.DesaApp.addLog('Pengaturan Sistem', 'Identitas & Kontak Desa', 'Diperbarui oleh ' + w.DesaApp.getRoleInfo().label);
      w.DesaApp.toast('Pengaturan sistem berhasil disimpan.', 'success');
      render();
    }
  });

  // Keyboard shortcuts: Ctrl+K (Admin Command Palette) & Esc
  document.addEventListener('keydown', function (e) {
    var st = w.DesaApp.state;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      if (st.area === 'admin') {
        e.preventDefault();
        st.cmdkOpen = !st.cmdkOpen;
        st.cmdkQuery = '';
        render();
        if (st.cmdkOpen) setTimeout(function () { var el = document.getElementById('cmdk-input-el'); if (el) el.focus(); }, 20);
      }
    } else if (e.key === 'Escape') {
      if (st.cmdkOpen || modalState || st.notifOpen || st.pubMobileMenuOpen || st.adminSidebarOpen) {
        st.cmdkOpen = false;
        modalState = null;
        st.notifOpen = false;
        st.pubMobileMenuOpen = false;
        st.adminSidebarOpen = false;
        render();
      }
    }
  });

  // Map Drag Pan Support (Mouse + Touch)
  var dragging = false, dragStartX = 0, dragStartY = 0, origPanX = 0, origPanY = 0;
  function startMapDrag(clientX, clientY, target) {
    var stage = target && target.closest ? target.closest('#map-drag-stage') : null;
    if (!stage || target.closest('.map-pin')) return;
    dragging = true;
    dragStartX = clientX;
    dragStartY = clientY;
    origPanX = w.DesaApp.state.mapPanX;
    origPanY = w.DesaApp.state.mapPanY;
  }
  function moveMapDrag(clientX, clientY) {
    if (!dragging) return;
    w.DesaApp.state.mapPanX = Math.max(-180, Math.min(180, origPanX + (clientX - dragStartX)));
    w.DesaApp.state.mapPanY = Math.max(-140, Math.min(140, origPanY + (clientY - dragStartY)));
    var g = document.getElementById('map-viewport-group');
    if (g) g.setAttribute('transform', 'translate(' + w.DesaApp.state.mapPanX + ',' + w.DesaApp.state.mapPanY + ') scale(' + w.DesaApp.state.mapZoom + ')');
  }
  document.addEventListener('mousedown', function (e) { startMapDrag(e.clientX, e.clientY, e.target); });
  document.addEventListener('mousemove', function (e) { moveMapDrag(e.clientX, e.clientY); });
  document.addEventListener('mouseup', function () { dragging = false; });
  document.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) startMapDrag(e.touches[0].clientX, e.touches[0].clientY, e.target);
  }, { passive: true });
  document.addEventListener('touchmove', function (e) {
    if (dragging && e.touches.length === 1) moveMapDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  document.addEventListener('touchend', function () { dragging = false; });

  w.addEventListener('hashchange', parseHash);
  w.addEventListener('DOMContentLoaded', function () {
    parseHash();
    render();
  });
})(window);
