export type Phase =  "IDLE" | "BETTING" | "DRAWING" | "PAYOUT";
export type BET = "WIN" | "PLACE";

export interface Runner {
  id  : string;
  name: string;
  odds: number;
}
