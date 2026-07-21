import type { ProctorEventType } from "./proctoring";

const IDLE_TIMEOUT_MS = 30_000;
const MIN_WINDOW_SIZE_PX = 400;

type ClientProctorEventType =
  | ProctorEventType
  | "fullscreen_exit"
  | "window_resize"
  | "right_click_blocked"
  | "shortcut_blocked";

export interface ClientProctorEvent {
  instanceId: string;
  eventType: ClientProctorEventType;
  metadata?: Record<string, unknown>;
}

export interface ClientIntegrityReport {
  totalEvents: number;
  tabSwitches: number;
  copyAttempts: number;
  pasteAttempts: number;
  cutAttempts: number;
  idlePeriods: number;
  fullscreenExits: number;
  windowResizes: number;
  rightClicksBlocked: number;
  shortcutsBlocked: number;
  riskLevel: "low" | "medium" | "high";
  details: string[];
}

const BLOCKED_SHORTCUTS: { ctrl?: boolean; shift?: boolean; alt?: boolean; key: string; label: string }[] = [
  { ctrl: true, key: "c", label: "Ctrl+C" },
  { ctrl: true, key: "v", label: "Ctrl+V" },
  { ctrl: true, key: "u", label: "Ctrl+U" },
  { ctrl: true, shift: true, key: "I", label: "Ctrl+Shift+I" },
  { key: "F12", label: "F12" },
];

export class ProctoringMonitor {
  private instanceId: string;
  private onEvent: (event: ClientProctorEvent) => void;
  private running = false;

  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private boundHandlers: Array<{ target: EventTarget; event: string; handler: EventListener }> = [];

  private tabSwitches = 0;
  private copyAttempts = 0;
  private pasteAttempts = 0;
  private cutAttempts = 0;
  private idlePeriods = 0;
  private fullscreenExits = 0;
  private windowResizes = 0;
  private rightClicksBlocked = 0;
  private shortcutsBlocked = 0;

  constructor(instanceId: string, onEvent: (event: ClientProctorEvent) => void) {
    this.instanceId = instanceId;
    this.onEvent = onEvent;
  }

