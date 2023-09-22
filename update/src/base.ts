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
> {
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
interface BasePipelineData<
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
 * Create a new array from entries of {@link stageDatas}, ordered by {@link order}.
 * @param order order of returned array. When `undefined`, the keys of {@link stageDatas} is used.
 * @param stageDatas stage datas to order.
 * @remarks
 * This function is generic.
 */
function getOrderedStageDataEntries<
  TStageData,
>(
  stageDatas: Record<string, TStageData> | Array<TStageData>,
  order?: Array<string> | Array<number>,
): Array<[string | number, TStageData]> {
  if (Array.isArray(stageDatas)) {
    order ??= [...stageDatas.keys()];
  } else {
    order ??= Object.keys(stageDatas);
  }

  const orderedStageEntries: Array<
    [
      string | number,
      TStageData,
    ]
  > = order.map(
    (iStageDataKey) => {
      let iStageDataValue;
      if (Array.isArray(stageDatas)) {
        if (typeof iStageDataKey !== "number") {
          throw new TypeError();
        }

        iStageDataValue = stageDatas[iStageDataKey];
      } else {
        iStageDataValue = stageDatas[iStageDataKey];
      }

      if (iStageDataValue === undefined) {
        throw new Error(`Undefined! ${iStageDataKey}`);
      }

      return [
        iStageDataKey,
        iStageDataValue,
      ];
    },
  );

  return orderedStageEntries;
}

export {
  type BasePipelineData,
  getOrderedStageDataEntries as getOrderedStageEntries,
  type PipelineStageData,
};
