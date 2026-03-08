import React, { useState } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import { DOULUO_SYSTEM_PROMPT } from '@/constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPrompt: string) => void;
  currentPrompt: string;
}

export function SettingsModal({ isOpen, onClose, onSave, currentPrompt }: SettingsModalProps) {
  const [prompt, setPrompt] = useState(currentPrompt);

  if (!isOpen) return null;

  const handleReset = () => {
    setPrompt(DOULUO_SYSTEM_PROMPT);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white">游戏设置 & 系统提示词</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              系统指令 (Prompt)
            </label>
            <p className="text-xs text-zinc-500 mb-2">
              这定义了AI游戏主持人的规则、世界观和行为。你可以修改它来改变游戏体验。
            </p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-96 bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm font-mono text-zinc-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none resize-none"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-900/50 rounded-b-2xl">
          <button 
            onClick={handleReset}
            className="flex items-center px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            恢复默认
          </button>
          <div className="flex space-x-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
                取消
            </button>
            <button 
                onClick={() => { onSave(prompt); onClose(); }}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
            >
                <Save className="w-4 h-4 mr-2" />
                保存并重启
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
