// src/utils/math.ts
export function softmax(
  values: number[],
  temperature = 1,
): number[] {
  const safeTemperature = Math.max(
    temperature,
    0.01,
  );

  const scaled = values.map(
    (value) => value / safeTemperature,
  );

  const max = Math.max(...scaled);

  const exponentials = scaled.map(
    (value) =>
      Math.exp(value - max),
  );

  const total = exponentials.reduce(
    (sum, value) => sum + value,
    0,
  );

  return exponentials.map(
    (value) => value / total,
  );
}

export function seededValue(
  seed: number,
): number {
  const x =
    Math.sin(seed * 12.9898) *
    43758.5453;

  return (
    (x - Math.floor(x)) * 2 - 1
  );
}

export function makeEmbedding(
  tokenIndex: number,
  dimensions = 12,
): number[] {
  return Array.from(
    { length: dimensions },
    (_, dimension) =>
      Number(
        seededValue(
          (tokenIndex + 1) * 31 +
            dimension * 7,
        ).toFixed(2),
      ),
  );
}

export function normalizeWeights(
  values: number[],
): number[] {
  const total = values.reduce(
    (sum, value) => sum + value,
    0,
  );

  if (total === 0) {
    return values.map(() => 0);
  }

  return values.map(
    (value) => value / total,
  );
}
