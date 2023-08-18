/**
 * Data for executing a stage.
 */
interface StageData<
  TParams,
  TResult,
> {
  /**
   * Execute this stage.
   */
  doExecute: (
    params: TParams,
  ) => TResult | void;
}

/**
 * Data for executing a stage within a pipeline.
 */
interface PipelineStageData<
  TPipelineParams,
  TPipelineStageResult,
  TStageParams,
  TStageResult,
> extends StageData<TStageParams, TStageResult> {
  /**
   * Produce params for this stage.
   * @param pipelineStageResults current results of the stage pipeline.
   */
  readonly produceParams: (
    pipelineParams: TPipelineParams,
    pipelineStageResults: Record<number, TPipelineStageResult | void>,
  ) => TStageParams;

  /**
   * should execute this stage?
   */
  shouldExecute?:
    | boolean
    | ((
      params: TStageParams,
      pipelineStageResults: Record<number, TPipelineStageResult | void>,
    ) => boolean);

  /**
   * Before executing any stage.
   */
  readonly beforeExecute?: (
    pipelineParams: TPipelineParams,
    params: TStageParams,
  ) => void;

  /**
   * After executing any stage.
   * Invoked when {@link shouldExecute} returns `false`.
   * @param result return of `doExecute`. `void` when `shouldExecute` returned `false`.
   */
  readonly afterExecute?: (
    pipelineParams: TPipelineParams,
    params: TStageParams,
    result: TStageResult | void,
  ) => void;
}

/**
 * Data for executing a pipeline.
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
   * Stages to execute.
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
   * Produce this pipeline's results.
   */
  readonly produceResults?: (
    params: TParams,
    results: Record<number, TStageResult | void>,
  ) => TResult;
}

function shouldExecutePipelineStage<
  TPipelineParams,
  TPipelineStageResult,
  TStageParams,
  TStageResult,
>(
  iStageData: PipelineStageData<
    TPipelineParams,
    TPipelineStageResult,
    TStageParams,
    TStageResult
  >,
  iStageParams: TStageParams,
  pipelineStageResults: Record<number, TPipelineStageResult | void>,
) {
  switch (typeof iStageData.shouldExecute) {
    case "boolean":
      return iStageData.shouldExecute;
    case "function":
      return iStageData.shouldExecute(iStageParams, pipelineStageResults);
    default:
      return true;
  }
}

/**
 * Execute a pipeline.
 * Stagees {@link StageResult.nextStageParams} of each stage into the `params` of the next stage.
 * @param params stageed to the initial stage.
 * @returns results of the last stage.
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
  let stageResults: Record<string | number, TStageResult | void> = {};
  const stageEntries = Object.entries(data.stageDatas);

  for (
    const [iStageOrderIndex, iStageData] of stageEntries
  ) {
    if (iStageData === undefined) {
      throw new Error(`Missing data!`);
    }

    const iStageParams = iStageData.produceParams(
      params,
      stageResults,
    );

    iStageData.beforeExecute?.(
      params,
      iStageParams,
    );

    let iStageResult;
    if (
      shouldExecutePipelineStage(
        iStageData,
        iStageParams,
        stageResults,
      )
    ) {
      iStageResult = iStageData.doExecute(
        iStageParams,
      );

      stageResults[iStageOrderIndex] = iStageResult;
    }

    iStageData.afterExecute?.(
      params,
      iStageParams,
      iStageResult,
    );
  }

  // produce results
  if (data.produceResults !== undefined) {
    return data.produceResults(
      params,
      stageResults,
    );
  } else {
    return;
  }
}

export {
  executePipeline,
  type PipelineData,
  shouldExecutePipelineStage,
  type StageData as StageData,
};
