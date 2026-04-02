import { BET, Runner } from "../types/game";

// 配当計算アルゴリズム
export function calculatePayout(bet: number, betType: BET, selected: Runner | null, threeSelected: Runner[], result: Runner[]): number {
    if (betType === "WIN") {
        return calculateWinPayout(bet, selected, result);
    } else if (betType === "PLACE") {
        return calculatePlacePayout(bet, selected, result);
    } else if (betType === "TRIO") {
        return calculateTrioPayout(bet, threeSelected, result);
    }
    return 0;
}

// 単勝計算
function calculateWinPayout(bet: number, selected: Runner | null, result: Runner[]): number {
    if (!selected) return 0;
    return (result[0].id === selected.id) ? Math.floor(selected.odds * bet) : 0;
}

// 複勝計算
function calculatePlacePayout(bet: number, selected: Runner | null, result: Runner[]): number {
    if (!selected) return 0;
    const placeOdds = 1 + (selected.odds - 1) * 0.2984; 
    return (result.slice(0, 3).some(r => r.id === selected.id)) ? Math.floor(placeOdds * bet) : 0;
}

// 3連単計算
function calculateTrioPayout(bet: number, threeSelected: Runner[], result: Runner[]): number {
  if (threeSelected.length !== 3) return 0;

  const trioOdds =
    4 +
    (threeSelected[0].odds - 1) * 0.5 +
    (threeSelected[1].odds - 1) * 0.3 +
    (threeSelected[2].odds - 1) * 0.2;

  const selectedIds = threeSelected.map((r) => r.id).sort();
  const top3Ids = result.slice(0, 3).map((r) => r.id).sort();

  const isHit = selectedIds.every((id, i) => id === top3Ids[i]);

  return isHit ? Math.floor(trioOdds * bet) : 0;
}   