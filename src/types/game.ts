export type Phase = "BETTING" | "DRAWING" | "PAYOUT";
export type BET = "WIN" | "PLACE" | "TRIO" | "TRIFECTA" | "QUINELLA" | "EXACTA";
export type Condition = "HOT" | "NORMAL" | "COLD";

export interface Runner {
  id  : string;
  name: string;
  odds: number;
}

export type RaceHistory = {
  raceNo: number;        // 第n戦
  result: Runner[];      // 着順
  conditions: Record<string, Condition>; // そのレース時の調子
};