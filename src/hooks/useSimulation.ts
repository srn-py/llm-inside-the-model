// src/hooks/useSimulation.ts

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  stages,
} from "../data/stages";

import type {
  DemoExample,
  ExplanationMode,
  SimulationState,
} from "../types/simulation";

import {
  buildSimulation,
} from "../utils/simulation";

import {
  softmax,
} from "../utils/math";

const DEFAULT_SPEED = 1;

export function useSimulation() {
  const [state, setState] =
    useState<SimulationState | null>(
      null,
    );

  const startExample =
    useCallback(
      (example: DemoExample) => {
        const data =
          buildSimulation(
            example,
          );

        setState({
          ...data,

          currentStage: 0,

          status: "paused",

          speed:
            DEFAULT_SPEED,

          mode: "beginner",

          temperature: 1,

          selectedToken:
            null,

          selectedAttention:
            null,

          exploredStages: [0],

          completedIterations: 0,

          viewedIteration: 1,

          generationPlaying:
            false,
        });
      },
      [],
    );

  const reset =
    useCallback(
      () => {
        setState(
          (previous) => {
            if (!previous) {
              return previous;
            }

            const data =
              buildSimulation(
                previous.example,
              );

            return {
              ...data,

              currentStage: 0,

              status: "paused",

              speed:
                DEFAULT_SPEED,

              mode:
                previous.mode,

              temperature: 1,

              selectedToken:
                null,

              selectedAttention:
                null,

              exploredStages: [
                0,
              ],

              completedIterations: 0,

              viewedIteration: 1,

              generationPlaying:
                false,
            };
          },
        );
      },
      [],
    );

  const next =
    useCallback(
      () => {
        setState(
          (previous) => {
            if (!previous) {
              return previous;
            }

            const current =
              previous.currentStage;

            const generationStageIndex =
              stages.findIndex(
                (stage) =>
                  stage.id ===
                  "generation",
              );

            if (
              current ===
              generationStageIndex &&
              previous.completedIterations <
                5
            ) {
              return previous;
            }

            const nextStage =
              Math.min(
                current + 1,
                stages.length - 1,
              );

            return {
              ...previous,

              currentStage:
                nextStage,

              exploredStages:
                Array.from(
                  new Set([
                    ...previous.exploredStages,
                    nextStage,
                  ]),
                ),
            };
          },
        );
      },
      [],
    );

  const back =
    useCallback(
      () => {
        setState(
          (previous) => {
            if (!previous) {
              return previous;
            }

            return {
              ...previous,

              currentStage:
                Math.max(
                  0,
                  previous.currentStage -
                    1,
                ),
            };
          },
        );
      },
      [],
    );

  const jumpTo =
    useCallback(
      (stageIndex: number) => {
        setState(
          (previous) => {
            if (!previous) {
              return previous;
            }

            if (
              !previous.exploredStages.includes(
                stageIndex,
              )
            ) {
              return previous;
            }

            return {
              ...previous,

              currentStage:
                stageIndex,
            };
          },
        );
      },
      [],
    );

  const setMode =
    useCallback(
      (
        mode: ExplanationMode,
      ) => {
        setState(
          (previous) =>
            previous
              ? {
                  ...previous,
                  mode,
                }
              : previous,
        );
      },
      [],
    );

  const setSpeed =
    useCallback(
      (speed: number) => {
        setState(
          (previous) =>
            previous
              ? {
                  ...previous,
                  speed,
                }
              : previous,
        );
      },
      [],
    );

  const setTemperature =
    useCallback(
      (temperature: number) => {
        setState(
          (previous) =>
            previous
              ? {
                  ...previous,
                  temperature,
                }
              : previous,
        );
      },
      [],
    );

  const selectToken =
    useCallback(
      (index: number | null) => {
        setState(
          (previous) =>
            previous
              ? {
                  ...previous,
                  selectedToken:
                    index,
                }
              : previous,
        );
      },
      [],
    );

  const selectAttention =
    useCallback(
      (
        from: number,
        to: number,
      ) => {
        setState(
          (previous) =>
            previous
              ? {
                  ...previous,

                  selectedAttention: {
                    from,
                    to,
                  },
                }
              : previous,
        );
      },
      [],
    );

  const generateNext =
    useCallback(
      () => {
        setState(
          (previous) => {
            if (!previous) {
              return previous;
            }

            if (
              previous.completedIterations >=
              previous.iterations.length
            ) {
              return {
                ...previous,
                generationPlaying:
                  false,
              };
            }

            const nextIteration =
              previous.completedIterations +
              1;

            const token =
              previous.iterations[
                nextIteration - 1
              ]
                ?.selectedToken;

            if (!token) {
              return previous;
            }

            return {
              ...previous,

              completedIterations:
                nextIteration,

              viewedIteration:
                nextIteration,

              generatedTokens:
                previous.generatedTokens.concat(
                  token,
                ),

              generationPlaying:
                false,
            };
          },
        );
      },
      [],
    );

  const playAll =
    useCallback(
      () => {
        setState(
          (previous) =>
            previous
              ? {
                  ...previous,
                  generationPlaying:
                    previous.completedIterations <
                    previous.iterations
                      .length,
                }
              : previous,
        );
      },
      [],
    );

  const pauseGeneration =
    useCallback(
      () => {
        setState(
          (previous) =>
            previous
              ? {
                  ...previous,
                  generationPlaying:
                    false,
                }
              : previous,
        );
      },
      [],
    );

  const viewIteration =
    useCallback(
      (iteration: number) => {
        setState(
          (previous) =>
            previous
              ? {
                  ...previous,

                  viewedIteration:
                    Math.min(
                      Math.max(
                        iteration,
                        1,
                      ),
                      Math.max(
                        previous.completedIterations,
                        1,
                      ),
                    ),
                }
              : previous,
        );
      },
      [],
    );

  useEffect(() => {
    if (
      !state?.generationPlaying
    ) {
      return;
    }

    if (
      state.completedIterations >=
      state.iterations.length
    ) {
      setState(
        (previous) =>
          previous
            ? {
                ...previous,
                generationPlaying:
                  false,
              }
            : previous,
      );

      return;
    }

    const timer =
      window.setTimeout(
        () => {
          setState(
            (previous) => {
              if (!previous) {
                return previous;
              }

              if (
                previous.completedIterations >=
                previous.iterations
                  .length
              ) {
                return {
                  ...previous,
                  generationPlaying:
                    false,
                };
              }

              const nextIteration =
                previous.completedIterations +
                1;

              const token =
                previous
                  .iterations[
                  nextIteration - 1
                ]?.selectedToken;

              if (!token) {
                return {
                  ...previous,
                  generationPlaying:
                    false,
                };
              }

              return {
                ...previous,

                completedIterations:
                  nextIteration,

                viewedIteration:
                  nextIteration,

                generatedTokens:
                  previous.generatedTokens.concat(
                    token,
                  ),

                generationPlaying:
                  nextIteration <
                  previous.iterations
                    .length,
              };
            },
          );
        },
        1500 /
          state.speed,
      );

    return () =>
      window.clearTimeout(
        timer,
      );
  }, [
    state?.generationPlaying,
    state?.completedIterations,
    state?.iterations,
    state?.speed,
  ]);

  const currentIteration =
    useMemo(() => {
      if (!state) {
        return null;
      }

      return (
        state.iterations[
          Math.max(
            state.viewedIteration -
              1,
            0,
          )
        ] ?? null
      );
    }, [
      state,
    ]);

  const currentProbabilities =
    useMemo(() => {
      if (!currentIteration) {
        return [];
      }

      return softmax(
        currentIteration.candidates.map(
          (item) =>
            item.logit,
        ),
        state?.temperature ??
          1,
      );
    }, [
      currentIteration,
      state?.temperature,
    ]);

  const stage =
    state
      ? stages[state.currentStage]
      : null;

  return {
    state,

    stages,

    stage,

    currentIteration,

    currentProbabilities,

    startExample,

    reset,

    next,

    back,

    jumpTo,

    setMode,

    setSpeed,

    setTemperature,

    selectToken,

    selectAttention,

    generateNext,

    playAll,

    pauseGeneration,

    viewIteration,
  };
}