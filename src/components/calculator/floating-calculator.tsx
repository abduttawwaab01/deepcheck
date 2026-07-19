"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Calculator, X, Minus, Plus, Divide, Equal, RotateCcw, Sigma, Pi } from "lucide-react";

type CalcMode = "basic" | "scientific";

export function FloatingCalculator() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<CalcMode>("basic");
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, elX: 0, elY: 0 });
  const [memory, setMemory] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPos({ x: window.innerWidth - 280, y: window.innerHeight - 400 });
    }
  }, []);

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) { setDisplay(digit); setWaitingForOperand(false); }
    else { setDisplay(display === "0" ? digit : display + digit); }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) { setDisplay("0."); setWaitingForOperand(false); return; }
    if (!display.includes(".")) setDisplay(display + ".");
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay("0"); setPrevValue(null); setOperator(null); setWaitingForOperand(false);
  }, []);

  const clearEntry = useCallback(() => setDisplay("0"), []);

  const performOperation = useCallback((nextOp: string | null) => {
    const current = parseFloat(display);
    if (prevValue == null) { setPrevValue(current); }
    else if (operator) {
      const result = calculate(prevValue, current, operator);
      setDisplay(String(result));
      setPrevValue(result);
    }
    setWaitingForOperand(true);
    setOperator(nextOp);
  }, [display, prevValue, operator]);

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : 0;
      case "^": return Math.pow(a, b);
      default: return b;
    }
  };

  const handleEquals = useCallback(() => {
    if (prevValue == null || !operator) return;
    const current = parseFloat(display);
    const result = calculate(prevValue, current, operator);
    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }, [display, prevValue, operator]);

  const handleScientific = useCallback((fn: string) => {
    const current = parseFloat(display);
    let result: number;
    switch (fn) {
      case "sin": result = Math.sin(current * (Math.PI / 180)); break;
      case "cos": result = Math.cos(current * (Math.PI / 180)); break;
      case "tan": result = Math.tan(current * (Math.PI / 180)); break;
      case "log": result = Math.log10(current); break;
      case "ln": result = Math.log(current); break;
      case "sqrt": result = Math.sqrt(current); break;
      case "sq": result = current * current; break;
      case "cube": result = current * current * current; break;
      case "inv": result = current !== 0 ? 1 / current : 0; break;
      case "pi": result = Math.PI; break;
      case "e": result = Math.E; break;
      case "fact": { let f = 1; for (let i = 2; i <= current; i++) f *= i; result = f; break; }
      case "neg": result = -current; break;
      default: result = current;
    }
    setDisplay(String(result));
    setWaitingForOperand(true);
  }, [display]);

  const handleMemory = useCallback((action: string) => {
    const current = parseFloat(display);
    switch (action) {
      case "MC": setMemory(null); break;
      case "MR": if (memory != null) { setDisplay(String(memory)); setWaitingForOperand(true); } break;
      case "M+": setMemory((memory || 0) + current); setWaitingForOperand(true); break;
      case "M-": setMemory((memory || 0) - current); setWaitingForOperand(true); break;
    }
  }, [display, memory]);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragRef.current = { startX: clientX, startY: clientY, elX: pos.x, elY: pos.y };
  }, [pos]);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      setPos({ x: dragRef.current.elX + clientX - dragRef.current.startX, y: dragRef.current.elY + clientY - dragRef.current.startY });
    };
    const handleMouseUp = () => setDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [dragging]);

  const btn = (label: string, onClick: () => void, variant = "default", span = false) => (
    <button
      onClick={onClick}
      className={`min-h-[44px] rounded-lg text-sm font-medium transition-all active:scale-95 ${
        variant === "primary" ? "bg-primary-600 text-white hover:bg-primary-700" :
        variant === "operator" ? "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200" :
        variant === "sci" ? "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300" :
        "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200"
      } ${span ? "col-span-2" : ""}`}
    >
      {label}
    </button>
  );

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg active:scale-95 transition-transform"
        aria-label="Open calculator"
      >
        <Calculator className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div
      className="fixed z-50 w-64 rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-950"
      style={{ left: Math.max(0, Math.min(window.innerWidth - 260, pos.x)), top: Math.max(0, Math.min(window.innerHeight - 420, pos.y)) }}
    >
      <div
        className="flex cursor-grab items-center justify-between border-b border-neutral-200 px-3 py-2 dark:border-neutral-700 active:cursor-grabbing"
        onMouseDown={handleDragStart} onTouchStart={handleDragStart}
      >
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Calculator className="h-3.5 w-3.5" />
          {mode === "basic" ? "Basic" : "Scientific"}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setMode(mode === "basic" ? "scientific" : "basic")} className="rounded p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <Sigma className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setOpen(false)} className="rounded p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="mb-3 rounded-lg bg-neutral-100 px-3 py-3 text-right text-2xl font-mono font-bold text-neutral-900 dark:bg-neutral-900 dark:text-white truncate">
          {display}
        </div>

        {mode === "scientific" && (
          <div className="mb-2 grid grid-cols-5 gap-1">
            {btn("sin", () => handleScientific("sin"), "sci")}
            {btn("cos", () => handleScientific("cos"), "sci")}
            {btn("tan", () => handleScientific("tan"), "sci")}
            {btn("log", () => handleScientific("log"), "sci")}
            {btn("ln", () => handleScientific("ln"), "sci")}
            {btn("√", () => handleScientific("sqrt"), "sci")}
            {btn("x²", () => handleScientific("sq"), "sci")}
            {btn("x³", () => handleScientific("cube"), "sci")}
            {btn("1/x", () => handleScientific("inv"), "sci")}
            {btn("x!", () => handleScientific("fact"), "sci")}
            {btn("π", () => handleScientific("pi"), "sci")}
            {btn("e", () => handleScientific("e"), "sci")}
          </div>
        )}

        <div className="grid grid-cols-4 gap-1.5">
          {btn("MC", () => handleMemory("MC"), "sci")}
          {btn("MR", () => handleMemory("MR"), "sci")}
          {btn("M+", () => handleMemory("M+"), "sci")}
          {btn("M-", () => handleMemory("M-"), "sci")}
          {btn("C", () => clear(), "operator")}
          {btn("CE", () => clearEntry(), "sci")}
          {btn("±", () => handleScientific("neg"), "sci")}
          {btn("÷", () => performOperation("÷"), "operator")}
          {btn("7", () => inputDigit("7"))}
          {btn("8", () => inputDigit("8"))}
          {btn("9", () => inputDigit("9"))}
          {btn("×", () => performOperation("×"), "operator")}
          {btn("4", () => inputDigit("4"))}
          {btn("5", () => inputDigit("5"))}
          {btn("6", () => inputDigit("6"))}
          {btn("-", () => performOperation("-"), "operator")}
          {btn("1", () => inputDigit("1"))}
          {btn("2", () => inputDigit("2"))}
          {btn("3", () => inputDigit("3"))}
          {btn("+", () => performOperation("+"), "operator")}
          {btn("0", () => inputDigit("0"), "default", true)}
          {btn(".", () => inputDecimal())}
          {btn("=", () => handleEquals(), "primary")}
        </div>
      </div>
    </div>
  );
}
