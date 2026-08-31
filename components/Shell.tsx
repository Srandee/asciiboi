"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { BottomNav } from "./BottomNav";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { credits, hydrated } = useAppStore();
  const hideNav = pathname.startsWith("/boi/");

  return (
    <div className="phone-shell relative flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 flex items-center justify-between px-5 pb-3 pt-[max(1rem,env(safe-area-inset-top))]">
        <Link href="/" className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
          ascii<span className="text-leaf">boi</span>
        </Link>
        <Link
          href="/shop"
          className="flex items-center gap-1.5 rounded-full bg-bark/80 px-3 py-1.5 text-sm text-paper ring-1 ring-leaf/20"
        >
          <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-leaf shadow-[0_0_8px_#c6f54a]" />
          <span className="font-mono tabular-nums">{hydrated ? credits : "—"}</span>
          <span className="text-mist">credits</span>
        </Link>
      </header>
      <main className={`flex-1 px-5 ${hideNav ? "pb-8" : "pb-28"}`}>{children}</main>
      {hideNav ? null : <BottomNav />}
    </div>
  );
}
