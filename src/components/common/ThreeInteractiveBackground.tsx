import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface ThreeInteractiveBackgroundProps {
  theme?: 'emerald' | 'cyan' | 'violet' | 'gold';
  density?: 'minimal' | 'balanced' | 'rich';
  autoRotate?: boolean;
  sensitivity?: number;
  interactive?: boolean;
  className?: string;
  showCinemaScreens?: boolean;
  activeCinemaIndex?: number;
  rollSpeedMultiplier?: number;
  continuousRoll?: boolean;
  onCinemaIndexChange?: (index: number) => void;
  onTelemetryChange?: (data: {
    yaw: number;
    pitch: number;
    roll: number;
    speed: number;
    isDragging: boolean;
  }) => void;
}

// Helper to draw crisp vector-sharp cinema screens onto HTML5 Canvas
function createCinemaCanvasTexture(
  screenIndex: number,
  primaryColor: string,
  secondaryColor: string,
  accentColor: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d')!;

  // 1. Deep frosted translucent background
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 640);
  bgGrad.addColorStop(0, 'rgba(6, 14, 28, 0.94)');
  bgGrad.addColorStop(0.5, 'rgba(8, 20, 36, 0.92)');
  bgGrad.addColorStop(1, 'rgba(4, 10, 22, 0.95)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 640);

  // 2. Fine holographic grid background
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1024; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 640);
    ctx.stroke();
  }
  for (let y = 0; y < 640; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // 3. Glowing border with sci-fi corner reticles
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, 992, 608);

  // Inner subtle neon glow
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(26, 26, 972, 588);

  // Corner brackets
  const cornerSize = 40;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 6;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(10, 10 + cornerSize);
  ctx.lineTo(10, 10);
  ctx.lineTo(10 + cornerSize, 10);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(1014 - cornerSize, 10);
  ctx.lineTo(1014, 10);
  ctx.lineTo(1014, 10 + cornerSize);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(10, 630 - cornerSize);
  ctx.lineTo(10, 630);
  ctx.lineTo(10 + cornerSize, 630);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(1014 - cornerSize, 630);
  ctx.lineTo(1014, 630);
  ctx.lineTo(1014, 630 - cornerSize);
  ctx.stroke();

  // Screen Content by Index
  if (screenIndex === 0) {
    // SCREEN 1: BERANDA & DASHBOARD
    // Top Badge
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText('LAYAR SINEMA 01 • BERANDA & EXECUTIVE DASHBOARD', 50, 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 38px system-ui, sans-serif';
    ctx.fillText('Ringkasan Eksekutif Likuiditas & Arus Kas', 50, 120);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText('Pantauan kas real-time, rasio margin, dan mutasi omzet operasional usaha.', 50, 155);

    // KPI Cards Row
    // Card 1: Saldo Kas Likuid
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(50, 190, 280, 140);
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 190, 280, 140);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('TOTAL SALDO KAS LIKUID', 70, 225);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 28px monospace';
    ctx.fillText('Rp 485.200.000', 70, 268);
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText('▲ +14.2% Bulan Ini', 70, 305);

    // Card 2: Uang Masuk Kasir
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(360, 190, 280, 140);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(360, 190, 280, 140);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('TOTAL PENDAPATAN / INFLOW', 380, 225);
    ctx.fillStyle = '#34d399';
    ctx.font = '900 28px monospace';
    ctx.fillText('Rp 124.500.000', 380, 268);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillText('148 Transaksi Kasir', 380, 305);

    // Card 3: Beban Keluar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(670, 190, 300, 140);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(670, 190, 300, 140);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('BEBAN & OUTFLOW', 690, 225);
    ctx.fillStyle = '#f87171';
    ctx.font = '900 28px monospace';
    ctx.fillText('Rp 58.300.000', 690, 268);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillText('Serapan 46.8% dari Pagu', 690, 305);

    // Mini Chart Visualization
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.fillRect(50, 355, 920, 150);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeRect(50, 355, 920, 150);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText('TREN ARUS KAS MINGGUAN (OKTOBER 2026)', 70, 385);

    // Draw bars
    const barData = [
      { masuk: 80, keluar: 40, label: 'Minggu 1' },
      { masuk: 95, keluar: 45, label: 'Minggu 2' },
      { masuk: 110, keluar: 55, label: 'Minggu 3' },
      { masuk: 124, keluar: 58, label: 'Minggu 4' },
    ];
    barData.forEach((b, idx) => {
      const baseX = 200 + idx * 190;
      // Inflow bar
      ctx.fillStyle = primaryColor;
      ctx.fillRect(baseX, 475 - b.masuk * 0.75, 40, b.masuk * 0.75);
      // Outflow bar
      ctx.fillStyle = '#f87171';
      ctx.fillRect(baseX + 46, 475 - b.keluar * 0.75, 40, b.keluar * 0.75);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText(b.label, baseX + 10, 495);
    });

    // Bottom Action Buttons Hologram
    ctx.fillStyle = primaryColor;
    ctx.fillRect(50, 535, 240, 55);
    ctx.fillStyle = '#021312';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('+ CATAT KAS BARU', 85, 570);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(310, 535, 220, 55);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('FILTER PERIODE ▼', 345, 570);
  } else if (screenIndex === 1) {
    // SCREEN 2: PERENCANAAN
    ctx.fillStyle = secondaryColor;
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText('LAYAR SINEMA 02 • PERENCANAAN & ANGGARAN (RAB)', 50, 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 38px system-ui, sans-serif';
    ctx.fillText('Target Omzet & Kalkulator Titik Impas (BEP)', 50, 120);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText('Perencanaan belanja operasional, batas risiko, dan target pendapatan bulanan.', 50, 155);

    // Target Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(50, 190, 440, 200);
    ctx.strokeStyle = secondaryColor;
    ctx.strokeRect(50, 190, 440, 200);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('TARGET PENJUALAN OKTOBER 2026', 75, 230);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 34px monospace';
    ctx.fillText('Rp 120.000.000', 75, 280);

    // Progress Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(75, 310, 390, 22);
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(75, 310, 390 * 0.88, 22);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText('Pencapaian: 88.4% (Tercapai)', 75, 360);

    // BEP Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(520, 190, 450, 200);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(520, 190, 450, 200);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('SIMULASI TITIK IMPAS OPERASIONAL (BEP)', 545, 230);
    ctx.fillStyle = accentColor;
    ctx.font = '900 34px monospace';
    ctx.fillText('Rp 42.500.000 / bln', 545, 280);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('Ambang batas omzet minimum bebas risiko rugi', 545, 320);
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText('✓ Zona Aman: Surplus Rp 82.000.000', 545, 360);

    // Budget Rows
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(50, 410, 920, 105);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeRect(50, 410, 920, 105);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText('Alokasi Belanja Bahan Baku: Rp 50 Jt (Terpakai Rp 32.5 Jt • 65%)', 75, 445);
    ctx.fillText('Gaji Staf & Upah Operasional: Rp 35 Jt (Terpakai Rp 35 Jt • 100%)', 75, 485);

    // Action Buttons
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(50, 535, 280, 55);
    ctx.fillStyle = '#021312';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('+ ALOKASI POS BARU', 85, 570);
  } else if (screenIndex === 2) {
    // SCREEN 3: PELAKSANAAN & BUKU KAS
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText('LAYAR SINEMA 03 • PELAKSANAAN & BUKU KAS', 50, 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 38px system-ui, sans-serif';
    ctx.fillText('Jurnal Mutasi Kas, Faktur & Pembayaran QRIS', 50, 120);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText('Pencatatan nota masuk/keluar harian, cetak voucher faktur kasir resmi.', 50, 155);

    // Table rows
    const txRows = [
      { date: '10 Okt', desc: 'Penerimaan Penjualan B2B Grosir', cat: 'Omzet', inOut: '+ Rp 18.500.000', method: 'Transfer BCA' },
      { date: '09 Okt', desc: 'Pembelian Stok Bahan Baku Utama', cat: 'Bahan Baku', inOut: '- Rp 7.250.000', method: 'QRIS Usaha' },
      { date: '08 Okt', desc: 'Pembayaran Rekening Listrik & Wifi', cat: 'Utilitas', inOut: '- Rp 1.450.000', method: 'Tunai Kasir' },
    ];

    txRows.forEach((r, idx) => {
      const y = 190 + idx * 75;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(50, y, 920, 65);
      ctx.strokeStyle = idx === 0 ? primaryColor : 'rgba(255, 255, 255, 0.15)';
      ctx.strokeRect(50, y, 920, 65);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(r.date, 70, y + 38);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillText(r.desc, 160, y + 38);

      ctx.fillStyle = '#64748b';
      ctx.font = '15px system-ui, sans-serif';
      ctx.fillText(`[${r.method}]`, 560, y + 38);

      ctx.fillStyle = r.inOut.startsWith('+') ? '#34d399' : '#f87171';
      ctx.font = '900 20px monospace';
      ctx.fillText(r.inOut, 740, y + 38);
    });

    // Features Badge Bar
    ctx.fillStyle = 'rgba(20, 184, 166, 0.15)';
    ctx.fillRect(50, 440, 920, 65);
    ctx.strokeStyle = primaryColor;
    ctx.strokeRect(50, 440, 920, 65);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('⚡ Fitur Unggulan: Generator Faktur Otomatis • Cetak Kwitansi Nota • Filter Kategori Kas', 75, 480);

    // Action Buttons
    ctx.fillStyle = primaryColor;
    ctx.fillRect(50, 535, 240, 55);
    ctx.fillStyle = '#021312';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('🖨️ CETAK FAKTUR', 85, 570);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(310, 535, 220, 55);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('⚡ TERIMA QRIS', 350, 570);
  } else if (screenIndex === 3) {
    // SCREEN 4: PELAPORAN & PAJAK
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText('LAYAR SINEMA 04 • PELAPORAN KEUANGAN & PAJAK', 50, 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 38px system-ui, sans-serif';
    ctx.fillText('Laporan Laba Rugi (P&L), Neraca & PPh Final', 50, 120);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText('Kalkulasi pajak final UMKM 0.5% (PP 55/2022) & ekspor lembar kerja CSV.', 50, 155);

    // Metrics Row
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(50, 190, 440, 140);
    ctx.strokeStyle = accentColor;
    ctx.strokeRect(50, 190, 440, 140);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('ESTIMASI LABA BERSIH (NET MARGIN)', 75, 225);
    ctx.fillStyle = '#34d399';
    ctx.font = '900 32px monospace';
    ctx.fillText('Rp 66.200.000', 75, 270);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillText('Net Margin Sehat: 53.1% Omzet', 75, 305);

    // Tax Card
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(520, 190, 450, 140);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(520, 190, 450, 140);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('ESTIMASI PPh FINAL 0.5% (PP 55/2022)', 545, 225);
    ctx.fillStyle = '#fbbf24';
    ctx.font = '900 32px monospace';
    ctx.fillText('Rp 622.500', 545, 270);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillText('Kewajiban setor kas negara tepat waktu', 545, 305);

    // Balance Sheet Summary
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(50, 355, 920, 150);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeRect(50, 355, 920, 150);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('RINGKASAN POSISI KEUANGAN (NERACA SALDO)', 75, 390);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '16px monospace';
    ctx.fillText('• Total Aset Kas & Bank   : Rp 485.200.000', 75, 430);
    ctx.fillText('• Liabilitas Utang Usaha : Rp  34.000.000', 75, 460);
    ctx.fillText('• Ekuitas Modal Bersih   : Rp 451.200.000', 75, 490);

    // Action Buttons
    ctx.fillStyle = accentColor;
    ctx.fillRect(50, 535, 270, 55);
    ctx.fillStyle = '#021312';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('📊 UNDUH CSV / EXCEL', 80, 570);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(340, 535, 240, 55);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('🖨️ CETAK LAPORAN', 375, 570);
  } else {
    // SCREEN 5: PENGATURAN & KONTROL PENUH
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText('LAYAR SINEMA 05 • PENGATURAN & KONTROL PENUH', 50, 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 38px system-ui, sans-serif';
    ctx.fillText('Kontrol Penuh 16 Fitur & Tautan Akun Google', 50, 120);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText('Tata kelola hak fitur, sinkronisasi cloud Google, dan rekening operasional.', 50, 155);

    // Profile Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(50, 190, 440, 180);
    ctx.strokeStyle = primaryColor;
    ctx.strokeRect(50, 190, 440, 180);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('PROFIL ENTITAS USAHA', 75, 230);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px system-ui, sans-serif';
    ctx.fillText('CV Niaga Mandiri Utama', 75, 270);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('Penanggung Jawab: Arman Pratama', 75, 305);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('🔗 Google: armandmtg@gmail.com', 75, 340);

    // Security & Flags Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(520, 190, 450, 180);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(520, 190, 450, 180);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('STATUS KONTROL PENUH SISTEM', 545, 230);
    ctx.fillStyle = '#34d399';
    ctx.font = '900 26px monospace';
    ctx.fillText('16 / 16 KAPABILITAS AKTIF', 545, 270);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillText('• Otoritas Pagu Anggaran [AKTIF]', 545, 305);
    ctx.fillText('• Ekspor CSV & Faktur Kasir [AKTIF]', 545, 335);

    // 4 Styles Switcher preview
    ctx.fillStyle = 'rgba(20, 184, 166, 0.15)';
    ctx.fillRect(50, 395, 920, 110);
    ctx.strokeStyle = primaryColor;
    ctx.strokeRect(50, 395, 920, 110);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('✨ 4 Variasi Tampilan Kontrol: 3D Spatial Glass • Command Deck • Bento Grid • Audit Ledger', 75, 440);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('Didukung panggung 3D interaktif real-time dengan sudut putar bebas 360°.', 75, 475);

    // Action Buttons
    ctx.fillStyle = primaryColor;
    ctx.fillRect(50, 535, 260, 55);
    ctx.fillStyle = '#021312';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('🛡️ KONTROL FITUR', 85, 570);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(330, 535, 260, 55);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('💳 KELOLA REKENING', 365, 570);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// Helper to draw floating 3D Token Badges (Buttons & Icons)
function createTokenCanvasTexture(label: string, iconSymbol: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 140;
  const ctx = canvas.getContext('2d')!;

  // Translucent pill background
  ctx.fillStyle = 'rgba(6, 18, 30, 0.88)';
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 120, 60);
  ctx.fill();

  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Glow line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(18, 18, 476, 104, 52);
  ctx.stroke();

  // Icon symbol & text
  ctx.fillStyle = color;
  ctx.font = 'bold 36px system-ui, sans-serif';
  ctx.fillText(iconSymbol, 45, 82);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillText(label, 105, 82);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export const ThreeInteractiveBackground: React.FC<ThreeInteractiveBackgroundProps> = ({
  theme = 'emerald',
  density = 'balanced',
  autoRotate = true,
  sensitivity = 1.2,
  interactive = true,
  className = '',
  showCinemaScreens = true,
  activeCinemaIndex,
  rollSpeedMultiplier = 1.0,
  continuousRoll = false,
  onCinemaIndexChange,
  onTelemetryChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef(onTelemetryChange);
  telemetryRef.current = onTelemetryChange;

  const cinemaIndexChangeRef = useRef(onCinemaIndexChange);
  cinemaIndexChangeRef.current = onCinemaIndexChange;

  const rollSpeedMultiplierRef = useRef<number>(rollSpeedMultiplier);
  rollSpeedMultiplierRef.current = rollSpeedMultiplier;

  const continuousRollRef = useRef<boolean>(continuousRoll);
  continuousRollRef.current = continuousRoll;

  // Track target cinema rotation from props
  const targetCinemaIndexRef = useRef<number | undefined>(activeCinemaIndex);
  targetCinemaIndexRef.current = activeCinemaIndex;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Palette Configuration
    const palettes = {
      emerald: {
        primary: 0x10b981,    // Emerald 500
        secondary: 0x14b8a6,  // Teal 500
        accent: 0x34d399,     // Mint 400
        light: 0xa7f3d0,      // Pale mint
        ambient: 0x064e3b,    // Dark teal
        primaryHex: '#10b981',
        secondaryHex: '#14b8a6',
        accentHex: '#34d399',
      },
      cyan: {
        primary: 0x06b6d4,    // Cyan 500
        secondary: 0x3b82f6,  // Blue 500
        accent: 0x38bdf8,     // Sky 400
        light: 0xbae6fd,      // Pale sky
        ambient: 0x082f49,    // Deep navy
        primaryHex: '#06b6d4',
        secondaryHex: '#3b82f6',
        accentHex: '#38bdf8',
      },
      violet: {
        primary: 0x8b5cf6,    // Violet 500
        secondary: 0xec4899,  // Pink 500
        accent: 0xc084fc,     // Purple 400
        light: 0xf5d0fe,      // Pale violet
        ambient: 0x3b0764,    // Deep purple
        primaryHex: '#8b5cf6',
        secondaryHex: '#ec4899',
        accentHex: '#c084fc',
      },
      gold: {
        primary: 0xf59e0b,    // Amber 500
        secondary: 0xd97706,  // Bronze 600
        accent: 0xfbbf24,     // Gold 400
        light: 0xfde68a,      // Pale gold
        ambient: 0x451a03,    // Deep bronze
        primaryHex: '#f59e0b',
        secondaryHex: '#d97706',
        accentHex: '#fbbf24',
      },
    };

    const currentPalette = palettes[theme] || palettes.emerald;

    // --- THREE SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020a10, 0.018);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 19;
    camera.position.y = 1.5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(currentPalette.ambient, 2.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(currentPalette.primary, 3.5);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(currentPalette.accent, 5.0, 35);
    pointLight.position.set(0, 5, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(currentPalette.secondary, 3.5, 30);
    pointLight2.position.set(-10, -5, 6);
    scene.add(pointLight2);

    // --- ROOT INTERACTIVE WORLD GROUP ---
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // --- 1. FLOATING CRYSTALLINE GEOMETRIC CORE ---
    const coreGeo = new THREE.IcosahedronGeometry(3.0, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: currentPalette.primary,
      emissive: currentPalette.ambient,
      emissiveIntensity: 0.5,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.82,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    worldGroup.add(coreMesh);

    // Wireframe cage
    const wireMat = new THREE.MeshBasicMaterial({
      color: currentPalette.accent,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(coreGeo.clone(), wireMat);
    wireMesh.scale.set(1.08, 1.08, 1.08);
    worldGroup.add(wireMesh);

    // Torus orbital ring around core
    const torusGeo = new THREE.TorusGeometry(5.2, 0.08, 16, 100);
    const torusMat = new THREE.MeshStandardMaterial({
      color: currentPalette.secondary,
      roughness: 0.2,
      metalness: 0.9,
      emissive: currentPalette.secondary,
      emissiveIntensity: 0.6,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.rotation.x = Math.PI / 3;
    torusMesh.rotation.y = Math.PI / 6;
    worldGroup.add(torusMesh);

    const torusGeo2 = new THREE.TorusGeometry(6.6, 0.06, 16, 100);
    const torusMat2 = new THREE.MeshStandardMaterial({
      color: currentPalette.accent,
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.7,
    });
    const torusMesh2 = new THREE.Mesh(torusGeo2, torusMat2);
    torusMesh2.rotation.x = -Math.PI / 4;
    torusMesh2.rotation.z = Math.PI / 5;
    worldGroup.add(torusMesh2);

    // --- 2. FLOATING 3D GOLDEN COIN WITH "RP" SYMBOL ---
    const coinGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.25, 36);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.2,
      emissive: 0x78350f,
      emissiveIntensity: 0.3,
    });
    const coinMesh = new THREE.Mesh(coinGeo, coinMat);
    coinMesh.position.set(-6, 3.5, 4);
    coinMesh.rotation.x = Math.PI / 2.8;
    worldGroup.add(coinMesh);

    // Coin label canvas texture for 'Rp'
    const coinCanvas = document.createElement('canvas');
    coinCanvas.width = 256;
    coinCanvas.height = 256;
    const cctx = coinCanvas.getContext('2d')!;
    cctx.fillStyle = '#f59e0b';
    cctx.fillRect(0, 0, 256, 256);
    cctx.fillStyle = '#78350f';
    cctx.font = 'bold 110px monospace';
    cctx.textAlign = 'center';
    cctx.textBaseline = 'middle';
    cctx.fillText('Rp', 128, 128);
    const coinTexture = new THREE.CanvasTexture(coinCanvas);
    const coinFaceMat = new THREE.MeshBasicMaterial({ map: coinTexture, transparent: true });
    const coinFaceGeo = new THREE.CircleGeometry(1.58, 36);
    const coinFaceMesh = new THREE.Mesh(coinFaceGeo, coinFaceMat);
    coinFaceMesh.position.y = 0.13;
    coinFaceMesh.rotation.x = -Math.PI / 2;
    coinMesh.add(coinFaceMesh);

    // --- 3. FLOATING 3D HOLOGRAPHIC CINEMA SCREENS ---
    // 5 Holographic Cinema Screens arranged in a sweeping amphitheater arc
    const cinemaScreenMeshes: THREE.Mesh[] = [];
    const cinemaScreenAngles = [
      0,          // 0: Beranda & Dashboard (Center)
      -0.65,      // 1: Perencanaan (Kiri)
      -1.30,      // 2: Pelaksanaan (Kiri Jauh)
      0.65,       // 3: Pelaporan (Kanan)
      1.30,       // 4: Pengaturan (Kanan Jauh)
    ];

    if (showCinemaScreens) {
      const screenWidth = 6.4;
      const screenHeight = 4.0;
      const screenGeo = new THREE.PlaneGeometry(screenWidth, screenHeight);
      const arcRadius = 12.5;

      for (let i = 0; i < 5; i++) {
        const tex = createCinemaCanvasTexture(
          i,
          currentPalette.primaryHex,
          currentPalette.secondaryHex,
          currentPalette.accentHex
        );

        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.94,
          roughness: 0.2,
          metalness: 0.1,
          emissive: currentPalette.primary,
          emissiveIntensity: 0.08,
        });

        const screenMesh = new THREE.Mesh(screenGeo, mat);
        const angle = cinemaScreenAngles[i];

        // Position along cylindrical arc
        screenMesh.position.x = Math.sin(angle) * arcRadius;
        screenMesh.position.z = Math.cos(angle) * arcRadius - arcRadius;
        screenMesh.position.y = 1.0;

        // Angle inwards facing center
        screenMesh.rotation.y = angle * 0.95;

        // Glowing border wireframe on back/rim
        const borderGeo = new THREE.BoxGeometry(screenWidth + 0.1, screenHeight + 0.1, 0.04);
        const borderMat = new THREE.MeshBasicMaterial({
          color: currentPalette.accent,
          wireframe: true,
          transparent: true,
          opacity: 0.45,
        });
        const borderMesh = new THREE.Mesh(borderGeo, borderMat);
        screenMesh.add(borderMesh);

        worldGroup.add(screenMesh);
        cinemaScreenMeshes.push(screenMesh);
      }
    }

    // --- 4. FLOATING 3D ACTION BUTTON TOKENS ---
    const tokenConfigs = [
      { label: '+ Catat Kas', icon: '⚡', color: currentPalette.primaryHex, pos: [-7.5, -2.5, 6] },
      { label: 'Cetak Faktur', icon: '🖨️', color: currentPalette.secondaryHex, pos: [7.5, -2.5, 6] },
      { label: 'Ekspor Excel', icon: '📊', color: currentPalette.accentHex, pos: [-8.5, 4.5, 3] },
      { label: 'Tautan Google', icon: '🔗', color: '#60a5fa', pos: [8.5, 4.5, 3] },
      { label: 'QRIS Kasir', icon: '📱', color: '#c084fc', pos: [0, -4.5, 8] },
    ];

    const tokenMeshes: THREE.Mesh[] = [];
    tokenConfigs.forEach((tok) => {
      const tex = createTokenCanvasTexture(tok.label, tok.icon, tok.color);
      const geo = new THREE.PlaneGeometry(2.6, 0.72);
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(tok.pos[0], tok.pos[1], tok.pos[2]);
      worldGroup.add(mesh);
      tokenMeshes.push(mesh);
    });

    // --- 5. ORBITING GEOMETRIC SATELLITES ---
    const orbitalCount = density === 'minimal' ? 6 : density === 'rich' ? 18 : 12;
    const satellites: {
      mesh: THREE.Mesh;
      speedX: number;
      speedY: number;
      speedZ: number;
      orbitRadius: number;
      orbitAngle: number;
      orbitSpeed: number;
    }[] = [];

    const polyGeometries = [
      new THREE.OctahedronGeometry(0.8, 0),
      new THREE.TetrahedronGeometry(0.7, 0),
      new THREE.DodecahedronGeometry(0.7, 0),
      new THREE.BoxGeometry(0.8, 0.8, 0.8),
    ];

    for (let i = 0; i < orbitalCount; i++) {
      const g = polyGeometries[i % polyGeometries.length];
      const mat = new THREE.MeshPhysicalMaterial({
        color: i % 2 === 0 ? currentPalette.primary : currentPalette.secondary,
        roughness: 0.2,
        metalness: 0.75,
        clearcoat: 0.8,
        transparent: true,
        opacity: 0.85,
      });

      const mesh = new THREE.Mesh(g, mat);
      const orbitRadius = 8.5 + Math.random() * 8;
      const orbitAngle = (i / orbitalCount) * Math.PI * 2;
      const height = (Math.random() - 0.5) * 8;

      mesh.position.set(
        Math.cos(orbitAngle) * orbitRadius,
        height,
        Math.sin(orbitAngle) * orbitRadius
      );

      worldGroup.add(mesh);
      satellites.push({
        mesh,
        speedX: (Math.random() - 0.5) * 0.02,
        speedY: (Math.random() - 0.5) * 0.02,
        speedZ: (Math.random() - 0.5) * 0.02,
        orbitRadius,
        orbitAngle,
        orbitSpeed: (0.003 + Math.random() * 0.005) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    // --- 6. GLOWING STARFIELD / AMBIENT PARTICLES ---
    const particleCount = density === 'minimal' ? 500 : density === 'rich' ? 1500 : 900;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 75;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 55;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 65;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMat = new THREE.PointsMaterial({
      color: currentPalette.accent,
      size: 0.2,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    worldGroup.add(starPoints);

    // --- 7. 3D HORIZON PERSPECTIVE GRID ---
    const gridHelper = new THREE.GridHelper(65, 40, currentPalette.primary, currentPalette.ambient);
    gridHelper.position.y = -8.5;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.22;
    worldGroup.add(gridHelper);

    // --- INTERACTIVE DRAG & ROLL CONTROLLER ---
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;

    let targetRotX = 0.05;
    let targetRotY = 0;
    let currentRotX = 0.05;
    let currentRotY = 0;

    let velocityX = 0;
    let velocityY = 0;

    let mouseWorldX = 0;
    let mouseWorldY = 0;

    // Check if external cinema index demands camera rotation
    const updateCinemaRotationTarget = () => {
      const idx = targetCinemaIndexRef.current;
      if (idx !== undefined && idx >= 0 && idx < cinemaScreenAngles.length) {
        // Target angle points directly to that screen
        targetRotY = -cinemaScreenAngles[idx];
        targetRotX = 0.05;
      }
    };

    const onPointerDown = (clientX: number, clientY: number) => {
      isDragging = true;
      previousPointerX = clientX;
      previousPointerY = clientY;
      velocityX = 0;
      velocityY = 0;
    };

    const onPointerMove = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
      mouseWorldX = nx * 10;
      mouseWorldY = ny * 8;

      if (!isDragging) return;

      const deltaX = clientX - previousPointerX;
      const deltaY = clientY - previousPointerY;

      previousPointerX = clientX;
      previousPointerY = clientY;

      const factor = 0.005 * sensitivity;
      targetRotY += deltaX * factor;
      targetRotX += deltaY * factor;

      velocityX = deltaX * factor * 0.8;
      velocityY = deltaY * factor * 0.8;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      onPointerDown(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      onPointerMove(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      onPointerUp();
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      onPointerUp();
    };

    const handleWheel = (e: WheelEvent) => {
      if (!interactive) return;
      targetRotX += e.deltaY * 0.0006;
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.008, 11, 26);
    };

    if (interactive) {
      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleTouchEnd);
      container.addEventListener('wheel', handleWheel, { passive: true });
    }

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Check if targetCinemaIndex changed externally
      if (!isDragging && targetCinemaIndexRef.current !== undefined) {
        updateCinemaRotationTarget();
      }

      // Inertia & Damping
      if (!isDragging) {
        targetRotY += velocityX;
        targetRotX += velocityY;
        velocityX *= 0.94;
        velocityY *= 0.94;

        if (autoRotate) {
          const mult = rollSpeedMultiplierRef.current || 1.0;
          const baseSpeed = 0.002 * mult;
          if (targetCinemaIndexRef.current === undefined || continuousRollRef.current) {
            targetRotY += baseSpeed;
          }
        }
      }

      // Smooth interpolation (lerp)
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      worldGroup.rotation.x = currentRotX;
      worldGroup.rotation.y = currentRotY;

      // Mouse-follow light
      pointLight.position.x += (mouseWorldX - pointLight.position.x) * 0.05;
      pointLight.position.y += (mouseWorldY - pointLight.position.y) * 0.05;

      // Animate core
      coreMesh.rotation.x += 0.005;
      coreMesh.rotation.y += 0.007;
      wireMesh.rotation.x -= 0.004;
      wireMesh.rotation.y += 0.006;
      torusMesh.rotation.z += 0.004;
      torusMesh2.rotation.z -= 0.003;

      // Animate 3D Gold Coin spin
      coinMesh.rotation.z += 0.015;
      coinMesh.position.y = 3.5 + Math.sin(elapsedTime * 2.0) * 0.4;

      // Floating token bobbing
      tokenMeshes.forEach((tok, idx) => {
        tok.position.y += Math.sin(elapsedTime * 2.5 + idx) * 0.003;
      });

      // Animate Satellites
      satellites.forEach((sat) => {
        sat.orbitAngle += sat.orbitSpeed;
        sat.mesh.position.x = Math.cos(sat.orbitAngle) * sat.orbitRadius;
        sat.mesh.position.z = Math.sin(sat.orbitAngle) * sat.orbitRadius;
        sat.mesh.rotation.x += sat.speedX;
        sat.mesh.rotation.y += sat.speedY;
        sat.mesh.rotation.z += sat.speedZ;
      });

      // Floating Cinema Screen gentle breathe
      cinemaScreenMeshes.forEach((scr, idx) => {
        scr.position.y = 1.0 + Math.sin(elapsedTime * 1.5 + idx * 0.8) * 0.15;
      });

      starPoints.rotation.y = elapsedTime * 0.012;

      renderer.render(scene, camera);

      // Report Telemetry
      if (telemetryRef.current) {
        const yawDeg = Math.round(((currentRotY * 180) / Math.PI) % 360);
        const pitchDeg = Math.round(((currentRotX * 180) / Math.PI) % 360);
        const speed = Math.round((Math.abs(velocityX) + Math.abs(velocityY)) * 1000);
        telemetryRef.current({
          yaw: yawDeg,
          pitch: pitchDeg,
          roll: 0,
          speed,
          isDragging,
        });
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);

      if (interactive) {
        container.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        container.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        container.removeEventListener('wheel', handleWheel);
      }

      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      wireMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      torusGeo2.dispose();
      torusMat2.dispose();
      coinGeo.dispose();
      coinMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      gridHelper.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme, density, autoRotate, sensitivity, interactive, showCinemaScreens]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none cursor-grab active:cursor-grabbing overflow-hidden ${className}`}
      title="Geser/drag mouse atau sentuh untuk memutar layar sinema & objek 3D"
    />
  );
};
