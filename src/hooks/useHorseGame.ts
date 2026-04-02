import { useState } from "react";
import { runners } from "../data/runners";
import type { BET, Phase, Runner } from "../types/game";
import { makeFinishOrder } from "../logic/race";
import { calculatePayout } from "../logic/payout";


export function useHorseGame() {
  const [money, setMoney] = useState(5000);
  const [betstr, setBet] = useState("300");
  const [phase, setPhase] = useState<Phase>("BETTING");
  const [payout, setPayout] = useState(0);
  const [oneSelectedRunner, setSelectedRunner] = useState<Runner | null>(null); // 単勝・複勝 選択用
  const [TrioSelectedRunner, setTrioSelectedRunner] = useState<Runner[]>([]); // 3連複 選択用
  const [TrifectaSelectedRunner, setTrifectaSelectedRunner] = useState<Runner[]>([]); // 3連単 選択用
  const [result, setResult] = useState<Runner[]>([]);
  const [previousResult, setPreviousResult] = useState<Runner[]>([]);
  const [betType, setBetType] = useState<BET>("WIN");
  const [errorMessage, setErrorMessage] = useState("");

  function toggleTrioSelectedRunner(runner: Runner) {
    setTrioSelectedRunner((prev) => {
      // すでに選ばれているか？
      const exists = prev.some((r) => r.id === runner.id);

      // 選ばれていたら → 解除
      if (exists) {
        return prev.filter((r) => r.id !== runner.id);
      }

      // まだ3頭未満なら → 追加
      if (prev.length < 3) {
        return [...prev, runner];
      }

      // 3頭すでに選ばれていたら → 何もしない
      return prev;
    });
  }

  function toggleTrifectaSelectedRunner(runner: Runner) {
    setTrifectaSelectedRunner((prev) => {
      // すでに選ばれているか？
      const exists = prev.some((r) => r.id === runner.id);

      // 選ばれていたら → 解除
      if (exists) {
        return prev.filter((r) => r.id !== runner.id);
      }

      // まだ3頭未満なら → 追加
      if (prev.length < 3) {
        return [...prev, runner];
      }

      // 3頭すでに選ばれていたら → 何もしない
      return prev;
    });
  }

  function go() {
  
    // ----- 抽選前 -----
    if (phase !== "BETTING") return;

    // 入力のエラーチェック
    const bet = Number(betstr);
    setErrorMessage("");
    if (bet <= 0) {
      setErrorMessage("賭ける金額を入力してください。");
      return;
    }
    if (bet > money) {
      setErrorMessage("所持金が不足しています。");
      return;
    }
    if ((betType === "WIN" || betType === "PLACE") && oneSelectedRunner === null) {
      setErrorMessage("馬を選択してください。");
      return;
    }
    if (betType === "TRIO" && TrioSelectedRunner.length !== 3) {
      setErrorMessage("3匹の馬を選択してください。");
      return;
    }
    if (betType === "TRIFECTA" && TrifectaSelectedRunner.length !== 3) {
      setErrorMessage("3匹の馬を選択してください。");
      return;
    }

    // ----- 抽選中 => 結果発表 -----
    setPhase("DRAWING");
    setMoney((prev) => prev - bet);

    setTimeout(() => {
      const finishOrder = makeFinishOrder(runners);
      const threeSelected = betType === "TRIO" ? TrioSelectedRunner : TrifectaSelectedRunner;
      const payout = calculatePayout(bet, betType, oneSelectedRunner, threeSelected, finishOrder);

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
    setPhase("BETTING");
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
    selectedRunner: oneSelectedRunner,
    TrioSelectedRunner: TrioSelectedRunner,
    TrifectaSelectedRunner: TrifectaSelectedRunner,
    result,
    previousResult,
    betType,
    errorMessage,
    // actions
    setBet,
    setBetType,
    setSelectedRunner,
    toggleTrioSelectedRunner,
    toggleTrifectaSelectedRunner,
    go,
    accept,
    setTotalBet,
    resetMoney,
  };
}