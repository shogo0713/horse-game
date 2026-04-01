import { BET, Runner } from "../types/game";

// 配当計算アルゴリズム
export function calculatePayout(bet: number, betType: BET, selected: Runner, result: Runner[]): number {
    if (betType === "WIN") {
        return (result[0].id === selected.id) ? Math.floor(bet * selected.odds) : 0;
    } else if (betType === "PLACE") {
        const placeOdds = 1 + (selected.odds - 1) * 0.2984; 
        return (result.slice(0, 3).some(r => r.id === selected.id)) ? Math.floor(bet * placeOdds) : 0;
    }
    return 0;
}