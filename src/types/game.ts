export type Phase = "BETTING" | "DRAWING" | "PAYOUT";
export type BET = "WIN" | "PLACE" | "TRIO" | "TRIFECTA";

export interface Runner {
  id  : string;
  name: string;
  odds: number;
}
