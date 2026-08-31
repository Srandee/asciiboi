"use client";

import { useCallback, useState } from "react";
import { HatchButton } from "@/components/HatchButton";
import { Scanner } from "@/components/Scanner";
import { SAMPLE_CODES } from "@/lib/credits";
import { useAppStore } from "@/lib/store";
import type { ScannedCode } from "@/lib/types";

export default function ScanPage() {
  const { rememberCode, codes } = useAppStore();
  const [typed, setTyped] = useState("");
  const [latest, setLatest] = useState<ScannedCode | null>(null);

  const capture = useCallback(
    (payload: string, source: ScannedCode["source"]) => {
      const trimmed = payload.trim();
      if (!trimmed) return;
      if (latest && latest.payload === trimmed) return;
      const saved = rememberCode(trimmed, source);
      setLatest(saved);
    },
    [latest, rememberCode],
  );

  return (
    <div className="space-y-5">
      <div>
        <p className="font-[family-name:var(--font-display)] text-3xl leading-none">Scan</p>
        <p className="mt-2 text-sm text-mist">Codes get stored first. Hatching spends a credit.</p>
      </div>

      <Scanner onDetect={(payload, source) => capture(payload, source)} paused={Boolean(latest)} />

      <form
        className="space-y-2"
        onSubmit={(event) => {
          event.preventDefault();
          capture(typed, "typed");
          setTyped("");
        }}
      >
        <label className="text-xs uppercase tracking-[0.18em] text-leaf-dim">or type a payload</label>
        <div className="flex gap-2">
          <input
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            placeholder="paste a code"
            className="min-w-0 flex-1 rounded-full bg-bark px-4 py-3 font-mono text-sm outline-none ring-1 ring-white/10 focus:ring-leaf/50"
          />
          <button type="submit" className="btn-leaf px-4 py-3 text-sm">
            Store
          </button>
        </div>
      </form>

      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-leaf-dim">sample codes</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SAMPLE_CODES.map((sample) => (
            <button
              key={sample.payload}
              type="button"
              onClick={() => capture(sample.payload, "sample")}
              className="rounded-full bg-bark px-3 py-1.5 text-xs ring-1 ring-white/10"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {latest ? (
        <div className="paper-card space-y-3 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-bark/50">stored</p>
          <p className="break-all font-mono text-sm">{latest.payload}</p>
          <HatchButton code={codes.find((code) => code.id === latest.id) ?? latest} />
        </div>
      ) : null}
    </div>
  );
}
