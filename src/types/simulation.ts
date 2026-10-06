// src/types/simulation.ts

export type ExplanationMode =
  | "beginner"
  | "technical";

export type SimulationStatus =
  | "idle"
  | "paused"
  | "complete";

export interface Token {
  text: string;
  index: number;
  id: number;
  length: number;
  type:
    | "word"
    | "punctuation"
    | "space";
}

export interface Embedding {
  tokenIndex: number;
  values: number[];
}

export interface Probability {
  token: string;
  logit: number;
  probability: number;
}

export interface AttentionCell {
  from: number;
  to: number;
  weight: number;
}

export interface GenerationCandidate {
  token: string;
  logit: number;
  probability: number;
}

export interface GenerationIteration {
  number: number;

  contextBefore: string;

  candidates: GenerationCandidate[];

  selectedToken: string;

  contextAfter: string;
}

export interface DemoExample {
  id: string;

  title: string;

  prompt: string;

  description: string;

  completionTokens: string[];
}

export interface SimulationData {
  example: DemoExample;

  prompt: string;

  tokens: Token[];

  embeddings: Embedding[];

  positions: number[];

  attention: AttentionCell[][];

  iterations: GenerationIteration[];

  generatedTokens: string[];

  response: string;
}

export interface SimulationState
  extends SimulationData {
  currentStage: number;

  status: SimulationStatus;

  speed: number;

  mode: ExplanationMode;

  temperature: number;

  selectedToken: number | null;

  selectedAttention: {
    from: number;
    to: number;
  } | null;

  exploredStages: number[];

  completedIterations: number;

  viewedIteration: number;

  generationPlaying: boolean;
}