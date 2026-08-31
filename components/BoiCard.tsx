"use client";

import Link from "next/link";
import type { Boi } from "@/lib/types";

export function BoiCard({ boi }: { boi: Boi }) {
  return (
    <Link href={`/boi/${boi.id}`} className="paper-card block overflow-hidden">
      <div className="aspect-square overflow-hidden bg-paper-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={boi.photo} alt={boi.name} className="h-full w-full object-cover" />
      </div>
      <div className="px-3 py-2.5">
        <p className="font-[family-name:var(--font-display)] text-base leading-none">{boi.name}</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-bark/60">{boi.species}</p>
      </div>
    </Link>
  );
}
