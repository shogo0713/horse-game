import { BET, Runner } from "../types/game";

// 配当計算アルゴリズム
export function calculatePayout(bet: number, betType: BET, selected: Runner | null, threeSelected: Runner[], twoSelected: Runner[], result: Runner[]): number {
    if (betType === "WIN") {
        return calculateWinPayout(bet, selected, result);
    } else if (betType === "PLACE") {
        return calculatePlacePayout(bet, selected, result);
    } else if (betType === "TRIO") {
        return calculateTrioPayout(bet, threeSelected, result);
    } else if (betType === "TRIFECTA") {
        return calculateTrifectaPayout(bet, threeSelected, result);
    } else if (betType === "QUINELLA") {
        return calculateQuinellaPayout(bet, twoSelected, result);
    } else if (betType === "EXACTA") {
        return calculateExactaPayout(bet, twoSelected, result);
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
    const placeOdds = 1 + (selected.odds - 0.7) * 0.3553; 
    return (result.slice(0, 3).some(r => r.id === selected.id)) ? Math.floor(placeOdds * bet) : 0;
}

// 3連復計算
function calculateTrioPayout(bet: number, threeSelected: Runner[], result: Runner[]): number {
  if (threeSelected.length !== 3) return 0;

  const trioOdds =
    15 +
    (threeSelected[0].odds - 1) * 2.0 +
    (threeSelected[1].odds - 1) * 1.5 +
    (threeSelected[2].odds - 1) * 1.0;

  const selectedIds = threeSelected.map((r) => r.id).sort();
  const top3Ids = result.slice(0, 3).map((r) => r.id).sort();

  const isHit = selectedIds.every((id, i) => id === top3Ids[i]);

  return isHit ? Math.floor(trioOdds * bet) : 0;
}

// 3連単計算
function calculateTrifectaPayout(bet: number, threeSelected: Runner[], result: Runner[]): number {
  if (threeSelected.length !== 3) return 0;

  const trifectaOdds =
    40 +
    (threeSelected[0].odds - 1) * 4.0 +
    (threeSelected[1].odds - 1) * 2.5 +
    (threeSelected[2].odds - 1) * 2.0;

  const selectedIds = threeSelected.map((r) => r.id);
  const top3Ids = result.slice(0, 3).map((r) => r.id);

  const isHit = selectedIds.every((id, i) => id === top3Ids[i]);

  return isHit ? Math.floor(trifectaOdds * bet) : 0;
}

// 馬連計算
function calculateQuinellaPayout(bet: number, twoSelected: Runner[], result: Runner[]): number {
    if(twoSelected.length !== 2) return 0;

    const quinellaOdds =
        8 +
        (twoSelected[0].odds - 1) * 1.5 +
        (twoSelected[1].odds - 1) * 1.0;
    
    const selectedIds = twoSelected.map((r) => r.id).sort();
    const top2Ids = result.slice(0, 2).map((r) => r.id).sort();

    const isHit = selectedIds.every((id, i) => id === top2Ids[i]);

    return isHit ? Math.floor(quinellaOdds * bet) : 0;
}

// 馬単計算
function calculateExactaPayout(bet: number, twoSelected: Runner[], result: Runner[]): number {
    if(twoSelected.length !== 2) return 0;

    const exactaOdds =
        20 +
        (twoSelected[0].odds - 1) * 3.0 +
        (twoSelected[1].odds - 1) * 2.0;

    const selectedIds = twoSelected.map((r) => r.id);
    const top2Ids = result.slice(0, 2).map((r) => r.id);

    const isHit = selectedIds.every((id, i) => id === top2Ids[i]);

    return isHit ? Math.floor(exactaOdds * bet) : 0;
}