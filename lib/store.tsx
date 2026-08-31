"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { HATCH_COST, STARTER_CREDITS } from "./credits";
import { uid } from "./hash";
import type { AppSnapshot, Boi, HatchResponse, ScannedCode } from "./types";

const STORAGE_KEY = "asciiboi-v2";

const empty: AppSnapshot = {
  version: 2,
  credits: STARTER_CREDITS,
  codes: [],
  bois: [],
};

function readSnapshot(): AppSnapshot {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as AppSnapshot;
    if (parsed.version !== 2 || !Array.isArray(parsed.codes) || !Array.isArray(parsed.bois)) {
      return empty;
    }
    return {
      version: 2,
      credits: Number.isFinite(parsed.credits) ? parsed.credits : STARTER_CREDITS,
      codes: parsed.codes,
      bois: parsed.bois,
    };
  } catch {
    return empty;
  }
}

type HatchResult = { ok: true; boi: Boi } | { ok: false; reason: "broke" | "missing" };

type StoreValue = AppSnapshot & {
  hydrated: boolean;
  rememberCode: (payload: string, source: ScannedCode["source"]) => ScannedCode;
  completeHatch: (codeId: string, result: HatchResponse) => HatchResult;
  addCredits: (amount: number) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function AppStore({ children }: { children: ReactNode }) {
  const [snap, setSnap] = useState<AppSnapshot>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSnap(readSnapshot());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
  }, [snap, hydrated]);

  const rememberCode = useCallback((payload: string, source: ScannedCode["source"]) => {
    const trimmed = payload.trim().slice(0, 2048);
    let saved: ScannedCode = {
      id: uid("code"),
      payload: trimmed,
      scannedAt: Date.now(),
      source,
    };

    setSnap((prev) => {
      const existing = prev.codes.find((code) => code.payload === trimmed);
      if (existing) {
        saved = existing;
        return prev;
      }
      return { ...prev, codes: [saved, ...prev.codes] };
    });

    return saved;
  }, []);

  const addCredits = useCallback((amount: number) => {
    setSnap((prev) => ({ ...prev, credits: prev.credits + amount }));
  }, []);

  const completeHatch = useCallback((codeId: string, result: HatchResponse): HatchResult => {
    let outcome: HatchResult = { ok: false, reason: "missing" };

    setSnap((prev) => {
      const code = prev.codes.find((item) => item.id === codeId);
      if (!code) {
        outcome = { ok: false, reason: "missing" };
        return prev;
      }
      if (prev.credits < HATCH_COST) {
        outcome = { ok: false, reason: "broke" };
        return prev;
      }
      const boi: Boi = {
        id: uid("boi"),
        codeId,
        payload: code.payload,
        templateId: result.id,
        photo: result.photo,
        name: result.name,
        species: result.species,
        blurb: result.blurb,
        traits: result.traits,
        hatchedAt: Date.now(),
      };
      outcome = { ok: true, boi };
      return {
        ...prev,
        credits: prev.credits - HATCH_COST,
        bois: [boi, ...prev.bois.filter((item) => item.codeId !== codeId)],
        codes: prev.codes.map((item) =>
          item.id === codeId ? { ...item, boiId: boi.id } : item,
        ),
      };
    });

    return outcome;
  }, []);

  const value = useMemo<StoreValue>(
    () => ({ ...snap, hydrated, rememberCode, completeHatch, addCredits }),
    [snap, hydrated, rememberCode, completeHatch, addCredits],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStore");
  return ctx;
}
