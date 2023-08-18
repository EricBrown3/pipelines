/**
 * Data for executing a stage.
 */
interface StageData<
  TParams,
  TResult,
> {
  /**
   * should execute this stage?
   */
  shouldExecute?:
    | boolean
    | ((
      params: TParams,
    ) => boolean);
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
  readonly stageDatas: Array<
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
  let stageResults: Record<number, TStageResult | void> = {};
  for (
    let iStageOrderIndex = 0;
    iStageOrderIndex < data.stageDatas.length;
    iStageOrderIndex++
  ) {
    const iStageData = data.stageDatas[iStageOrderIndex];

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

    let iShouldExecute;
    switch (typeof iStageData.shouldExecute) {
      case "boolean":
        iShouldExecute = iStageData.shouldExecute;
        break;
      case "function":
        iShouldExecute = iStageData.shouldExecute(iStageParams);
        break;
      default:
        iShouldExecute = true;
        break;
    }

    let iStageResult;
    if (iShouldExecute === true) {
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

export { executePipeline, type PipelineData, type StageData as StageData };
