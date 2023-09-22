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
   * @param params Type of `params` for the pipeline of this stage. ie, passed to {@link executePipeline}.
   * @param stageResults Return of {@link StageData.doExecute} of other stages in this pipeline.
   * @returns Params passed to all functions of this stage.
   */
  readonly createParams: (
    params: TPipelineParams,
    stageResults: Record<string, TPipelineStageResult>,
  ) => TParams;

  /**
   * Should execute this stage?
   * @param params Return of {@link createParams}.
   * @param stageResults Return of {@link StageData.doExecute} of other stages in this pipeline.
   * @return Should invoke {@link doExecute}?
   */
  readonly shouldExecute?: (
    params: TParams,
    stageResults: Record<string, TPipelineStageResult>,
  ) => boolean;

  /**
   * Hook invoked before executing this stage.
   * Always invoked (even when {@link shouldExecute} returns `false`).
   * Invoked after {@link shouldExecute}, and before {@link StageData.doExecute}.
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
   * @param result Result of executing this stage, return of {@link StageData.doExecute}. `null` when `doExecute` was not invoked. ie, when `didExecute` is `false` and `shouldExecute` returned `false`.
   * @param didExecute Did invoke {@link StageData.doExecute}? ie, return of {@link shouldExecute}.
   */
  readonly afterExecute?: (
    pipelineParams: TPipelineParams,
    params: TParams,
    result: TResult | null,
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
      string,
      PipelineStageData<TParams, TStageResult, TStageParams, TStageResult>
    >
    | Array<
      PipelineStageData<TParams, TStageResult, TStageParams, TStageResult>
    >;

  /**
   * Create this pipeline's results.
   * When `undefined`, {@link executePipeline} returns `undefined`.
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
 * @returns return of {@link PipelineData.createResults}. `undefined` when {@link PipelineData.createResults} is `undefined`.
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
): TResult | undefined {
  let stageResults: Record<string, TStageResult> = {};
  const stageDataEntries: Array<[string, PipelineStageData<TParams, TStageResult, TStageParams, TStageResult>]> = Object.entries(data.stageDatas);

  for (
    const [iStageDataKey, iStageDataValue] of stageDataEntries
  ) {
    const iStageParams: TStageParams = iStageDataValue.createParams(
      params,
      stageResults,
    );

    const iStageShouldExecute: boolean = iStageDataValue.shouldExecute?.(
      iStageParams,
      stageResults,
    ) ?? true;

    iStageDataValue.beforeExecute?.(
      params,
      iStageParams,
      iStageShouldExecute,
    );

    let iStageResult: TStageResult | null = null;
    if (
      iStageShouldExecute
    ) {
      iStageResult = iStageDataValue.doExecute(
        iStageParams,
      );

      stageResults[iStageDataKey] = iStageResult;
    }

    iStageDataValue.afterExecute?.(
      params,
      iStageParams,
      iStageResult,
      iStageShouldExecute,
    );
  }

  // create results
  return data.createResults?.(
    params,
    stageResults,
  );
}

export type { PipelineData, StageData };
export { executePipeline };