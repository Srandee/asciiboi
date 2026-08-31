"use client";

import { useState } from "react";
import { CREDIT_PACKS } from "@/lib/credits";
import { useAppStore } from "@/lib/store";

export default function ShopPage() {
  const { addCredits, credits } = useAppStore();
  const [buying, setBuying] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  async function buy(packId: string, amount: number, name: string) {
    setBuying(packId);
    await new Promise((resolve) => setTimeout(resolve, 900));
    addCredits(amount);
    setBuying(null);
    setFlash(`${name} packed. +${amount} credits.`);
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="font-[family-name:var(--font-display)] text-3xl leading-none">Shop</p>
        <p className="mt-2 text-sm text-mist">
          One credit hatches one little guy from a stored code. Demo checkout — no real charge.
        </p>
      </div>

      <div className="rounded-2xl bg-bark px-4 py-3 font-mono text-sm ring-1 ring-leaf/20">
        wallet · {credits} credits
      </div>

      <div className="space-y-3">
        {CREDIT_PACKS.map((pack) => (
          <button
            key={pack.id}
            type="button"
            disabled={buying !== null}
            onClick={() => buy(pack.id, pack.credits, pack.name)}
            className="paper-card flex w-full items-center justify-between px-4 py-4 text-left disabled:opacity-60"
          >
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg">{pack.name}</p>
              <p className="text-sm text-bark/70">{pack.credits} credits</p>
            </div>
            <div className="text-right">
              {pack.tag ? (
                <p className="text-[10px] uppercase tracking-[0.18em] text-ember">{pack.tag}</p>
              ) : null}
              <p className="text-base font-semibold">{buying === pack.id ? "inserting…" : pack.price}</p>
            </div>
          </button>
        ))}
      </div>

      {flash ? <p className="text-center text-sm text-leaf">{flash}</p> : null}
    </div>
  );
}
