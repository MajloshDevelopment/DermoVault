import React from 'react';
import { Camera, Sparkles, FolderLock, Shield, Wifi, Battery } from 'lucide-react';

interface DeviceFrameProps {
  viewMode: 'responsive' | 'mobile_shell';
  activeTab: 'scanner' | 'routine' | 'vault' | 'gdpr';
  setActiveTab: (tab: 'scanner' | 'routine' | 'vault' | 'gdpr') => void;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  viewMode,
  activeTab,
  setActiveTab,
  children
}) => {
  if (viewMode === 'responsive') {
    return (
      <div className="min-h-screen flex flex-col pb-16 md:pb-8">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
          {children}
        </main>
      </div>
    );
  }

  // Mobile Native React Native Frame simulation
  return (
    <div className="min-h-screen bg-slate-200 dark:bg-slate-950 py-4 sm:py-8 flex flex-col items-center justify-center">
      {/* Device Simulation Container */}
      <div className="w-full max-w-[410px] h-[860px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/60 flex flex-col relative overflow-hidden">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-end px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/80" />
        </div>

        {/* Screen Bezel */}
        <div className="w-full h-full bg-slate-50 dark:bg-slate-900 rounded-[38px] flex flex-col overflow-hidden relative @container">
          {/* iOS / Native Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-800 dark:text-slate-200 shrink-0 z-40 select-none">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Scrollable View Area */}
          <div className="flex-1 overflow-y-auto px-3.5 py-3 pb-20 mobile-simulator-content">
            {children}
          </div>

          {/* Native Bottom Tab Bar (Ergonomic Thumb Reach Zone) */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 items-center z-40 px-2 pb-safe">
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
          </div>
        </div>
      </div>
    </div>
  );
};
