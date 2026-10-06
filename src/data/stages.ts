// src/data/stages.ts

import type {
  StageDefinition,
} from "../types/stage";

export const stages: StageDefinition[] = [
  {
    id: "prompt",
    number: 1,
    shortTitle: "TEXT",
    title: "01 — HUMAN LANGUAGE",

    beginner:
      "This is the incomplete sentence you gave the model. The model receives a sequence of characters, not a collection of ready-made words.",

    technical:
      "The pipeline begins with the exact character sequence supplied to the model. No token IDs or numerical representations have been introduced yet.",

    callout:
      "The model starts with text.",
  },

  {
    id: "tokenization",
    number: 2,
    shortTitle: "TOKENS",
    title: "02 — TOKENIZATION",

    beginner:
      "A tokenizer breaks the text into tokens. A token can be a whole word, part of a word, punctuation, or a piece that includes whitespace.",

    technical:
      "This demonstration uses the o200k_base Byte Pair Encoding vocabulary. Exact token boundaries depend on the tokenizer and vocabulary.",

    callout:
      "A token is not necessarily a word.",
  },

  {
    id: "token-ids",
    number: 3,
    shortTitle: "IDS",
    title: "03 — TOKEN IDs",

    beginner:
      "Each token is mapped to an integer ID. The number is an index into the tokenizer vocabulary.",

    technical:
      "The tokenizer maps each token to an integer vocabulary index. The numeric value itself is not a semantic score.",

    callout:
      "Token IDs are lookup indices.",
  },

  {
    id: "embeddings",
    number: 4,
    shortTitle: "VECTORS",
    title: "04 — EMBEDDINGS",

    beginner:
      "Token IDs are used to retrieve learned vectors. We display a small simplified vector so the transformation is visible.",

    technical:
      "Conceptually, token IDs index an embedding matrix E ∈ R^(V×d_model), producing vectors in the model representation space.",

    callout:
      "Embeddings are vectors.",
  },

  {
    id: "position",
    number: 5,
    shortTitle: "POSITION",
    title: "05 — POSITIONAL INFORMATION",

    beginner:
      "The order of tokens matters. Transformer architectures use positional mechanisms so the model can distinguish different arrangements of tokens.",

    technical:
      "The exact positional mechanism depends on the architecture. This visualization represents positional information conceptually.",

    callout:
      "The same tokens in a different order can produce different meaning.",
  },

  {
    id: "transformer",
    number: 6,
    shortTitle: "TRANSFORMER",
    title: "06 — INTO THE TRANSFORMER",

    beginner:
      "The token representations pass through repeated transformer layers. Each layer transforms the representations further.",

    technical:
      "Transformer stacks repeatedly apply attention and feed-forward transformations together with residual and normalization pathways depending on the architecture.",
  },

  {
    id: "attention",
    number: 7,
    shortTitle: "ATTENTION",
    title: "07 — SELF-ATTENTION",

    beginner:
      "Each token can use information from other tokens to build a context-aware representation.",

    technical:
      "Self-attention computes interactions between token representations. The values displayed here are illustrative simulation data.",

    callout:
      "Attention mixes information from different tokens.",
  },

  {
    id: "logits",
    number: 8,
    shortTitle: "LOGITS",
    title: "08 — NEXT-TOKEN SCORES",

    beginner:
      "After processing the context, the model produces scores for possible next tokens. These scores are called logits.",

    technical:
      "A vocabulary projection produces unnormalized logits for candidate next tokens.",

    callout:
      "Logits are scores, not probabilities.",
  },

  {
    id: "probabilities",
    number: 9,
    shortTitle: "PROBABILITIES",
    title: "09 — SCORES → PROBABILITIES",

    beginner:
      "Softmax transforms the scores into a probability distribution showing how strongly each candidate is represented in this simulation.",

    technical:
      "softmax(xᵢ) = eˣⁱ / Σⱼeˣʲ. Temperature can modify the distribution before selection.",

    callout:
      "Probabilities form a distribution over possible next tokens.",
  },

  {
    id: "sampling",
    number: 10,
    shortTitle: "SELECT",
    title: "10 — SELECT THE NEXT TOKEN",

    beginner:
      "One token is selected from the distribution. This exhibit uses deterministic simulated generation so the same example always produces the same journey.",

    technical:
      "The demonstration uses deterministic next-token choices rather than querying a live language model.",

    callout:
      "One generation step adds one token to the context.",
  },

  {
    id: "generation",
    number: 11,
    shortTitle: "LOOP",
    title: "11 — FIVE GENERATION ITERATIONS",

    beginner:
      "The model generates the response repeatedly. Each iteration adds another token, then the new context is processed again.",

    technical:
      "Autoregressive generation repeats context processing, logit calculation, probability transformation, token selection, and context extension.",

    callout:
      "Generation happens one token at a time.",
  },

  {
    id: "decoding",
    number: 12,
    shortTitle: "RESPONSE",
    title: "12 — FINAL RESPONSE",

    beginner:
      "After the five simulated generation steps, the resulting token sequence becomes the completed response.",

    technical:
      "The generated token sequence is decoded into readable text. The final response shown here is deterministic demonstration output.",

    callout:
      "The output is built incrementally.",
  },
];