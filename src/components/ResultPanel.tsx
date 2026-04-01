import type { Phase, Runner } from "../types/game";

type ResultPanelProps = {
    phase: Phase;
    runners: Runner[];
    result: Runner[];
    previousResult: Runner[];
    selectedRunner: Runner | null;
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

export default function ResultPanel({ phase, runners, result, previousResult, selectedRunner }: ResultPanelProps) {
    return (
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
                }>
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
    );
}