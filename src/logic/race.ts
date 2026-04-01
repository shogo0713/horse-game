import { Runner } from "../types/game";

// 馬の配列から1頭決める
export function pickWinnerByOdds(runners: Runner[]): Runner {
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
export function makeFinishOrder(runners: Runner[]): Runner[] {
    let pool = [...runners];
    const finish: Runner[] = [];

    while (pool.length > 0) {const winner = pickWinnerByOdds(pool);
        finish.push(winner);
        pool = pool.filter(r => r.id !== winner.id);
    }
    return finish;
}