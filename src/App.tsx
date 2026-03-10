/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
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
  Globe
} from 'lucide-react';
import { UNIT_DATA } from './data/unitData';
import { UnitType, CalculatorState, ResourceCost } from './types';
import { translations } from './translations';

const TIER_COLORS: Record<number, string> = {
  1: 'bg-slate-500',
  2: 'bg-emerald-500',
  3: 'bg-blue-500',
  4: 'bg-purple-500',
  5: 'bg-orange-500',
  6: 'bg-red-500',
  7: 'bg-amber-600',
  8: 'bg-rose-700',
};

const UNIT_ICONS: Record<UnitType, React.ReactNode> = {
  infantry: <Shield className="w-5 h-5" />,
  cavalry: <Sword className="w-5 h-5" />,
  archer: <Target className="w-5 h-5" />,
  siege: <Hammer className="w-5 h-5" />,
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

  const [activeTab, setActiveTab] = useState<'training' | 'research' | 'data'>('training');

  const unitData = useMemo(() => UNIT_DATA[state.unitType], [state.unitType]);
  
  const targetUnit = useMemo(() => 
    unitData.find(u => u.tier === state.targetTier), 
  [unitData, state.targetTier]);

  const calculations = useMemo(() => {
    if (!targetUnit) return null;

    const buffMultiplier = 1 / (1 + state.trainingBuff / 100);
    const totalTimeSeconds = targetUnit.trainingTimeSeconds * state.amount * buffMultiplier;
    
    const totalCost: ResourceCost = {
      food: targetUnit.trainingCost.food * state.amount,
      wood: targetUnit.trainingCost.wood * state.amount,
      stone: targetUnit.trainingCost.stone * state.amount,
      gold: targetUnit.trainingCost.gold * state.amount,
    };

    return {
      totalTimeSeconds,
      totalCost,
      formattedTime: formatTime(totalTimeSeconds),
    };
  }, [targetUnit, state.amount, state.trainingBuff]);

  function formatTime(seconds: number) {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    
    return parts.length > 0 ? parts.join(' ') : '< 1m';
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Header */}
      <header className="border-b border-[#141414] p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#141414] p-2 rounded-sm">
            <Calculator className="text-[#E4E3E0] w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase">{t.title}</h1>
            <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex border border-[#141414] overflow-hidden">
            <button 
              onClick={() => setLang('en')}
              className={`px-2 py-1 text-[10px] font-mono uppercase ${lang === 'en' ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-white/50'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLang('tr')}
              className={`px-2 py-1 text-[10px] font-mono uppercase ${lang === 'tr' ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-white/50'}`}
            >
              TR
            </button>
          </div>
          <button 
            onClick={() => alert(t.dataSourceAlert)}
            className="text-[11px] font-mono uppercase border border-[#141414] px-3 py-1 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors hidden md:block"
          >
            {t.dataSourceInfo}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 border-x border-[#141414] min-h-[calc(100vh-89px)]">
        
        {/* Left Sidebar: Controls */}
        <aside className="lg:col-span-4 border-r border-[#141414] p-8 space-y-10">
          
          {/* Unit Type Selection */}
          <section>
            <label className="text-[11px] font-serif italic opacity-50 uppercase tracking-wider block mb-4">{t.unitClassification}</label>
            <div className="grid grid-cols-2 gap-2">
              {(['infantry', 'cavalry', 'archer', 'siege'] as UnitType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setState(s => ({ ...s, unitType: type }))}
                  className={`flex items-center gap-3 p-3 border border-[#141414] transition-all ${
                    state.unitType === type ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-white/50'
                  }`}
                >
                  {UNIT_ICONS[type]}
                  <span className="text-xs font-bold uppercase tracking-tight">{t[type]}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Tier Selection */}
          <section>
            <label className="text-[11px] font-serif italic opacity-50 uppercase tracking-wider block mb-4">{t.targetTierLevel}</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((tVal) => (
                <button
                  key={tVal}
                  onClick={() => setState(s => ({ ...s, targetTier: tVal }))}
                  className={`relative h-12 border border-[#141414] flex items-center justify-center transition-all ${
                    state.targetTier === tVal ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-white/50'
                  }`}
                >
                  <span className="text-sm font-bold">T{tVal}</span>
                  {state.targetTier === tVal && (
                    <motion.div 
                      layoutId="tier-indicator"
                      className={`absolute bottom-0 left-0 right-0 h-1 ${TIER_COLORS[tVal]}`} 
                    />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Amount & Buffs */}
          <section className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-serif italic opacity-50 uppercase tracking-wider">{t.trainingQuantity}</label>
                <span className="text-xs font-mono font-bold">{state.amount.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="100000" 
                step="100"
                value={state.amount}
                onChange={(e) => setState(s => ({ ...s, amount: parseInt(e.target.value) }))}
                className="w-full accent-[#141414] cursor-pointer"
              />
              <div className="flex gap-2 mt-2">
                {[1000, 5000, 10000, 20000].map(val => (
                  <button 
                    key={val}
                    onClick={() => setState(s => ({ ...s, amount: val }))}
                    className="flex-1 text-[10px] font-mono border border-[#141414] py-1 hover:bg-[#141414] hover:text-[#E4E3E0]"
                  >
                    {formatNumber(val)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-serif italic opacity-50 uppercase tracking-wider">{t.trainingSpeedBuff}</label>
                <span className="text-xs font-mono font-bold">+{state.trainingBuff}%</span>
              </div>
              <input 
                type="number" 
                value={state.trainingBuff}
                onChange={(e) => setState(s => ({ ...s, trainingBuff: Math.max(0, parseInt(e.target.value) || 0) }))}
                className="w-full bg-transparent border border-[#141414] p-2 text-sm font-mono focus:outline-none focus:bg-white/50"
              />
            </div>
          </section>

          <div className="pt-6 border-t border-[#141414]/20">
            <div className="bg-white/30 p-4 border border-[#141414] flex items-start gap-3">
              <Info className="w-4 h-4 mt-0.5 opacity-50 shrink-0" />
              <p className="text-[10px] leading-relaxed opacity-70">
                {t.sidebarInfo}
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content: Results */}
        <div className="lg:col-span-8 bg-white/40">
          
          {/* Tabs */}
          <div className="flex border-b border-[#141414]">
            <button 
              onClick={() => setActiveTab('training')}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === 'training' ? 'bg-white border-b-2 border-b-[#141414]' : 'opacity-40 hover:opacity-100'
              }`}
            >
              {t.trainingTab}
            </button>
            <button 
              onClick={() => setActiveTab('research')}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === 'research' ? 'bg-white border-b-2 border-b-[#141414]' : 'opacity-40 hover:opacity-100'
              }`}
            >
              {t.researchTab}
            </button>
            <button 
              onClick={() => setActiveTab('data')}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === 'data' ? 'bg-white border-b-2 border-b-[#141414]' : 'opacity-40 hover:opacity-100'
              }`}
            >
              {t.dataTableTab}
            </button>
          </div>

          <div className="p-10">
            <AnimatePresence mode="wait">
              {activeTab === 'training' ? (
                <motion.div
                  key="training"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12"
                >
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-[#141414] p-8 bg-white shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
                      <div className="flex items-center gap-2 mb-6 opacity-50">
                        <Clock className="w-4 h-4" />
                        <span className="text-[10px] font-mono uppercase tracking-widest">{t.totalTimeRequired}</span>
                      </div>
                      <div className="text-4xl font-bold tracking-tighter">
                        {calculations?.formattedTime}
                      </div>
                      <div className="mt-4 text-[10px] font-mono opacity-50 uppercase">
                        {calculations?.totalTimeSeconds.toLocaleString()} {t.totalSeconds}
                      </div>
                    </div>

                    <div className="border border-[#141414] p-8 bg-white shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
                      <div className="flex items-center gap-2 mb-6 opacity-50">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-[10px] font-mono uppercase tracking-widest">{t.unitStrength}</span>
                      </div>
                      <div className="text-4xl font-bold tracking-tighter">
                        {state.targetTier * 1250} <span className="text-lg opacity-30">{t.power}</span>
                      </div>
                      <div className="mt-4 text-[10px] font-mono opacity-50 uppercase">
                        {t.estimatedPowerGain}
                      </div>
                    </div>
                  </div>

                  {/* Resource Grid */}
                  <section>
                    <h3 className="text-[11px] font-serif italic opacity-50 uppercase tracking-wider mb-6">{t.resourceBreakdown}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(Object.entries(calculations?.totalCost || {}) as [string, number][]).map(([res, amount]) => (
                        <div key={res} className="border border-[#141414] p-6 bg-white/50 group hover:bg-[#141414] hover:text-[#E4E3E0] transition-all">
                          <div className="text-[10px] font-mono uppercase opacity-50 group-hover:opacity-100 mb-2">{t[res as keyof typeof t] || res}</div>
                          <div className="text-2xl font-bold tracking-tight">{formatNumber(amount)}</div>
                          <div className="mt-2 h-1 bg-[#141414]/10 group-hover:bg-[#E4E3E0]/20">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              className={`h-full ${res === 'gold' ? 'bg-amber-400' : 'bg-[#141414] group-hover:bg-[#E4E3E0]'}`} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Comparison Table */}
                  <section>
                    <h3 className="text-[11px] font-serif italic opacity-50 uppercase tracking-wider mb-6">{t.tierEfficiencyComparison}</h3>
                    <div className="border border-[#141414] overflow-hidden">
                      <div className="grid grid-cols-4 bg-[#141414] text-[#E4E3E0] p-3 text-[10px] font-mono uppercase tracking-widest">
                        <span>{t.tier}</span>
                        <span>{t.costPerUnit}</span>
                        <span>{t.timePerUnit}</span>
                        <span>{t.powerPerRes}</span>
                      </div>
                      {unitData.slice(Math.max(0, state.targetTier - 3), state.targetTier + 1).map((u) => (
                        <div key={u.tier} className={`grid grid-cols-4 p-4 border-t border-[#141414] text-xs font-mono items-center ${u.tier === state.targetTier ? 'bg-white font-bold' : 'opacity-60'}`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${TIER_COLORS[u.tier]}`} />
                            T{u.tier}
                          </div>
                          <div>{formatNumber((Object.values(u.trainingCost) as number[]).reduce((a, b) => a + b, 0))}</div>
                          <div>{u.trainingTimeSeconds}s</div>
                          <div className="text-emerald-600">{(u.tier / ((Object.values(u.trainingCost) as number[]).reduce((a, b) => a + b, 0) / 1000)).toFixed(2)}</div>
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
                  className="space-y-8"
                >
                  <div className="bg-[#141414] text-[#E4E3E0] p-8 rounded-sm">
                    <h2 className="text-2xl font-bold mb-2">{t.researchPath.replace('{tier}', state.targetTier.toString())}</h2>
                    <p className="text-xs opacity-60 font-mono uppercase tracking-widest">{t.militaryRequirements.replace('{unitType}', t[state.unitType])}</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: 'Advanced Metallurgy', level: state.targetTier * 2, status: 'required' },
                      { name: `${t[state.unitType]} Mastery`, level: state.targetTier + 5, status: 'required' },
                      { name: 'Tactical Formations', level: 10, status: 'recommended' },
                      { name: 'Elite Training Grounds', level: state.targetTier, status: 'required' },
                    ].map((req, i) => (
                      <div key={i} className="flex items-center justify-between p-6 border border-[#141414] bg-white group hover:translate-x-2 transition-transform">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 border border-[#141414] flex items-center justify-center font-bold">
                            {i + 1}
                          </div>
                          <div>
                            <div className="text-sm font-bold uppercase">{req.name}</div>
                            <div className="text-[10px] font-mono opacity-50 uppercase">{t.requiredLevel}: {req.level}</div>
                          </div>
                        </div>
                        <div className={`text-[10px] font-mono px-3 py-1 border border-[#141414] uppercase ${req.status === 'required' ? 'bg-red-100' : 'bg-blue-100'}`}>
                          {t[req.status as keyof typeof t] || req.status}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-8 border-2 border-dashed border-[#141414] text-center space-y-4">
                    <RefreshCw className="w-8 h-8 mx-auto opacity-20" />
                    <p className="text-xs font-serif italic opacity-60">
                      {t.researchWarning.replace('{level}', state.targetTier === 8 ? '25' : '23')}
                    </p>
                    <button className="bg-[#141414] text-[#E4E3E0] px-6 py-2 text-[11px] font-mono uppercase tracking-widest hover:opacity-90">
                      {t.calculateResearchCost}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="data"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-amber-50 border border-amber-200 p-4 text-[10px] font-mono uppercase tracking-tight text-amber-800">
                    {t.dataWarning}
                  </div>
                  <div className="border border-[#141414] overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#141414] text-[#E4E3E0] text-[10px] font-mono uppercase">
                          <th className="p-3 border-r border-[#E4E3E0]/20">{t.tier}</th>
                          <th className="p-3 border-r border-[#E4E3E0]/20">{t.food}</th>
                          <th className="p-3 border-r border-[#E4E3E0]/20">{t.wood}</th>
                          <th className="p-3 border-r border-[#E4E3E0]/20">{t.stone}</th>
                          <th className="p-3 border-r border-[#E4E3E0]/20">{t.gold}</th>
                          <th className="p-3">{t.timeSeconds}</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs font-mono">
                        {unitData.map((u) => (
                          <tr key={u.tier} className="border-t border-[#141414] hover:bg-white/50">
                            <td className="p-3 border-r border-[#141414]/10 font-bold">T{u.tier}</td>
                            <td className="p-3 border-r border-[#141414]/10">{u.trainingCost.food.toLocaleString()}</td>
                            <td className="p-3 border-r border-[#141414]/10">{u.trainingCost.wood.toLocaleString()}</td>
                            <td className="p-3 border-r border-[#141414]/10">{u.trainingCost.stone.toLocaleString()}</td>
                            <td className="p-3 border-r border-[#141414]/10">{u.trainingCost.gold.toLocaleString()}</td>
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
      <footer className="border-t border-[#141414] p-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-mono opacity-50 uppercase tracking-widest">
            © 2026 AoE Mobile Fan Project • Not affiliated with World's Edge or Xbox Game Studios
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-mono uppercase hover:underline">{t.discord}</a>
            <a href="#" className="text-[10px] font-mono uppercase hover:underline">{t.bugReport}</a>
            <a href="#" className="text-[10px] font-mono uppercase hover:underline">{t.contribute}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
