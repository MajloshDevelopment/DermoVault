import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Circle,
  ShieldAlert,
  Flame,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SkincareProduct, SkinType } from '../types/skin';
import { AFFILIATE_PRODUCT_CATALOG, generatePersonalizedRoutine } from '../utils/abcde';

interface RoutineViewProps {
  onOpenProductModal?: (product: SkincareProduct) => void;
}

export const RoutineView: React.FC<RoutineViewProps> = () => {
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType>('sensitive');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([
    'Melanoma Prevention',
    'Barrier Repair'
  ]);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    'prod-gentle-cleanser': true,
    'prod-mineral-sunscreen': true
  });
  const [expandedIngredients, setExpandedIngredients] = useState<Record<string, boolean>>({});
  const [streakDays, setStreakDays] = useState<number>(8);

  const availableConcerns = [
    'Melanoma Prevention',
    'Barrier Repair',
    'Redness & Erythema',
    'Hyperpigmentation',
    'Anti-Aging / Retinoids',
    'Pore Clarifying'
  ];

  const routine = generatePersonalizedRoutine(selectedSkinType, selectedConcerns);

  const toggleStep = (id: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleIngredientExpand = (id: string) => {
    setExpandedIngredients(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleConcern = (concern: string) => {
    setSelectedConcerns(prev =>
      prev.includes(concern) ? prev.filter(c => c !== concern) : [...prev, concern]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Streak Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Personalized Dermatological Regimen
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Custom AM & PM evidence-based active ingredient schedules tuned to your skin scans and barrier indices.
          </p>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl px-4 py-2.5 self-start md:self-auto">
          <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
          <div>
            <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
              {streakDays}-Day Routine Streak
            </div>
            <div className="text-[11px] text-amber-700 dark:text-amber-300">
              Skin barrier recovering steadily
            </div>
          </div>
        </div>
      </div>

      {/* Profile Filters: Skin Type & Concerns */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
            Target Skin Type
          </span>
          <div className="flex flex-wrap gap-2">
            {(['normal', 'dry', 'oily', 'combination', 'sensitive'] as SkinType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedSkinType(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                  selectedSkinType === type
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
            Target Concerns & Clinical Goals
          </span>
          <div className="flex flex-wrap gap-2">
            {availableConcerns.map((concern) => {
              const active = selectedConcerns.includes(concern);
              return (
                <button
                  key={concern}
                  onClick={() => toggleConcern(concern)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {concern}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Routine Grid: AM & PM Regimen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Morning Regimen */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Sun className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AM · Morning Shield Regimen
            </h2>
            <span className="text-xs text-slate-400 ml-auto">Cleanse, Nourish & SPF Defend</span>
          </div>

          <div className="space-y-3">
            {routine.amProducts.map((product) => {
              const isCompleted = completedSteps[product.id];
              const isExpanded = expandedIngredients[product.id];
              return (
                <div
                  key={product.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border transition-all ${
                    isCompleted
                      ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Completion Checkbox */}
                    <button
                      onClick={() => toggleStep(product.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                      title={isCompleted ? 'Mark step incomplete' : 'Mark step done'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    {/* Product Thumbnail */}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100 dark:border-slate-800"
                      referrerPolicy="no-referrer"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                          Step {product.stepNumber} · {product.category}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                          {product.price}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                        {product.name}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {product.brand} · <span className="text-amber-500">★ {product.rating}</span> ({product.reviewCount} reviews)
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {product.matchReason}
                      </p>

                      {/* Expandable Active Ingredients */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => toggleIngredientExpand(product.id)}
                          className="text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                        >
                          <span>Active Actives: {product.activeIngredients[0]}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        {isExpanded && (
                          <div className="mt-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                            <div>
                              <strong>Key Actives:</strong> {product.activeIngredients.join(', ')}
                            </div>
                            <div>
                              <strong>Clinical Benefits:</strong> {product.keyBenefits.join(' · ')}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Affiliate Action Button */}
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <a
                          href={product.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                        >
                          <span>Buy via {product.retailer}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <span className="text-[10px] text-slate-400 truncate">
                          Partner affiliate commission supports free scans
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Evening Regimen */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Moon className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              PM · Night Recovery Regimen
            </h2>
            <span className="text-xs text-slate-400 ml-auto">Repair, Retinal & Lipid Barrier</span>
          </div>

          <div className="space-y-3">
            {routine.pmProducts.map((product) => {
              const isCompleted = completedSteps[product.id];
              const isExpanded = expandedIngredients[product.id];
              return (
                <div
                  key={product.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border transition-all ${
                    isCompleted
                      ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleStep(product.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                      title={isCompleted ? 'Mark step incomplete' : 'Mark step done'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100 dark:border-slate-800"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                          Step {product.stepNumber} · {product.category}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                          {product.price}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                        {product.name}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {product.brand} · <span className="text-amber-500">★ {product.rating}</span> ({product.reviewCount} reviews)
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {product.matchReason}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => toggleIngredientExpand(product.id)}
                          className="text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                        >
                          <span>Active Actives: {product.activeIngredients[0]}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        {isExpanded && (
                          <div className="mt-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                            <div>
                              <strong>Key Actives:</strong> {product.activeIngredients.join(', ')}
                            </div>
                            <div>
                              <strong>Clinical Benefits:</strong> {product.keyBenefits.join(' · ')}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <a
                          href={product.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                        >
                          <span>Buy via {product.retailer}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <span className="text-[10px] text-slate-400 truncate">
                          Partner affiliate commission supports free scans
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FTC & Regulatory Affiliate Transparency Banner */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            Affiliate Transparency & Editorial Independence
          </p>
          <p className="text-[11px] leading-relaxed">
            DermaVault AI recommends formulations vetted for dermatological efficacy. Links on this page are partner affiliate links. If you purchase through these links, DermaVault may earn an affiliate referral fee (typically 5–10%) at zero extra cost to you. This enables us to maintain free on-device privacy encryption and offline computer vision models.
          </p>
        </div>
      </div>
    </div>
  );
};
