import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { ScannerView } from './components/ScannerView';
import { RoutineView } from './components/RoutineView';
import { VaultView } from './components/VaultView';
import { GdprView } from './components/GdprView';
import { ProModal } from './components/ProModal';
import { ReasoningTraceModal } from './components/ReasoningTraceModal';
import { ClinicalReportModal } from './components/ClinicalReportModal';
import { DeviceFrame } from './components/DeviceFrame';
import {
  SkinAnalysisRecord,
  UserConsentLedger,
  UserSubscription,
  HighThinkingAnalysis
} from './types/skin';
import { Camera, Sparkles, FolderLock, Shield } from 'lucide-react';

// Seed initial longitudinal baseline data for testing evolution tracking
const INITIAL_VAULT_RECORDS: SkinAnalysisRecord[] = [
  {
    id: 'scan-baseline-001',
    timestamp: Date.now() - 65 * 24 * 60 * 60 * 1000, // 65 days ago
    bodyLocation: 'Left Forearm',
    imageUrl: '/src/assets/images/derm_lesion_sample_1794495427395.jpg',
    isEncrypted: true,
    isEdgeInference: true,
    condition: 'benign_nevus',
    conditionLabel: 'Benign Melanocytic Compound Nevus (Baseline)',
    riskCategory: 'low',
    confidence: 96.4,
    abcde: {
      asymmetryScore: 2.1,
      asymmetryDetail: 'Uniform bilateral contours',
      borderScore: 1.8,
      borderDetail: 'Smooth continuous perimeter',
      colorScore: 2.0,
      colorsIdentified: ['Uniform light brown'],
      diameterMm: 4.1,
      diameterScore: 2.0,
      evolutionStatus: 'baseline',
      overallAbcdeScore: 22
    },
    skinMetrics: {
      hydration: 68,
      rednessErythema: 18,
      textureSmoothness: 82,
      oilBalance: 48,
      poreVisibility: 24,
      barrierHealth: 85
    },
    skinType: 'combination',
    primaryConcerns: ['Routine Dermoscopy Check', 'Baseline Pigment Tracking'],
    clinicalObservations: [
      'Regular reticular pigment pattern.',
      'Circumscribed borders with no peripheral extension.',
      'Baseline registered in encrypted longitudinal vault.'
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'routine' | 'vault' | 'gdpr'>('scanner');
  const [viewMode, setViewMode] = useState<'responsive' | 'mobile_shell'>('responsive');
  const [isVaultLocked, setIsVaultLocked] = useState<boolean>(false);
  const [vaultRecords, setVaultRecords] = useState<SkinAnalysisRecord[]>(INITIAL_VAULT_RECORDS);

  // Pro Subscription State
  const [subscription, setSubscription] = useState<UserSubscription>({
    tier: 'free',
    proActive: false,
    billingCycle: 'monthly',
    planName: 'Standard Free'
  });
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);

  // Modal States
  const [activeThinkingModal, setActiveThinkingModal] = useState<HighThinkingAnalysis | null>(null);
  const [activeReportModal, setActiveReportModal] = useState<SkinAnalysisRecord | null>(null);

  // GDPR Consent Ledger State
  const [consentLedger, setConsentLedger] = useState<UserConsentLedger>({
    biometricImageProcessing: true,
    encryptedLocalStorage: true,
    anonymizedResearch: false,
    affiliateTracking: true,
    updatedAt: new Date().toISOString(),
    consentVersion: 'GDPR-v2.1'
  });

  // Handle saving a new scan
  const handleSaveToVault = (newRecord: SkinAnalysisRecord) => {
    setVaultRecords(prev => [newRecord, ...prev]);
  };

  // Handle deleting a scan
  const handleDeleteRecord = (id: string) => {
    setVaultRecords(prev => prev.filter(r => r.id !== id));
  };

  // Handle full purge / cryptographic shred
  const handlePurgeAllData = () => {
    setVaultRecords([]);
    setSubscription({
      tier: 'free',
      proActive: false,
      billingCycle: 'monthly',
      planName: 'Standard Free'
    });
  };

  const handleUpdateConsent = (updated: Partial<UserConsentLedger>) => {
    setConsentLedger(prev => ({
      ...prev,
      ...updated,
      updatedAt: new Date().toISOString()
    }));
  };

  return (
    <div className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Top Bar Contract (Wordmark, Nav links, 1 primary action) */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        subscription={subscription}
        onOpenProModal={() => setIsProModalOpen(true)}
        isVaultLocked={isVaultLocked}
        onToggleVaultLock={() => setIsVaultLocked(prev => !prev)}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(prev => prev === 'responsive' ? 'mobile_shell' : 'responsive')}
      />

      {/* Main View Shell */}
      <DeviceFrame
        viewMode={viewMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {activeTab === 'scanner' && (
          <ScannerView
            subscription={subscription}
            onSaveToVault={handleSaveToVault}
            onOpenThinkingModal={(data) => setActiveThinkingModal(data)}
            onOpenClinicalReport={(rec) => setActiveReportModal(rec)}
            vaultRecords={vaultRecords}
          />
        )}

        {activeTab === 'routine' && (
          <RoutineView />
        )}

        {activeTab === 'vault' && (
          <VaultView
            records={vaultRecords}
            isLocked={isVaultLocked}
            onToggleLock={() => setIsVaultLocked(prev => !prev)}
            onDeleteRecord={handleDeleteRecord}
            onOpenReport={(rec) => setActiveReportModal(rec)}
            onSelectForScanner={(rec) => {
              setActiveTab('scanner');
            }}
          />
        )}

        {activeTab === 'gdpr' && (
          <GdprView
            records={vaultRecords}
            consent={consentLedger}
            onUpdateConsent={handleUpdateConsent}
            onPurgeAllData={handlePurgeAllData}
          />
        )}
      </DeviceFrame>

      {/* Mobile Fixed Bottom Nav for Small Screen Touch Viewports (only shown on native mobile screen sizes) */}
      {viewMode === 'responsive' && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 items-center h-16 px-2 pb-safe shadow-lg"
        >
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeTab === 'scanner'
                ? 'text-teal-600 dark:text-teal-400 font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('routine')}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeTab === 'routine'
                ? 'text-teal-600 dark:text-teal-400 font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Routine</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeTab === 'vault'
                ? 'text-teal-600 dark:text-teal-400 font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FolderLock className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('gdpr')}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeTab === 'gdpr'
                ? 'text-teal-600 dark:text-teal-400 font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Privacy</span>
          </button>
        </nav>
      )}

      {/* Modals */}
      <ProModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        subscription={subscription}
        onUpdateSubscription={(sub) => setSubscription(sub)}
      />

      <ReasoningTraceModal
        isOpen={Boolean(activeThinkingModal)}
        onClose={() => setActiveThinkingModal(null)}
        highThinking={activeThinkingModal}
      />

      <ClinicalReportModal
        isOpen={Boolean(activeReportModal)}
        onClose={() => setActiveReportModal(null)}
        record={activeReportModal}
      />
    </div>
  );
}
