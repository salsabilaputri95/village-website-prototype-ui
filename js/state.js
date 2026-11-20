/* ==========================================================================
   STATE & BUSINESS LOGIC — Reactive Store & PRD Rule Enforcement
   ========================================================================== */
(function (w) {
  'use strict';
  w.DesaApp = w.DesaApp || {};

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  w.DesaApp.escapeHtml = function (str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  var state = {
    area: 'public', // 'public' | 'admin' | 'login' | 'design-system'
    publicPage: 'home',
    adminPage: 'dashboard',
    adminTheme: 'light', // 'light' | 'dark'
    currentRole: 'petugas_pelayanan',
    demoBarCollapsed: false,
    showFullNik: false,

    // Sub-tabs & view filters
    profilTab: 'identitas',
    kontenTab: 'home',
    dataDesaTab: 'kependudukan',
    persuratanTab: 'pengajuan',
    bantuanTab: 'penerima',
    bantuanPublicTab: 'program',
    galleryTab: 'semua',
    pengaturanTab: 'identitas',
    laporanType: 'kependudukan',

    // Interactive filters
    layananFilter: 'Semua',
    beritaCategory: 'Semua',
    beritaSearch: '',
    beritaPage: 1,
    pengumumanTab: 'aktif',
    pengumumanSearch: '',
    potensiCategory: 'Semua',
    potensiSearch: '',
    gallerySearch: '',
    adminRequestFilter: 'Semua',
    adminRequestSearch: '',
    residentSearch: '',
    residentDusunFilter: 'Semua',
    archiveCategoryFilter: 'Semua',
    archiveSearch: '',
    logFilter: 'Semua',

    // Wizard & Check status state
    wizardStep: 1,
    wizardDraft: {
      serviceId: 'LYN-01',
      applicantName: '',
      nik: '',
      dob: '1992-05-10',
      phone: '',
      email: '',
      address: '',
      purpose: '',
      docs: []
    },
    lastSubmittedRegNo: '',
    cekRegInput: 'REG-2026-P3R8N',
    cekDobInput: '1975-06-05',
    cekResultId: 'REQ-103',
    cekError: '',

    // Map state
    mapCategory: 'Semua',
    mapSearch: '',
    selectedMarkerId: 'MAP-01',
    mapZoom: 1,
    mapPanX: 0,
    mapPanY: 0,

    // Drawer / Modal / Popover state
    activeRequestId: null,
    notifOpen: false,
    cmdkOpen: false,
    cmdkQuery: '',
    importStep: 1,
    importConfirmed: false,
    toasts: [],

    // Live data cloned from INITIAL_DATA
    data: clone(w.DesaApp.INITIAL_DATA)
  };

  w.DesaApp.state = state;

  var listeners = [];
  w.DesaApp.subscribe = function (fn) { listeners.push(fn); };
  w.DesaApp.notifyRender = function () {
    for (var i = 0; i < listeners.length; i++) listeners[i](state);
  };

  w.DesaApp.toast = function (message, type) {
    var id = 'T-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    state.toasts.push({ id: id, message: message, type: type || 'success' });
    w.DesaApp.renderToasts && w.DesaApp.renderToasts();
    setTimeout(function () {
      state.toasts = state.toasts.filter(function (t) { return t.id !== id; });
      w.DesaApp.renderToasts && w.DesaApp.renderToasts();
    }, 3600);
  };

  w.DesaApp.getRoleInfo = function (roleId) {
    var list = w.DesaApp.ROLES;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === (roleId || state.currentRole)) return list[i];
    }
    return list[0];
  };

  w.DesaApp.can = function (moduleKey, action, roleId) {
    var r = roleId || state.currentRole;
    var row = w.DesaApp.RBAC_MATRIX[moduleKey];
    if (!row) return false;
    var perms = row[r] || [];
    if (!action) return perms.length > 0;
    return perms.indexOf(action) !== -1;
  };

  w.DesaApp.addLog = function (action, target, detail) {
    var role = w.DesaApp.getRoleInfo();
    state.data.logs.unshift({
      id: 'LOG-' + (200 + state.data.logs.length),
      time: 'Baru saja (20 Nov 2026)',
      actor: role.user,
      action: action,
      target: target,
      detail: detail
    });
  };

  w.DesaApp.addNotif = function (title, body, target) {
    state.data.notifications.unshift({
      id: 'NTF-' + Date.now(),
      title: title,
      body: body,
      time: 'Baru saja',
      target: target || 'persuratan',
      unread: true
    });
  };

  function randomCode() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var out = '';
    for (var i = 0; i < 5; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
    return 'REG-2026-' + out;
  }

  function maskNik(nik) {
    var s = String(nik || '').replace(/\D/g, '');
    if (s.length < 8) return '3201••••••••0000';
    return s.slice(0, 4) + '••••••••' + s.slice(-4);
  }

  w.DesaApp.formatNik = function (nik) {
    var allowedFull = state.currentRole === 'operator_data' || state.currentRole === 'kepala_desa' || state.currentRole === 'super_admin';
    return (state.showFullNik && allowedFull) ? nik : maskNik(nik);
  };

  // BR-S01, BR-S02, BR-S03: Pengajuan Surat Online / Tatap Muka
  w.DesaApp.submitLetterRequest = function (payload, channel) {
    var svc = state.data.services.find(function (s) { return s.id === payload.serviceId; });
    if (!svc) return { ok: false, error: 'Jenis layanan tidak ditemukan.' };
    if (channel !== 'Tatap Muka (BR-S14)' && !svc.onlineEnabled) {
      return { ok: false, error: 'Layanan ini hanya tersedia melalui loket tatap muka (BR-S01).' };
    }
    if (!payload.applicantName || !payload.dob || !payload.address || !payload.purpose) {
      return { ok: false, error: 'Lengkapi seluruh field wajib sebelum mengirim permohonan (BR-S02).' };
    }
    var docs = payload.docs && payload.docs.length ? payload.docs : ['KTP_Pemohon.jpg (Terlampir)', 'Pengantar_RT_RW.jpg (Terlampir)'];
    var regNo = randomCode();
    var req = {
      id: 'REQ-' + (100 + state.data.requests.length + 1),
      regNo: regNo,
      serviceId: svc.id,
      serviceName: svc.name,
      applicantName: payload.applicantName.trim(),
      nikMasked: maskNik(payload.nik || '3201019900009999'),
      dob: payload.dob,
      phone: payload.phone || '-',
      email: payload.email || '',
      address: payload.address.trim(),
      purpose: payload.purpose.trim(),
      status: 'Diajukan',
      subStatus: '',
      channel: channel || 'Online',
      submittedAt: '20 Nov 2026 (Baru saja)',
      updatedAt: '20 Nov 2026 (Baru saja)',
      assignedTo: channel === 'Tatap Muka (BR-S14)' ? w.DesaApp.getRoleInfo().user : '-',
      residentId: '',
      letterNumber: '',
      pdfReady: false,
      docs: docs,
      reasonNote: '',
      history: [
        { at: '20 Nov 2026 (Baru saja)', actor: channel === 'Tatap Muka (BR-S14)' ? 'Petugas Loket Tatap Muka' : 'Pemohon (Online)', from: '-', to: 'Diajukan', note: 'Nomor registrasi unik dibuat oleh sistem.' }
      ]
    };
    state.data.requests.unshift(req);
    state.lastSubmittedRegNo = regNo;
    state.cekRegInput = regNo;
    state.cekDobInput = req.dob;
    state.cekResultId = req.id;
    w.DesaApp.addNotif('Pengajuan Baru Masuk', regNo + ' (' + svc.name + ') telah diajukan.', 'persuratan');
    w.DesaApp.addLog('Pengajuan Surat', regNo, svc.name + ' via ' + req.channel);
    return { ok: true, req: req };
  };

  // BR-S06: Kirim perbaikan dokumen dari warga hanya saat Perlu Perbaikan
  w.DesaApp.submitCitizenRevision = function (reqId, newDocName, note) {
    var req = state.data.requests.find(function (r) { return r.id === reqId; });
    if (!req) return { ok: false, error: 'Permohonan tidak ditemukan.' };
    if (req.status !== 'Perlu Perbaikan') {
      return { ok: false, error: 'Perbaikan hanya dapat dikirim ketika status Perlu Perbaikan (BR-S06).' };
    }
    var docLabel = newDocName || 'Perbaikan_Berkas_Terbaru.pdf (960 KB)';
    req.docs.push(docLabel);
    req.status = 'Menunggu Verifikasi';
    req.updatedAt = '20 Nov 2026 (Baru saja)';
    req.history.push({
      at: '20 Nov 2026 (Baru saja)',
      actor: 'Pemohon (Perbaikan Online)',
      from: 'Perlu Perbaikan',
      to: 'Menunggu Verifikasi',
      note: (note || 'Pemohon mengunggah perbaikan dokumen: ') + docLabel
    });
    w.DesaApp.addNotif('Perbaikan Berkas Masuk', req.regNo + ' mengirim perbaikan dokumen.', 'persuratan');
    w.DesaApp.addLog('Perbaikan Pemohon', req.regNo, 'Status kembali ke Menunggu Verifikasi');
    return { ok: true, req: req };
  };

  // BR-S05, BR-S07, BR-S09, BR-S11, BR-S12: Transisi status surat oleh petugas/Kades
  w.DesaApp.transitionLetterStatus = function (reqId, nextStatus, opts) {
    opts = opts || {};
    var req = state.data.requests.find(function (r) { return r.id === reqId; });
    if (!req) return { ok: false, error: 'Data pengajuan tidak ditemukan.' };

    var role = state.currentRole;
    if (nextStatus === 'Disetujui' || (nextStatus === 'Ditolak' && req.status === 'Sedang Diproses')) {
      if (role !== 'kepala_desa') {
        return { ok: false, error: 'Hanya Kepala Desa / Pejabat Penandatangan yang berwenang menyetujui atau menolak draf surat (Matriks 9.2.1).' };
      }
    } else if (nextStatus === 'Selesai / Diterbitkan') {
      if (role !== 'petugas_pelayanan' && role !== 'kepala_desa') {
        return { ok: false, error: 'Hanya Petugas Pelayanan atau Kepala Desa yang berwenang menerbitkan surat.' };
      }
    } else {
      if (role !== 'petugas_pelayanan') {
        return { ok: false, error: 'Aksi verifikasi ini hanya untuk peran Petugas Pelayanan (Matriks 9.2.1).' };
      }
    }

    if ((nextStatus === 'Perlu Perbaikan' || nextStatus === 'Ditolak') && (!opts.note || !opts.note.trim())) {
      return { ok: false, error: 'Alasan atau catatan perbaikan wajib diisi agar terlihat oleh pemohon (BR-S05).' };
    }

    var prev = req.status;
    req.status = nextStatus;
    req.updatedAt = '20 Nov 2026 (Baru saja)';
    req.assignedTo = w.DesaApp.getRoleInfo().user;
    req.subStatus = nextStatus === 'Sedang Diproses' ? 'Menunggu Persetujuan Pejabat' : '';
    if (opts.note) req.reasonNote = opts.note.trim();

    var extraNote = opts.note ? opts.note.trim() : 'Diproses melalui Panel Admin.';

    if (nextStatus === 'Selesai / Diterbitkan') {
      // BR-S09: Alokasi nomor atomik unik saat penerbitan
      var tpl = state.data.templates.find(function (t) { return t.code === (state.data.services.find(function (s) { return s.id === req.serviceId; }) || {}).code; });
      var kode = tpl ? tpl.klasifikasiKode : '470';
      var seq = String(state.data.numberingConfig.nextSequence).padStart(state.data.numberingConfig.padDigits, '0');
      state.data.numberingConfig.nextSequence += 1;
      var letterNum = kode + '/' + seq + '/' + state.data.numberingConfig.kodeDesa + '-XI/2026';
      req.letterNumber = letterNum;
      req.pdfReady = true;

      // BR-S11: Otomatis tercatat di Arsip Persuratan tanpa input ulang
      var newArsId = 'ARS-' + (100 + state.data.archives.length + 1);
      req.archiveId = newArsId;
      state.data.archives.unshift({
        id: newArsId,
        number: letterNum,
        category: 'Surat Keterangan Terbit',
        subject: req.serviceName + ' a.n. ' + req.applicantName,
        letterDate: '2026-11-20',
        ioDate: '2026-11-20',
        party: req.applicantName + ' (Warga)',
        pic: w.DesaApp.getRoleInfo().user,
        access: 'Terbatas',
        sourceReq: req.regNo,
        note: 'Arsip otomatis dari Pengajuan Surat (' + req.regNo + ').'
      });
      extraNote = 'Nomor surat ' + letterNum + ' dialokasikan, PDF dibuat, otomatis masuk Arsip (' + newArsId + ').';
      w.DesaApp.addLog('Penerbitan & Arsip Otomatis', letterNum, 'Pengajuan ' + req.regNo + ' → Arsip ' + newArsId);
    } else {
      w.DesaApp.addLog('Perubahan Status Surat', req.regNo, prev + ' → ' + nextStatus);
      if (nextStatus === 'Sedang Diproses') {
        w.DesaApp.addNotif('Draf Menunggu Persetujuan', req.regNo + ' (' + req.serviceName + ') siap diperiksa Kepala Desa.', 'persuratan');
      }
    }

    req.history.push({
      at: '20 Nov 2026 (Baru saja)',
      actor: w.DesaApp.getRoleInfo().user,
      from: prev,
      to: nextStatus,
      note: extraNote
    });

    return { ok: true, req: req };
  };

  // Match pemohon ke Data Kependudukan (BR-S15)
  w.DesaApp.matchApplicantToResident = function (reqId, residentId) {
    var req = state.data.requests.find(function (r) { return r.id === reqId; });
    var res = state.data.residents.find(function (p) { return p.id === residentId; });
    if (!req || !res) return;
    req.residentId = res.id;
    req.applicantName = res.name;
    req.nikMasked = maskNik(res.nik);
    req.address = res.dusun + ' RT ' + res.rt + ' / RW ' + res.rw;
    req.history.push({
      at: '20 Nov 2026 (Baru saja)',
      actor: w.DesaApp.getRoleInfo().user,
      from: req.status,
      to: req.status,
      note: 'Identitas ditautkan ke Data Kependudukan (' + res.id + ') tanpa duplikasi (BR-S15).'
    });
    w.DesaApp.addLog('Pencocokan Penduduk', req.regNo, 'Ditautkan ke ' + res.id);
  };

  w.DesaApp.toggleServiceOnline = function (serviceId) {
    var svc = state.data.services.find(function (s) { return s.id === serviceId; });
    if (!svc) return;
    svc.onlineEnabled = !svc.onlineEnabled;
    w.DesaApp.addLog('Ubah Opsi Layanan', svc.name, 'Pengajuan online: ' + (svc.onlineEnabled ? 'Aktif' : 'Nonaktif'));
  };

  w.DesaApp.approvePublicStatistics = function (published) {
    if (state.currentRole !== 'kepala_desa' && state.currentRole !== 'super_admin') {
      w.DesaApp.toast('Persetujuan publikasi statistik adalah kewenangan Kepala Desa.', 'warning');
      return false;
    }
    state.data.statistik.published = published;
    state.data.statistik.approvedBy = w.DesaApp.getRoleInfo().user;
    state.data.statistik.approvedAt = '20 Nov 2026';
    w.DesaApp.addLog('Publikasi Statistik', 'Statistik Kependudukan', published ? 'Disetujui tampil di publik' : 'Ditarik ke mode pembaruan (Empty State)');
    return true;
  };

  w.DesaApp.toggleMapBoundaryOfficial = function (available) {
    state.data.mapConfig.officialBoundaryAvailable = available;
    w.DesaApp.addLog('Konfigurasi Peta', 'Batas Wilayah Desa', available ? 'Menampilkan data batas sah' : 'Menyembunyikan batas (menunggu data resmi)');
  };

  w.DesaApp.toggleAidPublicRecap = function (programId) {
    var prg = state.data.aidPrograms.find(function (p) { return p.id === programId; });
    if (!prg) return;
    prg.publicPublish = !prg.publicPublish;
    w.DesaApp.addLog('Publikasi Rekap Bantuan', prg.name, prg.publicPublish ? 'Ditampilkan agregat ke publik' : 'Disembunyikan dari halaman publik');
  };

  // BR-B03: Deteksi ganda penerima + program + periode
  w.DesaApp.checkAidDuplicate = function (residentId, programId, periodId) {
    return state.data.aidRecipients.some(function (r) {
      return r.residentId === residentId && r.programId === programId && r.periodId === periodId;
    });
  };

  w.DesaApp.addAidDistribution = function (payload) {
    var res = state.data.residents.find(function (p) { return p.id === payload.residentId; });
    var prg = state.data.aidPrograms.find(function (p) { return p.id === payload.programId; });
    if (!res || !prg) return { ok: false, error: 'Penduduk atau program tidak valid.' };
    var isDup = w.DesaApp.checkAidDuplicate(payload.residentId, payload.programId, payload.periodId);
    var rec = {
      id: 'BNT-' + (10 + state.data.aidRecipients.length + 1),
      residentId: res.id,
      residentName: res.name,
      dusun: res.dusun,
      programId: prg.id,
      periodId: payload.periodId,
      distDate: payload.status === 'Disalurkan' ? '2026-11-20' : '-',
      bentuk: prg.bentuk,
      amount: prg.unit,
      status: payload.status,
      verifyRef: payload.verifyRef || 'Catatan Verifikasi Petugas',
      hasProof: !!payload.hasProof,
      duplicateWarning: isDup
    };
    state.data.aidRecipients.unshift(rec);
    w.DesaApp.addLog('Catat Penerima Bantuan', rec.id + ' (' + prg.name + ')', isDup ? 'Disimpan dengan peringatan ganda' : 'Tercatat rapi');
    return { ok: true, rec: rec, isDup: isDup };
  };

  w.DesaApp.confirmResidentImport = function () {
    var validRows = state.data.importPreviewRows.filter(function (r) { return r.state === 'Valid'; });
    if (state.importConfirmed) return 0;
    validRows.forEach(function (r, idx) {
      state.data.residents.unshift({
        id: 'PDD-IMP-' + (idx + 1),
        nik: r.nik,
        kk: '320101991126000' + (idx + 1),
        name: r.name,
        ttl: '[Kabupaten], 12 Mei 1990',
        gender: idx % 2 === 0 ? 'L' : 'P',
        dusun: r.dusun,
        rw: '01',
        rt: '01',
        address: r.dusun + ' (Hasil Impor)',
        education: 'SMA / SMK',
        job: 'Wiraswasta / UMKM',
        marital: 'Kawin',
        status: 'Aktif',
        updatedAt: '2026-11-20',
        history: ['20 Nov 2026: Diimpor melalui validasi 2-tahap Excel/CSV']
      });
    });
    state.importConfirmed = true;
    w.DesaApp.addLog('Impor Data Penduduk', validRows.length + ' baris valid', 'Baris error otomatis dilewati (BR-P05)');
    return validRows.length;
  };
})(window);
