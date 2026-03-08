import React from 'react';
import { GameState } from '@/services/gameService';
import { Shield, Zap, Heart, MapPin, User, Scroll } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface CharacterSheetProps {
  state: GameState | null;
}

export function CharacterSheet({ state }: CharacterSheetProps) {
  if (!state) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500 italic">
        等待武魂觉醒...
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-4"
    >
      {/* Header Info */}
      <div className="flex items-center space-x-4 border-b border-zinc-700 pb-4">
        <div className="h-16 w-16 rounded-full bg-indigo-900/50 flex items-center justify-center border-2 border-indigo-500/30">
          <User className="h-8 w-8 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{state.name || "未知"}</h2>
          <div className="flex items-center text-zinc-400 text-xs space-x-2">
            <span>{state.gender}</span>
            <span>•</span>
            <span>{state.age} 岁</span>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
            <div className="flex items-center text-zinc-400 text-xs mb-1">
                <Zap className="w-3 h-3 mr-1" /> 魂力等级
            </div>
            <div className="text-2xl font-mono font-bold text-indigo-400">
                {state.rank} <span className="text-sm text-zinc-500 font-normal">({state.spiritPower} 级)</span>
            </div>
        </div>
        <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
            <div className="flex items-center text-zinc-400 text-xs mb-1">
                <Heart className="w-3 h-3 mr-1" /> 生命值
            </div>
            <div className="text-2xl font-mono font-bold text-emerald-400">
                {state.health}<span className="text-zinc-600">/</span>{state.maxHealth}
            </div>
        </div>
      </div>

      {/* Martial Soul */}
      <div className="bg-zinc-800/30 p-4 rounded-xl border border-zinc-700/50">
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-zinc-300 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-indigo-400" />
                武魂
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-900/30 text-indigo-300 border border-indigo-500/20">
                {state.martialSoul || "无"}
            </span>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center text-zinc-400 text-sm bg-zinc-900/50 py-2 px-3 rounded-lg">
        <MapPin className="w-4 h-4 mr-2 text-zinc-500" />
        {state.location}
      </div>

      {/* Spirit Rings */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2" />
            魂环
        </h3>
        <div className="space-y-2">
            {state.spiritRings && state.spiritRings.length > 0 ? (
                state.spiritRings.map((ring, idx) => (
                    <div key={idx} className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 relative overflow-hidden group">
                        <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-1",
                            ring.color === 'White' ? 'bg-slate-200' :
                            ring.color === 'Yellow' ? 'bg-yellow-400' :
                            ring.color === 'Purple' ? 'bg-purple-500' :
                            ring.color === 'Black' ? 'bg-zinc-900' :
                            ring.color === 'Red' ? 'bg-red-600' : 'bg-slate-500'
                        )} />
                        <div className="pl-3">
                            <div className="flex justify-between items-start">
                                <span className="font-medium text-zinc-200 text-sm">{ring.name}</span>
                                <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold",
                                    ring.color === 'Yellow' ? 'text-yellow-400 bg-yellow-400/10' :
                                    ring.color === 'Purple' ? 'text-purple-400 bg-purple-400/10' :
                                    ring.color === 'Black' ? 'text-zinc-400 bg-zinc-800' :
                                    ring.color === 'Red' ? 'text-red-400 bg-red-400/10' : 'text-zinc-400'
                                )}>{ring.age} 年</span>
                            </div>
                            <div className="text-xs text-zinc-500 mt-1">魂技: <span className="text-zinc-300">{ring.skill}</span></div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-xs text-zinc-600 text-center py-4 border border-dashed border-zinc-800 rounded-lg">
                    尚未吸收魂环
                </div>
            )}
        </div>
      </div>

       {/* Inventory */}
       <div>
        <h3 className="text-sm font-semibold text-zinc-400 mb-2 flex items-center mt-4">
            <Scroll className="w-4 h-4 mr-2" /> 物品栏
        </h3>
        <div className="flex flex-wrap gap-2">
            {state.inventory && state.inventory.length > 0 ? (
                state.inventory.map((item, i) => (
                    <span key={i} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-700">
                        {item}
                    </span>
                ))
            ) : (
                <span className="text-xs text-zinc-600">空</span>
            )}
        </div>
       </div>
    </motion.div>
  );
}
