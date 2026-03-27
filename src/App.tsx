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
  const [previousResult, setPreviousResult] = useState<Runner[]>([]);
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
      setPreviousResult(result);
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

      {/* ヘッダー部分 */ }
      <header>
        <div className="header_inner">
          <h1 className="header_title">競馬ゲーム</h1>
          <button className="reset_button" onClick={resetMoney}>所持金リセット</button>
          <h1 className="header_sub">所持金: <span className="money">{money}</span> 円</h1>
        </div>
      </header>

      {/* メイン部分 */ }
      <main>
        <div className="left_panel">

          {/* 結果表示パネル */}
          <div className="result_panel">

            <div className="phaseMessage">現在 : {phaseMessage(phase)}</div>
            <div className="mainTitle">着順</div>
            <div className="finishLines">
              {runners.map((runner, i) => (
                <div
                  key={runner.id}
                  className={
                    phase === "PAYOUT" && selectedRunner?.id === result[i]?.id
                      ? "finishLine finishLine--selected"
                      : "finishLine"
                  }
                >
                  <span className={`finishRank finishRank--${i + 1}`}>{i + 1}位:</span>
                  <span className={`finishName finishName--${i + 1}`}>
                    {phase === "PAYOUT" ? (result[i]?.name ?? "-") : "-"}
                  </span>
                </div>
              ))}
            </div>

            <div className="previous_result">
              <div className="previous_result_title">前回結果</div>
              <div className="previous_result_lines">
                {runners.map((_, rank) => (
                  <div key={rank} className="previous_result_line">
                    {rank + 1}位: {previousResult[rank]?.name ?? "-"}
                    {rank < runners.length - 1 ? " ," : ""}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="right_panel">
          {/* ベットパネル */ }
          <div className="bet_panel">
            <div className="mainTitle">ベット</div>
            <div className="row">
              <div className="bet_panel_label">賭け方</div>
                <select
                  className="bet_panel_select"
                  value={betType}
                  disabled={phase !== "IDLE"}
                  onChange={(e) => setBetType(e.target.value as BET)}
                >
                  <option value="WIN"  >単勝</option>
                  <option value="PLACE">複勝</option>
                </select>
              </div>
            <div>
              <div className="bet_panel_label ">馬を選択</div>
              <div className="bet_panel_race_list">
                {runners.map((r) => (
                  <button
                    key={r.id}
                    className={
                      selectedRunner?.id === r.id
                        ? "runner runner--selected"
                        : "runner"
                    }
                    disabled={phase !== "IDLE"}
                    onClick={() => setSelectedRunner(r)}
                  >
                    <div className="runnerName">{r.name}</div>
                    <div className="runnerOdds">Odds {r.odds.toFixed(1)}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="row">
              <div className="row">
                <div className="bet_amount label">賭ける金額</div>
                <input
                  type="number"
                  value={betstr}
                  disabled={phase !== "IDLE"}
                  onChange={(e) => setBet(e.target.value)}
                />
                <div className="bet_amount unit">円</div>
              </div>
              <button className="bet_panel_total_bet_button" disabled={phase !== "IDLE"} onClick={setTotalBet}>全額賭ける</button>
            </div>
            <button className="bet_panel_submit_button" disabled={phase !== "IDLE" || selectedRunner === null} onClick={go}>確定</button>
          </div>

          {/* 払い戻しパネル */}
          <div className="payout_panel">            
            <div className="payout_label">獲得金額</div>
            <div className="payout_value">{payout} 円</div>
            <button disabled={phase !== "PAYOUT"} onClick={accept}>受け取り</button>
          </div>
        </div>
      </main>
    </div>
  );
}