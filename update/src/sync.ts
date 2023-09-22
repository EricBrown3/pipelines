import {
  BasePipelineData,
  getOrderedStageEntries,
  PipelineStageData,
} from "./base";

/**
 * Data for a synchronous stage.
 * @template TParams type of `params` passed to this stage.
 * @template TResult type of `result` returned from this stage.
 */
interface SyncStageData<
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
 * Data for synchronous stage in a pipeline.
 */
type SyncPipelineStageData<TParams, TStageParams, TStageResult> =
  & PipelineStageData<TParams, TStageResult, TStageParams, TStageResult>
  & SyncStageData<TStageParams, TStageResult>;

/**
 * Data for executing a synchronous pipeline.
 * @template TParams Type of params for this pipeline.
 * @template TResult Type of results of this pipeline.
 * @template TStageParams base type of stage params.
 * @template TStageResult base type of stage results.
 */
interface SyncPipelineData<
  TParams,
  TResult,
  TStageParams,
  TStageResult,
> extends BasePipelineData<TParams, TResult, TStageParams, TStageResult> {
  /**
   * Stages to execute.
   */
  readonly stageDatas:
    | Record<
      string,
      SyncPipelineStageData<TParams, TStageParams, TStageResult>
    >
    | Array<
      SyncPipelineStageData<TParams, TStageParams, TStageResult>
    >;
}

/**
 * Execute a pipeline.
 * @param order order to execute stages in. If `undefined`, the order of the keys of the pipeline's stage datas is used.
 * @returns return of {@link PipelineData.createResults}. `undefined` when {@link PipelineData.createResults} is `undefined`.
 */
function executeSyncPipeline<
  TParams,
  TResult,
  TStageParams,
  TStageResult,
>(
  data: SyncPipelineData<
    TParams,
    TResult,
    TStageParams,
    TStageResult
  >,
  params: TParams,
  order?: Array<number> | Array<string>,
): TResult | undefined {
  let stageResults: Record<string, TStageResult> = {};

  const orderedStageDataEntries = getOrderedStageEntries(
    data.stageDatas,
    order,
  );

  for (
    const [iStageDataKey, iStageDataValue] of orderedStageDataEntries
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

  return data.createResults?.(
    params,
    stageResults,
  );
}

export {
  executeSyncPipeline,
  type SyncPipelineData,
  type SyncPipelineStageData,
  type SyncStageData,
};
