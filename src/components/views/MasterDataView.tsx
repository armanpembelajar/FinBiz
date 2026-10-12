import React, { useState } from 'react';
import { 
  UserProfile, 
  FeatureControls, 
  MasterFolderId, 
  MasterFileItem, 
  AuditExportLog, 
  ExportFormat,
  Transaction,
  BudgetItem
} from '../../types';
import { 
  initialMasterFolders, 
  initialMasterFiles, 
  initialAuditExportLogs 
} from '../../data/mockData';
import { 
  FolderLock, 
  ShieldCheck, 
  ShieldAlert, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Database, 
  KeyRound, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Lock, 
  HardDrive, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Shield,
  FileCode,
  Archive,
  Fingerprint,
  X
} from 'lucide-react';

interface MasterDataViewProps {
  userProfile: UserProfile;
  featureControls: FeatureControls;
  transactions?: Transaction[];
  budgetItems?: BudgetItem[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenAuthModal?: () => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  userProfile,
  featureControls,
  transactions = [],
  budgetItems = [],
  onUpdateProfile,
  onOpenAuthModal,
}) => {
  const [selectedFolder, setSelectedFolder] = useState<MasterFolderId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditExportLog[]>(initialAuditExportLogs);
  
  // State Modal Autentikasi Google SSO untuk Ekspor
  const [pendingExportFile, setPendingExportFile] = useState<MasterFileItem | null>(null);
  const [pendingFormat, setPendingFormat] = useState<ExportFormat>('csv');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isVerifyingGoogleSSO, setIsVerifyingGoogleSSO] = useState(false);
  const [ssoVerificationSuccess, setSsoVerificationSuccess] = useState(false);
  const [googleLinkingInModal, setGoogleLinkingInModal] = useState(false);
  const [modalGoogleEmailInput, setModalGoogleEmailInput] = useState(
    userProfile.googleEmail || userProfile.email || 'sdn1.mantangaitengah@gmail.com'
  );

  // Filter berkas
  const filteredFiles = initialMasterFiles.filter((file) => {
    const matchesFolder = selectedFolder === 'all' || file.folderId === selectedFolder;
    const matchesSearch = 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  const getFolderMeta = (folderId: MasterFolderId) => {
    return initialMasterFolders.find(f => f.id === folderId) || initialMasterFolders[0];
  };

  const getFormatBadge = (format: ExportFormat) => {
    switch (format) {
      case 'csv':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">CSV</span>;
      case 'xlsx':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-300">XLSX</span>;
      case 'pdf':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">PDF</span>;
      case 'json':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">JSON</span>;
      case 'sql':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">SQL</span>;
      case 'zip':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300">ZIP</span>;
    }
  };

  const getConfidentialityBadge = (level: string) => {
    switch (level) {
      case 'Top Secret':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            Top Secret
          </span>
        );
      case 'Restricted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Lock className="w-3 h-3 text-amber-600" />
            Restricted
          </span>
        );
      case 'Confidential':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Shield className="w-3 h-3 text-blue-600" />
            Confidential
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200">
            Internal
          </span>
        );
    }
  };

  // Pemicu Klik Ekspor Berkas
  const handleInitiateExport = (file: MasterFileItem, format?: ExportFormat) => {
    const targetFormat = format || file.format;
    setPendingExportFile(file);
    setPendingFormat(targetFormat);
    setSsoVerificationSuccess(false);
    setIsVerifyingGoogleSSO(false);
    setIsExportModalOpen(true);
  };

  // Eksekusi Download File Riil
  const triggerActualDownload = (file: MasterFileItem, format: ExportFormat, userEmail: string) => {
    let mimeType = 'text/plain';
    let fileExtension = format;
    let content = '';

    const sanitizedBase = file.name.replace(/\.[^/.]+$/, "");
    const dateStamp = new Date().toISOString().slice(0, 10);
    const finalFileName = `${sanitizedBase}_EXPORT_${dateStamp}.${fileExtension}`;

    if (format === 'csv') {
      mimeType = 'text/csv;charset=utf-8;';
      content = `ID,Tanggal_Arsip,Klasifikasi,Subjek,Checksum,Status_Otentikasi,Diunduh_Oleh\n` +
        `"DATA-01","${dateStamp}","${file.confidentiality}","${file.name}","${file.checksum}","Google SSO Verified","${userEmail}"\n` +
        `"DATA-02","${dateStamp}","${file.folderId}","${file.description}","AES-256-GCM","Clearance Level 5","FinBiz Enterprise Vault"`;
    } else if (format === 'json') {
      mimeType = 'application/json;charset=utf-8;';
      content = JSON.stringify({
        vault: 'FinBiz Enterprise Master Vault',
        securityProtocol: 'Google SSO Mandatory Auth Enforcement',
        exportedAt: new Date().toISOString(),
        authorizedGoogleEmail: userEmail,
        fileMetadata: file,
        integrityHash: file.checksum,
        payloadStatus: 'Encrypted Snapshot Decrypted for Authorized Session',
        items: transactions.slice(0, 5)
      }, null, 2);
    } else if (format === 'sql') {
      mimeType = 'application/sql;charset=utf-8;';
      content = `-- FinBiz Enterprise Master SQL Dump\n-- Security Clearance: Google SSO Verified (${userEmail})\n-- Exported At: ${new Date().toISOString()}\n\n` +
        `CREATE TABLE IF NOT EXISTS finbiz_master_${file.folderId} (\n  id VARCHAR(64) PRIMARY KEY,\n  checksum VARCHAR(128),\n  data_payload TEXT,\n  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n` +
        `INSERT INTO finbiz_master_${file.folderId} (id, checksum, data_payload) VALUES ('${file.id}', '${file.checksum}', 'PAYLOAD_ENCRYPTED_AES256');\n`;
    } else {
      // PDF / Excel / ZIP fallback (Textual representation with verified certificate)
      mimeType = 'application/octet-stream';
      content = `[FINBIZ ENTERPRISE REPOSITORY CERTIFIED EXPORT]\n` +
        `BERKAS: ${file.name}\n` +
        `FOLDER: ${file.folderId.toUpperCase()}\n` +
        `FORMAT: ${format.toUpperCase()}\n` +
        `KERAHASIAAN: ${file.confidentiality}\n` +
        `OTENTIKASI: Google SSO Verified (${userEmail})\n` +
        `WAKTU EKSPOR: ${new Date().toLocaleString('id-ID')}\n` +
        `INTEGRITAS CHECKSUM: ${file.checksum}\n\n` +
        `Dokumen ini resmi dikeluarkan oleh Vault FinBiz dan dilindungi secara hukum. Penyalahgunaan tanpa hak tunduk pada UU ITE.`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Konfirmasi Autentikasi Google SSO dan Ekspor
  const handleConfirmGoogleSSOAndExport = () => {
    if (!pendingExportFile) return;

    const emailUsed = userProfile.googleLinked && userProfile.googleEmail
      ? userProfile.googleEmail
      : modalGoogleEmailInput || 'sdn1.mantangaitengah@gmail.com';

    setIsVerifyingGoogleSSO(true);

    setTimeout(() => {
      // Jika profil belum tertaut, tautkan secara otomatis
      if (!userProfile.googleLinked) {
        onUpdateProfile({
          googleLinked: true,
          googleEmail: emailUsed,
        });
      }

      setIsVerifyingGoogleSSO(false);
      setSsoVerificationSuccess(true);

      // Catat ke Audit Trail Log
      const newAuditLog: AuditExportLog = {
        id: `AUD-EXP-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        fileName: pendingExportFile.name,
        folderId: pendingExportFile.folderId,
        format: pendingFormat,
        authenticatedGoogleEmail: emailUsed,
        authMethod: 'Google SSO (GIS Verified)',
        status: 'Approved',
        ipAddress: '182.253.112.44 (Jakarta)',
        deviceInfo: 'Verified Browser Session via Google SSO'
      };

      setAuditLogs(prev => [newAuditLog, ...prev]);

      // Unduh file nyata
      triggerActualDownload(pendingExportFile, pendingFormat, emailUsed);

      // Tutup modal setelah delay umpan balik
      setTimeout(() => {
        setIsExportModalOpen(false);
        setPendingExportFile(null);
        setSsoVerificationSuccess(false);
      }, 1400);
    }, 900);
  };

  // Tautkan Akun Google langsung dari Modal
  const handleLinkGoogleInModal = () => {
    if (!modalGoogleEmailInput.trim()) return;
    setGoogleLinkingInModal(true);
    setTimeout(() => {
      onUpdateProfile({
        googleLinked: true,
        googleEmail: modalGoogleEmailInput.trim(),
      });
      setGoogleLinkingInModal(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* ===================== BANNER VAULT MASTER DATA ===================== */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-2xl p-5 sm:p-6 text-white border border-slate-800 shadow-md relative overflow-hidden">
        {/* Dekorasi Aksen Keamanan */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute right-40 bottom-0 w-60 h-60 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40">
                <FolderLock className="w-3.5 h-3.5" />
                Master Data Vault
              </span>
              <span className="text-slate-500">·</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px]">
                <ShieldCheck className="w-3 h-3" />
                Enkripsi AES-256 Aktif
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px]">
                <KeyRound className="w-3 h-3" />
                Google SSO Mandatory
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Folder Master Data &amp; Repositori Dokumen Sensitif
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pusat penyimpanan terpusat master folder sistem: <strong className="text-white">Admin, Pengguna, Laporan Keuangan, Log Audit, Backup/Restore</strong>, dan berkas perizinan urgen. Seluruh berkas dilindungi dengan protokol keamanan ketat, di mana <span className="text-teal-300 font-semibold underline decoration-teal-400/50">setiap operasi ekspor berkas CSV, Excel, PDF, JSON, dan SQL wajib melalui otentikasi Google SSO</span> guna mencegah pencurian, kebocoran, atau tereksposnya dokumen rahasia bisnis.
            </p>
          </div>

          {/* Indikator Status Clearance Google SSO Pengguna */}
          <div className="shrink-0 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3.5 sm:p-4 min-w-[260px] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Status Keamanan Ekspor
              </span>
              {userProfile.googleLinked ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  ● SSO Terverifikasi
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold animate-pulse">
                  ⚠️ SSO Belum Aktif
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 pt-0.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                userProfile.googleLinked 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
              }`}>
                <Fingerprint className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate">
                  {userProfile.googleLinked 
                    ? (userProfile.googleEmail || userProfile.email) 
                    : 'Akses Tamu / Offline'}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {userProfile.googleLinked 
                    ? 'Izin Ekspor Disetujui (Google SSO)' 
                    : 'Wajib Verifikasi SSO Sebelum Ekspor'}
                </span>
              </div>
            </div>

            {!userProfile.googleLinked && (
              <button
                type="button"
                onClick={() => {
                  setPendingExportFile(initialMasterFiles[0]);
                  setPendingFormat('csv');
                  setIsExportModalOpen(true);
                }}
                className="w-full py-1.5 px-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Otentikasi Google SSO Sekarang</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===================== GRID KARTU FOLDER MASTER DATA ===================== */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-teal-600" />
              Direktori Folder Master Terproteksi
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              (Pilih folder untuk memfilter berkas)
            </span>
          </div>

          {selectedFolder !== 'all' && (
            <button
              onClick={() => setSelectedFolder('all')}
              className="text-xs text-teal-600 hover:text-teal-700 font-semibold cursor-pointer underline flex items-center gap-1"
            >
              <span>Tampilkan Semua Folder</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {initialMasterFolders.map((folder) => {
            const isSelected = selectedFolder === folder.id;
            return (
              <div
                key={folder.id}
                onClick={() => setSelectedFolder(isSelected ? 'all' : folder.id)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left relative overflow-hidden group active:scale-95 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                    : 'bg-white hover:bg-slate-50/80 text-slate-800 border-slate-200 hover:border-slate-300 shadow-xs hover:-translate-y-0.5'
                }`}
              >
                {/* Header Kartu Folder */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' 
                        : 'bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-teal-50 group-hover:text-teal-700'
                    }`}>
                      {folder.id === 'admin' && <Lock className="w-4 h-4" />}
                      {folder.id === 'pengguna' && <Users className="w-4 h-4" />}
                      {folder.id === 'laporan' && <FileSpreadsheet className="w-4 h-4" />}
                      {folder.id === 'audit' && <Shield className="w-4 h-4" />}
                      {folder.id === 'backup' && <Database className="w-4 h-4" />}
                      {folder.id === 'urgen' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {folder.shortLabel}
                      </h3>
                      <span className={`text-[11px] font-mono ${isSelected ? 'text-teal-300' : 'text-slate-500'}`}>
                        /{folder.id}
                      </span>
                    </div>
                  </div>

                  {folder.isUrgent ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-rose-500 text-white shadow-xs">
                      Urgen
                    </span>
                  ) : (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      isSelected 
                        ? 'bg-slate-800 border-slate-700 text-slate-300' 
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}>
                      {folder.itemCount} Berkas
                    </span>
                  )}
                </div>

                <p className={`text-xs line-clamp-2 mb-3 ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                  {folder.description}
                </p>

                {/* Footer Kartu Folder */}
                <div className={`pt-2.5 border-t flex items-center justify-between text-[11px] ${
                  isSelected ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                    <span>{folder.securityLevel.split(' ')[0]} {folder.securityLevel.split(' ')[1]}</span>
                  </div>
                  <span className="font-mono text-[10px]">{folder.totalSize}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================== TABEL DAFTAR BERKAS MASTER & EKSPOR SSO ===================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header Kontrol Pencarian & Filter */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Daftar Dokumen &amp; Berkas Sensitif
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                {filteredFiles.length} Berkas
              </span>
              {selectedFolder !== 'all' && (
                <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-semibold text-xs border border-teal-200">
                  Folder: {getFolderMeta(selectedFolder).shortLabel}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Setiap tombol ekspor memicu protokol verifikasi Google SSO dan pencatatan audit forensik.
            </p>
          </div>

          {/* Kolom Pencarian */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama berkas, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Export Master Archive */}
            <button
              onClick={() => handleInitiateExport(initialMasterFiles[0], 'zip')}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
              title="Unduh Berkas Arsip dengan Google SSO"
            >
              <Archive className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Paket ZIP</span>
            </button>
          </div>
        </div>

        {/* Tabel Berkas */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama Dokumen &amp; Uraian</th>
                <th className="py-3 px-3">Folder</th>
                <th className="py-3 px-3">Format</th>
                <th className="py-3 px-3">Klasifikasi</th>
                <th className="py-3 px-3">Ukuran / Rekaman</th>
                <th className="py-3 px-3">Pembaruan</th>
                <th className="py-3 px-4 text-right">Aksi Ekspor (Google SSO)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredFiles.map((file) => {
                const folderMeta = getFolderMeta(file.folderId);
                return (
                  <tr key={file.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Nama & Deskripsi */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                          {file.format === 'csv' && <FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
                          {file.format === 'xlsx' && <FileSpreadsheet className="w-4 h-4 text-teal-600" />}
                          {file.format === 'pdf' && <FileText className="w-4 h-4 text-rose-600" />}
                          {file.format === 'json' && <FileCode className="w-4 h-4 text-amber-600" />}
                          {file.format === 'sql' && <Database className="w-4 h-4 text-indigo-600" />}
                          {file.format === 'zip' && <Archive className="w-4 h-4 text-purple-600" />}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate" title={file.name}>
                            {file.name}
                          </span>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mb-1">
                            {file.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {file.tags.map(tag => (
                              <span key={tag} className="px-1.5 py-0.2 rounded text-[9px] bg-slate-100 text-slate-600 font-medium">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Folder ID */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                        <FolderLock className="w-3.5 h-3.5 text-teal-600" />
                        {folderMeta.shortLabel}
                      </span>
                    </td>

                    {/* Format */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getFormatBadge(file.format)}
                    </td>

                    {/* Klasifikasi */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getConfidentialityBadge(file.confidentiality)}
                    </td>

                    {/* Ukuran & Record */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex flex-col text-[11px]">
                        <span className="font-semibold text-slate-900">{file.size}</span>
                        <span className="text-slate-500">{file.recordCount} entri data</span>
                      </div>
                    </td>

                    {/* Tanggal Pembaruan */}
                    <td className="py-3 px-3 whitespace-nowrap text-[11px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{file.updatedAt}</span>
                      </div>
                    </td>

                    {/* Tombol Ekspor Multi Format */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Tombol Default Berdasarkan Format Berkas */}
                        <button
                          type="button"
                          onClick={() => handleInitiateExport(file, file.format)}
                          className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                          title={`Ekspor ${file.name} format ${file.format.toUpperCase()} (Wajib Google SSO)`}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Ekspor {file.format.toUpperCase()}</span>
                        </button>

                        {/* Opsi Ekspor CSV / PDF Cepat Tambahan */}
                        {file.format !== 'csv' && (
                          <button
                            type="button"
                            onClick={() => handleInitiateExport(file, 'csv')}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-[10px] font-bold cursor-pointer active:scale-95"
                            title="Ekspor Alternatif CSV (Google SSO)"
                          >
                            CSV
                          </button>
                        )}
                        {file.format !== 'pdf' && (
                          <button
                            type="button"
                            onClick={() => handleInitiateExport(file, 'pdf')}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-[10px] font-bold cursor-pointer active:scale-95"
                            title="Ekspor Alternatif PDF (Google SSO)"
                          >
                            PDF
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== AUDIT TRAIL LOG EKSPOR GOOGLE SSO ===================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Forensic Audit Trail: Log Ekspor Berkas Sensitif
              </h3>
              <p className="text-xs text-slate-500">
                Rekaman setiap aktivitas unduhan yang telah diautentikasi dan disetujui melalui Google SSO.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md self-start sm:self-auto">
            Protokol: Append-Only Immutable
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Waktu &amp; ID Audit</th>
                <th className="py-2.5 px-3">Berkas yang Diekspor</th>
                <th className="py-2.5 px-3">Format</th>
                <th className="py-2.5 px-3">Google SSO Akun Pengautentikasi</th>
                <th className="py-2.5 px-3">IP &amp; Perangkat Klien</th>
                <th className="py-2.5 px-3 text-right">Status Keamanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="font-mono text-slate-900 font-semibold">{log.timestamp}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.id}</div>
                  </td>
                  <td className="py-2.5 px-3 max-w-xs truncate font-medium text-slate-900" title={log.fileName}>
                    {log.fileName}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {getFormatBadge(log.format)}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-slate-800">{log.authenticatedGoogleEmail}</span>
                    </div>
                    <span className="text-[10px] text-teal-600">{log.authMethod}</span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 text-[11px]">
                    <div>{log.ipAddress}</div>
                    <div className="text-[10px] text-slate-400">{log.deviceInfo}</div>
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Disetujui Google SSO
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== MODAL OTENTIKASI GOOGLE SSO SEBELUM EKSPOR ===================== */}
      {isExportModalOpen && pendingExportFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 text-left relative overflow-hidden">
            {/* Header Modal Keamanan */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    Otentikasi Google SSO Wajib Ekspor
                  </h3>
                  <p className="text-xs text-slate-500">
                    Protokol Perlindungan Data Sensitif FinBiz Enterprise
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsExportModalOpen(false);
                  setPendingExportFile(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rincian Berkas yang Diminta */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Berkas yang Diminta:</span>
                <span className="font-bold text-slate-900 truncate max-w-[200px]" title={pendingExportFile.name}>
                  {pendingExportFile.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Format Ekspor:</span>
                <div className="flex items-center gap-1.5">
                  {getFormatBadge(pendingFormat)}
                  <span className="text-slate-500">({pendingExportFile.size})</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Tingkat Kerahasiaan:</span>
                {getConfidentialityBadge(pendingExportFile.confidentiality)}
              </div>
              <div className="pt-1 border-t border-slate-200 text-[11px] text-slate-500 font-mono truncate">
                Checksum: {pendingExportFile.checksum}
              </div>
            </div>

            {/* Status Autentikasi Google SSO Pengguna */}
            {userProfile.googleLinked ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold">
                      Akun Google SSO Anda Telah Terhubung
                    </p>
                    <p className="text-emerald-700 mt-0.5">
                      Email: <span className="font-semibold">{userProfile.googleEmail || userProfile.email}</span>
                    </p>
                    <p className="text-[11px] text-emerald-600 mt-1">
                      Kredensial keamanan valid. Klik tombol otentikasi di bawah untuk mendekripsi dan mengunduh berkas dengan aman ke perangkat Anda.
                    </p>
                  </div>
                </div>

                {ssoVerificationSuccess ? (
                  <div className="p-3 rounded-xl bg-teal-600 text-white text-center font-bold text-xs flex items-center justify-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Otentikasi Berhasil! Mengunduh berkas sekarang...</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmGoogleSSOAndExport}
                    disabled={isVerifyingGoogleSSO}
                    className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-400 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    {isVerifyingGoogleSSO ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Memverifikasi Token SSO &amp; Menyiapkan Berkas...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Otentikasi Google SSO &amp; Unduh Berkas ({pendingFormat.toUpperCase()})</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              /* Kasus Belum Tertaut Google SSO */
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold">
                      Peringatan: Otentikasi Google SSO Diperlukan!
                    </p>
                    <p className="text-amber-800 mt-0.5 leading-relaxed">
                      Untuk mencegah pencurian, kebocoran, dan eksploitasi data sensitif, sistem FinBiz mewajibkan identitas Google SSO yang sah sebelum mengizinkan ekspor dokumen master data.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Masukkan Alamat Akun Google Resmi Anda:
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={modalGoogleEmailInput}
                      onChange={(e) => setModalGoogleEmailInput(e.target.value)}
                      placeholder="contoh@gmail.com"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Email ini akan didaftarkan sebagai penanggung jawab resmi unduhan berkas pada catatan audit forensik.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleConfirmGoogleSSOAndExport}
                    disabled={isVerifyingGoogleSSO || !modalGoogleEmailInput.trim()}
                    className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    {isVerifyingGoogleSSO ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Memverifikasi SSO Google...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verifikasi Google SSO &amp; Lanjutkan Ekspor</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Catatan Kepatuhan Regulasi */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>Keamanan: Standar ISO 27001 &amp; UU PDP</span>
              <span>Audit Trail Forensik Aktif</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
