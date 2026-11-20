import React from 'react';
import { ShieldCheck, Lock, Sparkles, Smartphone, Monitor } from 'lucide-react';
import { UserSubscription } from '../types/skin';

interface TopBarProps {
  activeTab: 'scanner' | 'routine' | 'vault' | 'gdpr';
  setActiveTab: (tab: 'scanner' | 'routine' | 'vault' | 'gdpr') => void;
  subscription: UserSubscription;
  onOpenProModal: () => void;
  isVaultLocked: boolean;
  onToggleVaultLock: () => void;
  viewMode: 'responsive' | 'mobile_shell';
  onToggleViewMode: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  subscription,
  onOpenProModal,
  isVaultLocked,
  onToggleVaultLock,
  viewMode,
  onToggleViewMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-teal-500/20">
            DV
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
            DermaVault <span className="text-teal-600 dark:text-teal-400">AI</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'scanner'
                ? 'border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Skin & Mole Scanner
          </button>
          <button
            onClick={() => setActiveTab('routine')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'routine'
                ? 'border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Personalized Routine
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'vault'
                ? 'border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Longitudinal Vault
          </button>
          <button
            onClick={() => setActiveTab('gdpr')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'gdpr'
                ? 'border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            GDPR & Privacy
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Simulator View Switcher */}
          <button
            onClick={onToggleViewMode}
            title={viewMode === 'mobile_shell' ? 'Switch to Fullscreen Canvas' : 'Preview React Native Mobile Frame'}
            aria-label="Toggle device view mode"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            {viewMode === 'mobile_shell' ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop Canvas</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Preview</span>
              </>
            )}
          </button>

          {/* Vault Lock Status */}
          <button
            onClick={onToggleVaultLock}
            title={isVaultLocked ? 'Encrypted Vault is Locked' : 'Encrypted Vault is Active'}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            <Lock className={`w-3.5 h-3.5 ${isVaultLocked ? 'text-amber-500' : 'text-emerald-500'}`} />
            <span className="hidden lg:inline">{isVaultLocked ? 'Locked' : 'AES-256'}</span>
          </button>

          {/* Primary Action: Pro Tier */}
          <button
            onClick={onOpenProModal}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm ${
              subscription.proActive
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{subscription.proActive ? 'Elite Active' : 'Upgrade to Pro'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
