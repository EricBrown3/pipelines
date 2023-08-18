/**
 * Data for executing a stage.
 */
interface PassData<
  TParams,
  TResult,
> {
  /**
   * should execute this pass?
   */
  shouldExecute: (
    params: TParams,
  ) => boolean;
  /**
   * Execute this pass.
   */
  doExecute: (
    params: TParams,
  ) => TResult;
}

/**
 * Data for executing a stage with multiple passes.
 */
interface MultiPassStageData<
  TPipelineParams,
  TPassParams,
  TPassResult,
> extends PassData<TPassParams, TPassResult> {
  readonly passData: Array<PassData<TPassParams, TPassResult>>;

  /**
   * Produce params for all passes in this stage.
   */
  readonly produceParams: (
    pipelineParams: TPipelineParams,
  ) => TPassParams;

  /**
   * Before executing pass(es).
   */
  readonly beforeExecute?: (
    pipelineParams: TPipelineParams,
    params: TPassParams,
  ) => void;

  /**
   * After executing pass(es).
   * Invoked when {@link shouldExecute} returns `false`.
   * @param results return of `doExecute`. `void` when `shouldExecute` returned `false`.
   */
  readonly afterExecute?: (
    pipelineParams: TPipelineParams,
    params: TPassParams,
    results: Array<TPassResult | void>,
  ) => void;
}

/**
 * Data for executing a stage with a single pass.
 */
interface SinglePassStageData<
  TPipelineParams,
  TPassParams,
  TPassResult,
> {
  readonly passData: PassData<TPassParams, TPassResult>;

  /**
   * Produce params for this stage.
   */
  readonly produceParams: (
    pipelineParams: TPipelineParams,
  ) => TPassParams;

  /**
   * Before executing any stage.
   */
  readonly beforeExecute?: (
    pipelineParams: TPipelineParams,
    params: TPassParams,
  ) => void;

  /**
   * After executing any stage.
   * Invoked when {@link shouldExecute} returns `false`.
   * @param result return of `doExecute`. `void` when `shouldExecute` returned `false`.
   */
  readonly afterExecute?: (
    pipelineParams: TPipelineParams,
    params: TPassParams,
    result: TPassResult | void,
  ) => void;
}

/**
 * Data for executing a pipeline.
 * @template TPassParams base type of stage params.
 * @template TPassResult base type of stage results.
 */
interface PipelineData<
  TParams,
  TResult,
  TPassParams,
  TPassResult,
> {
  /**
   * Stages to execute.
   */
  readonly stageDatas: Array<
    | SinglePassStageData<TParams, TPassParams, TPassResult>
    | MultiPassStageData<TParams, TPassParams, TPassResult>
  >;

  /**
   * Produce this pipeline's results.
   */
  readonly produceResults: (
    params: TParams,
  ) => TResult;
}

/**
 * Execute a pipeline.
 * Passes {@link StageResult.nextStageParams} of each stage into the `params` of the next stage.
 * @param params passed to the initial stage.
 * @returns results of the last stage.
 */
function executePipeline<
  TParams,
  TResult,
  TPassParams,
  TPassResult,
>(
  data: PipelineData<
    TParams,
    TResult,
    TPassParams,
    TPassResult
  >,
  params: TParams,
): TResult {
  for (
    let iStageOrderIndex = 0;
    iStageOrderIndex < data.stageDatas.length;
    iStageOrderIndex++
  ) {
    const iPipelineStageData = data.stageDatas[iStageOrderIndex];

    if (iPipelineStageData === undefined) {
      throw new Error(`Missing data!`);
    }

    if (Array.isArray(iPipelineStageData.passData)) { // multi-pass
      let iStageResults = new Array<TPassResult | void>(
        iPipelineStageData.passData.length,
      );

      const iStageParams = iPipelineStageData.produceParams(
        params,
      );

      iPipelineStageData.beforeExecute?.(
        params,
        iStageParams,
      );

      const iStages = iPipelineStageData.passData;
      for (
        let jStageGroupIndex = 0;
        jStageGroupIndex < iStages.length;
        jStageGroupIndex++
      ) {
        const jStageData = iStages[jStageGroupIndex];

        if (jStageData === undefined) {
          throw new Error(`Missing data!`);
        }

        const jShouldExecute = jStageData.shouldExecute(
          iStageParams,
        );

        if (jShouldExecute === true) {
          iStageResults[jStageGroupIndex] = jStageData.doExecute(
            iStageParams,
          );
        }
      }

      (iPipelineStageData as MultiPassStageData<
        TParams,
        TPassParams,
        TPassResult
      >)
        .afterExecute?.(
          params,
          iStageParams,
          iStageResults,
        );
    } else { // single pass
      const iStageParams = iPipelineStageData.produceParams(
        params,
      );

      iPipelineStageData.beforeExecute?.(
        params,
        iStageParams,
      );

      const iPassData = iPipelineStageData.passData;

      let iShouldExecute = iPassData.shouldExecute(
        iStageParams,
      );

      let iStageResult;
      if (iShouldExecute === true) {
        iStageResult = iPassData.doExecute(
          iStageParams,
        );
      }

      (iPipelineStageData as SinglePassStageData<
        TParams,
        TPassParams,
        TPassResult
      >).afterExecute?.(
        params,
        iStageParams,
        iStageResult,
      );
    }
  }

  // produce results
  return data.produceResults(
    params,
  );
}

export { executePipeline, type PassData as StageData, type PipelineData };
