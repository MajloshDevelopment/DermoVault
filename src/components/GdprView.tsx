import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Download,
  Trash2,
  FileCheck,
  Lock,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { SkinAnalysisRecord, UserConsentLedger } from '../types/skin';
import { cryptographicShredVault } from '../utils/crypto';

interface GdprViewProps {
  records: SkinAnalysisRecord[];
  consent: UserConsentLedger;
  onUpdateConsent: (updated: Partial<UserConsentLedger>) => void;
  onPurgeAllData: () => void;
}

export const GdprView: React.FC<GdprViewProps> = ({
  records,
  consent,
  onUpdateConsent,
  onPurgeAllData
}) => {
  const [shredConfirmOpen, setShredConfirmOpen] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExportDecryptedJson = () => {
    const payload = {
      exportVersion: '1.2-GDPR-PORTABILITY',
      exportDate: new Date().toISOString(),
      complianceStandard: 'EU GDPR Art. 20 / California CCPA',
      biometricRecordCount: records.length,
      records: records.map(r => ({
        id: r.id,
        timestamp: r.timestamp,
        formattedDate: new Date(r.timestamp).toISOString(),
        bodyLocation: r.bodyLocation,
        condition: r.condition,
        conditionLabel: r.conditionLabel,
        riskCategory: r.riskCategory,
        confidencePercent: r.confidence,
        abcde: r.abcde,
        skinMetrics: r.skinMetrics,
        clinicalObservations: r.clinicalObservations,
        highThinkingSummary: r.highThinking?.clinicalSummary || 'N/A'
      }))
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dermavault-gdpr-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess('Exported Decrypted JSON dossier successfully.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleExecuteShred = () => {
    cryptographicShredVault();
    onPurgeAllData();
    setShredConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            GDPR & Biometric Privacy Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Exercising EU GDPR Articles 15 (Access), 17 (Erasure / Cryptographic Shredding), and 20 (Data Portability).
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-4 h-4" />
          <span>GDPR Art. 9 Compliant</span>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Main Grid: Consent Ledger & Rights Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Granular Consent Ledger */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Granular Consent Ledger
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Ver: {consent.consentVersion}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Under GDPR Art. 9, processing special category biometric data (facial & skin photographs) requires explicit, withdrawable consent.
          </p>

          <div className="space-y-3 pt-2">
            {/* Consent Item 1 */}
            <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Local Biometric Image Processing
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Allows client-side edge tensor evaluation of skin contours and pigmentation.
                </p>
              </div>
              <input
                type="checkbox"
                checked={consent.biometricImageProcessing}
                onChange={(e) => onUpdateConsent({ biometricImageProcessing: e.target.checked })}
                className="mt-1 h-4 w-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            {/* Consent Item 2 */}
            <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Zero-Knowledge Encrypted Local Storage
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Encrypts scan history in local IndexedDB using AES-GCM 256-bit with PBKDF2 keys.
                </p>
              </div>
              <input
                type="checkbox"
                checked={consent.encryptedLocalStorage}
                onChange={(e) => onUpdateConsent({ encryptedLocalStorage: e.target.checked })}
                className="mt-1 h-4 w-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            {/* Consent Item 3 */}
            <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Anonymized Melanoma Research Opt-In
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  De-identified ABCDE ratios contribute to non-profit dermatological study benchmarks.
                </p>
              </div>
              <input
                type="checkbox"
                checked={consent.anonymizedResearch}
                onChange={(e) => onUpdateConsent({ anonymizedResearch: e.target.checked })}
                className="mt-1 h-4 w-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            {/* Consent Item 4 */}
            <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Affiliate Link Referral Tracking
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Permits partner retail links to credit referral commissions to support free services.
                </p>
              </div>
              <input
                type="checkbox"
                checked={consent.affiliateTracking}
                onChange={(e) => onUpdateConsent({ affiliateTracking: e.target.checked })}
                className="mt-1 h-4 w-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400">
            Last modified timestamp: <span className="font-mono">{consent.updatedAt}</span>
          </div>
        </div>

        {/* Right Column: Data Subject Rights (Portability & Erasure) */}
        <div className="space-y-5">
          {/* Right to Data Portability */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Right to Data Portability (Art. 20)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Export your complete skin profile, ABCDE time-series metrics, lesion evolution deltas, and personalized routine history in open structured JSON format.
            </p>

            <button
              onClick={handleExportDecryptedJson}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Complete Health Dossier (.json)</span>
            </button>
          </div>

          {/* Right to Erasure / Cryptographic Shredding */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-rose-200 dark:border-rose-900/50 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <Trash2 className="w-5 h-5" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Right to Erasure / Cryptographic Shredding (Art. 17)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Permanent zero-knowledge destruction. Overwrites PBKDF2 salt with high-entropy pseudo-random noise, revokes the derived AES-GCM keys, and eliminates all local database records from this device.
            </p>

            {!shredConfirmOpen ? (
              <button
                onClick={() => setShredConfirmOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Initiate Cryptographic Shredding</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 space-y-3">
                <p className="text-xs font-semibold text-rose-900 dark:text-rose-200">
                  Confirm permanent data destruction? All {records.length} encrypted scans will be permanently irrecoverable.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExecuteShred}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
                  >
                    Confirm & Shred Keys
                  </button>
                  <button
                    onClick={() => setShredConfirmOpen(false)}
                    className="py-1.5 px-3 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
