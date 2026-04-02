export type Phase =  "IDLE" | "BETTING" | "DRAWING" | "PAYOUT";
export type BET = "WIN" | "PLACE" | "TRIO";

export interface Runner {
  id  : string;
  name: string;
  odds: number;
}
