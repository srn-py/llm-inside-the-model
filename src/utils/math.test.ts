// src/utils/math.test.ts
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  softmax,
} from "./math";

describe(
  "softmax",
  () => {
    it(
      "returns probabilities summing to one",
      () => {
        const result =
          softmax([
            1,
            2,
            3,
          ]);

        expect(
          result.reduce(
            (
              sum,
              value,
            ) =>
              sum + value,
            0,
          ),
        ).toBeCloseTo(1);
      },
    );

    it(
      "assigns a larger probability to a larger logit",
      () => {
        const result =
          softmax([
            1,
            3,
          ]);

        expect(
          result[1],
        ).toBeGreaterThan(
          result[0],
        );
      },
    );

    it(
      "higher temperature flattens the distribution",
      () => {
        const low =
          softmax(
            [1, 3],
            0.5,
          );

        const high =
          softmax(
            [1, 3],
            2,
          );

        expect(
          high[1] -
            high[0],
        ).toBeLessThan(
          low[1] -
            low[0],
        );
      },
    );
  },
);
