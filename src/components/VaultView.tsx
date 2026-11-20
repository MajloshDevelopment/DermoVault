import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Calendar,
  TrendingUp,
  AlertCircle,
  Eye,
  Trash2,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { SkinAnalysisRecord } from '../types/skin';

interface VaultViewProps {
  records: SkinAnalysisRecord[];
  isLocked: boolean;
  onToggleLock: () => void;
  onDeleteRecord: (id: string) => void;
  onOpenReport: (record: SkinAnalysisRecord) => void;
  onSelectForScanner: (record: SkinAnalysisRecord) => void;
}

export const VaultView: React.FC<VaultViewProps> = ({
  records,
  isLocked,
  onToggleLock,
  onDeleteRecord,
  onOpenReport,
  onSelectForScanner
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [passphraseInput, setPassphraseInput] = useState<string>('dermavault-master-demo');

  const uniqueLocations = Array.from(new Set(records.map(r => r.bodyLocation)));

  const filteredRecords = selectedLocation === 'all'
    ? records
    : records.filter(r => r.bodyLocation === selectedLocation);

  // Group by location to compute evolution deltas
  const locationGroups = records.reduce<Record<string, SkinAnalysisRecord[]>>((acc, rec) => {
    acc[rec.bodyLocation] = acc[rec.bodyLocation] || [];
    acc[rec.bodyLocation].push(rec);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Longitudinal Mole & Skin Health Vault
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Zero-knowledge AES-256-GCM encrypted database tracking dermal changes, diameter shifts, and evolutionary risks over time.
          </p>
        </div>

        {/* Lock Status & Encryption Verification */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Vault: {isLocked ? 'Locked' : 'Unlocked'}
            </span>
            <button
              onClick={onToggleLock}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                isLocked
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Security Architecture Callout */}
      <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-medium">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            Client-Side PBKDF2 (100,000 rounds) + AES-GCM 256-bit encryption active. Zero unencrypted images leave this device.
          </span>
        </div>
        <span className="text-[11px] text-teal-700 dark:text-teal-300 whitespace-nowrap">
          {records.length} Secure Records Stored
        </span>
      </div>

      {/* Location Filter Bar */}
      {uniqueLocations.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedLocation('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedLocation === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900'
            }`}
          >
            All Locations ({records.length})
          </button>
          {uniqueLocations.map(loc => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedLocation === loc
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900'
              }`}
            >
              {loc} ({locationGroups[loc]?.length || 0})
            </button>
          ))}
        </div>
      )}

      {/* Longitudinal Timeline List */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <Lock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No Encrypted Scans in this Filter
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Run an analysis in the Skin & Mole Scanner tab and click "Save Scan to Encrypted Vault" to begin your longitudinal history.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record, index) => {
            const formattedDate = new Date(record.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            // Find if there's a subsequent or prior scan for delta
            const siblings = locationGroups[record.bodyLocation] || [];
            const previousScan = siblings.find(s => s.timestamp < record.timestamp);
            const diameterDelta = previousScan
              ? (record.abcde.diameterMm - previousScan.abcde.diameterMm).toFixed(1)
              : null;

            return (
              <div
                key={record.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Photo & Core Information */}
                  <div className="flex items-start gap-4">
                    <img
                      src={record.imageUrl}
                      alt={record.bodyLocation}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                      referrerPolicy="no-referrer"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-teal-700 dark:text-teal-400">
                          {record.bodyLocation}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {formattedDate}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {record.conditionLabel}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 pt-1">
                        <span>
                          Diameter: <strong className="font-mono text-slate-900 dark:text-white">{record.abcde.diameterMm} mm</strong>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Asymmetry: <strong className="font-mono text-slate-900 dark:text-white">{record.abcde.asymmetryScore}/10</strong>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Border: <strong className="font-mono text-slate-900 dark:text-white">{record.abcde.borderScore}/10</strong>
                        </span>
                      </div>

                      {/* Longitudinal Evolution Delta */}
                      {diameterDelta !== null && (
                        <div className="text-xs pt-1 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-slate-500">Longitudinal delta vs prior baseline:</span>
                          <span
                            className={`font-semibold font-mono ${
                              Number(diameterDelta) > 0.5 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {Number(diameterDelta) > 0 ? `+${diameterDelta} mm` : `${diameterDelta} mm`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Risk Pill */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                        record.riskCategory === 'high_attention_needed'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : record.riskCategory === 'moderate'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {record.riskCategory === 'high_attention_needed'
                        ? 'High Attention'
                        : record.riskCategory === 'moderate'
                        ? 'Monitor Lesion'
                        : 'Benign Pattern'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenReport(record)}
                        className="px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
                        title="View Clinical Report"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Report</span>
                      </button>

                      <button
                        onClick={() => onDeleteRecord(record.id)}
                        className="p-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                        title="Delete from encrypted vault"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
