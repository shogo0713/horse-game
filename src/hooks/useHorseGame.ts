import { useState } from "react";
import { runners } from "../data/runners";
import type { BET, Phase, Runner } from "../types/game";
import { makeFinishOrder } from "../logic/race";
import { calculatePayout } from "../logic/payout";


export function useHorseGame() {
  const [money, setMoney] = useState(5000);
  const [betstr, setBet] = useState("300");
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [payout, setPayout] = useState(0);
  const [selectedRunner, setSelectedRunner] = useState<Runner | null>(null);
  const [result, setResult] = useState<Runner[]>([]);
  const [previousResult, setPreviousResult] = useState<Runner[]>([]);
  const [betType, setBetType] = useState<BET>("WIN");

  function go() {
    if (phase !== "IDLE") return;

    const bet = Number(betstr);
    if (bet <= 0) return;
    if (bet > money) return;
    if (selectedRunner === null) return;

    setMoney((prev) => prev - bet);
    setPhase("DRAWING");

    setTimeout(() => {
      const finishOrder = makeFinishOrder(runners);
      const payout = calculatePayout(bet, betType, selectedRunner, finishOrder);

      setPreviousResult(result);
      setPayout(payout);
      setResult(finishOrder);
      setPhase("PAYOUT");
    }, 1000);
  }

  function accept() {
    if (phase !== "PAYOUT") return;
    setMoney((prev) => prev + payout);
    setPayout(0);
    setPhase("IDLE");
  }

  function setTotalBet() {
    setBet(money.toString());
  }

  function resetMoney() {
    setMoney(5000);
  }

  return {
    // states
    runners,
    money,
    betstr,
    phase,
    payout,
    selectedRunner,
    result,
    previousResult,
    betType,
    // actions
    setBet,
    setBetType,
    setSelectedRunner,
    go,
    accept,
    setTotalBet,
    resetMoney,
  };
}