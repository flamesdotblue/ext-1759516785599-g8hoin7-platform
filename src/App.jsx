import React, { useMemo, useState } from 'react';
import HeaderNav from './components/HeaderNav';
import PokerTable from './components/PokerTable';
import ControlsPanel from './components/ControlsPanel';
import CoachPanel from './components/CoachPanel';

// Card helpers
const RANKS = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
const SUITS = ['♠','♥','♦','♣'];
const RANK_VALUE = Object.fromEntries(RANKS.map((r,i)=>[r,i+2]));

function buildDeck() {
  const deck = [];
  for (const r of RANKS) for (const s of SUITS) deck.push(r + s);
  return deck;
}

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function draw(deck, n){
  return [deck.slice(0,n), deck.slice(n)];
}

function getInitialPlayers() {
  return [
    { id: 'hero', name: 'You', stack: 1000, isHero: true },
    { id: 'p2', name: 'Ava', stack: 1000 },
    { id: 'p3', name: 'Leo', stack: 1000 },
    { id: 'p4', name: 'Mia', stack: 1000 },
  ];
}

function cardRank(card){ return card[0]; }
function cardSuit(card){ return card[1]; }

// Very light heuristic for demo purposes only
function evaluateHandHeuristic(hole, board){
  const cards = [...hole, ...board];
  const counts = {};
  for (const c of cards) counts[cardRank(c)] = (counts[cardRank(c)]||0)+1;
  const holeRanks = hole.map(cardRank);
  const suited = cardSuit(hole[0]) === cardSuit(hole[1]);
  const high = hole.reduce((acc,c)=>acc + (RANK_VALUE[cardRank(c)]>=11?1:0),0);

  let strength = 0;
  // Pair in hole
  if (holeRanks[0] === holeRanks[1]) strength += 3 + (RANK_VALUE[holeRanks[0]]>=11?1:0);
  // Suited bonus
  if (suited) strength += 1;
  // High cards bonus
  strength += high * 0.8;

  // Board-based
  const maxCount = Math.max(...Object.values(counts));
  if (board.length>=3){
    if (maxCount>=4) strength += 6; // quads/boat overweight but fine for demo
    else if (maxCount===3) strength += 4;
    else if (maxCount===2) strength += 2;

    // Simple flush draw or made flush check
    const suitCounts = {};
    for (const c of cards) suitCounts[cardSuit(c)] = (suitCounts[cardSuit(c)]||0)+1;
    const flushPossible = Math.max(...Object.values(suitCounts));
    if (flushPossible>=5) strength += 5;
    else if (flushPossible===4) strength += 1.5; // draw

    // Simple straight potential
    const uniqRanks = Array.from(new Set(cards.map(cardRank))).map(r=>RANK_VALUE[r]).sort((a,b)=>a-b);
    let run = 1, bestRun=1;
    for (let i=1;i<uniqRanks.length;i++){
      if (uniqRanks[i]===uniqRanks[i-1]+1){ run++; bestRun=Math.max(bestRun,run);} else if (uniqRanks[i]!==uniqRanks[i-1]) run=1;
    }
    if (bestRun>=5) strength += 5;
    else if (bestRun===4) strength += 1.5;
  }

  const buckets = [
    { min: 7.5, label: 'Strong: Bet/Raise', action: 'bet', tone: 'positive' },
    { min: 4.5, label: 'Medium: Bet small or Check', action: 'medium', tone: 'neutral' },
    { min: 2.5, label: 'Marginal: Prefer Check/Call', action: 'check', tone: 'neutral' },
    { min: -Infinity, label: 'Weak: Fold to aggression', action: 'fold', tone: 'warning' },
  ];
  const bucket = buckets.find(b=>strength>=b.min);

  return {
    score: Number(strength.toFixed(2)),
    summary: bucket.label,
    recommended: bucket.action,
    tone: bucket.tone,
  };
}

export default function App(){
  const [players, setPlayers] = useState(getInitialPlayers());
  const [deck, setDeck] = useState(()=>shuffle(buildDeck()));
  const [hole, setHole] = useState([]);
  const [board, setBoard] = useState([]);
  const [pot, setPot] = useState(0);
  const [betSize, setBetSize] = useState(20);
  const [lastAction, setLastAction] = useState('');
  const [advice, setAdvice] = useState(null);

  const hero = players[0];

  const dealNewHand = () => {
    let d = shuffle(buildDeck());
    let drawn;
    [drawn, d] = draw(d, 2); // hero hole
    setHole(drawn);
    setBoard([]);
    setPot(0);
    setAdvice(null);
    setLastAction('New hand dealt');
    setBetSize(20);
    // Reset stacks lightly for demo
    setPlayers(prev => prev.map(p=> ({...p, stack: 1000})));
    setDeck(d);
  };

  const dealFlop = () => {
    if (board.length>0) return; // once
    let d = deck.slice();
    let drawn;
    [drawn, d] = draw(d, 3);
    setBoard(drawn);
    setDeck(d);
  };

  const dealTurn = () => {
    if (board.length!==3) return;
    let d = deck.slice();
    let drawn; [drawn, d] = draw(d, 1);
    setBoard(prev=>[...prev, ...drawn]);
    setDeck(d);
  };

  const dealRiver = () => {
    if (board.length!==4) return;
    let d = deck.slice();
    let drawn; [drawn, d] = draw(d, 1);
    setBoard(prev=>[...prev, ...drawn]);
    setDeck(d);
  };

  const onAction = (type) => {
    if (type==='fold'){
      setLastAction('You folded');
      setAdvice(null);
      return;
    }
    if (type==='check'){
      setLastAction('You checked');
      return;
    }
    if (type==='bet'){
      const amount = Math.max(1, Math.min(betSize, hero.stack));
      setPlayers(prev=>prev.map(p=> p.isHero ? {...p, stack: p.stack - amount} : p));
      setPot(prev=>prev + amount);
      setLastAction(`You bet ${amount}`);
      return;
    }
  };

  const askAI = () => {
    if (hole.length<2) return;
    const a = evaluateHandHeuristic(hole, board);
    setAdvice(a);
  };

  const boardStage = useMemo(()=>{
    if (board.length===0) return 'Preflop';
    if (board.length===3) return 'Flop';
    if (board.length===4) return 'Turn';
    if (board.length===5) return 'River';
    return 'Preflop';
  },[board]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-zinc-100">
      <div className="mx-auto max-w-md sm:max-w-lg lg:max-w-2xl px-3 pb-24">
        <HeaderNav onNewHand={dealNewHand} stage={boardStage} lastAction={lastAction} />

        <div className="space-y-3 mt-2">
          <PokerTable
            players={players}
            board={board}
            hole={hole}
            pot={pot}
            onDealFlop={dealFlop}
            onDealTurn={dealTurn}
            onDealRiver={dealRiver}
          />

          <CoachPanel advice={advice} scoreOnly={false} onAskAI={askAI} hole={hole} board={board} />

          <ControlsPanel
            stack={hero.stack}
            betSize={betSize}
            setBetSize={setBetSize}
            onAction={onAction}
            disabled={hole.length<2}
          />
        </div>
      </div>
    </div>
  );
}
