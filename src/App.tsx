import "./App.css";

import { useHorseGame } from "./hooks/useHorseGame";

import Header from "./components/Header";
import ResultPanel from "./components/ResultPanel";
import BetPanel from "./components/BetPanel";
import PayoutPanel from "./components/PayoutPanel";


export default function App() {
  const {
    runners,
    money,
    betstr,
    phase,
    payout,
    selectedRunner,
    TrioSelectedRunner,
    result,
    previousResult,
    betType,
    errorMessage,
    setBet,
    setBetType,
    setSelectedRunner,
    toggleTrioSelectedRunner,
    go,
    accept,
    setTotalBet,
    resetMoney,
  } = useHorseGame();

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
            trioSelectedRunner={TrioSelectedRunner}
          />

        </div>

        <div className="right_panel">

          {errorMessage && (
            <p className="error_message" aria-live="polite">
              {errorMessage}
            </p>
          )}

          {/* ベットパネル */ }
          <BetPanel
            betType={betType}
            phase={phase}
            betstr={betstr}
            selectedRunner={selectedRunner}
            trioSelectedRunner={TrioSelectedRunner}
            runners={runners}
            onChangeBetType={setBetType}
            onChangeBet={setBet}
            onSelectRunner={setSelectedRunner}
            onSetTrioSelectedRunner={toggleTrioSelectedRunner}
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