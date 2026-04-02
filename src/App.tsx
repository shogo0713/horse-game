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
    TrifectaSelectedRunner,
    result,
    previousResult,
    betType,
    errorMessage,
    setBet,
    setBetType,
    setSelectedRunner,
    toggleTrioSelectedRunner,
    toggleTrifectaSelectedRunner,
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
            betType={betType}
            phase={phase}
            runners={runners}
            result={result}
            previousResult={previousResult}
            oneSelectedRunner={selectedRunner}
            trioSelectedRunner={TrioSelectedRunner}
            trifectaSelectedRunner={TrifectaSelectedRunner}
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
            oneSelectedRunner={selectedRunner}
            trioSelectedRunner={TrioSelectedRunner}
            trifectaSelectedRunner={TrifectaSelectedRunner}
            runners={runners}
            onChangeBetType={setBetType}
            onChangeBet={setBet}
            onSelectRunner={setSelectedRunner}
            toggleTrioSelectedRunner={toggleTrioSelectedRunner}
            toggleTrifectaSelectedRunner={toggleTrifectaSelectedRunner}
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