import { useState } from "react";
import "./App.css";

type Phase =  "IDLE" | "BETTING" | "DRAWING" | "PAYOUT";

export default function App() {

  const [coins, setCoins] = useState(100);
  const [betstr, setBet] = useState("10");
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [payout, setPayout] = useState(0);

  // -------------------- 乱数用 --------------------

  type Entry = { mult: number; w: number };

  function weightedPick(table: Entry[]) {
    const total = table.reduce((s, e) => s + e.w, 0);
    let r = Math.random() * total;
    for (const e of table) {
      r -= e.w;
      if (r <= 0) return e.mult;
    }
    return table[table.length - 1].mult;
  }
  
  const payoutTable: Entry[] = [
    { mult: 0.0, w: 55 }, // 55% で0
    { mult: 0.5, w: 20 }, // 20% で半分返る
    { mult: 1.0, w: 15 }, // 15% でトントン
    { mult: 2.0, w: 8 },  // 8% で2倍
    { mult: 5.0, w: 2 },  // 2% で5倍
  ];

  // ------------------------------------------------


  function spin() {
    if( phase !== "IDLE" ) return;
    const bet = Number(betstr);
    if( bet <= 0 ) return;
    if( bet > coins ) return;

    setCoins(prev => prev - bet);

    setPhase("DRAWING");
    
    setTimeout(() => {
      const payout = Math.floor(bet * weightedPick(payoutTable));
      setPayout(payout);
      setPhase("PAYOUT") 
    }, 1000);
  }

  function accept() {
    if( phase !== "PAYOUT" ) return;
    setCoins(prev => prev + payout);
    setPayout(0);
    setPhase("IDLE");
  }

  function phaseMessage(phase: Phase): string {
    switch (phase) {
      case "IDLE":
        return "抽選前";
      case "BETTING":
        return "賭け中";
      case "DRAWING":
        return "抽選中…";
      case "PAYOUT":
        return "結果発表！";
    }
  }



  return (
    <div className="app">
      <div className="header">
        <h1 className="header__title">Slot Prototype</h1>
      </div>

      <div className="card">
        <div className="row">
          <div>
            <div className="text">所持コイン</div>
            <div className="value">{coins} 枚</div>
          </div>

          <div>
            <div className="label">Phase</div>
            <div className="badge">{phaseMessage(phase)}</div>
          </div>
        </div>

        <div className="row">
          <div>
            <div className="text">賭けるコイン枚数</div>
          </div>

          <input
            type="number"
            value={betstr}
            onChange={(e) => setBet(e.target.value)}
          />
        </div>

        <div className="row">
          <div>
            <div className="text">獲得コイン枚数</div>

          </div>

          <div className="value"> {payout} 枚</div>
        </div>


        <div className="row" style={{ justifyContent: "flex-end", marginBottom: 0 }}>
          <button disabled={phase !== "IDLE"} onClick={() => spin()}>SPIN</button>
          <button disabled={phase !== "PAYOUT"} onClick={() => accept()}>ACCEPT</button>
        </div>
      </div>
    </div>
  );
}