  start(): void {
    if (this.running) return;
    this.running = true;

    this.on("visibilitychange", document, this.handleVisibilityChange);
    this.on("blur", window, this.handleBlur);
    this.on("focus", window, this.handleFocus);
    this.on("copy", document, this.handleCopy);
    this.on("paste", document, this.handlePaste);
    this.on("cut", document, this.handleCut);
    this.on("mousemove", document, this.handleActivity);
    this.on("keydown", document, this.handleActivity);
    this.on("touchstart", document, this.handleActivity);
    this.on("resize", window, this.handleResize);
    this.on("fullscreenchange", document, this.handleFullscreenChange);
    this.on("contextmenu", document, this.handleContextMenu);
    this.on("keydown", document, this.handleShortcutBlock as (e: Event) => void);

    this.resetIdleTimer();
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;

    for (const { target, event, handler } of this.boundHandlers) {
      target.removeEventListener(event, handler);
    }
    this.boundHandlers = [];

    if (this.idleTimer !== null) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  getReport(): ClientIntegrityReport {
    const totalEvents =
      this.tabSwitches +
      this.copyAttempts +
      this.pasteAttempts +
      this.cutAttempts +
      this.idlePeriods +
      this.fullscreenExits +
      this.windowResizes +
      this.rightClicksBlocked +
      this.shortcutsBlocked;

    const suspicious = this.tabSwitches + this.copyAttempts + this.pasteAttempts + this.shortcutsBlocked;
    let riskLevel: "low" | "medium" | "high" = "low";
    if (suspicious >= 5) riskLevel = "high";
    else if (suspicious >= 2) riskLevel = "medium";

    const details: string[] = [];
    if (this.tabSwitches > 0) details.push(`${this.tabSwitches} tab/window switch(es)`);
    if (this.copyAttempts > 0) details.push(`${this.copyAttempts} copy attempt(s)`);
    if (this.pasteAttempts > 0) details.push(`${this.pasteAttempts} paste attempt(s)`);
    if (this.cutAttempts > 0) details.push(`${this.cutAttempts} cut attempt(s)`);
    if (this.idlePeriods > 0) details.push(`${this.idlePeriods} idle period(s)`);
    if (this.fullscreenExits > 0) details.push(`${this.fullscreenExits} fullscreen exit(s)`);
    if (this.windowResizes > 0) details.push(`${this.windowResizes} suspicious resize(s)`);
    if (this.rightClicksBlocked > 0) details.push(`${this.rightClicksBlocked} right-click(s) blocked`);
    if (this.shortcutsBlocked > 0) details.push(`${this.shortcutsBlocked} shortcut(s) blocked`);

    return {
      totalEvents,
      tabSwitches: this.tabSwitches,
      copyAttempts: this.copyAttempts,
      pasteAttempts: this.pasteAttempts,
      cutAttempts: this.cutAttempts,
      idlePeriods: this.idlePeriods,
      fullscreenExits: this.fullscreenExits,
      windowResizes: this.windowResizes,
      rightClicksBlocked: this.rightClicksBlocked,
      shortcutsBlocked: this.shortcutsBlocked,
      riskLevel,
      details,
    };
  }

  private emit(eventType: ClientProctorEventType, metadata?: Record<string, any>): void {
    this.onEvent({ instanceId: this.instanceId, eventType, metadata });
  }

  private on(
    event: string,
    target: EventTarget,
    handler: (e: Event) => void,
  ): void {
    const bound = handler.bind(this) as EventListener;
    target.addEventListener(event, bound);
    this.boundHandlers.push({ target, event, handler: bound });
  }

  private resetIdleTimer(): void {
    if (this.idleTimer !== null) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.idlePeriods++;
      this.emit("idle", { idleSeconds: IDLE_TIMEOUT_MS / 1000 });
    }, IDLE_TIMEOUT_MS);
  }

  private handleActivity = (): void => {
    this.resetIdleTimer();
  };

  private handleVisibilityChange = (): void => {
    if (document.hidden) {
      this.tabSwitches++;
      this.emit("tab_switch", { action: "hidden", timestamp: Date.now() });
    }
  };

  private handleBlur = (): void => {
    this.tabSwitches++;
    this.emit("tab_switch", { action: "blur", timestamp: Date.now() });
  };

  private handleFocus = (): void => {
    this.emit("tab_switch", { action: "focus", timestamp: Date.now() });
  };

  private handleCopy = (): void => {
    this.copyAttempts++;
    this.emit("copy", { timestamp: Date.now() });
  };

  private handlePaste = (): void => {
    this.pasteAttempts++;
    this.emit("paste", { timestamp: Date.now() });
  };

  private handleCut = (): void => {
    this.cutAttempts++;
    this.emit("copy", { action: "cut", timestamp: Date.now() });
  };

  private handleResize = (): void => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w < MIN_WINDOW_SIZE_PX || h < MIN_WINDOW_SIZE_PX) {
      this.windowResizes++;
      this.emit("window_resize", { width: w, height: h, timestamp: Date.now() });
    }
  };

  private handleFullscreenChange = (): void => {
    if (!document.fullscreenElement) {
      this.fullscreenExits++;
      this.emit("fullscreen_exit", { timestamp: Date.now() });
    }
  };

  private handleContextMenu = (e: Event): void => {
    e.preventDefault();
    this.rightClicksBlocked++;
    this.emit("right_click_blocked", { timestamp: Date.now() });
  };

  private handleShortcutBlock = (e: KeyboardEvent): void => {
    for (const s of BLOCKED_SHORTCUTS) {
      const ctrlMatch = s.ctrl ? e.ctrlKey || e.metaKey : !(e.ctrlKey || e.metaKey);
      const shiftMatch = s.shift ? e.shiftKey : !e.shiftKey;
      const altMatch = s.alt ? e.altKey : !e.altKey;
      const keyMatch = e.key.toLowerCase() === s.key.toLowerCase();

      if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
        e.preventDefault();
        e.stopPropagation();
        this.shortcutsBlocked++;
        this.emit("shortcut_blocked", { shortcut: s.label, timestamp: Date.now() });
        return;
      }
    }
  };
}
