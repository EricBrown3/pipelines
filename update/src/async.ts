import PLazy from "p-lazy";

import {
  BasePipelineData,
  getOrderedStageEntries,
  PipelineStageData,
} from "./base";

/**
 * Data for an an asynchronous stage.
 * @template TParams type of `params` passed to this stage.
 * @template TResult type of `result` returned from this stage.
 */
interface AsyncStageData<
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
  ) => Promise<TResult>;
}

/**
 * Data for an asynchronous stage within a pipeline.
 */
type AsyncPipelineStageData<TParams, TStageParams, TStageResult> =
  & PipelineStageData<TParams, TStageResult, TStageParams, TStageResult>
  & AsyncStageData<TStageParams, TStageResult>;

/**
 * Data for an asynchronous pipeline.
 * @template TParams Type of params for this pipeline.
 * @template TResult Type of results of this pipeline.
 * @template TStageParams base type of stage params.
 * @template TStageResult base type of stage results.
 */
interface AsyncPipelineData<
  TParams,
  TResult,
  TStageParams,
  TStageResult,
> extends BasePipelineData<TParams, TResult, TStageParams, TStageResult> {
  /**
   * Stages to execute, in order,
   */
  readonly stageDatas:
    | Record<
      string,
      AsyncPipelineStageData<TParams, TStageParams, TStageResult>
    >
    | Array<
      AsyncPipelineStageData<TParams, TStageParams, TStageResult>
    >;
}

enum ConcurrencyMode {
  all,
  any,
  order,
}

/**
 * Execute an asynchronous pipeline.
 * @param order order to execute stages in. If `undefined`, the order of the keys of the pipeline's stage datas is used.
 * @param concurrencyMode concurrency mode
 * @returns return of {@link PipelineData.createResults}. `undefined` when {@link PipelineData.createResults} is `undefined`.
 */
async function executeAsyncPipeline<
  TParams,
  TResult,
  TStageParams,
  TStageResult,
>(
  data: AsyncPipelineData<
    TParams,
    TResult,
    TStageParams,
    TStageResult
  >,
  params: TParams,
  concurrencyMode: ConcurrencyMode,
  order?: Array<number> | Array<string>,
): Promise<TResult | undefined> {
  let stageResults: Record<string, TStageResult> = {};
  const orderedStageDataEntries = getOrderedStageEntries(
    data.stageDatas,
    order,
  );

  const stageDataEntryPromises = orderedStageDataEntries.map(
    ([iStageDataKey, iStageDataValue]) => {
      return new PLazy<void>(
        async () => {
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
            iStageResult = await iStageDataValue.doExecute(
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
        },
      );
    },
  );

  switch (concurrencyMode) {
    case ConcurrencyMode.all:
      await Promise.all(stageDataEntryPromises);
      break;
    case ConcurrencyMode.any:
      await Promise.any(stageDataEntryPromises);
      break;
    case ConcurrencyMode.order:
      for (const i of stageDataEntryPromises) {
        await i;
      }
      break;
    default:
      throw new Error(`Not implemented! Mode '${concurrencyMode}'.`);
  }

  return data.createResults?.(
    params,
    stageResults,
  );
}

export {
  type AsyncPipelineData,
  type AsyncPipelineStageData,
  type AsyncStageData,
  ConcurrencyMode,
  executeAsyncPipeline,
};
