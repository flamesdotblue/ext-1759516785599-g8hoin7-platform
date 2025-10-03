import React from 'react';
import { Brain, Settings, HelpCircle, Play } from 'lucide-react';

export default function HeaderNav({ onNewHand, stage, lastAction }){
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/70 bg-zinc-950/90">
      <div className="mx-auto max-w-md sm:max-w-lg lg:max-w-2xl px-3 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-zinc-800/80 border border-zinc-700">
            <Brain className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-zinc-100">Poker AI Coach</div>
            <div className="text-xs text-zinc-400">Stage: {stage} • {lastAction || 'Ready'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onNewHand} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-500 text-emerald-950 font-medium hover:bg-emerald-400 active:scale-[0.99] transition">
            <Play className="w-4 h-4" />
            New Hand
          </button>
          <button className="p-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
