"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { boiForCode } from "@/lib/bois";
import { HATCH_COST } from "@/lib/credits";
import { useAppStore } from "@/lib/store";
import type { ScannedCode } from "@/lib/types";

export function HatchButton({
  code,
  label = "Hatch little guy",
}: {
  code: ScannedCode;
  label?: string;
}) {
  const router = useRouter();
  const { credits, completeHatch } = useAppStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const already = Boolean(code.boiId);

  async function onHatch() {
    if (already && code.boiId) {
      router.push(`/boi/${code.boiId}`);
      return;
    }
    if (credits < HATCH_COST) {
      router.push("/shop");
      return;
    }
    setBusy(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 700));
    const result = boiForCode(code.payload);
    const outcome = completeHatch(code.id, result);
    setBusy(false);
    if (!outcome.ok) {
      setError(outcome.reason === "broke" ? "Need a credit for that." : "Could not hatch.");
      if (outcome.reason === "broke") router.push("/shop");
      return;
    }
    router.push(`/boi/${outcome.boi.id}`);
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onHatch}
        disabled={busy}
        className="btn-leaf w-full px-4 py-3 text-sm disabled:opacity-60"
      >
        {busy ? "hashing the code…" : already ? "Open little guy" : `${label} · ${HATCH_COST} credit`}
      </button>
      {error ? <p className="text-center text-xs text-ember">{error}</p> : null}
    </div>
  );
}
