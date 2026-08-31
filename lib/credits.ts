export const STARTER_CREDITS = 5;
export const HATCH_COST = 1;

export const CREDIT_PACKS = [
  { id: "pocket", name: "Pocket", credits: 5, price: "$1.99", tag: "snack" },
  { id: "stack", name: "Stack", credits: 20, price: "$5.99", tag: "best" },
  { id: "crate", name: "Crate", credits: 50, price: "$11.99", tag: "hoard" },
] as const;

export const SAMPLE_CODES = [
  { label: "coffee shop", payload: "COFFEE-SHOP" },
  { label: "bus pass", payload: "BUS-PASS-42" },
  { label: "secret url", payload: "https://ascii.boi/secret" },
  { label: "lunch box", payload: "LUNCH-BOX" },
  { label: "asciiboi", payload: "ASCIIBOI" },
] as const;
