import { Runner } from "../types/game";
import { Condition } from "../types/game";

// 馬の配列から1頭決める
export function pickWinnerByOdds(
  pool: Runner[],
  weighted: { runner: Runner; weight: number }[]
): Runner {
  // pool に残っている馬だけ抽出
  const poolWeighted = weighted.filter((w) =>
    pool.some((r) => r.id === w.runner.id)
  );

  const total = poolWeighted.reduce((s, w) => s + w.weight, 0);
  let r = Math.random() * total;

  for (const w of poolWeighted) {
    r -= w.weight;
    if (r <= 0) return w.runner;
  }
  return poolWeighted[poolWeighted.length - 1].runner;
}

// 馬の順位を決める
export function makeFinishOrder(runners: Runner[], conditions: Record<string, Condition>): Runner[] {

    const weighted = runners.map((r) => {
        const base = 1 / r.odds;
        const mod = conditions[r.id] === "HOT" ? 0.6
                   : conditions[r.id] === "COLD" ? 0
                   : 0.2;
        return { runner: r, weight: base + mod };
    });
    

    let pool = [...runners];
    const finish: Runner[] = [];

    while (pool.length > 0) {const winner = pickWinnerByOdds(pool, weighted);
        finish.push(winner);
        pool = pool.filter(r => r.id !== winner.id);
    }
    return finish;
}