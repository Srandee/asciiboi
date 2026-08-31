import catalog from "@/public/bois/catalog.json";
import { hash32 } from "./hash";

export type BoiTemplate = (typeof catalog.bois)[number];

export const BOIS: readonly BoiTemplate[] = catalog.bois;

export function boiIndexForCode(payload: string): number {
  return hash32(payload.trim()) % BOIS.length;
}

export function boiForCode(payload: string): BoiTemplate & { index: number } {
  const index = boiIndexForCode(payload);
  return { ...BOIS[index]!, index };
}
