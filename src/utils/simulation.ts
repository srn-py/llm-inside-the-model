// src/utils/simulation.ts

import type {
  DemoExample,
  GenerationCandidate,
  GenerationIteration,
  SimulationData,
} from "../types/simulation";

import {
  makeEmbedding,
  normalizeWeights,
  seededValue,
  softmax,
} from "./math";

import {
  tokenizeDemo,
} from "./tokenizer";

const distractorSets: string[][] = [
  [
    " mat",
    " table",
    " floor",
    " chair",
  ],

  [
    " company",
    " organization",
    " system",
    " standard",
  ],

  [
    " JavaScript",
    " programming",
    " music",
    " mathematics",
  ],

  [
    " quickly",
    " toward",
    " across",
    " around",
  ],

  [
    " very",
    " quite",
    " mostly",
    " usually",
  ],
];

export function buildSimulation(
  example: DemoExample,
): SimulationData {
  const prompt =
    example.prompt;

  const tokens =
    tokenizeDemo(prompt);

  const embeddings =
    tokens.map(
      (token) => ({
        tokenIndex:
          token.index,

        values:
          makeEmbedding(
            token.index,
          ),
      }),
    );

  const attention =
    buildAttention(
      tokens.length,
    );

  const iterations =
    buildGenerationIterations(
      example,
    );

  const generatedTokens: string[] =
    [];

  const response =
    prompt +
    example.completionTokens.join(
      "",
    );

  return {
    example,

    prompt,

    tokens,

    embeddings,

    positions:
      tokens.map(
        (token) =>
          token.index,
      ),

    attention,

    iterations,

    generatedTokens,

    response,
  };
}

function buildGenerationIterations(
  example: DemoExample,
): GenerationIteration[] {
  let context =
    example.prompt;

  return example.completionTokens.map(
    (selectedToken, index) => {
      const iterationNumber =
        index + 1;

      const candidates =
        buildCandidates(
          selectedToken,
          index,
        );

      const contextBefore =
        context;

      const contextAfter =
        context +
        selectedToken;

      context =
        contextAfter;

      return {
        number:
          iterationNumber,

        contextBefore,

        candidates,

        selectedToken,

        contextAfter,
      };
    },
  );
}

function buildCandidates(
  selectedToken: string,
  iterationIndex: number,
): GenerationCandidate[] {
  const distractors =
    distractorSets[
      iterationIndex %
        distractorSets.length
    ];

  const candidateTokens = [
    selectedToken,
    ...distractors.slice(
      0,
      4,
    ),
  ];

  const logits =
    candidateTokens.map(
      (_, index) => {
        if (index === 0) {
          return (
            4.4 +
            Math.abs(
              seededValue(
                iterationIndex +
                  17,
              ),
            ) *
              0.5
          );
        }

        return (
          1.2 +
          (4 -
            index) *
            0.35 +
          seededValue(
            iterationIndex *
              11 +
              index *
              7,
          ) *
            0.15
        );
      },
    );

  const probabilities =
    softmax(logits);

  return candidateTokens.map(
    (token, index) => ({
      token,

      logit:
        Number(
          logits[index].toFixed(
            3,
          ),
        ),

      probability:
        probabilities[index],
    }),
  );
}

function buildAttention(
  tokenCount: number,
) {
  return Array.from(
    {
      length: tokenCount,
    },
    (_, from) => {
      const raw =
        Array.from(
          {
            length:
              tokenCount,
          },
          (_, to) => {
            const distance =
              Math.abs(
                from - to,
              );

            return (
              Math.exp(
                -distance * 0.8,
              ) +
              Math.abs(
                seededValue(
                  (from + 1) *
                    100 +
                    to,
                ),
              )
            );
          },
        );

      const normalized =
        normalizeWeights(
          raw,
        );

      return normalized.map(
        (weight, to) => ({
          from,
          to,

          weight:
            Number(
              weight.toFixed(
                3,
              ),
            ),
        }),
      );
    },
  );
}