import React, { useState } from 'react';
import { Sparkles, Check, X, Shield, Cpu, FileText, Zap } from 'lucide-react';
import { UserSubscription } from '../types/skin';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  onUpdateSubscription: (sub: UserSubscription) => void;
}

export const ProModal: React.FC<ProModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onUpdateSubscription
}) => {
  if (!isOpen) return null;

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(subscription.billingCycle);

  const handleToggleUpgrade = () => {
    const newStatus = !subscription.proActive;
    onUpdateSubscription({
      tier: newStatus ? 'pro' : 'free',
      proActive: newStatus,
      billingCycle,
      planName: newStatus ? 'DermaGuard Elite' : 'Standard Free'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>DermaGuard Elite Subscription</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Advanced Dermatological Intelligence
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Unlock Gemini 4 Carbon High Thinking clinical differential reasoning, unlimited longitudinal mole tracking, and exportable physician dossiers.
        </p>

        {/* Billing Selector */}
        <div className="flex items-center justify-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl my-6 max-w-xs mx-auto">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Monthly ($9.99/mo)
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
              billingCycle === 'annual'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Annual ($79/yr · Save 34%)
          </button>
        </div>

        {/* Feature Comparison */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span><strong>Gemini 4 Carbon High Thinking</strong>: Multi-step dermatological differential reasoning</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span><strong>Unlimited Longitudinal Mole Mapping</strong>: Time-series delta metrics & growth alerts</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span><strong>Clinical PDF Dossier Generator</strong>: Formatted reports for your in-person dermatologist</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span><strong>Active Ingredient Conflict Matrix</strong>: Flags harmful chemical interactions (e.g. Retinol + AHA)</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleToggleUpgrade}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
            subscription.proActive
              ? 'bg-slate-700 hover:bg-slate-800'
              : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/25 active:scale-[0.99]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {subscription.proActive
              ? 'Downgrade to Standard Free Tier'
              : `Activate ${billingCycle === 'annual' ? '$79/Year' : '$9.99/Month'} Elite Tier`}
          </span>
        </button>

        <p className="text-[11px] text-center text-slate-400 mt-3">
          Simulated instant subscription activation · Cancel anytime with zero fee
        </p>
      </div>
    </div>
  );
};
