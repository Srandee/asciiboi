"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import QRCode from "qrcode";
import { useAppStore } from "@/lib/store";

export default function BoiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { bois, hydrated } = useAppStore();
  const boi = bois.find((item) => item.id === id);
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    if (!boi) return;
    QRCode.toDataURL(boi.payload, { margin: 1, width: 240, color: { dark: "#1a2116", light: "#f3ead4" } }).then(
      setQr,
    );
  }, [boi]);

  if (!hydrated) {
    return <p className="pt-8 text-center text-sm text-mist">looking in the pocket…</p>;
  }

  if (!boi) {
    return (
      <div className="space-y-4 pt-8 text-center">
        <p>That little guy wandered off.</p>
        <Link href="/" className="text-leaf underline">
          Back to pocket
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link href="/" className="text-xs uppercase tracking-[0.18em] text-mist">
        ← pocket
      </Link>
      <div className="paper-card overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={boi.photo} alt={boi.name} className="aspect-square w-full object-cover" />
        <div className="space-y-3 p-5">
          <div>
            <p className="font-[family-name:var(--font-display)] text-3xl leading-none">{boi.name}</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-wide text-bark/60">{boi.species}</p>
          </div>
          <p className="text-sm leading-relaxed">{boi.blurb}</p>
          <div className="flex flex-wrap gap-1.5">
            {boi.traits.map((trait) => (
              <span key={trait} className="rounded-full bg-ink/10 px-2.5 py-1 text-[11px]">
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-bark p-4 ring-1 ring-white/5">
        <p className="text-xs uppercase tracking-[0.18em] text-leaf-dim">hatched from</p>
        <p className="mt-2 break-all font-mono text-sm text-leaf">{boi.payload}</p>
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qr} alt="Original QR" className="mx-auto mt-4 w-32 rounded-xl" />
        ) : null}
      </div>
    </div>
  );
}
