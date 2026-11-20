/* ==========================================================================
   ILLUSTRATIONS — Custom Inline SVG Visuals (Navy / Emerald / Warm Earth)
   ========================================================================== */
(function (w) {
  'use strict';
  w.DesaApp = w.DesaApp || {};

  w.DesaApp.illustrations = {
    heroVillage: function () {
      return '<svg viewBox="0 0 460 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustrasi Balai Desa dan Persawahan">' +
        '<defs>' +
          '<linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="#E8EFF6"/><stop offset="100%" stop-color="#EEF6F3"/>' +
          '</linearGradient>' +
          '<linearGradient id="hillGrad" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="#1E7A5F"/><stop offset="100%" stop-color="#145340"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<rect width="460" height="300" rx="18" fill="url(#skyGrad)"/>' +
        '<circle cx="385" cy="58" r="26" fill="#FDE68A" opacity="0.9"/>' +
        '<path d="M0 190 Q110 110 230 170 T460 150 L460 300 L0 300 Z" fill="#A7D7C5"/>' +
        '<path d="M0 215 Q140 165 280 205 T460 190 L460 300 L0 300 Z" fill="url(#hillGrad)" opacity="0.88"/>' +
        '<path d="M0 250 Q160 220 330 255 T460 245 L460 300 L0 300 Z" fill="#1B3A5C" opacity="0.16"/>' +
        '<!-- Balai Desa -->' +
        '<rect x="135" y="152" width="190" height="86" rx="10" fill="#FFFFFF" stroke="#1B3A5C" stroke-width="2.5"/>' +
        '<polygon points="120,158 230,104 340,158" fill="#1B3A5C"/>' +
        '<polygon points="168,148 230,118 292,148" fill="#1E7A5F"/>' +
        '<rect x="210" y="184" width="40" height="54" rx="5" fill="#1B3A5C"/>' +
        '<rect x="155" y="176" width="32" height="28" rx="5" fill="#E8EFF6" stroke="#1B3A5C" stroke-width="1.5"/>' +
        '<rect x="273" y="176" width="32" height="28" rx="5" fill="#E8EFF6" stroke="#1B3A5C" stroke-width="1.5"/>' +
        '<rect x="122" y="236" width="216" height="10" rx="5" fill="#CBD5E1"/>' +
        '<!-- Flagpole -->' +
        '<line x1="78" y1="104" x2="78" y2="244" stroke="#1B3A5C" stroke-width="3" stroke-linecap="round"/>' +
        '<rect x="80" y="106" width="34" height="11" fill="#DC2626"/>' +
        '<rect x="80" y="117" width="34" height="11" fill="#FFFFFF"/>' +
        '<!-- Trees -->' +
        '<circle cx="48" cy="196" r="22" fill="#1E7A5F"/><rect x="45" y="212" width="6" height="32" rx="2" fill="#78350F"/>' +
        '<circle cx="400" cy="188" r="26" fill="#1E7A5F"/><rect x="396" y="208" width="7" height="36" rx="2" fill="#78350F"/>' +
        '<!-- Floating Badge -->' +
        '<rect x="20" y="20" width="166" height="34" rx="17" fill="#FFFFFF" opacity="0.94"/>' +
        '<circle cx="38" cy="37" r="6" fill="#1E7A5F"/>' +
        '<text x="52" y="41" font-family="Inter,sans-serif" font-size="11.5" font-weight="600" fill="#1B3A5C">Layanan Publik Terpadu</text>' +
      '</svg>';
    },

    cardScene: function (variant, title) {
      var themes = {
        infra: { bg: '#E8EFF6', accent: '#1B3A5C', soft: '#1E7A5F', label: 'Pembangunan' },
        agri: { bg: '#EEF6F3', accent: '#1E7A5F', soft: '#D97706', label: 'Pertanian & Pangan' },
        health: { bg: '#E5F1FF', accent: '#007AFF', soft: '#1E7A5F', label: 'Kesehatan & Sosial' },
        meet: { bg: '#FEF3C7', accent: '#D97706', soft: '#1B3A5C', label: 'Musyawarah Desa' },
        tourism: { bg: '#E6F4EF', accent: '#1E7A5F', soft: '#1B3A5C', label: 'Wisata & Alam' },
        umkm: { bg: '#FCE7F3', accent: '#1B3A5C', soft: '#D97706', label: 'UMKM & Kerajinan' },
        culture: { bg: '#EDE9FE', accent: '#1B3A5C', soft: '#1E7A5F', label: 'Budaya & Tradisi' },
        fish: { bg: '#E0F2FE', accent: '#0284C7', soft: '#1E7A5F', label: 'Perikanan' }
      };
      var t = themes[variant] || themes.agri;
      return '<svg viewBox="0 0 360 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (title || t.label) + '">' +
        '<rect width="360" height="210" fill="' + t.bg + '"/>' +
        '<circle cx="300" cy="48" r="46" fill="' + t.soft + '" opacity="0.14"/>' +
        '<circle cx="62" cy="170" r="64" fill="' + t.accent + '" opacity="0.1"/>' +
        '<path d="M0 155 Q95 110 190 148 T360 132 L360 210 L0 210 Z" fill="' + t.accent + '" opacity="0.18"/>' +
        '<path d="M0 174 Q120 145 240 170 T360 160 L360 210 L0 210 Z" fill="' + t.soft + '" opacity="0.25"/>' +
        '<rect x="22" y="20" width="128" height="26" rx="13" fill="#FFFFFF" opacity="0.92"/>' +
        '<text x="34" y="37" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="' + t.accent + '">' + t.label + '</text>' +
        '<rect x="134" y="68" width="92" height="68" rx="16" fill="#FFFFFF" opacity="0.95"/>' +
        '<circle cx="180" cy="95" r="14" fill="' + t.accent + '" opacity="0.16"/>' +
        '<rect x="154" y="116" width="52" height="7" rx="3.5" fill="' + t.soft + '" opacity="0.6"/>' +
      '</svg>';
    },

    avatar: function (initials, bgColor) {
      var bg = bgColor || '#1B3A5C';
      return '<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Foto Perangkat">' +
        '<rect width="96" height="96" rx="22" fill="' + bg + '"/>' +
        '<circle cx="48" cy="36" r="16" fill="rgba(255,255,255,0.22)"/>' +
        '<path d="M20 84 C20 65 76 65 76 84" fill="rgba(255,255,255,0.18)"/>' +
        '<text x="48" y="54" text-anchor="middle" font-family="Inter,sans-serif" font-size="24" font-weight="700" fill="#FFFFFF">' + (initials || 'PD') + '</text>' +
      '</svg>';
    }
  };
})(window);
