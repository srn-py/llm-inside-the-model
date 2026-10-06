// src/utils/simulation.test.ts

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  examples,
} from "../data/examples";

import {
  buildSimulation,
} from "./simulation";

describe(
  "buildSimulation",
  () => {
    it(
      "creates exactly five generation iterations",
      () => {
        const result =
          buildSimulation(
            examples[1],
          );

        expect(
          result.iterations,
        ).toHaveLength(5);
      },
    );

    it(
      "creates deterministic generation output",
      () => {
        const first =
          buildSimulation(
            examples[1],
          );

        const second =
          buildSimulation(
            examples[1],
          );

        expect(
          first.iterations,
        ).toEqual(
          second.iterations,
        );

        expect(
          first.response,
        ).toEqual(
          second.response,
        );
      },
    );

    it(
      "builds each iteration from the previous context",
      () => {
        const result =
          buildSimulation(
            examples[1],
          );

        expect(
          result.iterations[0]
            .contextBefore,
        ).toBe(
          examples[1]
            .prompt,
        );

        expect(
          result.iterations[0]
            .contextAfter,
        ).toBe(
          examples[1].prompt +
            result
              .iterations[0]
              .selectedToken,
        );

        expect(
          result.iterations[1]
            .contextBefore,
        ).toBe(
          result
            .iterations[0]
            .contextAfter,
        );
      },
    );

    it(
      "creates five generated tokens",
      () => {
        const result =
          buildSimulation(
            examples[0],
          );

        expect(
          result.example
            .completionTokens,
        ).toHaveLength(5);

        expect(
          result.iterations
            .map(
              (iteration) =>
                iteration.selectedToken,
            ),
        ).toEqual(
          result.example
            .completionTokens,
        );
      },
    );

    it(
      "keeps token IDs as real tokenizer IDs",
      () => {
        const result =
          buildSimulation(
            examples[1],
          );

        for (const token of result.tokens) {
          expect(
            Number.isInteger(
              token.id,
            ),
          ).toBe(true);

          expect(
            token.id,
          ).toBeGreaterThanOrEqual(
            0,
          );
        }
      },
    );
  },
);