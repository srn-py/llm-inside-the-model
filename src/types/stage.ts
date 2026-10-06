// src/types/stage.ts
export type StageId =
  | "prompt"
  | "tokenization"
  | "token-ids"
  | "embeddings"
  | "position"
  | "transformer"
  | "attention"
  | "logits"
  | "probabilities"
  | "sampling"
  | "generation"
  | "decoding";

export interface StageDefinition {
  id: StageId;
  number: number;
  shortTitle: string;
  title: string;
  beginner: string;
  technical: string;
  callout?: string;
}
