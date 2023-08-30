/**
 * Data for executing a stage.
 * @template TParams type of `params` passed to this stage.
 * @template TResult type of `result` returned from this stage.
 */
interface StageData<
  TParams,
  TResult,
> {
  /**
   * Execute this stage.
   * @param params used to execute this stage.
   * @returns result of executing this stage.
   */
  doExecute: (
    params: TParams,
  ) => TResult;
}

/**
 * Data for executing a stage within a pipeline.
 * @template TPipelineParams params passed to {@link executePipeline}.
 * @template TPipelineStageResult result returned from {@link executePipeline}.
 * @template TParams type of `params` passed to this stage.
 * @template TResult type of `result` returned from this stage.
 */
interface PipelineStageData<
  TPipelineParams,
  TPipelineStageResult,
  TParams,
  TResult,
> extends StageData<TParams, TResult> {
  /**
   * Create `params` for this stage.
   * @param pipelineParams Type of `params` for the pipeline of this stage. ie, passed to {@link executePipeline}.
   * @param pipelineStageResults Return of {@link StageData.doExecute} of other stages in this pipeline.
   * @returns Params passed to all functions of this stage.
   */
  readonly createParams: (
    pipelineParams: TPipelineParams,
    pipelineStageResults: Record<number, TPipelineStageResult>,
  ) => TParams;

  /**
   * Should execute this stage?
   * @param params Return of {@link createParams}.
   * @param pipelineStageResults Return of {@link StageData.doExecute} of other stages in this pipeline.
   * @return Should invoke {@link doExecute}?
   */
  readonly shouldExecute?: (
    params: TParams,
    pipelineStageResults: Record<number, TPipelineStageResult>,
  ) => boolean;

  /**
   * Hook invoked before executing this stage.
   * Invoked before {@link shouldExecute}.
   * @param pipelineParams params passed to {@link executePipeline}.
   * @param params Return of {@link createParams}.
   * @param willExecute Will invoke {@link StageData.doExecute}? ie, return of {@link shouldExecute}.
   */
  readonly beforeExecute?: (
    pipelineParams: TPipelineParams,
    params: TParams,
    willExecute: boolean,
  ) => void;

  /**
   * Hook invoked after executing this stage.
   * Always invoked (even when {@link shouldExecute} returns `false`).
   * @param pipelineParams Params for the pipeline of this stage. ie, passed to {@link executePipeline}.
   * @param params Return of {@link createParams}.
   * @param result Result of executing this stage, return of {@link StageData.doExecute}. `undefined` when `shouldExecute` returns `false`.
   * @param didExecute Did invoke {@link StageData.doExecute}? ie, return of {@link shouldExecute}.
   */
  readonly afterExecute?: (
    pipelineParams: TPipelineParams,
    params: TParams,
    result: TResult | undefined,
    didExecute: boolean,
  ) => void;
}

/**
 * Data for executing a pipeline.
 * @template TParams Type of params for this pipeline.
 * @template TResult Type of results of this pipeline.
 * @template TStageParams base type of stage params.
 * @template TStageResult base type of stage results.
 */
interface PipelineData<
  TParams,
  TResult,
  TStageParams,
  TStageResult,
> {
  /**
   * Stages to execute, in order,
   */
  readonly stageDatas:
    | Record<
      number | string,
      PipelineStageData<TParams, TStageResult, TStageParams, TStageResult>
    >
    | Array<
      PipelineStageData<TParams, TStageResult, TStageParams, TStageResult>
    >;

  /**
   * Create this pipeline's results.
   * When undefined, {@link executePipeline} returns `void`.
   * @param pipelineParams Params passed to this pipeline. ie, passed to {@link executePipeline}.
   * @param pipelineStageResults Return of {@link StageData.doExecute} from other stages in this pipeline.
   * @returns Used as return value for {@link executePipeline}.
   */
  readonly createResults?: (
    pipelineParams: TParams,
    pipelineStageResults: Record<number, TStageResult>,
  ) => TResult;
}

/**
 * Execute a pipeline.
 * @returns return of {@link PipelineData.createResults}. `void` when {@link PipelineData.createResults} is `undefined`.
 */
function executePipeline<
  TParams,
  TResult,
  TStageParams,
  TStageResult,
>(
  data: PipelineData<
    TParams,
    TResult,
    TStageParams,
    TStageResult
  >,
  params: TParams,
): TResult | void {
  let stageResults: Record<string | number, TStageResult> = {};
  const stageEntries = Object.entries(data.stageDatas);

  for (
    const [iStageKey, iStageData] of stageEntries
  ) {
    const iStageParams = iStageData.createParams(
      params,
      stageResults,
    );

    const iStageShouldExecute = iStageData.shouldExecute?.(
      iStageParams,
      stageResults,
    ) ?? true;

    iStageData.beforeExecute?.(
      params,
      iStageParams,
      iStageShouldExecute,
    );

    let iStageResult;
    if (
      iStageShouldExecute
    ) {
      iStageResult = iStageData.doExecute(
        iStageParams,
      );

      stageResults[iStageKey] = iStageResult;
    }

    iStageData.afterExecute?.(
      params,
      iStageParams,
      iStageResult,
      iStageShouldExecute,
    );
  }

  // create results
  if (data.createResults !== undefined) {
    return data.createResults(
      params,
      stageResults,
    );
  } else {
    return;
  }
}

export type { PipelineData, StageData };
export { executePipeline };