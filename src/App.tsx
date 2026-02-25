import { useState } from "react";
import "./App.css";

type Phase =  "IDLE" | "BETTING" | "DRAWING" | "PAYOUT";
type BET = "WIN" | "PLACE";

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
  const [betType, setBetType] = useState<BET>("WIN");

  // -------------------- 順位計算アルゴリズムたち --------------------

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

  // -------------------- 配当計算アルゴリズムたち --------------------

  function calculatePayout(bet: number, betType: BET, selected: Runner, result: Runner[]): number {
    if (betType === "WIN") {
      return (result[0].id === selected.id) ? Math.floor(bet * selected.odds) : 0;
    } else if (betType === "PLACE") {
      const placeOdds = 1 + (selected.odds - 1) * 0.2984; 
      return (result.slice(0, 3).some(r => r.id === selected.id)) ? Math.floor(bet * placeOdds) : 0;
    }
    return 0;
  }



  // -------------------- メインのアルゴリズムたち --------------------

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
      const payout = calculatePayout(bet, betType, selectedRunner, finishOrder);
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

  // 所持金リセットボタン
  function resetMoney() {
    setMoney(5000);
  }

  return (
    <div className="app">
      <div className="header">
        <h1 className="header__title">競馬ゲーム</h1>
        <div className="spacer-16"/>
        <button className="header__sub" onClick={resetMoney}> お金リセット </button>
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

            {result.length > 0 ? (
              <div className="finishLines">
                {result.map((r, i) => (
                  <div key={r.id} className="finishLine">
                    {i + 1}位 : {r.name}
                  </div>
                ))}
              </div>
            ) : (
              <div className="finishEmpty">—</div>
            )}
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

          <div className="betType">
            <div className="label">賭け方 :</div>
            <select value={betType} onChange={(e) => setBetType(e.target.value as BET)}>
              <option value="WIN"  >単勝</option>
              <option value="PLACE">複勝</option>
            </select>
          </div>

          <div className="spacer-16" />

          <div className="race">

            <div className="raceMessage">
              {betType === "WIN" ? "単勝 : 1位予想の馬を選択してください" : "複勝 : 1-3位予想の馬を選択してください"}
            </div>

            <div className="spacer-8" />

            <div className="raceList">
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