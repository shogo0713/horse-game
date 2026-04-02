import type { BET, Phase, Runner } from "../types/game";

import RunnerButton from "./RunnerButton";

type BetPanelProps = {
    betType: BET;
    phase: Phase;
    betstr: string;
    selectedRunner: Runner | null;
    trioSelectedRunner: Runner[];
    runners: Runner[];
    onChangeBetType: (betType: BET) => void;
    onChangeBet: (value: string) => void;
    onSelectRunner: (runner: Runner) => void;
    onSetTrioSelectedRunner: (runner: Runner) => void;
    onSetTotalBet: () => void;
    onSubmit: () => void;
};

export default function BetPanel({ betType, phase, betstr, selectedRunner, trioSelectedRunner, runners, onChangeBetType, onChangeBet, onSelectRunner, onSetTrioSelectedRunner, onSetTotalBet, onSubmit }: BetPanelProps) {
  const isIdle = phase === "IDLE";

  const isSubmitDisabled =
  !isIdle ||
  (betType !== "TRIO" && selectedRunner === null) ||
  (betType === "TRIO" && trioSelectedRunner.length !== 3);
  
  return (
        <div className="bet_panel">
            <div className="mainTitle">ベット</div>
            <div className="row">
              <div className="bet_panel_label">賭け方</div>
                <select
                  className="bet_panel_select"
                  value={betType}
                  disabled={phase !== "IDLE"}
                  onChange={(e) => onChangeBetType(e.target.value as BET)}
                >
                  <option value="WIN"  >単勝</option>
                  <option value="PLACE">複勝</option>
                  <option value="TRIO" >3連複</option>
                </select>
              </div>
            <div>
              <div className="bet_panel_label ">馬を選択</div>
              <div className="bet_panel_race_list">

                {betType !== "TRIO" && runners.map((r) => (
                    <RunnerButton
                        key={r.id}
                        runner={r}
                        isSelected={selectedRunner?.id === r.id}
                        disabled={phase !== "IDLE"}
                        onClick={() => onSelectRunner(r)}
                    />
                ))}
                {betType === "TRIO" && runners.map((r) => (
                    <RunnerButton
                        key={r.id}
                        runner={r}
                        isSelected={trioSelectedRunner.some((runner) => runner.id === r.id)}
                        disabled={phase !== "IDLE"}
                        onClick={() => onSetTrioSelectedRunner(r)}
                    />
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
                  onChange={(e) => onChangeBet(e.target.value)}
                />
                <div className="bet_amount unit">円</div>
              </div>
              <button className="bet_panel_total_bet_button" disabled={phase !== "IDLE"} onClick={onSetTotalBet}>全額賭ける</button>
            </div>
            <button className="bet_panel_submit_button" disabled={isSubmitDisabled} onClick={onSubmit}>確定</button>
          </div>
        
    );
}