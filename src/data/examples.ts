// src/data/examples.ts

import type {
  DemoExample,
} from "../types/simulation";

export const examples: DemoExample[] = [
  {
    id: "cat",
    title: "A simple scene",

    prompt:
      "The cat is sitting on the",

    description:
      "A familiar sentence that demonstrates ordinary language continuation.",

    completionTokens: [
      " mat",
      " near",
      " the",
      " window",
      ".",
    ],
  },

  {
    id: "ibm",
    title: "An abbreviation",

    prompt:
      "IBM stands for",

    description:
      "Shows how the model can continue a sentence containing an acronym.",

    completionTokens: [
      " International",
      " Organization",
      " for",
      " Standardization",
      ".",
    ],
  },

  {
    id: "learning",
    title: "A personal statement",

    prompt:
      "I am learning",

    description:
      "Demonstrates that several different continuations can be plausible.",

    completionTokens: [
      " Python",
      " because",
      " I",
      " enjoy",
      " it.",
    ],
  },

  {
    id: "football",
    title: "A football sentence",

    prompt:
      "The football player ran",

    description:
      "Uses the surrounding context to produce a plausible continuation.",

    completionTokens: [
      " toward",
      " the",
      " goal",
      " and",
      " scored.",
    ],
  },

  {
    id: "weather",
    title: "A weather sentence",

    prompt:
      "The weather today is",

    description:
      "Shows how several words can be generated one token at a time.",

    completionTokens: [
      " quite",
      " warm",
      " and",
      " sunny",
      ".",
    ],
  },
];