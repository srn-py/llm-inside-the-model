// src/App.tsx
import {
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FlaskConical,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Sparkles,
} from "lucide-react";
import {
  examples,
} from "./data/examples";
import {
  useSimulation,
} from "./hooks/useSimulation";
import type {
  DemoExample,
} from "./types/simulation";
import type {
  StageId,
} from "./types/stage";

type ActiveSimulationState = NonNullable<
  ReturnType<typeof useSimulation>["state"]
>;

type ActiveGenerationIteration = NonNullable<
  ReturnType<typeof useSimulation>["currentIteration"]
>;

function App() {
  const simulation =
    useSimulation();

  const [selectedExample, setSelectedExample] =
    useState<DemoExample>(
      examples[0],
    );

  const [
    showDebug,
    setShowDebug,
  ] = useState(false);

  const stage =
    simulation.stage;

  const beginJourney =
    () => {
      simulation.startExample(
        selectedExample,
      );
    };

  if (!simulation.state) {
    return (
      <Landing
        selectedExample={
          selectedExample
        }
        onSelect={
          setSelectedExample
        }
        onStart={
          beginJourney
        }
      />
    );
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Header
        simulation={
          simulation
        }
        showDebug={
          showDebug
        }
        setShowDebug={
          setShowDebug
        }
      />

      <SimulationScreen
        simulation={
          simulation
        }
        showDebug={
          showDebug
        }
        stage={
          stage!
        }
      />
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* LANDING                                                                    */
/* -------------------------------------------------------------------------- */

function Landing({
  selectedExample,
  onSelect,
  onStart,
}: {
  selectedExample: DemoExample;
  onSelect: (
    example: DemoExample,
  ) => void;
  onStart: () => void;
}) {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-ink/15">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <Brand />

          <div className="simulation-badge">
            SIMULATION
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-14 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 flex justify-center items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-ink/55">
            <FlaskConical
              size={15}
            />

            Interactive science exhibit
          </div>

          <h1 className="text-5xl font-black leading-[0.92] tracking-[-0.05em] sm:text-7xl lg:text-[6.5rem]">
            How does a model complete a sentence?
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-ink/60">
            Choose an incomplete sentence and follow it through tokenization,
            vectors, attention, probabilities, and five rounds of next-token
            generation.
          </p>
        </div>

        <div className="mt-16">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="eyebrow">
                Step 01
              </div>

              <h2 className="mt-1 text-2xl font-black">
                Choose an incomplete sentence
              </h2>
            </div>

            <div className="font-mono text-xs opacity-40">
              5 examples
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {examples.map(
              (example) => (
                <ExampleCard
                  key={
                    example.id
                  }
                  example={
                    example
                  }
                  selected={
                    selectedExample.id ===
                    example.id
                  }
                  onClick={() =>
                    onSelect(
                      example,
                    )
                  }
                />
              ),
            )}
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-xl">
          <SelectedExamplePreview
            example={
              selectedExample
            }
          />

          <button
            className="primary-button mt-4 w-full"
            onClick={onStart}
          >
            <Play
              size={17}
              fill="currentColor"
            />

            Start journey
          </button>
        </div>

        <JourneyPreview />
      </section>
    </main>
  );
}

function ExampleCard({
  example,
  selected,
  onClick,
}: {
  example: DemoExample;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`example-card ${
        selected
          ? "example-card-selected"
          : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <span className="example-number">
          {example.id ===
          "cat"
            ? "01"
            : example.id ===
                "ibm"
              ? "02"
              : example.id ===
                  "learning"
                ? "03"
                : example.id ===
                    "football"
                  ? "04"
                  : "05"}
        </span>

        {selected && (
          <span className="selected-check">
            <Check
              size={13}
            />
          </span>
        )}
      </div>

      <div className="mt-10 text-left">
        <div className="eyebrow">
          {example.title}
        </div>

        <div className="mt-3 min-h-20 text-xl font-semibold leading-tight">
          {example.prompt}
        </div>
      </div>

      <div className="mt-7 text-left text-xs leading-5 text-ink/50">
        {example.description}
      </div>
    </button>
  );
}

function SelectedExamplePreview({
  example,
}: {
  example: DemoExample;
}) {
  return (
    <div className="paper-panel p-5">
      <div className="eyebrow">
        Selected input
      </div>

      <div className="mt-3 font-mono text-lg">
        {example.prompt}

        <span className="cursor-block" />
      </div>

      <div className="mt-4 border-t border-ink/10 pt-4 font-mono text-xs text-ink/45">
        The model will generate 5 simulated next-token steps.
      </div>
    </div>
  );
}

function JourneyPreview() {
  const stages = [
    "TEXT",
    "TOKENS",
    "IDS",
    "VECTORS",
    "POSITION",
    "ATTENTION",
    "TRANSFORMER",
    "LOGITS",
    "PROBABILITIES",
    "SELECT",
    "5 × GENERATE",
    "RESPONSE",
  ];

  return (
    <div className="mt-20 border-y border-ink/15 py-8">
      <div className="eyebrow mb-5">
        The journey
      </div>

      <div className="flex flex-wrap gap-2">
        {stages.map(
          (stage, index) => (
            <div
              key={stage}
              className="journey-preview-item"
            >
              <span>
                {String(
                  index + 1,
                ).padStart(
                  2,
                  "0",
                )}
              </span>

              {stage}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* HEADER                                                                     */
/* -------------------------------------------------------------------------- */

function Header({
  simulation,
  showDebug,
  setShowDebug,
}: {
  simulation: ReturnType<
    typeof useSimulation
  >;
  showDebug: boolean;
  setShowDebug: (
    value: boolean,
  ) => void;
}) {
  return (
    <header className="border-b border-ink/15">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 lg:px-7">
        <Brand />

        <div className="flex items-center gap-2">
          <ModeButton
            active={
              simulation.state
                ?.mode ===
              "beginner"
            }
            onClick={() =>
              simulation.setMode(
                "beginner",
              )
            }
          >
            Beginner
          </ModeButton>

          <ModeButton
            active={
              simulation.state
                ?.mode ===
              "technical"
            }
            onClick={() =>
              simulation.setMode(
                "technical",
              )
            }
          >
            Technical
          </ModeButton>

          <button
            className="icon-button ml-2"
            aria-label="Toggle developer panel"
            onClick={() =>
              setShowDebug(
                !showDebug,
              )
            }
          >
            <Settings2
              size={17}
            />
          </button>
        </div>
      </div>
    </header>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="logo-mark"
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </div>

      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-55">
          Interactive Science Exhibit
        </div>

        <div className="text-lg font-bold tracking-tight">
          Inside the Model
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SIMULATION                                                                 */
/* -------------------------------------------------------------------------- */

function SimulationScreen({
  simulation,
  showDebug,
  stage,
}: {
  simulation: ReturnType<
    typeof useSimulation
  >;

  showDebug: boolean;

  stage: NonNullable<
    ReturnType<
      typeof useSimulation
    >["stage"]
  >;
}) {
  const currentComponent =
    useMemo(
      () => (
        <StageVisualization
          stageId={
            stage.id
          }

          state={
            simulation.state!
          }

          currentIteration={
            simulation.currentIteration!
          }

          currentProbabilities={
            simulation.currentProbabilities
          }

          onSelectToken={
            simulation.selectToken
          }

          onSelectAttention={
            simulation.selectAttention
          }

          onTemperatureChange={
            simulation.setTemperature
          }

          onGenerateNext={
            simulation.generateNext
          }

          onPlayAll={
            simulation.playAll
          }

          onPauseGeneration={
            simulation.pauseGeneration
          }

          onViewIteration={
            simulation.viewIteration
          }
        />
      ),
      [
        stage.id,
        simulation.state,
        simulation.currentIteration,
        simulation.currentProbabilities,
        simulation.selectToken,
        simulation.selectAttention,
        simulation.setTemperature,
        simulation.generateNext,
        simulation.playAll,
        simulation.pauseGeneration,
        simulation.viewIteration,
      ],
    );

  return (
    <section className="mx-auto max-w-[1500px] px-4 py-5 lg:px-7">
      <StageNavigator
        simulation={
          simulation
        }
      />

      <div className="grid min-h-[calc(100vh-190px)] gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="paper-panel relative flex min-h-[620px] flex-col overflow-hidden">
          <div
            className="absolute left-0 top-0 h-1 bg-accent transition-all duration-500"
            style={{
              width: `${
                ((simulation.state!
                  .currentStage +
                  1) /
                  simulation.stages.length) *
                100
              }%`,
            }}
          />

          <div className="flex items-start justify-between border-b border-ink/10 p-5 lg:p-7">
            <div>
              <div className="eyebrow">
                {String(
                  stage.number,
                ).padStart(
                  2,
                  "0",
                )}{" "}
                /{" "}
                {
                  simulation
                    .stages
                    .length
                }
              </div>

              <h2 className="mt-1 text-2xl font-black tracking-tight lg:text-3xl">
                {stage.title}
              </h2>
            </div>

            <span className="simulation-badge">
              {simulation.state!
                .example.title}
            </span>
          </div>

          <div className="flex flex-1 items-center justify-center p-5 lg:p-10">
            <AnimatePresence
              mode="wait"
            >
              <motion.div
                key={stage.id}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="w-full"
              >
                {
                  currentComponent
                }
              </motion.div>
            </AnimatePresence>
          </div>

          <SimulationControls
            simulation={
              simulation
            }
          />
        </section>

        <aside className="flex flex-col gap-5">
          <ExplanationPanel
            simulation={
              simulation
            }
            stage={stage}
          />

          {showDebug && (
            <DebugPanel
              simulation={
                simulation
              }
            />
          )}
        </aside>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* NAVIGATION                                                                 */
/* -------------------------------------------------------------------------- */

function StageNavigator({
  simulation,
}: {
  simulation: ReturnType<
    typeof useSimulation
  >;
}) {
  const state =
    simulation.state!;

  return (
    <div className="mb-5 overflow-x-auto border-y border-ink/10 py-3">
      <div className="flex min-w-max items-center gap-1">
        {simulation.stages.map(
          (stage, index) => {
            const unlocked =
              state.exploredStages.includes(
                index,
              );

            const active =
              state.currentStage ===
              index;

            return (
              <button
                key={stage.id}
                disabled={!unlocked}
                onClick={() =>
                  simulation.jumpTo(
                    index,
                  )
                }
                className={`journey-node ${
                  active
                    ? "journey-node-active"
                    : ""
                } ${
                  !unlocked
                    ? "journey-node-locked"
                    : ""
                }`}
              >
                <span>
                  {String(
                    index + 1,
                  ).padStart(
                    2,
                    "0",
                  )}
                </span>

                {
                  stage.shortTitle
                }
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}

function SimulationControls({
  simulation,
}: {
  simulation: ReturnType<
    typeof useSimulation
  >;
}) {
  const state =
    simulation.state!;

  const generationIndex =
    simulation.stages.findIndex(
      (stage) =>
        stage.id ===
        "generation",
    );

  const onGenerationStage =
    state.currentStage ===
    generationIndex;

  const generationComplete =
    state.completedIterations >=
    state.iterations.length;

  const canNext =
    !onGenerationStage ||
    generationComplete;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 p-4 lg:p-5">
      <div className="flex gap-2">
        <button
          className="secondary-button"
          onClick={
            simulation.back
          }
          disabled={
            state.currentStage ===
            0
          }
        >
          <ArrowLeft
            size={16}
          />

          Back
        </button>

        <button
          className="secondary-button"
          onClick={() =>
            simulation.reset()
          }
        >
          <RotateCcw
            size={16}
          />

          Restart
        </button>

        <button
          className="secondary-button"
          onClick={
            simulation.next
          }
          disabled={
            !canNext ||
            state.currentStage ===
              simulation.stages
                .length -
                1
          }
        >
          Next

          <ArrowRight
            size={16}
          />
        </button>
      </div>

      {onGenerationStage && (
        <div className="flex items-center gap-3">
          <span className="eyebrow">
            Generation
          </span>

          <span className="generation-counter">
            {
              state.completedIterations
            }{" "}
            / 5
          </span>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* EXPLANATION                                                                */
/* -------------------------------------------------------------------------- */

function ExplanationPanel({
  simulation,
  stage,
}: {
  simulation: ReturnType<
    typeof useSimulation
  >;

  stage: ReturnType<
    typeof useSimulation
  >["stages"][number];
}) {
  const state =
    simulation.state!;

  const text =
    state.mode ===
    "beginner"
      ? stage.beginner
      : stage.technical;

  return (
    <div className="paper-panel p-5 lg:p-6">
      <div className="eyebrow">
        Explanation
      </div>

      <p className="mt-4 text-[15px] leading-7 text-ink/75">
        {text}
      </p>

      {stage.callout && (
        <div className="mt-6 border-l-2 border-accent bg-white/40 p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            Important
          </div>

          <div className="mt-2 text-sm font-semibold">
            {stage.callout}
          </div>
        </div>
      )}

      {stage.id ===
        "tokenization" && (
        <div className="mt-6 border-t border-ink/10 pt-4">
          <div className="eyebrow">
            Encoding
          </div>

          <div className="mt-2 font-mono text-sm">
            o200k_base
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* DEBUG                                                                      */
/* -------------------------------------------------------------------------- */

function DebugPanel({
  simulation,
}: {
  simulation: ReturnType<
    typeof useSimulation
  >;
}) {
  const state =
    simulation.state!;

  return (
    <div className="paper-panel overflow-hidden">
      <div className="border-b border-ink/10 p-4">
        <div className="eyebrow">
          Developer panel
        </div>
      </div>

      <pre className="max-h-[550px] overflow-auto p-4 font-mono text-[10px] leading-5">
        {JSON.stringify(
          {
            example:
              state.example,

            stage:
              state.currentStage,

            mode:
              state.mode,

            temperature:
              state.temperature,

            completedIterations:
              state.completedIterations,

            viewedIteration:
              state.viewedIteration,

            generatedTokens:
              state.generatedTokens,

            iterations:
              state.iterations,
          },
          null,
          2,
        )}
      </pre>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* STAGE VISUALIZATION                                                        */
/* -------------------------------------------------------------------------- */

function StageVisualization({
  stageId,
  state,
  currentIteration,
  currentProbabilities,
  onSelectToken,
  onSelectAttention,
  onTemperatureChange,
  onGenerateNext,
  onPlayAll,
  onPauseGeneration,
  onViewIteration,
}: {
  stageId: StageId;

  state: ActiveSimulationState;

  currentIteration:
    ActiveGenerationIteration;

  currentProbabilities:
    number[];

  onSelectToken: (
    index: number | null,
  ) => void;

  onSelectAttention: (
    from: number,
    to: number,
  ) => void;

  onTemperatureChange: (
    value: number,
  ) => void;

  onGenerateNext: () => void;

  onPlayAll: () => void;

  onPauseGeneration: () => void;

  onViewIteration: (
    iteration: number,
  ) => void;
}) {
  switch (stageId) {
    case "prompt":
      return (
        <PromptStage
          state={state}
        />
      );

    case "tokenization":
      return (
        <TokenStage
          state={state}
          onSelectToken={
            onSelectToken
          }
        />
      );

    case "token-ids":
      return (
        <IdsStage
          state={state}
        />
      );

    case "embeddings":
      return (
        <EmbeddingStage
          state={state}
        />
      );

    case "position":
      return (
        <PositionStage
          state={state}
        />
      );

    case "transformer":
      return (
        <TransformerStage />
      );

    case "attention":
      return (
        <AttentionStage
          state={state}
          onSelectAttention={
            onSelectAttention
          }
        />
      );

    case "logits":
      return (
        <LogitsStage
          iteration={
            currentIteration
          }
        />
      );

    case "probabilities":
      return (
        <ProbabilityStage
          iteration={
            currentIteration
          }
          probabilities={
            currentProbabilities
          }
        />
      );

    case "sampling":
      return (
        <SamplingStage
          state={state}
          iteration={
            currentIteration
          }
          probabilities={
            currentProbabilities
          }
          onTemperatureChange={
            onTemperatureChange
          }
        />
      );

    case "generation":
      return (
        <GenerationStage
          state={state}
          onGenerateNext={
            onGenerateNext
          }
          onPlayAll={
            onPlayAll
          }
          onPauseGeneration={
            onPauseGeneration
          }
          onViewIteration={
            onViewIteration
          }
        />
      );

    case "decoding":
      return (
        <DecodeStage
          state={state}
        />
      );

    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/* STAGE 1                                                                    */
/* -------------------------------------------------------------------------- */

function PromptStage({
  state,
}: {
  state: NonNullable<
    ReturnType<
      typeof useSimulation
    >["state"]
  >;
}) {
  return (
    <div className="stage-center">
      <div className="raw-paper">
        <div className="eyebrow mb-5">
          Incomplete input
        </div>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="text-3xl font-semibold leading-tight tracking-tight lg:text-5xl"
        >
          {state.prompt}

          <span className="cursor-block" />
        </motion.p>

        <div className="mt-8 border-t border-ink/10 pt-5 font-mono text-xs text-ink/50">
          The model will generate the continuation one token at a time.
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* STAGE 2                                                                    */
/* -------------------------------------------------------------------------- */

function TokenStage({
  state,
  onSelectToken,
}: {
  state: NonNullable<
    ReturnType<
      typeof useSimulation
    >["state"]
  >;

  onSelectToken: (
    index: number | null,
  ) => void;
}) {
  return (
    <div>
      <div className="mb-8 text-center">
        <div className="eyebrow">
          Real BPE tokenization
        </div>

        <div className="mt-2 text-sm text-ink/45">
          Spaces can belong to the following token, and words can be split into pieces.
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {state.tokens.map(
          (token) => (
            <motion.button
              key={
                token.index
              }
              layout
              onClick={() =>
                onSelectToken(
                  token.index,
                )
              }
              className={`token-chip ${
                state.selectedToken ===
                token.index
                  ? "token-selected"
                  : ""
              }`}
              whileHover={{
                y: -3,
              }}
            >
              {
                formatTokenForDisplay(
                  token.text,
                )
              }
            </motion.button>
          ),
        )}
      </div>

      {state.selectedToken !==
        null && (
        <TokenInspector
          state={
            state
          }
          index={
            state.selectedToken
          }
        />
      )}
    </div>
  );
}

function formatTokenForDisplay(
  text: string,
) {
  if (!text) {
    return "∅";
  }

  return text.replaceAll(
    " ",
    "␠",
  );
}

function TokenInspector({
  state,
  index,
}: {
  state: NonNullable<
    ReturnType<
      typeof useSimulation
    >["state"]
  >;

  index: number;
}) {
  const token =
    state.tokens[index];

  if (!token) {
    return null;
  }

  return (
    <div className="mx-auto mt-10 max-w-md border border-ink bg-white/40 p-5">
      <div className="eyebrow">
        Token inspector
      </div>

      <div className="mt-4 font-mono text-2xl font-bold">
        {JSON.stringify(
          token.text,
        )}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-y-2 font-mono text-xs">
        <dt className="opacity-50">
          Position
        </dt>

        <dd>
          {token.index}
        </dd>

        <dt className="opacity-50">
          Token ID
        </dt>

        <dd>
          {token.id}
        </dd>

        <dt className="opacity-50">
          Characters
        </dt>

        <dd>
          {token.length}
        </dd>

        <dt className="opacity-50">
          Representation
        </dt>

        <dd>
          BPE token
        </dd>
      </dl>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* STAGE 3                                                                    */
/* -------------------------------------------------------------------------- */

function IdsStage({
  state,
}: {
  state: NonNullable<
    ReturnType<
      typeof useSimulation
    >["state"]
  >;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {state.tokens.map(
        (token) => (
          <motion.div
            key={
              token.index
            }
            initial={{
              scale: 0.7,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              delay:
                token.index *
                0.04,
            }}
            className="id-card"
          >
            <span className="font-mono text-[10px] opacity-45">
              {formatTokenForDisplay(
                token.text,
              )}
            </span>

            <strong>
              {token.id}
            </strong>
          </motion.div>
        ),
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* STAGE 4                                                                    */
/* -------------------------------------------------------------------------- */

function EmbeddingStage({
  state,
}: {
  state: NonNullable<
    ReturnType<
      typeof useSimulation
    >["state"]
  >;
}) {
  const selected =
    state.selectedToken ??
    Math.min(
      1,
      Math.max(
        0,
        state.embeddings
          .length - 1,
      ),
    );

  const embedding =
    state.embeddings[
      selected
    ];

  return (
    <div>
      <div className="mb-6 flex justify-center gap-2">
        {state.tokens
          .slice(
            0,
            Math.min(
              8,
              state.tokens
                .length,
            ),
          )
          .map((token) => (
            <span
              key={
                token.index
              }
              className="mini-token"
            >
              {formatTokenForDisplay(
                token.text,
              )}
            </span>
          ))}
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="mb-4 text-center font-mono text-xs uppercase tracking-widest opacity-50">
          Simplified vector visualization
        </div>

        <div className="vector-grid">
          {embedding?.values.map(
            (
              value,
              index,
            ) => (
              <motion.div
                key={index}
                initial={{
                  height: 0,
                }}
                animate={{
                  height: `${
                    Math.abs(
                      value,
                    ) *
                      80 +
                    15
                  }px`,
                }}
                transition={{
                  delay:
                    index *
                    0.04,
                }}
                className="vector-column"
              >
                <span>
                  {value}
                </span>
              </motion.div>
            ),
          )}
        </div>

        <div className="mt-5 text-center font-mono text-xs opacity-50">
          The real model has many more dimensions than this visualization.
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* STAGE 5                                                                    */
/* -------------------------------------------------------------------------- */

function PositionStage({
  state,
}: {
  state: NonNullable<
    ReturnType<
      typeof useSimulation
    >["state"]
  >;
}) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max justify-center gap-3">
        {state.tokens.map(
          (token) => (
            <div
              key={
                token.index
              }
              className="position-card"
            >
              <div className="position-number">
                {token.index}
              </div>

              <div className="font-mono text-sm">
                {formatTokenForDisplay(
                  token.text,
                )}
              </div>
            </div>
          ),
        )}
      </div>

      <div className="mx-auto mt-10 max-w-2xl text-center text-sm text-ink/60">
        Positional mechanisms let transformer architectures distinguish where each token occurs in the sequence.
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* STAGE 6                                                                    */
/* -------------------------------------------------------------------------- */

function TransformerStage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-5 text-center font-mono text-xs uppercase tracking-widest opacity-50">
        Representation flow
      </div>

      <div className="space-y-2">
        {[
          1,
          2,
          3,
          4,
          5,
        ].map(
          (layer) => (
            <motion.div
              key={
                layer
              }
              initial={{
                x: -30,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              transition={{
                delay:
                  layer *
                  0.12,
              }}
              className="transformer-layer"
            >
              <span>
                Transformer Layer{" "}
                {layer}
              </span>

              <div className="layer-dots">
                {Array.from(
                  {
                    length: 9,
                  },
                ).map(
                  (
                    _,
                    index,
                  ) => (
                    <span
                      key={
                        index
                      }
                    />
                  ),
                )}
              </div>
            </motion.div>
          ),
        )}

        <div className="py-2 text-center font-mono text-xs opacity-40">
          ⋮
        </div>

        <div className="transformer-layer border-accent">
          <span>
            Layer N
          </span>

          <span className="font-mono text-xs text-accent">
            contextual representation
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* STAGE 7                                                                    */
/* -------------------------------------------------------------------------- */

function AttentionStage({
  state,
  onSelectAttention,
}: {
  state: NonNullable<
    ReturnType<
      typeof useSimulation
    >["state"]
  >;

  onSelectAttention: (
    from: number,
    to: number,
  ) => void;
}) {
  const tokens =
    state.tokens.slice(
      0,
      10,
    );

  return (
    <div className="w-full">
      <div className="mb-5 text-center font-mono text-xs uppercase tracking-widest opacity-50">
        Illustrative attention matrix
      </div>

      <div className="mx-auto max-w-3xl overflow-auto">
        <div
          className="attention-grid"
          style={{
            gridTemplateColumns: `80px repeat(${tokens.length}, minmax(34px, 1fr))`,
          }}
        >
          <div />

          {tokens.map(
            (token) => (
              <div
                key={`head-${token.index}`}
                className="attention-label"
              >
                {
                  formatTokenForDisplay(
                    token.text,
                  )
                }
              </div>
            ),
          )}

          {tokens.map(
            (from) => (
              <div
                key={`row-${from.index}`}
                className="contents"
              >
                <div className="attention-label text-right">
                  {
                    formatTokenForDisplay(
                      from.text,
                    )
                  }
                </div>

                {tokens.map(
                  (to) => {
                    const cell =
                      state.attention[
                        from.index
                      ]?.[
                        to.index
                      ];

                    const weight =
                      cell?.weight ??
                      0;

                    const selected =
                      state.selectedAttention
                        ?.from ===
                        from.index &&
                      state.selectedAttention
                        ?.to ===
                        to.index;

                    return (
                      <button
                        key={`${from.index}-${to.index}`}
                        className={`attention-cell ${
                          selected
                            ? "attention-selected"
                            : ""
                        }`}
                        style={{
                          opacity:
                            0.18 +
                            weight *
                              1.4,
                        }}
                        onClick={() =>
                          onSelectAttention(
                            from.index,
                            to.index,
                          )
                        }
                      >
                        {weight.toFixed(
                          2,
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            ),
          )}
        </div>
      </div>

      {state.selectedAttention && (
        <div className="mx-auto mt-5 max-w-md border border-ink/15 bg-white/40 p-4 text-center font-mono text-xs">
          <strong>
            {
              formatTokenForDisplay(
                state.tokens[
                  state
                    .selectedAttention
                    .from
                ]?.text ??
                  "",
              )
            }
          </strong>{" "}
          is attending to{" "}
          <strong>
            {
              formatTokenForDisplay(
                state.tokens[
                  state
                    .selectedAttention
                    .to
                ]?.text ??
                  "",
              )
            }
          </strong>

          <div className="mt-2 opacity-50">
            Illustrative attention weight.
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* STAGES 8-10                                                               */
/* -------------------------------------------------------------------------- */

function LogitsStage({
  iteration,
}: {
  iteration: NonNullable<
    ReturnType<
      typeof useSimulation
    >["currentIteration"]
  >;
}) {
  return (
    <CandidateStage
      title="Candidate next tokens"
      iteration={
        iteration
      }
    />
  );
}

function ProbabilityStage({
  iteration,
  probabilities,
}: {
  iteration: NonNullable<
    ReturnType<
      typeof useSimulation
    >["currentIteration"]
  >;

  probabilities: number[];
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-7 text-center font-mono text-xs uppercase tracking-widest opacity-50">
        Softmax → probabilities
      </div>

      <div className="space-y-3">
        {iteration.candidates.map(
          (candidate, index) => (
            <div
              key={
                candidate.token
              }
              className="prob-row"
            >
              <span className="w-32 font-mono text-sm">
                {formatTokenForDisplay(
                  candidate.token,
                )}
              </span>

              <div className="prob-track">
                <motion.div
                  animate={{
                    width: `${
                      probabilities[
                        index
                      ] * 100
                    }%`,
                  }}
                  className="prob-fill accent-fill"
                />
              </div>

              <span className="w-16 text-right font-mono text-xs">
                {(
                  probabilities[
                    index
                  ] * 100
                ).toFixed(1)}
                %
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function CandidateStage({
  title,
  iteration,
}: {
  title: string;

  iteration: NonNullable<
    ReturnType<
      typeof useSimulation
    >["currentIteration"]
  >;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-7 text-center font-mono text-xs uppercase tracking-widest opacity-50">
        {title}
      </div>

      <div className="space-y-3">
        {iteration.candidates.map(
          (candidate) => (
            <div
              key={
                candidate.token
              }
              className="prob-row"
            >
              <span className="w-32 font-mono text-sm">
                {formatTokenForDisplay(
                  candidate.token,
                )}
              </span>

              <div className="prob-track">
                <div
                  className="prob-fill"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        8,
                        candidate.logit *
                          16,
                      ),
                    )}%`,
                  }}
                />
              </div>

              <span className="w-16 text-right font-mono text-xs">
                {candidate.logit.toFixed(
                  2,
                )}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function SamplingStage({
  state,
  iteration,
  probabilities,
  onTemperatureChange,
}: {
  state: NonNullable<
    ReturnType<
      typeof useSimulation
    >["state"]
  >;

  iteration: NonNullable<
    ReturnType<
      typeof useSimulation
    >["currentIteration"]
  >;

  probabilities: number[];

  onTemperatureChange: (
    value: number,
  ) => void;
}) {
  const highestIndex =
    probabilities.indexOf(
      Math.max(
        ...probabilities,
      ),
    );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <div className="eyebrow">
          Temperature
        </div>

        <div className="mt-2 font-mono text-3xl font-bold">
          {state.temperature.toFixed(
            1,
          )}
        </div>
      </div>

      <input
        type="range"
        min="0.1"
        max="2"
        step="0.1"
        value={
          state.temperature
        }
        onChange={(event) =>
          onTemperatureChange(
            Number(
              event.target.value,
            ),
          )
        }
        className="temperature-slider w-full"
      />

      <div className="mt-8 space-y-3">
        {iteration.candidates.map(
          (candidate, index) => (
            <div
              key={
                candidate.token
              }
              className="prob-row"
            >
              <span className="w-32 font-mono text-sm">
                {formatTokenForDisplay(
                  candidate.token,
                )}
              </span>

              <div className="prob-track">
                <motion.div
                  animate={{
                    width: `${
                      probabilities[
                        index
                      ] * 100
                    }%`,
                  }}
                  className="prob-fill accent-fill"
                />
              </div>

              <span className="w-16 text-right font-mono text-xs">
                {(
                  probabilities[
                    index
                  ] * 100
                ).toFixed(1)}
                %
              </span>
            </div>
          ),
        )}
      </div>

      <div className="mt-8 border border-ink/15 bg-white/30 p-4 text-center font-mono text-xs">
        Simulated selection:
        {" "}
        <strong>
          {
            formatTokenForDisplay(
              iteration
                .candidates[
                highestIndex
              ]
                ?.token ??
                iteration.selectedToken,
            )
          }
        </strong>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* STAGE 11 — GENERATION LOOP                                                */
/* -------------------------------------------------------------------------- */

function GenerationStage({
  state,
  onGenerateNext,
  onPlayAll,
  onPauseGeneration,
  onViewIteration,
}: {
  state: NonNullable<
    ReturnType<
      typeof useSimulation
    >["state"]
  >;

  onGenerateNext: () => void;

  onPlayAll: () => void;

  onPauseGeneration: () => void;

  onViewIteration: (
    iteration: number,
  ) => void;
}) {
  const viewed =
    state.iterations[
      Math.max(
        state.viewedIteration -
          1,
        0,
      )
    ];

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="generation-progress">
        {state.iterations.map(
          (
            iteration,
            index,
          ) => {
            const completed =
              index <
              state.completedIterations;

            const active =
              state.viewedIteration ===
              iteration.number;

            return (
              <button
                key={
                  iteration.number
                }
                disabled={!completed}
                onClick={() =>
                  onViewIteration(
                    iteration.number,
                  )
                }
                className={`iteration-node ${
                  completed
                    ? "iteration-complete"
                    : ""
                } ${
                  active
                    ? "iteration-active"
                    : ""
                }`}
              >
                <span>
                  {iteration.number}
                </span>

                <small>
                  {completed
                    ? "done"
                    : "next"}
                </small>
              </button>
            );
          },
        )}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="eyebrow">
            Iteration{" "}
            {
              viewed?.number ??
              1
            }{" "}
            / 5
          </div>

          <div className="mt-3 generation-context">
            {viewed
              ? viewed.contextBefore
              : state.prompt}

            <span className="generation-cursor" />
          </div>

          {viewed && (
            <>
              <div className="my-7 flex items-center justify-center text-3xl opacity-25">
                ↓
              </div>

              <div className="generated-token-reveal">
                <div className="eyebrow">
                  Selected next token
                </div>

                <div className="mt-3 text-3xl font-bold">
                  {formatTokenForDisplay(
                    viewed.selectedToken,
                  )}
                </div>
              </div>

              <div className="my-7 flex items-center justify-center text-3xl opacity-25">
                ↓
              </div>

              <div className="generation-context generation-context-after">
                {viewed.contextAfter}
              </div>
            </>
          )}

          {!viewed && (
            <div className="generation-empty">
              Click "Generate next token" to perform the first simulated generation step.
            </div>
          )}
        </div>

        <div className="generation-side-panel">
          <div className="eyebrow">
            Controls
          </div>

          <button
            className="primary-button mt-4 w-full"
            onClick={
              onGenerateNext
            }
            disabled={
              state.completedIterations >=
              5
            }
          >
            <Sparkles
              size={16}
            />

            Generate next token
          </button>

          {!state.generationPlaying ? (
            <button
              className="secondary-button mt-2 w-full"
              onClick={
                onPlayAll
              }
              disabled={
                state.completedIterations >=
                5
              }
            >
              <Play
                size={15}
              />

              Play all 5
            </button>
          ) : (
            <button
              className="secondary-button mt-2 w-full"
              onClick={
                onPauseGeneration
              }
            >
              <Pause
                size={15}
              />

              Pause
            </button>
          )}

          <div className="mt-7 border-t border-ink/10 pt-5">
            <div className="eyebrow">
              Progress
            </div>

            <div className="mt-2 font-mono text-3xl font-bold">
              {
                state.completedIterations
              }
              /5
            </div>
          </div>

          <div className="mt-5 text-xs leading-5 text-ink/50">
            Each iteration simulates one next-token generation step. The newly selected token becomes part of the next context.
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* STAGE 12                                                                  */
/* -------------------------------------------------------------------------- */

function DecodeStage({
  state,
}: {
  state: NonNullable<
    ReturnType<
      typeof useSimulation
    >["state"]
  >;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="eyebrow text-center">
        Five generation steps complete
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {state.generatedTokens.map(
          (
            token,
            index,
          ) => (
            <motion.span
              key={`${token}-${index}`}
              initial={{
                y: 12,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              className="token-chip"
            >
              {formatTokenForDisplay(
                token,
              )}
            </motion.span>
          ),
        )}
      </div>

      <div className="my-8 text-center text-3xl opacity-30">
        ↓
      </div>

      <div className="result-card">
        <div className="eyebrow">
          Final response
        </div>

        <div className="mt-4 font-mono text-xs opacity-45">
          {state.prompt}
        </div>

        <p className="mt-5 text-2xl font-semibold leading-tight lg:text-4xl">
          {state.response}
        </p>
      </div>

      <div className="mt-7 text-center font-mono text-xs uppercase tracking-[0.2em] opacity-50">
        You just watched the response being built one step at a time.
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MODE                                                                        */
/* -------------------------------------------------------------------------- */

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`mode-button ${
        active
          ? "mode-active"
          : ""
      }`}
    >
      {children}
    </button>
  );
}

export default App;