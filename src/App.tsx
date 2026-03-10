/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  Sword,
  Shield,
  Target,
  Hammer,
  Clock,
  Info,
  TrendingUp,
  RefreshCw,
  Download,
  X,
  Building2
} from 'lucide-react';
import { UNIT_DATA } from './data/unitData';
import { BUILDINGS } from './data/buildingData';
import { UnitType, CalculatorState, ResourceCost } from './types';
import { translations } from './translations';

const TIER_COLORS: Record<number, string> = {
  1: 'bg-slate-500',
  2: 'bg-emerald-500',
  3: 'bg-sky-500',
  4: 'bg-violet-500',
  5: 'bg-orange-500',
  6: 'bg-red-500',
  7: 'bg-amber-500',
  8: 'bg-rose-600',
  9: 'bg-fuchsia-600',
};

const UNIT_ICONS: Record<UnitType, React.ReactNode> = {
  infantry: <Shield className="w-5 h-5" />,
  cavalry: <Sword className="w-5 h-5" />,
  archer: <Target className="w-5 h-5" />,
  siege: <Hammer className="w-5 h-5" />,
};

const RES_COLORS: Record<string, string> = {
  food: 'text-orange-400',
  wood: 'text-emerald-400',
  stone: 'text-slate-300',
  gold: 'text-yellow-400',
};

