"use client";

import { BoiCard } from "@/components/BoiCard";
import { HatchButton } from "@/components/HatchButton";
import { useAppStore } from "@/lib/store";

export default function PocketPage() {
  const { bois, codes, hydrated } = useAppStore();
  const eggs = codes.filter((code) => !code.boiId);

  if (!hydrated) {
    return <p className="pt-8 text-center text-sm text-mist">warming the pocket…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-[family-name:var(--font-display)] text-3xl leading-none">Pocket</p>
        <p className="mt-2 text-sm text-mist">Scan a QR, store the code, hatch a little guy.</p>
      </div>

      {eggs.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf-dim">unhatched</h2>
          <div className="space-y-3">
            {eggs.map((code) => (
              <div key={code.id} className="rounded-2xl bg-bark p-4 ring-1 ring-white/5">
                <p className="truncate font-mono text-xs text-leaf">{code.payload}</p>
                <p className="mt-1 text-[11px] text-mist">
                  stored {new Date(code.scannedAt).toLocaleTimeString()}
                </p>
                <div className="mt-3">
                  <HatchButton code={code} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {bois.length === 0 ? (
        <div className="paper-card px-5 py-10 text-center">
          <p className="font-[family-name:var(--font-display)] text-xl">no bois yet</p>
          <p className="mt-2 text-sm text-bark/70">Point the camera at a QR, or drop in a sample on Scan.</p>
        </div>
      ) : (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf-dim">collection</h2>
          <div className="grid grid-cols-2 gap-3">
            {bois.map((boi) => (
              <BoiCard key={boi.id} boi={boi} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
