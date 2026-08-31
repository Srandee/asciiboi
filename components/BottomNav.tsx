"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items: {
  href: string;
  label: string;
  icon: () => React.JSX.Element;
  featured?: boolean;
}[] = [
  { href: "/", label: "Pocket", icon: PocketIcon },
  { href: "/scan", label: "Scan", icon: ScanIcon, featured: true },
  { href: "/shop", label: "Shop", icon: ShopIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="flex items-end justify-around rounded-3xl bg-moss/95 px-2 py-2 ring-1 ring-white/5 backdrop-blur">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          if (item.featured) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="-mt-7 flex flex-col items-center gap-1"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf text-ink shadow-[0_8px_20px_rgba(198,245,74,0.35)]">
                  <Icon />
                </span>
                <span className="text-[11px] font-semibold text-leaf">{item.label}</span>
              </Link>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-16 flex-col items-center gap-1 py-2 text-[11px] ${
                active ? "text-leaf" : "text-mist"
              }`}
            >
              <Icon />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function PocketIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 8.5h14v9.5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M8 8.5V6a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ShopIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8.5" cy="18" r="1.4" fill="currentColor" />
      <circle cx="16.5" cy="18" r="1.4" fill="currentColor" />
      <path
        d="M4 6h2l1.2 9h11.3l1.6-6.5H7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
