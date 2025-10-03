import React from 'react';
import { Brain, Send } from 'lucide-react';

export default function CoachPanel({ advice, onAskAI, hole, board, scoreOnly=false }){
  const status = advice ? advice.summary : 'Tap “Ask AI” to get advice based on your hand and the board.';
  const badgeColor = advice?.tone === 'positive' ? 'bg-emerald-400/20 text-emerald-200 border-emerald-500/30' : advice?.tone === 'warning' ? 'bg-amber-400/20 text-amber-200 border-amber-500/30' : 'bg-zinc-700/40 text-zinc-200 border-zinc-600';

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-zinc-800/80 border border-zinc-700">
            <Brain className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-semibold">AI Coach</div>
            <div className="text-xs text-zinc-400">Instant, on-device heuristic</div>
          </div>
        </div>
        <button onClick={onAskAI} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-500 text-emerald-950 font-medium hover:bg-emerald-400 active:scale-[0.99]">
          <Send className="w-4 h-4" />
          Ask AI
        </button>
      </div>

      <div className={`text-sm border ${badgeColor} px-3 py-2 rounded-lg`}>{status}</div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-zinc-300">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2">
          <div className="text-zinc-400">Hole</div>
          <div className="font-semibold">{hole[0] || '—'} {hole[1] || ''}</div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2">
          <div className="text-zinc-400">Board</div>
          <div className="font-semibold">{board.length? board.join(' ') : '—'}</div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2">
          <div className="text-zinc-400">Score</div>
          <div className="font-semibold">{advice? advice.score : '—'}</div>
        </div>
      </div>

      {!scoreOnly && advice && (
        <div className="mt-2 text-xs text-zinc-400">
          Recommendation: <span className="text-zinc-200 font-medium">{advice.recommended.toUpperCase()}</span>
        </div>
      )}
    </section>
  );
}
