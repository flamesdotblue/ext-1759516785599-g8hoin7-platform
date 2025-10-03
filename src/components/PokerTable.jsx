import React from 'react';
import { User, ChevronRight } from 'lucide-react';

function Seat({ name, stack, active=false }){
  return (
    <div className={`flex items-center gap-2 px-2 py-1 rounded-full border ${active? 'border-emerald-400/70 bg-emerald-400/10':'border-zinc-700 bg-zinc-800/40'} text-xs` }>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${active?'bg-emerald-500 text-emerald-950':'bg-zinc-700 text-zinc-100'}`}>
        <User className="w-4 h-4" />
      </div>
      <span className="font-medium">{name}</span>
      <span className="text-zinc-400">{stack}</span>
    </div>
  );
}

function Card({ c, hidden=false }){
  const suit = c ? c[1] : '♠';
  const isRed = suit==='♥' || suit==='♦';
  return (
    <div className={`w-12 h-16 rounded-lg border shadow-sm flex items-center justify-center ${hidden? 'bg-zinc-800 border-zinc-700':'bg-zinc-100 border-zinc-300'}`}>
      {hidden ? (
        <div className="w-8 h-12 rounded-md bg-gradient-to-br from-zinc-700 to-zinc-900" />
      ) : (
        <div className="text-lg font-semibold" style={{color:isRed?'#ef4444':'#111827'}}>{c}</div>
      )}
    </div>
  );
}

export default function PokerTable({ players, board, hole, pot, onDealFlop, onDealTurn, onDealRiver }){
  const hero = players.find(p=>p.isHero);
  const villains = players.filter(p=>!p.isHero);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-[radial-gradient(ellipse_at_center,_#173f2a,_#0b1110_70%)] p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-emerald-300/90">Pot: <span className="font-semibold text-emerald-200">{pot}</span></div>
        <div className="flex items-center gap-1 text-xs text-zinc-400">
          <span className="hidden sm:inline">Board</span> <ChevronRight className="w-4 h-4" /> {board.length} cards
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {villains.map(v => (
          <div key={v.id} className="flex justify-center">
            <Seat name={v.name} stack={v.stack} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 py-3">
        {[0,1,2,3,4].map(i => (
          <Card key={i} c={board[i]} hidden={!board[i]} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <Card c={hole[0]} hidden={!hole[0]} />
        <Card c={hole[1]} hidden={!hole[1]} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <button onClick={onDealFlop} className={`px-2 py-2 rounded-lg border ${board.length===0? 'border-emerald-400 text-emerald-300 hover:bg-emerald-400/10':'border-zinc-800 text-zinc-600'} transition`}>Deal Flop</button>
        <button onClick={onDealTurn} className={`px-2 py-2 rounded-lg border ${board.length===3? 'border-emerald-400 text-emerald-300 hover:bg-emerald-400/10':'border-zinc-800 text-zinc-600'} transition`}>Deal Turn</button>
        <button onClick={onDealRiver} className={`px-2 py-2 rounded-lg border ${board.length===4? 'border-emerald-400 text-emerald-300 hover:bg-emerald-400/10':'border-zinc-800 text-zinc-600'} transition`}>Deal River</button>
      </div>

      <div className="mt-3 flex justify-center">
        <Seat name={hero.name} stack={hero.stack} active />
      </div>
    </section>
  );
}
