import type { Runner } from "../types/game";

type RunnerButtonProps = {
    runner: Runner;
    isSelected: boolean;
    disabled: boolean;
    onClick: () => void;
}

export default function RunnerButton({ runner, isSelected, disabled, onClick }: RunnerButtonProps) {
    return (
        <button
            className={isSelected ? "runner runner--selected" : "runner"}
            disabled={disabled}
            onClick={onClick}
        >
            <div className="runnerName">{runner.name}</div>
            <div className="runnerOdds">Odds {runner.odds.toFixed(1)}</div>
        </button>
    );


}