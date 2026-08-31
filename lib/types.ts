export type ScannedCode = {
  id: string;
  payload: string;
  scannedAt: number;
  source: "camera" | "image" | "typed" | "sample";
  boiId?: string;
};

export type Boi = {
  id: string;
  codeId: string;
  payload: string;
  templateId: string;
  photo: string;
  name: string;
  species: string;
  blurb: string;
  traits: string[];
  hatchedAt: number;
};

export type AppSnapshot = {
  version: 2;
  credits: number;
  codes: ScannedCode[];
  bois: Boi[];
};

export type HatchResponse = {
  id: string;
  name: string;
  species: string;
  photo: string;
  blurb: string;
  traits: string[];
};

export type CreditPack = {
  id: string;
  name: string;
  credits: number;
  price: string;
  tag?: string;
};
