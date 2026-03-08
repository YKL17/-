import React, { useState, useEffect } from 'react';
import { GameEngine, gameEngine } from '@/engine/game';
import { GameState, GameEvent } from '@/engine/types';
import { Heart, Zap, Shield, Coins, Calendar, MapPin, User, Sword, Moon, Sun, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export default function GameUI() {
  const [state, setState] = useState<GameState>(gameEngine.state);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [activeTab, setActiveTab] = useState<'log' | 'relationships' | 'inventory'>('log');

  // Sync with engine
  const refresh = () => {
    setState({ ...gameEngine.state });
    setCurrentEvent(gameEngine.currentEvent);
  };

  useEffect(() => {
    gameEngine.startGame();
    refresh();
  }, []);

  const handleOptionClick = (index: number) => {
    gameEngine.handleOption(index);
    refresh();
  };

  const handleAction = (action: 'cultivate' | 'explore' | 'rest') => {
    if (action === 'cultivate') gameEngine.cultivate();
    if (action === 'explore') gameEngine.explore();
    if (action === 'rest') gameEngine.rest();
    refresh();
  };

  // Render Event Modal
  const renderEvent = () => {
    if (!currentEvent) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden"
        >
          {/* Event Image Placeholder */}
          <div className="h-48 bg-indigo-900/30 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900" />
             <span className="text-indigo-400/50 text-6xl font-serif opacity-20 select-none">EVENT</span>
             <h2 className="absolute bottom-4 left-6 text-2xl font-bold text-white z-10">{currentEvent.title}</h2>
          </div>

          <div className="p-6">
            <p className="text-zinc-300 text-lg leading-relaxed mb-8">
              {currentEvent.description}
            </p>

            <div className="space-y-3">
              {currentEvent.options.map((opt, idx) => {
                const disabled = opt.condition ? !opt.condition(state) : false;
                return (
                  <button
                    key={idx}
                    onClick={() => !disabled && handleOptionClick(idx)}
                    disabled={disabled}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all border",
                      disabled 
                        ? "bg-zinc-800/50 text-zinc-600 border-zinc-800 cursor-not-allowed"
                        : "bg-zinc-800 hover:bg-indigo-900/30 border-zinc-700 hover:border-indigo-500/50 text-zinc-200 hover:text-white"
                    )}
                  >
                    <div className="font-medium">{opt.text}</div>
                    {disabled && <div className="text-xs text-red-500 mt-1">条件不满足</div>}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col lg:flex-row overflow-hidden">
      {renderEvent()}

      {/* Sidebar: Stats */}
      <div className="w-full lg:w-80 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col overflow-y-auto">
        <div className="mb-8 text-center">
            <div className="w-20 h-20 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center border-2 border-indigo-500/50 mb-4">
                <User className="w-10 h-10 text-indigo-400" />
            </div>
            <h1 className="text-xl font-bold">{state.name}</h1>
            <p className="text-zinc-500 text-sm">{state.martialSoul} | {state.faction === 'Neutral' ? '中立' : state.faction === 'Shrek' ? '史莱克阵营' : '武魂殿阵营'}</p>
        </div>

        <div className="space-y-4">
            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 flex justify-between items-center">
                <div className="flex items-center text-zinc-400 text-sm"><Calendar className="w-4 h-4 mr-2" /> 时间</div>
                <div className="font-mono font-bold text-indigo-300">第 {state.year} 年 {state.month} 月</div>
            </div>
            
            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center text-zinc-400 text-sm"><Zap className="w-4 h-4 mr-2" /> 魂力</div>
                    <div className="font-mono font-bold text-yellow-400">{state.attributes.spiritPower} 级</div>
                </div>
                <div className="w-full bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-yellow-500 h-full" style={{ width: `${(state.attributes.spiritPower % 10) * 10}%` }} />
                </div>
            </div>

            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 flex justify-between items-center">
                <div className="flex items-center text-zinc-400 text-sm"><Heart className="w-4 h-4 mr-2" /> 健康</div>
                <div className="font-mono font-bold text-emerald-400">{state.attributes.health}/{state.attributes.maxHealth}</div>
            </div>

            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 flex justify-between items-center">
                <div className="flex items-center text-zinc-400 text-sm"><Coins className="w-4 h-4 mr-2" /> 财富</div>
                <div className="font-mono font-bold text-amber-400">{state.attributes.wealth}</div>
            </div>

            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 flex justify-between items-center">
                <div className="flex items-center text-zinc-400 text-sm"><MapPin className="w-4 h-4 mr-2" /> 地点</div>
                <div className="font-medium text-zinc-200">{state.currentLocation}</div>
            </div>
        </div>

        <div className="mt-8">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">魂环配置</h3>
            <div className="space-y-2">
                {state.spiritRings.length > 0 ? state.spiritRings.map((ring, i) => (
                    <div key={i} className="text-xs bg-zinc-950 p-2 rounded border border-zinc-800 text-zinc-300">
                        {ring}
                    </div>
                )) : <div className="text-xs text-zinc-600 italic">暂无魂环</div>}
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-zinc-950 relative">
        {/* Top Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/50">
            <button 
                onClick={() => setActiveTab('log')}
                className={cn("px-6 py-4 text-sm font-medium transition-colors", activeTab === 'log' ? "text-indigo-400 border-b-2 border-indigo-500" : "text-zinc-500 hover:text-zinc-300")}
            >
                冒险日志
            </button>
            <button 
                onClick={() => setActiveTab('relationships')}
                className={cn("px-6 py-4 text-sm font-medium transition-colors", activeTab === 'relationships' ? "text-indigo-400 border-b-2 border-indigo-500" : "text-zinc-500 hover:text-zinc-300")}
            >
                人际关系
            </button>
            <button 
                onClick={() => setActiveTab('inventory')}
                className={cn("px-6 py-4 text-sm font-medium transition-colors", activeTab === 'inventory' ? "text-indigo-400 border-b-2 border-indigo-500" : "text-zinc-500 hover:text-zinc-300")}
            >
                背包
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'log' && (
                <div className="space-y-4">
                    {state.log.map((entry, i) => (
                        <div key={i} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-300 text-sm leading-relaxed">
                            {entry}
                        </div>
                    ))}
                    {state.log.length === 0 && <div className="text-zinc-600 text-center mt-20">暂无记录</div>}
                </div>
            )}

            {activeTab === 'relationships' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.values(state.relationships).map((rel, i) => (
                        <div key={i} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                                <Users className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-zinc-200">{rel.name}</h3>
                                    <span className={cn("text-xs px-1.5 py-0.5 rounded", rel.faction === 'Shrek' ? 'bg-green-900/30 text-green-400' : 'bg-purple-900/30 text-purple-400')}>
                                        {rel.faction === 'Shrek' ? '史莱克' : '武魂殿'}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">{rel.description}</p>
                                <div className="mt-3">
                                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                        <span>好感度</span>
                                        <span>{rel.affection}/100</span>
                                    </div>
                                    <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                                        <div className="bg-pink-500 h-full" style={{ width: `${rel.affection}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {Object.keys(state.relationships).length === 0 && <div className="text-zinc-600 text-center col-span-2 mt-20">暂无结识的角色</div>}
                </div>
            )}
             {activeTab === 'inventory' && (
                 <div className="text-zinc-600 text-center mt-20">背包空空如也</div>
             )}
        </div>

        {/* Action Bar */}
        <div className="p-6 bg-zinc-900 border-t border-zinc-800 grid grid-cols-3 gap-4">
            <button 
                onClick={() => handleAction('cultivate')}
                disabled={!!currentEvent}
                className="flex flex-col items-center justify-center p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors disabled:opacity-50"
            >
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mb-2 text-indigo-400">
                    <Moon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">修炼</span>
            </button>
            <button 
                onClick={() => handleAction('explore')}
                disabled={!!currentEvent}
                className="flex flex-col items-center justify-center p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors disabled:opacity-50"
            >
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2 text-emerald-400">
                    <MapPin className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">探索</span>
            </button>
            <button 
                onClick={() => handleAction('rest')}
                disabled={!!currentEvent}
                className="flex flex-col items-center justify-center p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors disabled:opacity-50"
            >
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-2 text-amber-400">
                    <Sun className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">休息</span>
            </button>
        </div>
      </div>
    </div>
  );
}
