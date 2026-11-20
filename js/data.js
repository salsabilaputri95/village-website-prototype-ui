/* ==========================================================================
   DATA — Data Contoh / Placeholder Berlabel Jelas (Sesuai PRD & Acuan Fitur)
   Catatan: Tidak menggunakan identitas nyata, NIK nyata, atau batas wilayah fiktif.
   ========================================================================== */
(function (w) {
  'use strict';
  w.DesaApp = w.DesaApp || {};

  w.DesaApp.STATUS_META = {
    'Diajukan': { badge: 'badge-navy', step: 1, desc: 'Permohonan masuk dan tercatat dengan nomor registrasi unik.' },
    'Menunggu Verifikasi': { badge: 'badge-info', step: 2, desc: 'Dalam antrean pemeriksaan identitas dan berkas oleh Petugas Pelayanan.' },
    'Perlu Perbaikan': { badge: 'badge-warning', step: 2, desc: 'Petugas meminta kelengkapan atau perbaikan berkas pemohon.' },
    'Sedang Diproses': { badge: 'badge-navy', step: 3, desc: 'Berkas lengkap; draf surat disusun dan diproses pejabat berwenang.' },
    'Disetujui': { badge: 'badge-emerald', step: 4, desc: 'Disetujui Kepala Desa / Pejabat Penandatangan, menunggu penerbitan.' },
    'Ditolak': { badge: 'badge-danger', step: 2, desc: 'Permohonan ditolak disertai alasan resmi.' },
    'Selesai / Diterbitkan': { badge: 'badge-done', step: 5, desc: 'Nomor surat dialokasikan, PDF diterbitkan, dan otomatis tercatat di Arsip.' }
  };

  w.DesaApp.ROLES = [
    { id: 'super_admin', label: 'Super Admin', user: 'Raka Pratama (IT Desa)', badge: 'SA', desc: 'Konfigurasi sistem, akun, RBAC, template, dan backup. Akses data pribadi dibatasi prinsip least privilege.' },
    { id: 'kepala_desa', label: 'Kepala Desa', user: 'H. Ahmad Subandi (Kades)', badge: 'KD', desc: 'Menyetujui surat sesuai kewenangan, menyetujui publikasi statistik publik, memantau laporan dan log.' },
    { id: 'admin_website', label: 'Admin Website', user: 'Siti Aminah (Kaur TU)', badge: 'AW', desc: 'Mengelola konten publik: Home, Profil Desa, Berita, Pengumuman, Gallery, Layanan, Potensi, Peta.' },
    { id: 'petugas_pelayanan', label: 'Petugas Pelayanan', user: 'Budi Santoso (Kasi Pelayanan)', badge: 'PP', desc: 'Memeriksa berkas pengajuan surat, meminta perbaikan, membuat draf surat, menerbitkan PDF.' },
    { id: 'operator_data', label: 'Operator Data Desa', user: 'Dewi Lestari (Operator Data)', badge: 'OD', desc: 'Mengelola Data Kependudukan internal, import Excel/CSV, validasi ganda, menyiapkan statistik.' },
    { id: 'petugas_bantuan', label: 'Petugas Bantuan', user: 'Hendra Wijaya (Kasi Kesra)', badge: 'PB', desc: 'Mengelola Data Penerima Bantuan, program, periode, riwayat penyaluran, deteksi ganda.' },
    { id: 'petugas_arsip', label: 'Petugas Arsip', user: 'Nurul Hidayah (Staf Arsip)', badge: 'PA', desc: 'Mengelola Arsip Persuratan masuk/keluar/terbit, metadata, pratinjau PDF, klasifikasi akses.' }
  ];

  // Matriks RBAC exact mengacu PRD Bagian 11
  w.DesaApp.RBAC_MATRIX = {
    // moduleKey: { roleId: ['K','L','S','E'] }
    dashboard:     { super_admin:['L'], kepala_desa:['L'], admin_website:['L'], petugas_pelayanan:['L'], operator_data:['L'], petugas_bantuan:['L'], petugas_arsip:['L'] },
    konten:        { super_admin:['K'], kepala_desa:['L'], admin_website:['K'], petugas_pelayanan:['L'], operator_data:[], petugas_bantuan:[], petugas_arsip:[] },
    kependudukan:  { super_admin:['K'], kepala_desa:['L','E'], admin_website:[], petugas_pelayanan:['L'], operator_data:['K','E'], petugas_bantuan:['L'], petugas_arsip:[] },
    statistik_pub: { super_admin:['K'], kepala_desa:['S'], admin_website:[], petugas_pelayanan:[], operator_data:['K'], petugas_bantuan:[], petugas_arsip:[] },
    peta:          { super_admin:['K'], kepala_desa:['L'], admin_website:['K'], petugas_pelayanan:[], operator_data:['K'], petugas_bantuan:[], petugas_arsip:[] },
    persuratan:    { super_admin:['L'], kepala_desa:['L','S'], admin_website:[], petugas_pelayanan:['K'], operator_data:[], petugas_bantuan:[], petugas_arsip:[] },
    template_no:   { super_admin:['K'], kepala_desa:['L'], admin_website:[], petugas_pelayanan:['L'], operator_data:[], petugas_bantuan:[], petugas_arsip:[] },
    arsip:         { super_admin:['K'], kepala_desa:['L','E'], admin_website:[], petugas_pelayanan:['L'], operator_data:[], petugas_bantuan:[], petugas_arsip:['K','E'] },
    bantuan:       { super_admin:['K'], kepala_desa:['L','E'], admin_website:[], petugas_pelayanan:[], operator_data:['L'], petugas_bantuan:['K','E'], petugas_arsip:[] },
    laporan:       { super_admin:['K','E'], kepala_desa:['L','E'], admin_website:[], petugas_pelayanan:['E'], operator_data:['E'], petugas_bantuan:['E'], petugas_arsip:['E'] },
    pengguna:      { super_admin:['K'], kepala_desa:[], admin_website:[], petugas_pelayanan:[], operator_data:[], petugas_bantuan:[], petugas_arsip:[] },
    log:           { super_admin:['L'], kepala_desa:['L'], admin_website:[], petugas_pelayanan:[], operator_data:[], petugas_bantuan:[], petugas_arsip:[] },
    pengaturan:    { super_admin:['K'], kepala_desa:[], admin_website:['K'], petugas_pelayanan:[], operator_data:[], petugas_bantuan:[], petugas_arsip:[] }
  };

  w.DesaApp.INITIAL_DATA = {
    site: {
      villageName: 'Desa [Nama Desa]',
      districtName: 'Kecamatan [Nama Kecamatan]',
      regencyName: 'Kabupaten [Nama Kabupaten]',
      provinceName: 'Provinsi [Nama Provinsi]',
      tagline: 'Pelayanan Desa Modern • Transparan, Tertib, dan Terintegrasi',
      heroTitle: 'Website Resmi & Pelayanan Administrasi Desa [Nama Desa]',
      heroDesc: 'Pusat informasi resmi pemerintah desa, transparansi statistik agregat, katalog potensi lokal, serta layanan pengajuan surat online tanpa perlu antre berulang di kantor desa.',
      aboutSummary: 'Desa [Nama Desa] terletak di wilayah dataran subur dengan 4 dusun yang mengedepankan tata kelola pemerintahan partisipatif, pelayanan publik inklusif (online maupun tatap muka), serta keterbukaan informasi pembangunan bagi seluruh warga.',
      officeAddress: 'Jl. Balai Desa No. 01, Dusun Krajan, Desa [Nama Desa], Kec. [Nama Kecamatan], Kab. [Nama Kabupaten]',
      phone: '(021) 555-0142',
      whatsapp: '0812-0000-1234 (Layanan Kantor)',
      email: 'pelayanan@[namadesa].desa.id',
      officeHours: 'Senin – Kamis: 08.00 – 15.00 WIB | Jumat: 08.00 – 11.30 WIB',
      kadesName: 'H. Ahmad Subandi (Contoh)',
      kadesTitle: 'Kepala Desa [Nama Desa]',
      kadesGreeting: 'Assalamu’alaikum warahmatullahi wabarakatuh. Kehadiran Website dan Sistem Informasi Desa Terintegrasi ini menjadi komitmen kami agar masyarakat dapat mengakses informasi desa, memantau pengumuman resmi, dan mengurus layanan persuratan dengan lebih mudah. Bagi warga yang membutuhkan pendampingan langsung, loket tatap muka di Kantor Desa tetap melayani sepenuh hati.',
      kadesPeriod: 'Periode Jabatan [Tahun Awal – Tahun Akhir]',
      socialLinks: {
        instagram: '@pemdes.[namadesa]',
        youtube: 'Pemdes [Nama Desa] Official',
        facebook: 'Pemerintah Desa [Nama Desa]'
      },
      domainNotice: 'Domain resmi (.desa.id) atas nama Pemerintah Desa — dalam proses pendaftaran tahap go-live',
      notificationEmailEnabled: true,
      smtpProvider: 'SMTP Resmi Desa (variabel .env)',
      retentionMonths: 24,
      smallGroupThreshold: 5
    },

    profil: {
      sejarah: 'Desa [Nama Desa] merupakan wilayah administratif yang berkembang dari komunitas agraris dan perdagangan lokal sejak tahun [Tahun Berdiri]. Penataan wilayah terbagi menjadi empat dusun yang saling terhubung melalui jaringan jalan desa dan irigasi pertanian produktif. [Teks ini merupakan placeholder resmi untuk dikonfirmasi bersama Perangkat Desa pada Tahap 1].',
      visi: 'Terwujudnya Desa [Nama Desa] yang Mandiri, Tertib Administrasi, Sejahtera Berbasis Potensi Lokal, dan Transparan dalam Pelayanan Publik.',
      misi: [
        'Menyelenggarakan pelayanan administrasi surat menyurat yang cepat, jelas syaratnya, serta ramah bagi warga secara online maupun tatap muka.',
        'Mewujudkan tata kelola data kependudukan dan pencatatan bantuan yang tertib, akurat, dan menjaga kerahasiaan data pribadi warga.',
        'Mengembangkan potensi pertanian, UMKM kerajinan, dan wisata alam desa melalui promosi digital yang terhubung dengan peta wilayah.',
        'Memperkuat partisipasi masyarakat dan keterbukaan informasi pembangunan desa secara berkala.'
      ],
      geografis: {
        luas: '642,5 Ha (Data Contoh)',
        ketinggian: '185 mdpl',
        batasUtara: 'Desa [Sebelah Utara]',
        batasSelatan: 'Desa [Sebelah Selatan]',
        batasBarat: 'Sungai / Desa [Sebelah Barat]',
        batasTimur: 'Kecamatan [Sebelah Timur]',
        dusun: [
          { nama: 'Dusun Krajan', rw: 3, rt: 9, kk: 312, jiwa: 1020 },
          { nama: 'Dusun Sawah Indah', rw: 2, rt: 8, kk: 268, jiwa: 890 },
          { nama: 'Dusun Bukit Makmur', rw: 2, rt: 7, kk: 245, jiwa: 795 },
          { nama: 'Dusun Sumber Jaya', rw: 2, rt: 6, kk: 220, jiwa: 715 }
        ]
      },
      perangkat: [
        { id: 'PR-1', nama: 'H. Ahmad Subandi', jabatan: 'Kepala Desa', bidang: 'Pimpinan Pemerintahan Desa', masa: '2024–2032', inisial: 'AS', warna: '#1B3A5C' },
        { id: 'PR-2', nama: 'Drs. Wahyu Hidayat', jabatan: 'Sekretaris Desa', bidang: 'Koordinator Administrasi & Arsip', masa: 'ASN / Perangkat', inisial: 'WH', warna: '#1E7A5F' },
        { id: 'PR-3', nama: 'Budi Santoso', jabatan: 'Kasi Pelayanan', bidang: 'Pelayanan Administrasi & Surat', masa: '2021–Sekarang', inisial: 'BS', warna: '#0F4C81' },
        { id: 'PR-4', nama: 'Hendra Wijaya', jabatan: 'Kasi Kesejahteraan', bidang: 'Pembangunan & Bantuan Sosial', masa: '2022–Sekarang', inisial: 'HW', warna: '#1E7A5F' },
        { id: 'PR-5', nama: 'Siti Aminah', jabatan: 'Kaur Tata Usaha & Umum', bidang: 'Admin Website & Tata Usaha', masa: '2020–Sekarang', inisial: 'SA', warna: '#1B3A5C' },
        { id: 'PR-6', nama: 'Dewi Lestari', jabatan: 'Kaur Perencanaan', bidang: 'Operator Data & Perencanaan', masa: '2023–Sekarang', inisial: 'DL', warna: '#2E6F5E' },
        { id: 'PR-7', nama: 'Nurul Hidayah', jabatan: 'Staf Arsip & Persuratan', bidang: 'Pengelola Arsip Digital', masa: '2023–Sekarang', inisial: 'NH', warna: '#3B5998' },
        { id: 'PR-8', nama: 'Slamet Riyadi', jabatan: 'Kepala Dusun Krajan', bidang: 'Kewilayahan Dusun I', masa: '2021–Sekarang', inisial: 'SR', warna: '#1B3A5C' }
      ],
      sarpras: [
        { nama: 'Balai & Kantor Desa', jumlah: '1 Unit', kondisi: 'Baik', lokasi: 'Dusun Krajan' },
        { nama: 'Puskesmas Pembantu / Polindes', jumlah: '2 Unit', kondisi: 'Baik', lokasi: 'Krajan & Bukit Makmur' },
        { nama: 'SD / MI & PAUD', jumlah: '5 Unit', kondisi: 'Baik', lokasi: 'Tersebar 4 Dusun' },
        { nama: 'Masjid & Mushola', jumlah: '14 Unit', kondisi: 'Baik', lokasi: 'Semua Dusun' },
        { nama: 'Pasar Desa & Kios UMKM', jumlah: '1 Kawasan', kondisi: 'Aktif', lokasi: 'Dusun Sumber Jaya' },
        { nama: 'Jaringan Irigasi Teknis', jumlah: '8,4 Km', kondisi: 'Perlu Pemeliharaan Berkala', lokasi: 'Sawah Indah' }
      ],
      dokumen: [
        { judul: 'Ringkasan Profil & RPJMDes [Tahun Contoh]', ukuran: '1,4 MB (PDF)', tahun: '2026', ket: 'Dokumen Publik' },
        { judul: 'Ringkasan APBDes Tahun Anggaran 2026 (Infografis)', ukuran: '920 KB (PDF)', tahun: '2026', ket: 'Dokumen Publik' },
        { judul: 'Peraturan Desa tentang Standar Pelayanan Minimal', ukuran: '640 KB (PDF)', tahun: '2025', ket: 'Dokumen Publik' }
      ]
    },

    statistik: {
      published: true,
      approvedBy: 'H. Ahmad Subandi (Kepala Desa)',
      approvedAt: '15 November 2026',
      totalPenduduk: 3420,
      lakiLaki: 1735,
      perempuan: 1685,
      totalKK: 1045,
      kelompokUsia: [
        { label: '0–5 Th (Balita)', jumlah: 298 },
        { label: '6–17 Th (Usia Sekolah)', jumlah: 642 },
        { label: '18–35 Th (Produktif Muda)', jumlah: 1018 },
        { label: '36–55 Th (Dewasa)', jumlah: 964 },
        { label: '56+ Th (Lansia)', jumlah: 498 }
      ],
      pendidikan: [
        { label: 'SD / Sederajat', jumlah: 740 },
        { label: 'SMP / Sederajat', jumlah: 820 },
        { label: 'SMA / SMK', jumlah: 1180 },
        { label: 'Diploma / Sarjana', jumlah: 390 },
        { label: 'Belum / Tidak Sekolah', jumlah: 290 }
      ],
      pekerjaan: [
        { label: 'Petani / Pekebun', jumlah: 980 },
        { label: 'Wiraswasta / UMKM', jumlah: 560 },
        { label: 'Karyawan Swasta', jumlah: 485 },
        { label: 'Ibu Rumah Tangga & Pelajar', jumlah: 1150 },
        { label: 'PNS / TNI / Polri / Lainnya', jumlah: 245 }
      ]
    },

    services: [
      {
        id: 'LYN-01', code: 'SKD', kategori: 'Kependudukan',
        name: 'Surat Keterangan Domisili',
        desc: 'Surat resmi keterangan tempat tinggal penduduk untuk keperluan sekolah, perbankan, atau melamar pekerjaan.',
        onlineEnabled: true, allowCitizenDownload: true,
        estimate: '1–2 Hari Kerja', fee: 'Gratis (Rp 0)',
        hours: 'Senin–Jumat, 08.00–15.00 WIB', location: 'Loket Pelayanan Kantor Desa',
        pic: 'Budi Santoso (Kasi Pelayanan)',
        requirements: ['Fotokopi / Foto KTP Pemohon yang masih berlaku', 'Fotokopi / Foto Kartu Keluarga (KK)', 'Surat Pengantar RT/RW setempat'],
        steps: ['Baca syarat & siapkan foto dokumen', 'Isi formulir pengajuan online atau serahkan di loket', 'Verifikasi berkas oleh Petugas Pelayanan', 'Persetujuan Kepala Desa & pencatatan nomor surat', 'Unduh salinan PDF atau ambil surat fisik berstempel di kantor desa']
      },
      {
        id: 'LYN-02', code: 'SKU', kategori: 'Ekonomi & UMKM',
        name: 'Surat Keterangan Usaha (SKU)',
        desc: 'Keterangan kepemilikan usaha mikro/kecil warga desa sebagai syarat pengajuan KUR atau legalitas UMKM.',
        onlineEnabled: true, allowCitizenDownload: true,
        estimate: '1–2 Hari Kerja', fee: 'Gratis (Rp 0)',
        hours: 'Senin–Jumat, 08.00–15.00 WIB', location: 'Loket Pelayanan Kantor Desa',
        pic: 'Budi Santoso (Kasi Pelayanan)',
        requirements: ['KTP Pemohon', 'Kartu Keluarga (KK)', 'Foto lokasi atau produk usaha', 'Surat Pengantar RT/RW'],
        steps: ['Siapkan foto usaha & identitas', 'Ajukan melalui formulir online', 'Verifikasi data usaha oleh petugas', 'Persetujuan Kepala Desa & penerbitan surat']
      },
      {
        id: 'LYN-03', code: 'SKTM', kategori: 'Sosial',
        name: 'Surat Keterangan Tidak Mampu (SKTM)',
        desc: 'Keterangan kondisi ekonomi keluarga untuk pengajuan beasiswa pendidikan, keringanan biaya rumah sakit, atau bantuan sosial.',
        onlineEnabled: true, allowCitizenDownload: false,
        estimate: '1–2 Hari Kerja', fee: 'Gratis (Rp 0)',
        hours: 'Senin–Jumat, 08.00–15.00 WIB', location: 'Loket Pelayanan Kantor Desa',
        pic: 'Budi Santoso (Kasi Pelayanan)',
        requirements: ['KTP & KK Pemohon', 'Surat Pengantar RT/RW yang menyatakan kondisi keluarga', 'Bukti pendukung keperluan (surat RS / sekolah)'],
        steps: ['Ajukan permohonan & unggah pengantar RT/RW', 'Verifikasi lapangan/data oleh petugas desa', 'Persetujuan Kepala Desa', 'Pengambilan surat bertanda tangan & cap basah di Kantor Desa (tidak diunduh langsung)']
      },
      {
        id: 'LYN-04', code: 'SPG', kategori: 'Umum',
        name: 'Surat Pengantar (SKCK / KTP / KK)',
        desc: 'Surat pengantar resmi desa untuk pengurusan dokumen di tingkat Kecamatan, Polsek, atau Dinas Dukcapil.',
        onlineEnabled: true, allowCitizenDownload: true,
        estimate: '1 Hari Kerja', fee: 'Gratis (Rp 0)',
        hours: 'Senin–Jumat, 08.00–15.00 WIB', location: 'Loket Pelayanan Kantor Desa',
        pic: 'Budi Santoso (Kasi Pelayanan)',
        requirements: ['KTP Pemohon', 'Kartu Keluarga', 'Surat Pengantar RT/RW'],
        steps: ['Isi formulir & pilih tujuan pengantar', 'Verifikasi petugas', 'Terbit & arsip otomatis']
      },
      {
        id: 'LYN-05', code: 'SKL', kategori: 'Kependudukan',
        name: 'Surat Keterangan Kelahiran (Pengantar Akta)',
        desc: 'Surat keterangan dari desa sebagai pengantar pengurusan Akta Kelahiran di Dukcapil Kabupaten.',
        onlineEnabled: true, allowCitizenDownload: true,
        estimate: '1–2 Hari Kerja', fee: 'Gratis (Rp 0)',
        hours: 'Senin–Jumat, 08.00–15.00 WIB', location: 'Loket Pelayanan Kantor Desa',
        pic: 'Budi Santoso (Kasi Pelayanan)',
        requirements: ['Surat Keterangan Lahir dari Bidan/RS', 'KTP Kedua Orang Tua', 'Kartu Keluarga & Buku Nikah/Akta Perkawinan'],
        steps: ['Unggah surat bidan/RS & KK orang tua', 'Verifikasi petugas pelayanan', 'Persetujuan & penerbitan pengantar']
      },
      {
        id: 'LYN-06', code: 'SKK', kategori: 'Kependudukan',
        name: 'Surat Keterangan Kematian',
        desc: 'Keterangan resmi peristiwa kematian warga desa untuk kebutuhan administrasi keluarga dan pelaporan Dukcapil.',
        onlineEnabled: true, allowCitizenDownload: true,
        estimate: '1 Hari Kerja', fee: 'Gratis (Rp 0)',
        hours: 'Senin–Jumat, 08.00–15.00 WIB', location: 'Loket Pelayanan Kantor Desa',
        pic: 'Budi Santoso (Kasi Pelayanan)',
        requirements: ['KTP & KK Almarhum/Almarhumah', 'KTP Pelapor / Ahli Waris', 'Surat Keterangan Medis / RT/RW'],
        steps: ['Lapor secara online atau datang langsung', 'Verifikasi data pelapor', 'Penerbitan surat & pembaruan catatan internal']
      },
      {
        id: 'LYN-07', code: 'SBM', kategori: 'Status Sipil',
        name: 'Surat Keterangan Belum Menikah',
        desc: 'Surat keterangan status belum pernah menikah untuk keperluan pekerjaan, beasiswa, atau persiapan administrasi KUA/Catatan Sipil.',
        onlineEnabled: false, allowCitizenDownload: false,
        estimate: '1–2 Hari Kerja (Tatap Muka)', fee: 'Gratis (Rp 0)',
        hours: 'Senin–Jumat, 08.00–15.00 WIB', location: 'Loket Pelayanan Kantor Desa',
        pic: 'Budi Santoso (Kasi Pelayanan)',
        requirements: ['KTP Asli & KK Pemohon', 'Surat Pernyataan Bermeterai Pemohon', 'Surat Pengantar RT/RW'],
        steps: ['Warga menyiapkan pengantar RT/RW & surat pernyataan', 'Datang langsung ke loket pelayanan untuk verifikasi tatap muka', 'Petugas mencatat pengajuan atas nama warga (BR-S14) agar arsip seragam']
      },
      {
        id: 'LYN-08', code: 'SKP', kategori: 'Kependudukan',
        name: 'Surat Pengantar Pindah Domisili',
        desc: 'Pengantar pindah antar desa/kecamatan/kabupaten sebelum diproses penerbitan SKPWNI oleh Dukcapil.',
        onlineEnabled: false, allowCitizenDownload: false,
        estimate: '2 Hari Kerja (Tatap Muka)', fee: 'Gratis (Rp 0)',
        hours: 'Senin–Jumat, 08.00–15.00 WIB', location: 'Loket Pelayanan Kantor Desa',
        pic: 'Budi Santoso (Kasi Pelayanan)',
        requirements: ['KK & KTP Asli Pemohon', 'Alamat lengkap tujuan pindah', 'Surat Pengantar RT/RW'],
        steps: ['Hadir di kantor desa membawa dokumen asli', 'Pencocokan data kependudukan internal', 'Penerbitan surat pengantar pindah ke Kecamatan/Dukcapil']
      }
    ],

    requests: [
      {
        id: 'REQ-101', regNo: 'REG-2026-A9C4X', serviceId: 'LYN-01', serviceName: 'Surat Keterangan Domisili',
        applicantName: 'Rahmat Hidayat (Contoh)', nikMasked: '3201••••••••0001', dob: '1991-04-14',
        phone: '0812-1111-0001', email: 'rahmat.contoh@mail.test', address: 'Dusun Krajan RT 02 / RW 01',
        purpose: 'Persyaratan pembukaan rekening dan administrasi kerja',
        status: 'Diajukan', subStatus: '', channel: 'Online',
        submittedAt: '20 Nov 2026, 09:15', updatedAt: '20 Nov 2026, 09:15',
        assignedTo: '-', residentId: 'PDD-01', letterNumber: '', pdfReady: false,
        docs: ['KTP_Rahmat_Contoh.jpg (1.1 MB)', 'KK_Rahmat_Contoh.pdf (840 KB)', 'Pengantar_RT02.jpg (620 KB)'],
        reasonNote: '',
        history: [
          { at: '20 Nov 2026, 09:15', actor: 'Pemohon (Online)', from: '-', to: 'Diajukan', note: 'Formulir & 3 berkas persyaratan dikirim via Website Publik.' }
        ]
      },
      {
        id: 'REQ-102', regNo: 'REG-2026-K7M4P', serviceId: 'LYN-02', serviceName: 'Surat Keterangan Usaha (SKU)',
        applicantName: 'Sri Wahyuni (Contoh)', nikMasked: '3201••••••••0002', dob: '1988-09-21',
        phone: '0813-2222-0002', email: 'sri.wahyuni@mail.test', address: 'Dusun Sawah Indah RT 04 / RW 02',
        purpose: 'Pengajuan modal UMKM Keripik Singkong Sawah Indah',
        status: 'Menunggu Verifikasi', subStatus: '', channel: 'Online',
        submittedAt: '19 Nov 2026, 14:20', updatedAt: '19 Nov 2026, 14:22',
        assignedTo: 'Budi Santoso', residentId: 'PDD-02', letterNumber: '', pdfReady: false,
        docs: ['KTP_Sri_Contoh.jpg (950 KB)', 'Foto_Lapak_Usaha.jpg (1.4 MB)', 'Pengantar_RT04.jpg (510 KB)'],
        reasonNote: '',
        history: [
          { at: '19 Nov 2026, 14:20', actor: 'Pemohon (Online)', from: '-', to: 'Diajukan', note: 'Pengajuan diterima sistem.' },
          { at: '19 Nov 2026, 14:22', actor: 'Sistem', from: 'Diajukan', to: 'Menunggu Verifikasi', note: 'Masuk antrean verifikasi Petugas Pelayanan.' }
        ]
      },
      {
        id: 'REQ-103', regNo: 'REG-2026-P3R8N', serviceId: 'LYN-03', serviceName: 'Surat Keterangan Tidak Mampu (SKTM)',
        applicantName: 'Slamet Mulyono (Contoh)', nikMasked: '3201••••••••0003', dob: '1975-06-05',
        phone: '0856-3333-0003', email: '', address: 'Dusun Bukit Makmur RT 01 / RW 01',
        purpose: 'Pengajuan keringanan biaya pendidikan anak di SMK',
        status: 'Perlu Perbaikan', subStatus: '', channel: 'Online',
        submittedAt: '18 Nov 2026, 10:05', updatedAt: '18 Nov 2026, 15:40',
        assignedTo: 'Budi Santoso', residentId: 'PDD-03', letterNumber: '', pdfReady: false,
        docs: ['KTP_Slamet_Contoh.jpg (880 KB)', 'Pengantar_RT_Buram.jpg (410 KB)'],
        reasonNote: 'Foto Surat Pengantar RT/RW kurang terbaca dan stempel RT terpotong. Mohon unggah ulang foto pengantar RT/RW yang jelas beserta fotokopi KK.',
        history: [
          { at: '18 Nov 2026, 10:05', actor: 'Pemohon (Online)', from: '-', to: 'Diajukan', note: 'Pengajuan dikirim tanpa email (melacak lewat Cek Status).' },
          { at: '18 Nov 2026, 10:10', actor: 'Sistem', from: 'Diajukan', to: 'Menunggu Verifikasi', note: 'Masuk antrean petugas.' },
          { at: '18 Nov 2026, 15:40', actor: 'Budi Santoso (Petugas Pelayanan)', from: 'Menunggu Verifikasi', to: 'Perlu Perbaikan', note: 'Foto Surat Pengantar RT/RW kurang terbaca dan stempel RT terpotong. Mohon unggah ulang.' }
        ]
      },
      {
        id: 'REQ-104', regNo: 'REG-2026-D5W2Q', serviceId: 'LYN-04', serviceName: 'Surat Pengantar (SKCK / KTP / KK)',
        applicantName: 'Fajar Nugroho (Contoh)', nikMasked: '3201••••••••0004', dob: '1999-11-12',
        phone: '0812-4444-0004', email: 'fajar.n@mail.test', address: 'Dusun Sumber Jaya RT 03 / RW 02',
        purpose: 'Pengantar pengurusan SKCK di Polsek setempat',
        status: 'Sedang Diproses', subStatus: 'Menunggu Persetujuan Pejabat', channel: 'Online',
        submittedAt: '18 Nov 2026, 08:30', updatedAt: '19 Nov 2026, 11:10',
        assignedTo: 'Budi Santoso', residentId: 'PDD-04', letterNumber: '', pdfReady: false,
        docs: ['KTP_Fajar_Contoh.jpg (920 KB)', 'KK_Fajar_Contoh.pdf (1.0 MB)', 'Pengantar_RT03.jpg (710 KB)'],
        reasonNote: '',
        draftContent: 'Draf Surat Pengantar SKCK telah disusun dari template resmi dan menunggu persetujuan Kepala Desa.',
        history: [
          { at: '18 Nov 2026, 08:30', actor: 'Pemohon (Online)', from: '-', to: 'Diajukan', note: 'Berkas diterima.' },
          { at: '18 Nov 2026, 09:45', actor: 'Budi Santoso (Petugas Pelayanan)', from: 'Menunggu Verifikasi', to: 'Sedang Diproses', note: 'Berkas lengkap, dicocokkan dengan data penduduk Dusun Sumber Jaya, draf diajukan ke Kepala Desa.' }
        ]
      },
      {
        id: 'REQ-105', regNo: 'REG-2026-V8L1T', serviceId: 'LYN-05', serviceName: 'Surat Keterangan Kelahiran (Pengantar Akta)',
        applicantName: 'Rina Kurniawati (Contoh)', nikMasked: '3201••••••••0005', dob: '1994-02-19',
        phone: '0819-5555-0005', email: 'rina.k@mail.test', address: 'Dusun Krajan RT 05 / RW 02',
        purpose: 'Pengantar pengurusan Akta Kelahiran anak kedua',
        status: 'Disetujui', subStatus: '', channel: 'Online',
        submittedAt: '17 Nov 2026, 13:15', updatedAt: '19 Nov 2026, 16:00',
        assignedTo: 'Budi Santoso', residentId: 'PDD-05', letterNumber: '', pdfReady: false,
        docs: ['Ket_Lahir_Bidan.pdf (680 KB)', 'KK_Rina_Contoh.pdf (920 KB)', 'Buku_Nikah_Contoh.jpg (1.2 MB)'],
        reasonNote: 'Disetujui oleh Kepala Desa untuk segera diberi nomor surat dan diterbitkan.',
        history: [
          { at: '17 Nov 2026, 13:15', actor: 'Pemohon (Online)', from: '-', to: 'Diajukan', note: 'Permohonan masuk.' },
          { at: '17 Nov 2026, 16:00', actor: 'Budi Santoso', from: 'Menunggu Verifikasi', to: 'Sedang Diproses', note: 'Berkas diverifikasi lengkap.' },
          { at: '19 Nov 2026, 16:00', actor: 'H. Ahmad Subandi (Kepala Desa)', from: 'Sedang Diproses', to: 'Disetujui', note: 'Disetujui Kepala Desa.' }
        ]
      },
      {
        id: 'REQ-106', regNo: 'REG-2026-X2Z9M', serviceId: 'LYN-02', serviceName: 'Surat Keterangan Usaha (SKU)',
        applicantName: 'Dedi Setiawan (Contoh)', nikMasked: '3201••••••••0006', dob: '1990-01-25',
        phone: '0852-6666-0006', email: '', address: 'Luar Desa (Kecamatan Tetangga)',
        purpose: 'Pengajuan SKU untuk toko di kecamatan tetangga',
        status: 'Ditolak', subStatus: '', channel: 'Online',
        submittedAt: '15 Nov 2026, 11:00', updatedAt: '16 Nov 2026, 09:30',
        assignedTo: 'Budi Santoso', residentId: '', letterNumber: '', pdfReady: false,
        docs: ['KTP_Dedi_Contoh.jpg (900 KB)'],
        reasonNote: 'Alamat domisili KTP dan lokasi usaha pemohon berada di luar wilayah administrasi Desa [Nama Desa]. Silakan mengurus SKU di pemerintah desa setempat sesuai lokasi usaha.',
        history: [
          { at: '15 Nov 2026, 11:00', actor: 'Pemohon (Online)', from: '-', to: 'Diajukan', note: 'Pengajuan diterima.' },
          { at: '16 Nov 2026, 09:30', actor: 'Budi Santoso (Petugas Pelayanan)', from: 'Menunggu Verifikasi', to: 'Ditolak', note: 'Ditolak: Lokasi usaha di luar wilayah desa.' }
        ]
      },
      {
        id: 'REQ-107', regNo: 'REG-2026-T4H6B', serviceId: 'LYN-01', serviceName: 'Surat Keterangan Domisili',
        applicantName: 'Siti Rahmawati (Contoh)', nikMasked: '3201••••••••0007', dob: '1996-07-08',
        phone: '0813-7777-0007', email: 'siti.r@mail.test', address: 'Dusun Sawah Indah RT 02 / RW 01',
        purpose: 'Keperluan administrasi beasiswa pascasarjana',
        status: 'Selesai / Diterbitkan', subStatus: '', channel: 'Online',
        submittedAt: '12 Nov 2026, 09:00', updatedAt: '14 Nov 2026, 10:15',
        assignedTo: 'Budi Santoso', residentId: 'PDD-07', letterNumber: '470/042/DS-XI/2026', pdfReady: true,
        archiveId: 'ARS-012',
        docs: ['KTP_SitiR_Contoh.jpg (890 KB)', 'KK_SitiR_Contoh.pdf (780 KB)', 'Pengantar_RT02.jpg (540 KB)'],
        reasonNote: 'Surat terbit dengan nomor 470/042/DS-XI/2026 dan otomatis tercatat di Arsip Persuratan.',
        history: [
          { at: '12 Nov 2026, 09:00', actor: 'Pemohon (Online)', from: '-', to: 'Diajukan', note: 'Permohonan masuk.' },
          { at: '12 Nov 2026, 13:20', actor: 'Budi Santoso', from: 'Menunggu Verifikasi', to: 'Sedang Diproses', note: 'Data diverifikasi & draf dibuat.' },
          { at: '13 Nov 2026, 11:00', actor: 'H. Ahmad Subandi (Kepala Desa)', from: 'Sedang Diproses', to: 'Disetujui', note: 'Disetujui.' },
          { at: '14 Nov 2026, 10:15', actor: 'Budi Santoso (Petugas Pelayanan)', from: 'Disetujui', to: 'Selesai / Diterbitkan', note: 'Nomor 470/042/DS-XI/2026 dialokasikan, PDF diterbitkan, otomatis masuk Arsip (ARS-012).' }
        ]
      },
      {
        id: 'REQ-108', regNo: 'REG-2026-M1N7K', serviceId: 'LYN-07', serviceName: 'Surat Keterangan Belum Menikah',
        applicantName: 'Adi Nugroho (Contoh)', nikMasked: '3201••••••••0008', dob: '1997-03-17',
        phone: '0821-8888-0008', email: '', address: 'Dusun Krajan RT 04 / RW 02',
        purpose: 'Persyaratan administrasi melamar pekerjaan BUMN',
        status: 'Selesai / Diterbitkan', subStatus: '', channel: 'Tatap Muka (BR-S14)',
        submittedAt: '10 Nov 2026, 10:30', updatedAt: '11 Nov 2026, 14:10',
        assignedTo: 'Budi Santoso', residentId: 'PDD-08', letterNumber: '474/041/DS-XI/2026', pdfReady: true,
        archiveId: 'ARS-011',
        docs: ['KTP_Adi_TatapMuka.jpg (700 KB)', 'Pernyataan_Bermeterai.pdf (450 KB)'],
        reasonNote: 'Dicatat oleh petugas dari loket tatap muka dan telah diambil fisik oleh pemohon.',
        history: [
          { at: '10 Nov 2026, 10:30', actor: 'Budi Santoso (Loket Tatap Muka)', from: '-', to: 'Diajukan', note: 'Dicatat atas nama warga yang hadir langsung di kantor desa.' },
          { at: '11 Nov 2026, 14:10', actor: 'H. Ahmad Subandi & Budi Santoso', from: 'Disetujui', to: 'Selesai / Diterbitkan', note: 'Diterbitkan dengan nomor 474/041/DS-XI/2026.' }
        ]
      }
    ],

    templates: [
      { id: 'TPL-01', code: 'SKD', name: 'Template Surat Keterangan Domisili', klasifikasiKode: '470', penandatangan: 'Kepala Desa', body: 'Yang bertanda tangan di bawah ini Kepala Desa [Nama Desa], Kecamatan [Nama Kecamatan], Kabupaten [Nama Kabupaten], menerangkan bahwa:\n\nNama: {{NAMA}}\nNIK: {{NIK_MASKED}}\nTempat/Tgl Lahir: {{TTL}}\nAlamat: {{ALAMAT}}\n\nAdalah benar warga yang berdomisili di wilayah Desa [Nama Desa] sesuai keterangan RT/RW setempat. Surat ini diterbitkan untuk keperluan: {{KEPERLUAN}}.' },
      { id: 'TPL-02', code: 'SKU', name: 'Template Surat Keterangan Usaha', klasifikasiKode: '503', penandatangan: 'Kepala Desa / Sekdes a.n Kades', body: 'Yang bertanda tangan di bawah ini Kepala Desa [Nama Desa] menerangkan bahwa warga bernama {{NAMA}} ({{ALAMAT}}) benar menjalankan kegiatan usaha di wilayah Desa [Nama Desa]. Surat ini dipergunakan untuk: {{KEPERLUAN}}.' },
      { id: 'TPL-03', code: 'SKTM', name: 'Template Surat Keterangan Tidak Mampu', klasifikasiKode: '401', penandatangan: 'Kepala Desa', body: 'Berdasarkan keterangan RT/RW dan verifikasi petugas desa, diterangkan bahwa {{NAMA}} yang beralamat di {{ALAMAT}} termasuk keluarga kurang mampu di wilayah Desa [Nama Desa] dan memerlukan surat ini untuk: {{KEPERLUAN}}.' },
      { id: 'TPL-04', code: 'SPG', name: 'Template Surat Pengantar Umum', klasifikasiKode: '331', penandatangan: 'Kepala Desa / Kasi Pelayanan', body: 'Pemerintah Desa [Nama Desa] memberikan pengantar kepada {{NAMA}} ({{ALAMAT}}) guna keperluan pengurusan administrasi: {{KEPERLUAN}} pada instansi terkait.' },
      { id: 'TPL-05', code: 'SKL', name: 'Template Pengantar Kelahiran', klasifikasiKode: '472.11', penandatangan: 'Kepala Desa', body: 'Menerangkan peristiwa kelahiran atas permohonan {{NAMA}} ({{ALAMAT}}) sesuai dokumen bidan/rumah sakit terlampir untuk pengurusan Akta Kelahiran di Dukcapil.' },
      { id: 'TPL-06', code: 'SBM', name: 'Template Keterangan Belum Menikah', klasifikasiKode: '474', penandatangan: 'Kepala Desa', body: 'Menerangkan bahwa {{NAMA}} ({{ALAMAT}}) menurut catatan desa hingga tanggal diterbitkannya surat ini berstatus belum pernah menikah. Dipergunakan untuk: {{KEPERLUAN}}.' }
    ],

    numberingConfig: {
      pattern: '{KODE}/{URUT}/{DESA}-{BULAN_ROMAWI}/{TAHUN}',
      kodeDesa: 'DS',
      nextSequence: 43,
      resetPolicy: 'Reset tahunan setiap 1 Januari (sesuai aturan desa)',
      padDigits: 3,
      sample: '470/043/DS-XI/2026'
    },

    archives: [
      { id: 'ARS-012', number: '470/042/DS-XI/2026', category: 'Surat Keterangan Terbit', subject: 'SK Domisili a.n. Siti Rahmawati (Contoh)', letterDate: '2026-11-14', ioDate: '2026-11-14', party: 'Siti Rahmawati (Warga)', pic: 'Budi Santoso', access: 'Terbatas', sourceReq: 'REG-2026-T4H6B', note: 'Arsip otomatis dari Pengajuan Surat Online.' },
      { id: 'ARS-011', number: '474/041/DS-XI/2026', category: 'Surat Keterangan Terbit', subject: 'SK Belum Menikah a.n. Adi Nugroho (Contoh)', letterDate: '2026-11-11', ioDate: '2026-11-11', party: 'Adi Nugroho (Warga)', pic: 'Budi Santoso', access: 'Terbatas', sourceReq: 'REG-2026-M1N7K', note: 'Arsip otomatis dari Pengajuan Tatap Muka.' },
      { id: 'ARS-010', number: '005/118/KEC/XI/2026', category: 'Surat Masuk', subject: 'Undangan Rapat Koordinasi Sinkronisasi Data Kecamatan', letterDate: '2026-11-08', ioDate: '2026-11-09', party: 'Kantor Kecamatan [Nama Kecamatan]', pic: 'Nurul Hidayah', access: 'Umum Internal', sourceReq: '', note: 'Diterima lewat kurir kecamatan, didisposisikan ke Sekdes.' },
      { id: 'ARS-009', number: '141/019/DS-XI/2026', category: 'Surat Keputusan', subject: 'SK Kepala Desa tentang Tim Pengelola Website & Informasi Desa', letterDate: '2026-11-02', ioDate: '2026-11-02', party: 'Pemerintah Desa', pic: 'Drs. Wahyu Hidayat', access: 'Umum Internal', sourceReq: '', note: 'SK Penunjukan operator & admin website.' },
      { id: 'ARS-008', number: '005/038/DS-X/2026', category: 'Surat Undangan', subject: 'Undangan Musyawarah Desa Penetapan RKPDes 2027', letterDate: '2026-10-25', ioDate: '2026-10-25', party: 'BPD, Ketua RT/RW, Tokoh Masyarakat', pic: 'Nurul Hidayah', access: 'Umum Internal', sourceReq: '', note: 'Terkait pengumuman musyawarah desa.' },
      { id: 'ARS-007', number: '090/037/DS-X/2026', category: 'Surat Tugas', subject: 'Surat Tugas Pendataan Irigasi Dusun Sawah Indah', letterDate: '2026-10-19', ioDate: '2026-10-19', party: 'Kaur Perencanaan & Kadus', pic: 'Nurul Hidayah', access: 'Umum Internal', sourceReq: '', note: 'Dokumentasi survei saluran tersier.' },
      { id: 'ARS-006', number: '412/036/DS-X/2026', category: 'Surat Keluar', subject: 'Penyampaian Laporan Realisasi Penyaluran BLT Dana Desa TW III', letterDate: '2026-10-12', ioDate: '2026-10-12', party: 'Dinas PMD Kabupaten', pic: 'Hendra Wijaya', access: 'Rahasia', sourceReq: '', note: 'Berisi lampiran daftar verifikasi penerima internal (akses dibatasi).' },
      { id: 'ARS-005', number: '900/035/DS-X/2026', category: 'Dokumen Persuratan Lainnya', subject: 'Berita Acara Serah Terima Hasil Pembangunan Jalan Usaha Tani', letterDate: '2026-10-04', ioDate: '2026-10-04', party: 'TPK & Pemerintah Desa', pic: 'Nurul Hidayah', access: 'Umum Internal', sourceReq: '', note: 'Dilampiri foto dokumentasi progres 100%.' }
    ],

    residents: [
      { id: 'PDD-01', nik: '3201011404910001', kk: '3201010101150011', name: 'Rahmat Hidayat (Contoh)', ttl: '[Kabupaten], 14 Apr 1991', gender: 'L', dusun: 'Dusun Krajan', rw: '01', rt: '02', address: 'Jl. Melati No. 12', education: 'SMA / SMK', job: 'Karyawan Swasta', marital: 'Kawin', status: 'Aktif', updatedAt: '2026-11-10', history: ['10 Nov 2026: Pembaruan pekerjaan oleh Dewi Lestari'] },
      { id: 'PDD-02', nik: '3201016109880002', kk: '3201010203120024', name: 'Sri Wahyuni (Contoh)', ttl: '[Kabupaten], 21 Sep 1988', gender: 'P', dusun: 'Dusun Sawah Indah', rw: '02', rt: '04', address: 'Blok Cempaka No. 5', education: 'SMA / SMK', job: 'Wiraswasta / UMKM', marital: 'Kawin', status: 'Aktif', updatedAt: '2026-11-05', history: ['05 Nov 2026: Verifikasi data UMKM oleh Dewi Lestari'] },
      { id: 'PDD-03', nik: '3201010506750003', kk: '3201010305080032', name: 'Slamet Mulyono (Contoh)', ttl: '[Kabupaten], 05 Jun 1975', gender: 'L', dusun: 'Dusun Bukit Makmur', rw: '01', rt: '01', address: 'Bukit Makmur RT 01', education: 'SD / Sederajat', job: 'Petani / Pekebun', marital: 'Kawin', status: 'Aktif', updatedAt: '2026-10-20', history: ['20 Okt 2026: Data diimpor dari rekap dusun'] },
      { id: 'PDD-04', nik: '3201011211990004', kk: '3201010408140045', name: 'Fajar Nugroho (Contoh)', ttl: '[Kabupaten], 12 Nov 1999', gender: 'L', dusun: 'Dusun Sumber Jaya', rw: '02', rt: '03', address: 'Sumber Jaya RT 03', education: 'Diploma / Sarjana', job: 'Wiraswasta / UMKM', marital: 'Belum Kawin', status: 'Aktif', updatedAt: '2026-10-15', history: ['15 Okt 2026: Pembaruan pendidikan terakhir'] },
      { id: 'PDD-05', nik: '3201015902940005', kk: '3201010501190051', name: 'Rina Kurniawati (Contoh)', ttl: '[Kabupaten], 19 Feb 1994', gender: 'P', dusun: 'Dusun Krajan', rw: '02', rt: '05', address: 'Krajan Timur No. 9', education: 'SMA / SMK', job: 'Ibu Rumah Tangga & Pelajar', marital: 'Kawin', status: 'Aktif', updatedAt: '2026-11-12', history: ['12 Nov 2026: Pencocokan pengajuan SK Kelahiran'] },
      { id: 'PDD-07', nik: '3201014807960007', kk: '3201010709100077', name: 'Siti Rahmawati (Contoh)', ttl: '[Kabupaten], 08 Jul 1996', gender: 'P', dusun: 'Dusun Sawah Indah', rw: '01', rt: '02', address: 'Jl. Padi No. 18', education: 'Diploma / Sarjana', job: 'Karyawan Swasta', marital: 'Belum Kawin', status: 'Aktif', updatedAt: '2026-11-14', history: ['14 Nov 2026: Tertaut ke SK Domisili REG-2026-T4H6B'] },
      { id: 'PDD-08', nik: '3201011703970008', kk: '3201010811110083', name: 'Adi Nugroho (Contoh)', ttl: '[Kabupaten], 17 Mar 1997', gender: 'L', dusun: 'Dusun Krajan', rw: '02', rt: '04', address: 'Jl. Balai Desa Gg. II', education: 'Diploma / Sarjana', job: 'Karyawan Swasta', marital: 'Belum Kawin', status: 'Aktif', updatedAt: '2026-11-10', history: ['10 Nov 2026: Tertaut ke SK Belum Menikah'] },
      { id: 'PDD-09', nik: '3201014208620009', kk: '3201010903050091', name: 'Mbah Kartini (Contoh)', ttl: '[Kabupaten], 02 Agu 1962', gender: 'P', dusun: 'Dusun Bukit Makmur', rw: '02', rt: '05', address: 'Bukit Makmur RT 05', education: 'SD / Sederajat', job: 'Petani / Pekebun', marital: 'Cerai Mati', status: 'Aktif', updatedAt: '2026-10-28', history: ['28 Okt 2026: Tercatat sebagai penerima bantuan BLT'] },
      { id: 'PDD-10', nik: '3201012305800010', kk: '3201011007090104', name: 'Agus Santoso (Contoh)', ttl: '[Kabupaten], 23 Mei 1980', gender: 'L', dusun: 'Dusun Sumber Jaya', rw: '01', rt: '01', address: 'Sumber Jaya RT 01', education: 'SMP / Sederajat', job: 'Petani / Pekebun', marital: 'Kawin', status: 'Aktif', updatedAt: '2026-10-02', history: ['02 Okt 2026: Tercatat dari import tahap awal'] },
      { id: 'PDD-11', nik: '3201016412850011', kk: '3201011102130118', name: 'Yuniarti (Contoh)', ttl: '[Kabupaten], 24 Des 1985', gender: 'P', dusun: 'Dusun Sawah Indah', rw: '01', rt: '03', address: 'Sawah Indah RT 03', education: 'SMP / Sederajat', job: 'Wiraswasta / UMKM', marital: 'Kawin', status: 'Aktif', updatedAt: '2026-09-18', history: ['18 Sep 2026: Data awal tervalidasi'] },
      { id: 'PDD-12', nik: '3201010101580012', kk: '3201011201010122', name: 'Suparman (Contoh)', ttl: '[Kabupaten], 01 Jan 1958', gender: 'L', dusun: 'Dusun Krajan', rw: '03', rt: '08', address: 'Krajan Barat No. 3', education: 'SD / Sederajat', job: 'Petani / Pekebun', marital: 'Kawin', status: 'Nonaktif (Pindah)', updatedAt: '2026-09-01', history: ['01 Sep 2026: Status diubah menjadi Nonaktif karena masih direferensikan riwayat bantuan lama (BR-P07)'] }
    ],

    importPreviewRows: [
      { row: 1, nik: '3201011508920101', name: 'Hasan Basri (Impor Contoh)', dusun: 'Dusun Krajan', state: 'Valid', note: 'Format 16 digit valid, siap simpan.' },
      { row: 2, nik: '3201015204950102', name: 'Lina Marlina (Impor Contoh)', dusun: 'Dusun Sawah Indah', state: 'Valid', note: 'Format 16 digit valid, siap simpan.' },
      { row: 3, nik: '3201011404910001', name: 'Rahmat Hidayat (Contoh)', dusun: 'Dusun Krajan', state: 'Peringatan Ganda', note: 'NIK & Tgl Lahir cocok dengan PDD-01 (keputusan di operator).' },
      { row: 4, nik: '3201018899', name: 'Rudi Hartono (Error Contoh)', dusun: 'Dusun Bukit Makmur', state: 'Error Format', note: 'NIK hanya 10 digit (harus 16 angka). Baris tidak disimpan.' },
      { row: 5, nik: '3201012010830105', name: 'Taufik Hidayat (Impor Contoh)', dusun: 'Dusun Sumber Jaya', state: 'Valid', note: 'Format 16 digit valid, siap simpan.' },
      { row: 6, nik: '320101ABC0000106', name: 'Siska Amelia (Error Contoh)', dusun: 'Dusun Krajan', state: 'Error Format', note: 'NIK mengandung huruf. Baris tidak disimpan.' }
    ],

    aidPrograms: [
      { id: 'PRG-BLT', name: 'BLT Dana Desa', source: 'Dana Desa (APBD)', bentuk: 'Uang Tunai', unit: 'Rp 300.000 / bulan', publicPublish: true, desc: 'Bantuan Langsung Tunai bersumber dari Dana Desa sesuai penetapan Musyawarah Desa Khusus.', kuota: 85, disalurkan: 82 },
      { id: 'PRG-PKH', name: 'Program Keluarga Harapan (PKH)', source: 'Kementerian Sosial RI', bentuk: 'Transfer Non-Tunai', unit: 'Sesuai Komponen', publicPublish: true, desc: 'Program bantuan sosial bersyarat dari Pemerintah Pusat untuk keluarga terdaftar DTKS.', kuota: 120, disalurkan: 118 },
      { id: 'PRG-BPNT', name: 'BPNT / Program Sembako', source: 'Kementerian Sosial RI', bentuk: 'Saldo Pangan / Sembako', unit: 'Rp 200.000 / bulan', publicPublish: true, desc: 'Bantuan pangan non-tunai untuk pemenuhan kebutuhan pokok keluarga.', kuota: 165, disalurkan: 160 },
      { id: 'PRG-BERAS', name: 'Bantuan Cadangan Beras Pangan', source: 'Badan Pangan / Bulog', bentuk: 'Barang (Beras)', unit: '10 Kg / KPM', publicPublish: false, desc: 'Penyaluran beras cadangan pangan pemerintah (dalam tahap rekapitulasi internal sebelum dipublikasikan).', kuota: 210, disalurkan: 194 }
    ],

    aidPeriods: [
      { id: 'PER-2026-T3', label: 'Triwulan III 2026 (Jul–Sep)', status: 'Selesai', dateRange: '01 Jul 2026 – 30 Sep 2026' },
      { id: 'PER-2026-T4', label: 'Triwulan IV 2026 (Okt–Des)', status: 'Aktif Berjalan', dateRange: '01 Okt 2026 – 31 Des 2026' },
      { id: 'PER-2026-NOV', label: 'Tahap November 2026', status: 'Aktif Berjalan', dateRange: '01 Nov 2026 – 30 Nov 2026' }
    ],

    aidRecipients: [
      { id: 'BNT-01', residentId: 'PDD-03', residentName: 'Slamet Mulyono (Contoh)', dusun: 'Dusun Bukit Makmur', programId: 'PRG-BLT', periodId: 'PER-2026-T4', distDate: '2026-11-05', bentuk: 'Uang Tunai', amount: 'Rp 900.000 (3 bln)', status: 'Disalurkan', verifyRef: 'BA Musdesus No. 04/2026', hasProof: true },
      { id: 'BNT-02', residentId: 'PDD-09', residentName: 'Mbah Kartini (Contoh)', dusun: 'Dusun Bukit Makmur', programId: 'PRG-BLT', periodId: 'PER-2026-T4', distDate: '2026-11-05', bentuk: 'Uang Tunai', amount: 'Rp 900.000 (3 bln)', status: 'Disalurkan', verifyRef: 'BA Musdesus No. 04/2026', hasProof: true },
      { id: 'BNT-03', residentId: 'PDD-10', residentName: 'Agus Santoso (Contoh)', dusun: 'Dusun Sumber Jaya', programId: 'PRG-BPNT', periodId: 'PER-2026-T4', distDate: '2026-11-08', bentuk: 'Sembako', amount: 'Rp 200.000', status: 'Disalurkan', verifyRef: 'Daftar SK Kemensos T4', hasProof: false },
      { id: 'BNT-04', residentId: 'PDD-11', residentName: 'Yuniarti (Contoh)', dusun: 'Dusun Sawah Indah', programId: 'PRG-PKH', periodId: 'PER-2026-T4', distDate: '-', bentuk: 'Non-Tunai', amount: 'Sesuai Komponen', status: 'Belum Disalurkan', verifyRef: 'SK Kemensos T4/2026', hasProof: false },
      { id: 'BNT-05', residentId: 'PDD-09', residentName: 'Mbah Kartini (Contoh)', dusun: 'Dusun Bukit Makmur', programId: 'PRG-BERAS', periodId: 'PER-2026-NOV', distDate: '2026-11-12', bentuk: 'Beras', amount: '10 Kg', status: 'Disalurkan', verifyRef: 'Daftar Penerima Pangan Nov', hasProof: true },
      { id: 'BNT-06', residentId: 'PDD-03', residentName: 'Slamet Mulyono (Contoh)', dusun: 'Dusun Bukit Makmur', programId: 'PRG-BLT', periodId: 'PER-2026-T4', distDate: '-', bentuk: 'Uang Tunai', amount: 'Rp 900.000', status: 'Belum Disalurkan', verifyRef: 'Input ulang operator dusun (Peringatan Ganda!)', hasProof: false, duplicateWarning: true },
      { id: 'BNT-07', residentId: 'PDD-12', residentName: 'Suparman (Contoh)', dusun: 'Dusun Krajan', programId: 'PRG-BLT', periodId: 'PER-2026-T3', distDate: '-', bentuk: 'Uang Tunai', amount: 'Rp 900.000', status: 'Tidak Diambil', verifyRef: 'Penerima pindah domisili sebelum jadwal salur', hasProof: false }
    ],

    news: [
      { id: 'BRT-01', title: 'Peningkatan Jalan Usaha Tani Dusun Sawah Indah Rampung 100%', category: 'Pembangunan', author: 'Siti Aminah', date: '2026-11-16', updated: '2026-11-16', status: 'Dipublikasikan', scene: 'infra', tags: ['infrastruktur', 'pertanian', 'sawah indah'], summary: 'Perkerasan jalan usaha tani sepanjang 850 meter selesai dibangun guna memperlancar distribusi hasil panen warga.', body: 'Pemerintah Desa [Nama Desa] bersama Tim Pelaksana Kegiatan telah merampungkan peningkatan badan jalan usaha tani di Dusun Sawah Indah. Pekerjaan ini bersumber dari anggaran pembangunan desa tahun berjalan dan diawasi langsung oleh BPD serta perwakilan kelompok tani.\n\nDengan rampungnya jalan ini, kendaraan pengangkut hasil panen padi dan palawija kini dapat menjangkau area persawahan dengan lebih aman, terutama saat musim penghujan.' },
      { id: 'BRT-02', title: 'Pelayanan Posyandu Balita dan Lansia Digelar Serentak di Empat Dusun', category: 'Kesehatan', author: 'Siti Aminah', date: '2026-11-12', updated: '2026-11-12', status: 'Dipublikasikan', scene: 'health', tags: ['posyandu', 'kesehatan', 'balita'], summary: 'Kader kesehatan desa bersama bidan desa melaksanakan penimbangan, imunisasi, dan pemeriksaan tekanan darah lansia.', body: 'Kegiatan Posyandu rutin bulan November dilaksanakan bergiliran di empat dusun. Para ibu balita mendapat layanan pengukuran tinggi badan, berat badan, dan pemberian makanan tambahan bergizi.\n\nSelain balita, layanan pemeriksaan kesehatan dasar bagi warga lanjut usia turut dihadirkan agar pemantauan kesehatan warga terjaga secara berkala.' },
      { id: 'BRT-03', title: 'Pelatihan Kemasan Digital dan Pemasaran Online bagi Pelaku UMKM Desa', category: 'Ekonomi & UMKM', author: 'Siti Aminah', date: '2026-11-08', updated: '2026-11-09', status: 'Dipublikasikan', scene: 'umkm', tags: ['umkm', 'pelatihan', 'kerajinan'], summary: 'Sebanyak 35 pelaku usaha makanan olahan dan kerajinan bambu mengikuti pelatihan desain label produk.', body: 'Pelaku UMKM lokal di Desa [Nama Desa] mengikuti pendampingan pengemasan produk yang higienis dan menarik. Produk unggulan warga juga didokumentasikan untuk masuk ke dalam Katalog Potensi Desa agar mudah dikenal calon mitra dan pengunjung.' },
      { id: 'BRT-04', title: 'Panen Raya Padi Organik Kelompok Tani Sumber Makmur', category: 'Pertanian', author: 'Dewi Lestari', date: '2026-11-02', updated: '2026-11-02', status: 'Dipublikasikan', scene: 'agri', tags: ['panen', 'pertanian', 'organik'], summary: 'Produktivitas lahan demplot pertanian ramah lingkungan mencapai rata-rata 6,8 ton gabah kering panen per hektare.', body: 'Kelompok Tani Sumber Makmur menyelenggarakan panen raya bersama penyuluh pertanian dan perangkat desa. Penerapan pupuk kompos mandiri terbukti menjaga kesuburan tanah sekaligus menekan biaya produksi.' },
      { id: 'BRT-05', title: 'Sosialisasi Uji Coba Pengajuan Surat Online Tanpa Antre', category: 'Pemerintahan', author: 'Budi Santoso', date: '2026-10-28', updated: '2026-10-28', status: 'Dipublikasikan', scene: 'meet', tags: ['pelayanan', 'surat online'], summary: 'Warga kini dapat membaca syarat layanan surat secara terbuka dan mengajukan permohonan dari rumah.', body: 'Pemerintah desa memperkenalkan fitur layanan surat online yang terhubung langsung dengan antrean petugas pelayanan. Warga cukup menyiapkan foto persyaratan dan menyimpan nomor registrasi untuk mengecek status kapan saja.' },
      { id: 'BRT-06', title: 'Rencana Kerja Padat Karya Pembersihan Saluran Irigasi (Draf)', category: 'Pembangunan', author: 'Siti Aminah', date: '2026-11-25', updated: '2026-11-20', status: 'Terjadwal', scene: 'infra', tags: ['irigasi', 'padat karya'], summary: 'Artikel jadwal publikasi mendatang terkait agenda pembersihan saluran irigasi jelang musim tanam.', body: 'Konten terjadwal untuk dipublikasikan otomatis ketika tanggal publikasi tercapai.' }
    ],

    announcements: [
      { id: 'PGM-01', title: 'PENTING: Uji Coba Sistem Pengajuan Surat Online & Jam Loket Kantor Desa', category: 'Pelayanan', date: '2026-11-18', validUntil: '2026-12-31', important: true, status: 'Dipublikasikan', attachment: 'Panduan_Singkat_Ajukan_Surat.pdf', body: 'Diberitahukan kepada seluruh masyarakat Desa [Nama Desa] bahwa pengajuan layanan SK Domisili, SKU, SKTM, Pengantar, Kelahiran, dan Kematian kini dapat dilakukan secara online melalui menu Layanan Desa. Warga tetap dapat dilayani secara langsung (tatap muka) di Balai Desa setiap Senin–Jumat.' },
      { id: 'PGM-02', title: 'Jadwal Penyaluran Bantuan Beras Pangan Bulan November 2026', category: 'Bantuan Sosial', date: '2026-11-15', validUntil: '2026-11-30', important: true, status: 'Dipublikasikan', attachment: 'Jadwal_Per_Dusun_Nov2026.pdf', body: 'Pengambilan bantuan pangan bagi Keluarga Penerima Manfaat yang terdaftar oleh pihak berwenang dilayani di Balai Desa sesuai jadwal per dusun pada tanggal 22–24 November 2026 pukul 08.30–14.00 WIB dengan membawa KTP dan KK asli.' },
      { id: 'PGM-03', title: 'Undangan Kerja Bakti Pembersihan Lingkungan & Saluran Drainase', category: 'Agenda Desa', date: '2026-11-14', validUntil: '2026-11-29', important: false, status: 'Dipublikasikan', attachment: '', body: 'Mengundang warga RT/RW di empat dusun untuk berpartisipasi dalam kerja bakti bersama pada hari Minggu pagi pukul 07.00 WIB guna mengantisipasi genangan air musim hujan.' },
      { id: 'PGM-04', title: 'Pemberitahuan Pemeliharaan Jaringan Listrik Wilayah Bukit Makmur', category: 'Umum', date: '2026-11-10', validUntil: '2026-11-28', important: false, status: 'Dipublikasikan', attachment: 'Surat_Edaran_PLN_Contoh.jpg', body: 'Sesuai surat pemberitahuan instansi terkait, akan dilakukan pemeliharaan jaringan distribusi pada hari Selasa pukul 09.00–13.00 WIB di sebagian Dusun Bukit Makmur.' },
      { id: 'PGM-05', title: 'Musyawarah Desa Penetapan RKPDes Tahun 2027', category: 'Agenda Desa', date: '2026-10-15', validUntil: '2026-10-28', important: false, status: 'Diarsipkan', attachment: 'Undangan_Musdes_RKPDes.pdf', body: 'Pengumuman telah melewati batas waktu berlaku (otomatis dipindahkan dari daftar aktif ke arsip pengumuman sesuai BR-K02, namun tetap dapat dicari).' }
    ],

    potentials: [
      { id: 'POT-01', name: 'Beras Pandan Wangi Organik Sawah Indah', category: 'Pertanian', location: 'Dusun Sawah Indah', markerId: 'MAP-09', manager: 'Gapoktan Sumber Makmur', contact: '0812-3000-0101 (Kantor Gapoktan)', product: 'Beras Kemasan 5 kg & 10 kg', status: 'Dipublikasikan', scene: 'agri', desc: 'Budidaya padi varietas lokal dengan sistem pengairan irigasi teknis dan pemupukan kompos ramah lingkungan.' },
      { id: 'POT-02', name: 'Bukit Panorama & Taman Edukasi Embung Desa', category: 'Pariwisata', location: 'Dusun Bukit Makmur', markerId: 'MAP-07', manager: 'Pokdarwis Bukit Asri', contact: '@wisata.[namadesa]', product: 'Wisata Alam, Gazebo & Jalur Sepeda', status: 'Dipublikasikan', scene: 'tourism', desc: 'Kawasan wisata alam desa yang menyajikan pemandangan perbukitan hijau, embung air bersih, dan area UMKM kuliner warga.' },
      { id: 'POT-03', name: 'Sentra Anyaman Bambu & Kerajinan Tangan', category: 'Kerajinan dan produk unggulan', location: 'Dusun Krajan RW 03', markerId: 'MAP-10', manager: 'Paguyuban Perajin Krajan', contact: '0813-4000-0202', product: 'Besek Bambu, Tudung Saji, Lampu Hias', status: 'Dipublikasikan', scene: 'umkm', desc: 'Kerajinan anyaman bambu turun-temurun yang memasok kebutuhan kemasan ramah lingkungan dan dekorasi interior.' },
      { id: 'POT-04', name: 'UMKM Olahan Keripik Singkong & Gula Semut', category: 'UMKM dan industri lokal', location: 'Dusun Sumber Jaya', markerId: 'MAP-11', manager: 'Kelompok Usaha Bersama Sejahtera', contact: '0856-5000-0303', product: 'Keripik Aneka Rasa & Gula Aren', status: 'Dipublikasikan', scene: 'umkm', desc: 'Produk olahan pangan lokal berizin P-IRT yang dipasarkan di pasar desa dan toko oleh-oleh kabupaten.' },
      { id: 'POT-05', name: 'Budidaya Ikan Nila Kolam Air Deras', category: 'Perikanan', location: 'Dusun Sumber Jaya', markerId: 'MAP-12', manager: 'Pokdakan Tirta Jaya', contact: '0812-6000-0404', product: 'Ikan Nila Segar & Bibit Ikan', status: 'Dipublikasikan', scene: 'fish', desc: 'Memanfaatkan aliran sumber mata air jernih desa untuk pembesaran ikan konsumsi berkualitas.' },
      { id: 'POT-06', name: 'Kebun Kopi Robusta & Tanaman Kelapa', category: 'Perkebunan', location: 'Dusun Bukit Makmur', markerId: '', manager: 'Kelompok Tani Kebun Makmur', contact: 'Kontak Balai Desa', product: 'Biji Kopi Sangrai & Nira Kelapa', status: 'Dipublikasikan', scene: 'agri', desc: 'Lahan perkebunan rakyat di lereng bukit dengan ketinggian 185–320 mdpl.' },
      { id: 'POT-07', name: 'Peternakan Kambing Perah Terpadu', category: 'Peternakan', location: 'Dusun Sawah Indah', markerId: '', manager: 'Kelompok Ternak Mandiri', contact: 'Kontak Balai Desa', product: 'Susu Segar & Pupuk Kandang Kompos', status: 'Dipublikasikan', scene: 'agri', desc: 'Terintegrasi dengan kelompok tani dalam penyediaan pupuk organik padat.' },
      { id: 'POT-08', name: 'Sanggar Seni Karawitan & Tari Tradisional', category: 'Budaya dan tradisi', location: 'Dusun Krajan', markerId: '', manager: 'Sanggar Budaya Lestari', contact: '0815-7000-0505', product: 'Pertunjukan Seni & Pelatihan Pemuda', status: 'Dipublikasikan', scene: 'culture', desc: 'Melestarikan kesenian tradisional desa dan tampil pada acara peringatan hari besar serta festival budaya.' }
    ],

    mapConfig: {
      officialBoundaryAvailable: true,
      centerLabel: 'Desa [Nama Desa] (Koordinat Contoh)',
      disclaimer: 'Batas wilayah yang tampil hanya sebagai visualisasi dari berkas batas desa contoh. Batas resmi menunggu verifikasi data sah.'
    },

    mapMarkers: [
      { id: 'MAP-01', name: 'Kantor & Balai Desa [Nama Desa]', category: 'Kantor Desa', dusun: 'Dusun Krajan', x: 460, y: 270, coords: '-7.12345, 110.12345 (Contoh)', desc: 'Pusat pelayanan administrasi masyarakat dan ruang kerja perangkat desa.', hours: 'Senin–Jumat 08.00–15.00', potentialId: '' },
      { id: 'MAP-02', name: 'SDN 01 Desa [Nama Desa]', category: 'Sekolah', dusun: 'Dusun Krajan', x: 525, y: 220, coords: '-7.12110, 110.12680 (Contoh)', desc: 'Sekolah dasar negeri pusat di wilayah Krajan.', hours: '07.00–13.00', potentialId: '' },
      { id: 'MAP-03', name: 'PAUD & TK Harapan Bangsa', category: 'Sekolah', dusun: 'Dusun Sawah Indah', x: 315, y: 365, coords: '-7.12780, 110.11540 (Contoh)', desc: 'Layanan pendidikan anak usia dini.', hours: '07.30–11.00', potentialId: '' },
      { id: 'MAP-04', name: 'Polindes & Poskesdes Desa', category: 'Fasilitas Kesehatan', dusun: 'Dusun Krajan', x: 410, y: 315, coords: '-7.12520, 110.12010 (Contoh)', desc: 'Pelayanan kesehatan dasar ibu, anak, dan pemeriksaan rutin warga.', hours: '08.00–14.00', potentialId: '' },
      { id: 'MAP-05', name: 'Masjid Besar Al-Ikhlas', category: 'Tempat Ibadah', dusun: 'Dusun Krajan', x: 485, y: 325, coords: '-7.12580, 110.12490 (Contoh)', desc: 'Masjid utama desa untuk kegiatan keagamaan dan sosial.', hours: 'Terbuka setiap waktu', potentialId: '' },
      { id: 'MAP-06', name: 'Pasar Desa & Lapangan Olahraga', category: 'Fasilitas Umum', dusun: 'Dusun Sumber Jaya', x: 645, y: 350, coords: '-7.12690, 110.13320 (Contoh)', desc: 'Pusat transaksi hasil bumi dan kegiatan olahraga masyarakat.', hours: '05.30–14.00', potentialId: '' },
      { id: 'MAP-07', name: 'Bukit Panorama & Embung Wisata', category: 'Wisata', dusun: 'Dusun Bukit Makmur', x: 245, y: 155, coords: '-7.11650, 110.11120 (Contoh)', desc: 'Kawasan wisata alam dan taman edukasi air.', hours: '07.00–17.30', potentialId: 'POT-02' },
      { id: 'MAP-08', name: 'Air Terjun Mini Sumber Asri', category: 'Wisata', dusun: 'Dusun Bukit Makmur', x: 155, y: 195, coords: '-7.11890, 110.10650 (Contoh)', desc: 'Objek wisata alam aliran mata air pegunungan.', hours: '07.00–17.00', potentialId: '' },
      { id: 'MAP-09', name: 'Demplot Padi Organik Sawah Indah', category: 'Potensi Ekonomi', dusun: 'Dusun Sawah Indah', x: 250, y: 425, coords: '-7.13120, 110.11280 (Contoh)', desc: 'Area pertanian pangan unggulan beras Pandan Wangi organik.', hours: 'Aktivitas Tani', potentialId: 'POT-01' },
      { id: 'MAP-10', name: 'Sentra Anyaman Bambu Krajan', category: 'Potensi Ekonomi', dusun: 'Dusun Krajan', x: 560, y: 155, coords: '-7.11620, 110.12890 (Contoh)', desc: 'Galeri dan bengkel kerja perajin anyaman bambu.', hours: '08.00–16.00', potentialId: 'POT-03' },
      { id: 'MAP-11', name: 'Rumah Produksi UMKM Sumber Jaya', category: 'Potensi Ekonomi', dusun: 'Dusun Sumber Jaya', x: 735, y: 270, coords: '-7.12310, 110.13840 (Contoh)', desc: 'Produksi keripik singkong dan gula semut kemasan.', hours: '08.00–16.00', potentialId: 'POT-04' },
      { id: 'MAP-12', name: 'Kolam Budidaya Nila Tirta Jaya', category: 'Potensi Ekonomi', dusun: 'Dusun Sumber Jaya', x: 770, y: 405, coords: '-7.13010, 110.14020 (Contoh)', desc: 'Sentra perikanan air tawar Pokdakan Tirta Jaya.', hours: '07.00–16.30', potentialId: 'POT-05' }
    ],

    gallery: [
      { id: 'GAL-01', type: 'Foto', title: 'Peresmian Jalan Usaha Tani Dusun Sawah Indah', category: 'Pembangunan', date: '2026-11-16', location: 'Dusun Sawah Indah', status: 'Dipublikasikan', scene: 'infra', count: 4, desc: 'Dokumentasi penyerahan dan peninjauan hasil pembangunan jalan usaha tani bersama warga.', slides: ['Tampak ruas jalan baru', 'Peninjauan bersama BPD', 'Akses angkut hasil panen', 'Plang informasi kegiatan'] },
      { id: 'GAL-02', type: 'Foto', title: 'Pelayanan Posyandu Balita & Lansia Bulan November', category: 'Kegiatan Sosial', date: '2026-11-12', location: 'Balai Dusun Krajan', status: 'Dipublikasikan', scene: 'health', count: 3, desc: 'Kader kesehatan melayani penimbangan balita dan cek tensi lansia.', slides: ['Meja pendaftaran kader', 'Penimbangan balita', 'Konsultasi bidan desa'] },
      { id: 'GAL-03', type: 'Foto', title: 'Festival Panen Raya Padi Organik 2026', category: 'Pertanian & Ekonomi', date: '2026-11-02', location: 'Blok Sawah Indah', status: 'Dipublikasikan', scene: 'agri', count: 3, desc: 'Suasana kebersamaan petani saat panen raya padi varietas lokal.', slides: ['Hamparan padi menguning', 'Panen perdana bersama', 'Pameran beras kemasan'] },
      { id: 'GAL-04', type: 'Foto', title: 'Pameran Produk UMKM & Kerajinan Bambu', category: 'UMKM & Budaya', date: '2026-10-25', location: 'Halaman Balai Desa', status: 'Dipublikasikan', scene: 'umkm', count: 3, desc: 'Beragam produk anyaman bambu dan olahan makanan lokal warga desa.', slides: ['Stan kerajinan anyaman', 'Produk olahan keripik', 'Kunjungan mitra kabupaten'] },
      { id: 'GAL-05', type: 'Video', title: 'Video Profil Singkat Potensi Wisata Bukit Panorama', category: 'Wisata & Alam', date: '2026-10-18', location: 'Dusun Bukit Makmur', status: 'Dipublikasikan', scene: 'tourism', videoUrl: 'https://youtube.com/@pemdes-contoh', desc: 'Tautan video dokumentasi udara kawasan Embung dan Bukit Panorama (disimpan di layanan eksternal sesuai batasan sistem).', slides: [] },
      { id: 'GAL-06', type: 'Video', title: 'Panduan Singkat Pengajuan Surat Online bagi Warga', category: 'Edukasi Layanan', date: '2026-10-10', location: 'Loket Kantor Desa', status: 'Dipublikasikan', scene: 'meet', videoUrl: 'https://youtube.com/@pemdes-contoh', desc: 'Video tutorial langkah demi langkah mengajukan surat dan mengecek nomor registrasi dari rumah.', slides: [] },
      { id: 'GAL-07', type: 'Foto', title: 'Pentas Seni Karawitan HUT Desa', category: 'UMKM & Budaya', date: '2026-09-20', location: 'Lapangan Desa', status: 'Dipublikasikan', scene: 'culture', count: 2, desc: 'Penampilan sanggar seni tradisional oleh pemuda desa.', slides: ['Penampilan gamelan', 'Tari penyambutan tamu'] }
    ],

    users: [
      { id: 'USR-01', name: 'Raka Pratama', username: 'raka.admin', email: 'raka@[namadesa].desa.id', roles: ['super_admin'], active: true, lastLogin: '20 Nov 2026, 08:05' },
      { id: 'USR-02', name: 'H. Ahmad Subandi', username: 'kades.subandi', email: 'kades@[namadesa].desa.id', roles: ['kepala_desa'], active: true, lastLogin: '20 Nov 2026, 08:40' },
      { id: 'USR-03', name: 'Siti Aminah', username: 'siti.web', email: 'humas@[namadesa].desa.id', roles: ['admin_website'], active: true, lastLogin: '19 Nov 2026, 15:10' },
      { id: 'USR-04', name: 'Budi Santoso', username: 'budi.pelayanan', email: 'pelayanan@[namadesa].desa.id', roles: ['petugas_pelayanan', 'petugas_arsip'], active: true, lastLogin: '20 Nov 2026, 08:15' },
      { id: 'USR-05', name: 'Dewi Lestari', username: 'dewi.data', email: 'data@[namadesa].desa.id', roles: ['operator_data'], active: true, lastLogin: '19 Nov 2026, 13:45' },
      { id: 'USR-06', name: 'Hendra Wijaya', username: 'hendra.bantuan', email: 'kesra@[namadesa].desa.id', roles: ['petugas_bantuan'], active: true, lastLogin: '18 Nov 2026, 11:20' },
      { id: 'USR-07', name: 'Nurul Hidayah', username: 'nurul.arsip', email: 'arsip@[namadesa].desa.id', roles: ['petugas_arsip'], active: true, lastLogin: '20 Nov 2026, 08:50' }
    ],

    logs: [
      { id: 'LOG-109', time: '20 Nov 2026, 09:15', actor: 'Sistem (Publik)', action: 'Pengajuan Baru', target: 'Pengajuan REG-2026-A9C4X (SK Domisili)', detail: 'Diterima melalui formulir online publik' },
      { id: 'LOG-108', time: '20 Nov 2026, 08:40', actor: 'H. Ahmad Subandi', action: 'Login', target: 'Portal Admin Desa', detail: 'Berhasil masuk sebagai Kepala Desa' },
      { id: 'LOG-107', time: '19 Nov 2026, 16:00', actor: 'H. Ahmad Subandi', action: 'Persetujuan Surat', target: 'Pengajuan REG-2026-V8L1T', detail: 'Status diubah: Sedang Diproses → Disetujui' },
      { id: 'LOG-106', time: '19 Nov 2026, 11:10', actor: 'Budi Santoso', action: 'Verifikasi Berkas', target: 'Pengajuan REG-2026-D5W2Q', detail: 'Berkas lengkap, diajukan ke persetujuan Kepala Desa' },
      { id: 'LOG-105', time: '18 Nov 2026, 15:40', actor: 'Budi Santoso', action: 'Minta Perbaikan', target: 'Pengajuan REG-2026-P3R8N', detail: 'Status → Perlu Perbaikan (alasan tercatat)' },
      { id: 'LOG-104', time: '16 Nov 2026, 14:00', actor: 'Siti Aminah', action: 'Publikasi Berita', target: 'BRT-01 Peningkatan Jalan Usaha Tani', detail: 'Konten dipublikasikan ke halaman Home & Berita' },
      { id: 'LOG-103', time: '15 Nov 2026, 10:30', actor: 'H. Ahmad Subandi', action: 'Persetujuan Statistik', target: 'Snapshot Statistik Kependudukan', detail: 'Disetujui untuk tampilan agregat publik (3.420 jiwa)' },
      { id: 'LOG-102', time: '14 Nov 2026, 10:15', actor: 'Budi Santoso', action: 'Penerbitan & Arsip Otomatis', target: '470/042/DS-XI/2026 (ARS-012)', detail: 'PDF dibuat dan otomatis dicatat di Arsip Persuratan' }
    ],

    backups: [
      { id: 'BKP-03', time: '20 Nov 2026, 02:00 WIB', size: '42,8 MB', type: 'Otomatis Harian (DB + Dokumen Privat)', location: 'VPS + Penyimpanan Off-site', status: 'Berhasil & Teruji' },
      { id: 'BKP-02', time: '19 Nov 2026, 02:00 WIB', size: '42,5 MB', type: 'Otomatis Harian (DB + Dokumen Privat)', location: 'VPS + Penyimpanan Off-site', status: 'Berhasil' },
      { id: 'BKP-01', time: '18 Nov 2026, 02:00 WIB', size: '41,9 MB', type: 'Otomatis Harian (DB + Dokumen Privat)', location: 'VPS + Penyimpanan Off-site', status: 'Berhasil' }
    ],

    notifications: [
      { id: 'NTF-01', title: 'Pengajuan Baru Masuk', body: 'REG-2026-A9C4X (SK Domisili) menunggu verifikasi petugas.', time: 'Baru saja', target: 'persuratan', unread: true },
      { id: 'NTF-02', title: 'Draf Menunggu Persetujuan', body: 'REG-2026-D5W2Q (Surat Pengantar) siap disetujui Kepala Desa.', time: 'Kemarin', target: 'persuratan', unread: true },
      { id: 'NTF-03', title: 'Peringatan Data Ganda Bantuan', body: '1 catatan bantuan (BNT-06) terindikasi ganda pada BLT Dana Desa TW IV.', time: '2 hari lalu', target: 'bantuan', unread: true }
    ]
  };
})(window);