export default function App() {
  const [lang, setLang] = useState<'en' | 'tr'>('tr');
  const t = translations[lang];

  const [state, setState] = useState<CalculatorState>({
    unitType: 'infantry',
    targetTier: 8,
    currentTier: 1,
    amount: 1000,
    researchBuff: 0,
    trainingBuff: 0,
  });

  const [activeTab, setActiveTab] = useState<'training' | 'research' | 'buildings' | 'data'>('training');

  // Building state
  const [selectedBuilding, setSelectedBuilding] = useState(BUILDINGS[0].id);
  const [buildingFromLevel, setBuildingFromLevel] = useState(1);
  const [buildingToLevel, setBuildingToLevel] = useState(10);
  const [buildingBuff, setBuildingBuff] = useState(0);

  // PWA Install
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Also show for iOS (no beforeinstallprompt)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isIOS && !isStandalone) {
      setShowInstallBanner(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
    }
    setShowInstallBanner(false);
  };

  // Unit calculations
  const unitData = useMemo(() => UNIT_DATA[state.unitType], [state.unitType]);

  const targetUnit = useMemo(() =>
    unitData.find(u => u.tier === state.targetTier),
    [unitData, state.targetTier]);

  const currentUnit = useMemo(() =>
    unitData.find(u => u.tier === state.currentTier),
    [unitData, state.currentTier]);

  const calculations = useMemo(() => {
    if (!targetUnit) return null;

    const buffMultiplier = 1 / (1 + state.trainingBuff / 100);
    const isUpgrade = state.currentTier < state.targetTier && currentUnit;

    let baseTime = targetUnit.trainingTimeSeconds;
    let baseCost = { ...targetUnit.trainingCost };

    if (isUpgrade && currentUnit) {
      baseTime = Math.max(0, targetUnit.trainingTimeSeconds - currentUnit.trainingTimeSeconds);
      baseCost = {
        food: Math.max(0, targetUnit.trainingCost.food - currentUnit.trainingCost.food),
        wood: Math.max(0, targetUnit.trainingCost.wood - currentUnit.trainingCost.wood),
        stone: Math.max(0, targetUnit.trainingCost.stone - currentUnit.trainingCost.stone),
        gold: Math.max(0, targetUnit.trainingCost.gold - currentUnit.trainingCost.gold),
      };
    }

    const totalTimeSeconds = baseTime * state.amount * buffMultiplier;
    const totalCost: ResourceCost = {
      food: baseCost.food * state.amount,
      wood: baseCost.wood * state.amount,
      stone: baseCost.stone * state.amount,
      gold: baseCost.gold * state.amount,
    };

    const researchBuffMultiplier = 1 / (1 + state.researchBuff / 100);
    const researchTimeSeconds = (targetUnit.researchTimeSeconds || 0) * researchBuffMultiplier;
    const researchCost: ResourceCost = targetUnit.researchCost || { food: 0, wood: 0, stone: 0, gold: 0 };

    return {
      totalTimeSeconds,
      totalCost,
      formattedTime: formatTime(totalTimeSeconds),
      isUpgrade,
      researchTimeSeconds,
      formattedResearchTime: formatTime(researchTimeSeconds),
      researchCost,
    };
  }, [targetUnit, currentUnit, state.amount, state.trainingBuff, state.researchBuff, state.currentTier, state.targetTier]);

  // Building calculations
  const buildingCalc = useMemo(() => {
    const building = BUILDINGS.find(b => b.id === selectedBuilding);
    if (!building) return null;

    const levelsInRange = building.levels.filter(l => l.level > buildingFromLevel && l.level <= buildingToLevel);
    const buffMult = 1 / (1 + buildingBuff / 100);

    const totalCost: ResourceCost = { food: 0, wood: 0, stone: 0, gold: 0 };
    let totalTime = 0;
    let totalPower = 0;

    levelsInRange.forEach(l => {
      totalCost.food += l.upgradeCost.food;
      totalCost.wood += l.upgradeCost.wood;
      totalCost.stone += l.upgradeCost.stone;
      totalCost.gold += l.upgradeCost.gold;
      totalTime += l.upgradeTimeSeconds;
      totalPower += l.power;
    });

    totalTime *= buffMult;

    return { totalCost, totalTime, totalPower, levels: levelsInRange, building, formattedTime: formatTime(totalTime) };
  }, [selectedBuilding, buildingFromLevel, buildingToLevel, buildingBuff]);

  function formatTime(seconds: number) {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const parts = [];
    if (days > 0) parts.push(`${days}${lang === 'tr' ? 'g' : 'd'}`);
    if (hours > 0) parts.push(`${hours}${lang === 'tr' ? 's' : 'h'}`);
    if (minutes > 0) parts.push(`${minutes}${lang === 'tr' ? 'dk' : 'm'}`);

    return parts.length > 0 ? parts.join(' ') : '< 1m';
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const tabClasses = (tab: string) =>
    `flex-1 py-3 text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${activeTab === tab
      ? 'border-amber-400 text-amber-400 bg-white/5'
      : 'border-transparent text-slate-500 hover:text-slate-300'
    }`;

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#E2E8F0] font-sans selection:bg-amber-400 selection:text-slate-900">

      {/* PWA Install Banner */}
      <AnimatePresence>
        {showInstallBanner && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-3 flex items-center justify-between gap-3 relative z-50"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Download className="w-5 h-5 shrink-0" />
              <span className="text-xs sm:text-sm font-medium truncate">{t.installPrompt}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleInstall}
                className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {t.installApp}
              </button>
              <button onClick={() => setShowInstallBanner(false)} className="p-1 hover:bg-white/10 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b border-slate-700/50 px-4 sm:px-6 py-4 flex justify-between items-center bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-lg shadow-lg shadow-amber-900/30">
            <Calculator className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-serif font-bold tracking-wide text-amber-100 leading-none">
              Age of Empires
            </h1>
            <p className="text-[9px] sm:text-[10px] font-mono text-slate-500 uppercase tracking-[0.15em] mt-0.5">
              {t.subtitle}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase transition-colors ${lang === 'en' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('tr')}
              className={`px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase transition-colors ${lang === 'tr' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
            >
              TR
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[calc(100vh-61px)]">

        {/* Left Sidebar: Controls */}
        <aside className="lg:col-span-4 border-r border-slate-700/30 p-6 sm:p-8 space-y-8 bg-slate-900/30">

          {/* Unit Type Selection */}
          <section>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              {t.unitClassification}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['infantry', 'cavalry', 'archer', 'siege'] as UnitType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setState(s => ({ ...s, unitType: type }))}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-all ${state.unitType === type
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                      : 'border-slate-700/50 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                    }`}
                >
                  {UNIT_ICONS[type]}
                  <span className="text-xs font-semibold uppercase tracking-tight">{t[type]}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Tier Selection */}
          <section className="space-y-5">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                {t.currentTier}
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((tVal) => (
                  <button
                    key={tVal}
                    disabled={tVal >= state.targetTier}
                    onClick={() => setState(s => ({ ...s, currentTier: tVal }))}
                    className={`h-8 rounded border text-[10px] font-bold transition-all ${state.currentTier === tVal
                        ? 'bg-amber-500 text-slate-900 border-amber-400'
                        : tVal >= state.targetTier
                          ? 'opacity-20 cursor-not-allowed border-slate-700 text-slate-600'
                          : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                      }`}
                  >
                    {tVal === 0 ? t.newUnit : `T${tVal}`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                {t.targetTierLevel}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((tVal) => (
                  <button
                    key={tVal}
                    onClick={() => setState(s => {
                      const newState = { ...s, targetTier: tVal };
                      if (s.currentTier >= tVal) newState.currentTier = Math.max(0, tVal - 1);
                      return newState;
                    })}
                    className={`relative h-10 rounded-lg border font-bold text-sm transition-all ${state.targetTier === tVal
                        ? 'bg-slate-700 text-white border-slate-500'
                        : 'border-slate-700/50 text-slate-500 hover:border-slate-500 hover:text-white'
                      }`}
                  >
                    T{tVal}
                    {state.targetTier === tVal && (
                      <motion.div
                        layoutId="tier-indicator"
                        className={`absolute bottom-0 left-1 right-1 h-0.5 rounded-full ${TIER_COLORS[tVal]}`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Amount & Buffs */}
          <section className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {t.trainingQuantity}
                </label>
                <span className="text-xs font-mono font-bold text-amber-300">{state.amount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100"
                max="100000"
                step="100"
                value={state.amount}
                onChange={(e) => setState(s => ({ ...s, amount: parseInt(e.target.value) }))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex gap-2 mt-2">
                {[1000, 5000, 10000, 20000].map(val => (
                  <button
                    key={val}
                    onClick={() => setState(s => ({ ...s, amount: val }))}
                    className={`flex-1 text-[10px] font-mono py-1.5 rounded border transition-all ${state.amount === val
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'border-slate-700 text-slate-500 hover:text-white hover:border-slate-500'
                      }`}
                  >
                    {formatNumber(val)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  {t.trainingSpeedBuff}
                </label>
                <input
                  type="number"
                  value={state.trainingBuff}
                  onChange={(e) => setState(s => ({ ...s, trainingBuff: Math.max(0, parseInt(e.target.value) || 0) }))}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-lg p-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  {t.researchBuff}
                </label>
                <input
                  type="number"
                  value={state.researchBuff}
                  onChange={(e) => setState(s => ({ ...s, researchBuff: Math.max(0, parseInt(e.target.value) || 0) }))}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-lg p-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                  placeholder="0"
                />
              </div>
            </div>
          </section>

          <div className="pt-4 border-t border-slate-700/30">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30 flex items-start gap-2.5">
              <Info className="w-4 h-4 mt-0.5 text-slate-500 shrink-0" />
              <p className="text-[11px] leading-relaxed text-slate-400">
                {t.sidebarInfo}
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content: Results */}
        <div className="lg:col-span-8">

          {/* Tabs */}
          <div className="flex border-b border-slate-700/30">
            <button onClick={() => setActiveTab('training')} className={tabClasses('training')}>
              {t.trainingTab}
            </button>
            <button onClick={() => setActiveTab('research')} className={tabClasses('research')}>
              {t.researchTab}
            </button>
            <button onClick={() => setActiveTab('buildings')} className={tabClasses('buildings')}>
              {t.buildingsTab}
            </button>
            <button onClick={() => setActiveTab('data')} className={tabClasses('data')}>
              {t.dataTableTab}
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'training' ? (
                <motion.div
                  key="training"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-slate-700/50 p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-4 h-4 text-sky-400" />
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t.totalTimeRequired}</span>
                      </div>
                      <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                        {calculations?.formattedTime}
                      </div>
                      <div className="mt-3 text-[11px] font-mono text-slate-500">
                        {calculations?.totalTimeSeconds.toLocaleString()} {t.totalSeconds}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-700/50 p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t.unitStrength}</span>
                      </div>
                      <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                        {state.targetTier * 1250} <span className="text-lg text-slate-500">{t.power}</span>
                      </div>
                      <div className="mt-3 text-[11px] font-mono text-slate-500">
                        {t.estimatedPowerGain}
                      </div>
                    </div>
                  </div>

                  {/* Resource Grid */}
                  <section>
                    <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">
                      {calculations?.isUpgrade ? t.upgradeCost : t.resourceBreakdown}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(Object.entries(calculations?.totalCost || {}) as [string, number][]).map(([res, amount]) => (
                        <div key={res} className="rounded-lg border border-slate-700/50 p-4 bg-slate-800/40 hover:bg-slate-800/70 transition-all group">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[11px] font-semibold uppercase ${RES_COLORS[res]}`}>
                              {t[res as keyof typeof t] || res}
                            </span>
                          </div>
                          <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">{formatNumber(amount)}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Comparison Table */}
                  <section>
                    <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">{t.tierEfficiencyComparison}</h3>
                    <div className="rounded-xl border border-slate-700/50 overflow-hidden">
                      <div className="grid grid-cols-4 bg-slate-800 p-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        <span>{t.tier}</span>
                        <span>{t.costPerUnit}</span>
                        <span>{t.timePerUnit}</span>
                        <span>{t.powerPerRes}</span>
                      </div>
                      {unitData.slice(Math.max(0, state.targetTier - 3), state.targetTier + 1).map((u) => (
                        <div key={u.tier} className={`grid grid-cols-4 p-3.5 border-t border-slate-700/30 text-xs font-mono items-center ${u.tier === state.targetTier ? 'bg-amber-500/10 text-amber-200 font-bold' : 'text-slate-400'}`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${TIER_COLORS[u.tier]}`} />
                            T{u.tier}
                          </div>
                          <div>{formatNumber((Object.values(u.trainingCost) as number[]).reduce((a, b) => a + b, 0))}</div>
                          <div>{formatTime(u.trainingTimeSeconds)}</div>
                          <div className="text-emerald-400">{(u.tier / ((Object.values(u.trainingCost) as number[]).reduce((a, b) => a + b, 0) / 1000)).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                </motion.div>
              ) : activeTab === 'research' ? (
                <motion.div
                  key="research"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-r from-violet-600/20 to-sky-600/20 border border-violet-500/30 rounded-xl p-6">
                    <h2 className="text-xl font-serif font-bold text-white mb-1">{t.researchPath.replace('{tier}', state.targetTier.toString())}</h2>
                    <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">{t.militaryRequirements.replace('{unitType}', t[state.unitType])}</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: lang === 'tr' ? 'Gelişmiş Metalürji' : 'Advanced Metallurgy', level: state.targetTier * 2, status: 'required' },
                      { name: `${t[state.unitType]} ${lang === 'tr' ? 'Ustalığı' : 'Mastery'}`, level: state.targetTier + 5, status: 'required' },
                      { name: lang === 'tr' ? 'Taktik Formasyonları' : 'Tactical Formations', level: 10, status: 'recommended' },
                      { name: lang === 'tr' ? 'Elit Eğitim Alanı' : 'Elite Training Grounds', level: state.targetTier, status: 'required' },
                    ].map((req, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/60 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-xs font-bold text-amber-400">
                            {i + 1}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{req.name}</div>
                            <div className="text-[10px] font-mono text-slate-500">{t.requiredLevel}: {req.level}</div>
                          </div>
                        </div>
                        <div className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold uppercase ${req.status === 'required' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'}`}>
                          {t[req.status as keyof typeof t] || req.status}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-slate-700/50 p-6 bg-slate-800/30 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-violet-400" />
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t.baseResearchTime}</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{calculations?.formattedResearchTime}</div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-700/30">
                      {(Object.entries(calculations?.researchCost || {}) as [string, number][]).map(([res, amount]) => (
                        <div key={res} className="rounded-lg border border-slate-700/30 p-3 bg-slate-900/50">
                          <div className={`text-[10px] font-semibold uppercase mb-1 ${RES_COLORS[res]}`}>{t[res as keyof typeof t] || res}</div>
                          <div className="text-base font-bold text-white">{formatNumber(amount)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
                    <p className="text-xs text-amber-200/80">
                      {t.researchWarning.replace('{level}', state.targetTier === 9 ? '35' : (state.targetTier === 8 ? '25' : '23'))}
                    </p>
                    <div className="mt-3 bg-slate-800/50 rounded-lg p-3 text-[11px] font-mono text-sky-300">
                      {t.totalUnlockCost
                        .replace('{tier}', state.targetTier.toString())
                        .replace('{amount}', formatNumber(unitData.slice(0, state.targetTier).reduce((acc, u) => acc + (u.researchCost ? (Object.values(u.researchCost) as number[]).reduce((a, b) => a + b, 0) : 0), 0)))}
                    </div>
                  </div>
                </motion.div>
              ) : activeTab === 'buildings' ? (
                <motion.div
                  key="buildings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Building selection */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                      {t.selectBuilding}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {BUILDINGS.map(b => (
                        <button
                          key={b.id}
                          onClick={() => {
                            setSelectedBuilding(b.id);
                            setBuildingToLevel(Math.min(buildingToLevel, b.levels[b.levels.length - 1].level));
                          }}
                          className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${selectedBuilding === b.id
                              ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                              : 'border-slate-700/50 text-slate-400 hover:border-slate-500 hover:text-white'
                            }`}
                        >
                          <span className="text-lg">{b.icon}</span>
                          <div>
                            <div className="text-xs font-semibold">{lang === 'tr' ? b.nameTR : b.nameEN}</div>
                            <div className={`text-[9px] font-mono uppercase ${b.category === 'military' ? 'text-red-400' : b.category === 'economy' ? 'text-emerald-400' : 'text-sky-400'
                              }`}>
                              {t[b.category as keyof typeof t]}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Level range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                        {t.currentLevel}
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={buildingToLevel - 1}
                        value={buildingFromLevel}
                        onChange={(e) => setBuildingFromLevel(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-lg p-2.5 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                        {t.targetLevel}
                      </label>
                      <input
                        type="number"
                        min={buildingFromLevel + 1}
                        max={25}
                        value={buildingToLevel}
                        onChange={(e) => setBuildingToLevel(Math.max(buildingFromLevel + 1, parseInt(e.target.value) || buildingFromLevel + 1))}
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-lg p-2.5 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Building buff */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      {t.buildingSpeedBuff}
                    </label>
                    <input
                      type="number"
                      value={buildingBuff}
                      onChange={(e) => setBuildingBuff(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full max-w-[200px] bg-slate-800/60 border border-slate-700 rounded-lg p-2.5 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                      placeholder="0"
                    />
                  </div>

                  {/* Results */}
                  {buildingCalc && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="rounded-xl border border-slate-700/50 p-5 bg-gradient-to-br from-slate-800/80 to-slate-900/80">
                          <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-4 h-4 text-sky-400" />
                            <span className="text-[10px] font-semibold text-slate-400 uppercase">{t.upgradeTime}</span>
                          </div>
                          <div className="text-2xl font-bold text-white">{buildingCalc.formattedTime}</div>
                        </div>
                        <div className="rounded-xl border border-slate-700/50 p-5 bg-gradient-to-br from-slate-800/80 to-slate-900/80">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-semibold text-slate-400 uppercase">{t.powerGain}</span>
                          </div>
                          <div className="text-2xl font-bold text-white">{formatNumber(buildingCalc.totalPower)} <span className="text-sm text-slate-500">{t.power}</span></div>
                        </div>
                        <div className="rounded-xl border border-slate-700/50 p-5 bg-gradient-to-br from-slate-800/80 to-slate-900/80">
                          <div className="flex items-center gap-2 mb-3">
                            <Building2 className="w-4 h-4 text-amber-400" />
                            <span className="text-[10px] font-semibold text-slate-400 uppercase">{t.totalForRange}</span>
                          </div>
                          <div className="text-2xl font-bold text-amber-300">
                            {t.levelRange.replace('{from}', buildingFromLevel.toString()).replace('{to}', buildingToLevel.toString())}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {(Object.entries(buildingCalc.totalCost) as [string, number][]).map(([res, amount]) => (
                          <div key={res} className="rounded-lg border border-slate-700/50 p-4 bg-slate-800/40">
                            <div className={`text-[11px] font-semibold uppercase mb-1 ${RES_COLORS[res]}`}>{t[res as keyof typeof t] || res}</div>
                            <div className="text-xl font-bold text-white">{formatNumber(amount)}</div>
                          </div>
                        ))}
                      </div>

                      {/* Per-level breakdown */}
                      <div className="rounded-xl border border-slate-700/50 overflow-hidden">
                        <div className="grid grid-cols-6 bg-slate-800 p-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                          <span>Lv.</span>
                          <span>{t.food}</span>
                          <span>{t.wood}</span>
                          <span>{t.stone}</span>
                          <span>{t.gold}</span>
                          <span>{t.timeSeconds}</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                          {buildingCalc.levels.map((l) => (
                            <div key={l.level} className="grid grid-cols-6 p-3 border-t border-slate-700/20 text-xs font-mono text-slate-300 hover:bg-slate-800/40">
                              <div className="font-bold text-amber-300">{l.level}</div>
                              <div>{formatNumber(l.upgradeCost.food)}</div>
                              <div>{formatNumber(l.upgradeCost.wood)}</div>
                              <div>{formatNumber(l.upgradeCost.stone)}</div>
                              <div>{formatNumber(l.upgradeCost.gold)}</div>
                              <div>{formatTime(l.upgradeTimeSeconds)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="data"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg text-[11px] font-mono text-amber-200">
                    {t.dataWarning}
                  </div>
                  <div className="rounded-xl border border-slate-700/50 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                          <th className="p-3 border-r border-slate-700/30">{t.tier}</th>
                          <th className="p-3 border-r border-slate-700/30">{t.food}</th>
                          <th className="p-3 border-r border-slate-700/30">{t.wood}</th>
                          <th className="p-3 border-r border-slate-700/30">{t.stone}</th>
                          <th className="p-3 border-r border-slate-700/30">{t.gold}</th>
                          <th className="p-3">{t.timeSeconds}</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs font-mono">
                        {unitData.map((u) => (
                          <tr key={u.tier} className="border-t border-slate-700/20 text-slate-300 hover:bg-slate-800/40">
                            <td className="p-3 border-r border-slate-700/10 font-bold text-amber-300">T{u.tier}</td>
                            <td className="p-3 border-r border-slate-700/10">{u.trainingCost.food.toLocaleString()}</td>
                            <td className="p-3 border-r border-slate-700/10">{u.trainingCost.wood.toLocaleString()}</td>
                            <td className="p-3 border-r border-slate-700/10">{u.trainingCost.stone.toLocaleString()}</td>
                            <td className="p-3 border-r border-slate-700/10">{u.trainingCost.gold.toLocaleString()}</td>
                            <td className="p-3">{u.trainingTimeSeconds.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/30 p-6 bg-slate-900/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider text-center md:text-left">
            © 2026 AoE Mobile Fan Project • Not affiliated with World's Edge or Xbox Game Studios
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] font-mono text-slate-500 uppercase hover:text-amber-400 transition-colors">{t.discord}</a>
            <a href="#" className="text-[10px] font-mono text-slate-500 uppercase hover:text-amber-400 transition-colors">{t.bugReport}</a>
            <a href="#" className="text-[10px] font-mono text-slate-500 uppercase hover:text-amber-400 transition-colors">{t.contribute}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
