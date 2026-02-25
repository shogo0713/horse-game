import { useState } from "react";
import "./App.css";

type Phase =  "IDLE" | "BETTING" | "DRAWING" | "PAYOUT";

interface Runner {
  id  : string;
  name: string;
  odds: number;
}

export default function App() {

  const [money, setMoney] = useState(5000);
  const [betstr, setBet] = useState("300");
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [payout, setPayout] = useState(0);
  const [selectedRunner, setSelectedRunner] = useState<Runner | null>(null);
  const [result, setResult] = useState<Runner[]>([]);

  // -------------------- 計算アルゴリズムたち --------------------

  // 馬の配列から1頭決める
  function pickWinnerByOdds(runners: Runner[]): Runner {
    const weights = runners.map(r => 1 / r.odds);
    const total = weights.reduce((s, w) => s + w, 0);
    let r = Math.random() * total;
    for (let i = 0; i < runners.length; i++) {
      r -= weights[i];
      if (r <= 0) return runners[i];
    }
    return runners[runners.length - 1];
  }

  // 馬の順位を決める
  function makeFinishOrder(runners: Runner[]): Runner[] {
    let pool = [...runners];
    const finish: Runner[] = [];

    while (pool.length > 0) {
      const winner = pickWinnerByOdds(pool);
      finish.push(winner);
      pool = pool.filter(r => r.id !== winner.id);
    } 
    return finish;
  }

  // ------------------------------------------------------------


  // 固定の出走馬データ
  const runners: Runner[] = [
    { id: "1", name: "絶対勝つウマ", odds: 1.2 },
    { id: "2", name: "ウマウマ", odds: 2.0 },
    { id: "3", name: "高層ビル", odds: 3.0 },
    { id: "4", name: "中立マン", odds: 5.0 },
    { id: "5", name: "バッファ", odds: 10.0 },
    { id: "6", name: "スカイライン", odds: 10.0 },
    { id: "7", name: "エクスプレス", odds: 20.0 }
  ]

  // 一度のレースの流れを管理する関数
  function go() {
    if( phase !== "IDLE" ) return;
    const bet = Number(betstr);
    if( bet <= 0 ) return;
    if( bet > money ) return;
    if(selectedRunner === null) return;

    setMoney(prev => prev - bet);

    setPhase("DRAWING");
    
    setTimeout(() => {
      const finishOrder = makeFinishOrder(runners);
      const payout = (finishOrder[0].id === selectedRunner!.id)
        ? Math.floor(bet * selectedRunner!.odds)
        : 0;

      setPayout(payout);
      setResult(finishOrder);
      setPhase("PAYOUT");
    }, 1000);
  }

  // 結果の受け取り関数
  function accept() {
    if( phase !== "PAYOUT" ) return;
    setMoney(prev => prev + payout);
    setPayout(0);
    setPhase("IDLE");
  }

  // フェーズに応じたメッセージを返す関数
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

  // 全額賭けるボタン
  function setTotalBet() {
    setBet(money.toString());
  }

  return (
    <div className="app">
      <div className="header">
        <h1 className="header__title">競馬ゲーム</h1>
      </div>

      <div className="card">
        {/* 上：情報（右上に所持コイン） */}
        <div className="topbar">
          <div className="topbar__left">
            <div className="label">Phase</div>
            <div className="badge">{phaseMessage(phase)}</div>
          </div>

          <div className="topbar__right">
            <div className="kpiLabel">所持金</div>
            <div className="kpiValue">{money} 円</div>
          </div>
        </div>

        {/* 中央：結果画面 */}
        <div className="main">
          <div>
            <div className="mainTitle">着順</div>
            <div className="finish">
              {result.length > 0
                ? result.map((r, i) => `${i + 1}位 : ${r.name}`).join(", ")
                : "—"}
            </div>
          </div>

          <div className="payout">
            <div className="payout__label">獲得金額</div>
            <div className="payout__value">{payout} 円</div>
          </div>
        </div>
      </div>

      <div className="card">
        {/* 下：操作 */}
        <div className="bottom">
          <div className="controls">

            <div className="row">

              <div className="label">賭ける金額 :</div>
              <input
                type="number"
                value={betstr}
                onChange={(e) => setBet(e.target.value)}
              />
              <div className="label">円</div>

              <button className="totalBetButton" onClick={setTotalBet}>
                全額賭ける
              </button>

            </div>
          
          </div>

          <div className="spacer-16" />

          <div className="race">
            {runners.map((r) => (
              <button
                key={r.id}
                className={
                  selectedRunner?.id === r.id
                    ? "runner runner--selected"
                    : "runner"
                }
                onClick={() => setSelectedRunner(r)}
              >
                <div className="runnerName">{r.name}</div>
                <div className="runnerOdds">Odds {r.odds.toFixed(1)}</div>
              </button>
            ))}
          </div>

          <div className="spacer-8" />

          <div className="actions">
            <button
              disabled={phase !== "IDLE" || selectedRunner === null}
              onClick={go}
            >
              開始
            </button>
            <button disabled={phase !== "PAYOUT"} onClick={accept}>
              受け取り
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}