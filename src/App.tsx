import { useState } from "react";
import "./App.css";

import { runners } from "./data/runners";

import { BET, Phase, Runner } from "./types/game";
import { makeFinishOrder } from "./logic/race"
import { calculatePayout } from "./logic/payout";

import Header from "./components/Header";
import ResultPanel from "./components/ResultPanel";
import BetPanel from "./components/BetPanel";
import PayoutPanel from "./components/PayoutPanel";


export default function App() {

  const [money, setMoney] = useState(5000);
  const [betstr, setBet] = useState("300");
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [payout, setPayout] = useState(0);
  const [selectedRunner, setSelectedRunner] = useState<Runner | null>(null);
  const [result, setResult] = useState<Runner[]>([]);
  const [previousResult, setPreviousResult] = useState<Runner[]>([]);
  const [betType, setBetType] = useState<BET>("WIN");


  // -------------------- メインのアルゴリズムたち --------------------

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
      
      {/* ヘッダー部分 */}
      <Header
        money={money}
        onResetMoney={resetMoney}
      />

      {/* メイン部分 */}
      <main>
        <div className="left_panel">

          {/* 結果表示パネル */}
          <ResultPanel
            phase={phase}
            runners={runners}
            result={result}
            previousResult={previousResult}
            selectedRunner={selectedRunner}
          />

        </div>

        <div className="right_panel">

          {/* ベットパネル */ }
          <BetPanel
            betType={betType}
            phase={phase}
            betstr={betstr}
            selectedRunner={selectedRunner}
            runners={runners}
            onChangeBetType={setBetType}
            onChangeBet={setBet}
            onSelectRunner={setSelectedRunner}
            onSetTotalBet={setTotalBet}
            onSubmit={go}
          />

          {/* 払い戻しパネル */}
          <PayoutPanel
            payout={payout}
            phase={phase}
            onAccept={accept}
          />

        </div>
      </main>

    </div>
  );
}