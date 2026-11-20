import React from 'react';
import { X, Printer, Shield, FileText, CheckCircle2, Download } from 'lucide-react';
import { SkinAnalysisRecord } from '../types/skin';

interface ClinicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: SkinAnalysisRecord | null;
}

export const ClinicalReportModal: React.FC<ClinicalReportModalProps> = ({
  isOpen,
  onClose,
  record
}) => {
  if (!isOpen || !record) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:p-0 print:bg-white">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto print:border-none print:shadow-none print:max-h-none print:p-4">
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="print:hidden absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Clinical Document Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                DV
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                DermaVault Clinical Screening Dossier
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Patient Adjunct Summary for Dermatologist & Primary Care Consultation
            </p>
          </div>

          <div className="text-right text-[11px] font-mono text-slate-500">
            <div>Doc ID: {record.id}</div>
            <div>Date: {new Date(record.timestamp).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Clinical Summary Grid */}
        <div className="space-y-4 text-xs">
          {/* Lesion & Image Overview */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <img
              src={record.imageUrl}
              alt={record.bodyLocation}
              className="w-24 h-24 rounded-lg object-cover border border-slate-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1">
              <div className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                Anatomical Location
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {record.bodyLocation}
              </div>
              <div className="pt-1">
                <span className="text-slate-500">Preliminary Assessment:</span>{' '}
                <strong className="text-slate-900 dark:text-white">{record.conditionLabel}</strong>
              </div>
              <div>
                <span className="text-slate-500">Classification Confidence:</span>{' '}
                <span className="font-mono">{record.confidence.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* ABCDE Matrix Table */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              Dermoscopic ABCDE Metrics Table
            </h3>
            <table className="w-full border-collapse border border-slate-200 dark:border-slate-700 text-left">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-[11px]">
                  <th className="p-2 border border-slate-200 dark:border-slate-700">Criterion</th>
                  <th className="p-2 border border-slate-200 dark:border-slate-700">Calculated Value</th>
                  <th className="p-2 border border-slate-200 dark:border-slate-700">Clinical Observation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-slate-200 dark:border-slate-700 font-semibold">A · Asymmetry</td>
                  <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono">{record.abcde.asymmetryScore}/10</td>
                  <td className="p-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">{record.abcde.asymmetryDetail}</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 dark:border-slate-700 font-semibold">B · Border</td>
                  <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono">{record.abcde.borderScore}/10</td>
                  <td className="p-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">{record.abcde.borderDetail}</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 dark:border-slate-700 font-semibold">C · Color</td>
                  <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono">{record.abcde.colorScore}/10</td>
                  <td className="p-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">{record.abcde.colorsIdentified.join(', ')}</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 dark:border-slate-700 font-semibold">D · Diameter</td>
                  <td className="p-2 border border-slate-200 dark:border-slate-700 font-mono">{record.abcde.diameterMm} mm</td>
                  <td className="p-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Measured across widest transaxial margin</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 dark:border-slate-700 font-semibold">E · Evolution</td>
                  <td className="p-2 border border-slate-200 dark:border-slate-700 capitalize font-mono">{record.abcde.evolutionStatus.replace('_', ' ')}</td>
                  <td className="p-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Longitudinal vault status verification</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Clinical Findings & Recommendations */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white">
              Observations for Attending Clinician
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
              {record.clinicalObservations.map((obs, i) => (
                <li key={i}>{obs}</li>
              ))}
            </ul>
          </div>

          {/* Statutory Medical Warning */}
          <div className="text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
            <strong>NOTICE TO CLINICIAN:</strong> This report is produced by DermaVault AI client software utilizing on-device computer vision and the Google Gemini 4 Carbon API. It is provided solely as supplementary screening documentation. Clinical decisions, excisions, and diagnoses must be based on standard dermatoscope examination and histopathology.
          </div>
        </div>

        {/* Actions (Hidden on Print) */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
