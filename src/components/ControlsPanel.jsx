import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function ControlsPanel({ stack, betSize, setBetSize, onAction, disabled }){
  const minBet = 5;
  const maxBet = Math.max(minBet, stack);
  const clamp = (v)=> Math.max(minBet, Math.min(v, maxBet));

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-zinc-300">Stack: <span className="font-semibold text-emerald-300">{stack}</span></div>
        <div className="text-xs text-zinc-400">Controls</div>
      </div>

      <div className="grid grid-cols-5 gap-2 items-center">
        <button onClick={()=>setBetSize(clamp(betSize-5))} className="p-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 active:scale-[0.99]">
          <Minus className="w-5 h-5" />
        </button>
        <input
          type="range"
          min={minBet}
          max={maxBet}
          step={5}
          value={Math.min(betSize,maxBet)}
          onChange={(e)=>setBetSize(clamp(parseInt(e.target.value)||minBet))}
          className="col-span-3 accent-emerald-500"
        />
        <button onClick={()=>setBetSize(clamp(betSize+5))} className="p-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 active:scale-[0.99]">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-2 text-sm text-zinc-300">Bet size: <span className="font-semibold text-emerald-300">{Math.min(betSize, maxBet)}</span></div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button disabled={disabled} onClick={()=>onAction('fold')} className="px-3 py-2 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 disabled:opacity-50">Fold</button>
        <button disabled={disabled} onClick={()=>onAction('check')} className="px-3 py-2 rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-300 hover:bg-zinc-200 disabled:opacity-50">Check</button>
        <button disabled={disabled} onClick={()=>onAction('bet')} className="px-3 py-2 rounded-lg bg-emerald-500 text-emerald-950 font-semibold hover:bg-emerald-400 disabled:opacity-50">Bet</button>
      </div>
    </section>
  );
}
