/**
 * Data for executing a stage within a pipeline.
 * @template TPipelineParams params passed to {@link executePipeline}.
 * @template TPipelineStageResult result returned from {@link executePipeline}.
 * @template TParams type of `params` passed to this stage.
 * @template TResult type of `result` returned from this stage.
 */
interface PipelineStageData<TPipelineParams, TPipelineStageResult, TParams, TResult> {
    /**
     * Create `params` for this stage.
     * @param params Type of `params` for the pipeline of this stage. ie, passed to {@link executePipeline}.
     * @param stageResults Return of {@link StageData.doExecute} of other stages in this pipeline.
     * @returns Params passed to all functions of this stage.
     */
    readonly createParams: (params: TPipelineParams, stageResults: Record<string, TPipelineStageResult>) => TParams;
    /**
     * Should execute this stage?
     * @param params Return of {@link createParams}.
     * @param stageResults Return of {@link StageData.doExecute} of other stages in this pipeline.
     * @return Should invoke {@link doExecute}?
     */
    readonly shouldExecute?: (params: TParams, stageResults: Record<string, TPipelineStageResult>) => boolean;
    /**
     * Hook invoked before executing this stage.
     * Always invoked (even when {@link shouldExecute} returns `false`).
     * Invoked after {@link shouldExecute}, and before {@link StageData.doExecute}.
     * @param pipelineParams params passed to {@link executePipeline}.
     * @param params Return of {@link createParams}.
     * @param willExecute Will invoke {@link StageData.doExecute}? ie, return of {@link shouldExecute}.
     */
    readonly beforeExecute?: (pipelineParams: TPipelineParams, params: TParams, willExecute: boolean) => void;
    /**
     * Hook invoked after executing this stage.
     * Always invoked (even when {@link shouldExecute} returns `false`).
     * @param pipelineParams Params for the pipeline of this stage. ie, passed to {@link executePipeline}.
     * @param params Return of {@link createParams}.
     * @param result Result of executing this stage, return of {@link StageData.doExecute}. `null` when `doExecute` was not invoked. ie, when `didExecute` is `false` and `shouldExecute` returned `false`.
     * @param didExecute Did invoke {@link StageData.doExecute}? ie, return of {@link shouldExecute}.
     */
    readonly afterExecute?: (pipelineParams: TPipelineParams, params: TParams, result: TResult | null, didExecute: boolean) => void;
}
/**
 * Data for executing a pipeline.
 * @template TParams Type of params for this pipeline.
 * @template TResult Type of results of this pipeline.
 * @template TStageParams base type of stage params.
 * @template TStageResult base type of stage results.
 */
interface BasePipelineData<TParams, TResult, TStageParams, TStageResult> {
    /**
     * Stages to execute.
     */
    readonly stageDatas: Record<string, PipelineStageData<TParams, TStageResult, TStageParams, TStageResult>> | Array<PipelineStageData<TParams, TStageResult, TStageParams, TStageResult>>;
    /**
     * Create this pipeline's results.
     * When `undefined`, {@link executePipeline} returns `undefined`.
     * @param pipelineParams Params passed to this pipeline. ie, passed to {@link executePipeline}.
     * @param pipelineStageResults Return of {@link StageData.doExecute} from other stages in this pipeline.
     * @returns Used as return value for {@link executePipeline}.
     */
    readonly createResults?: (pipelineParams: TParams, pipelineStageResults: Record<number, TStageResult>) => TResult;
}

/**
 * Data for an an asynchronous stage.
 * @template TParams type of `params` passed to this stage.
 * @template TResult type of `result` returned from this stage.
 */
interface AsyncStageData<TParams, TResult> {
    /**
     * Execute this stage.
     * @param params used to execute this stage.
     * @returns result of executing this stage.
     */
    doExecute: (params: TParams) => Promise<TResult>;
}
/**
 * Data for an asynchronous stage within a pipeline.
 */
type AsyncPipelineStageData<TParams, TStageParams, TStageResult> = PipelineStageData<TParams, TStageResult, TStageParams, TStageResult> & AsyncStageData<TStageParams, TStageResult>;
/**
 * Data for an asynchronous pipeline.
 * @template TParams Type of params for this pipeline.
 * @template TResult Type of results of this pipeline.
 * @template TStageParams base type of stage params.
 * @template TStageResult base type of stage results.
 */
interface AsyncPipelineData<TParams, TResult, TStageParams, TStageResult> extends BasePipelineData<TParams, TResult, TStageParams, TStageResult> {
    /**
     * Stages to execute, in order,
     */
    readonly stageDatas: Record<string, AsyncPipelineStageData<TParams, TStageParams, TStageResult>> | Array<AsyncPipelineStageData<TParams, TStageParams, TStageResult>>;
}
declare enum ConcurrencyMode {
    all = 0,
    any = 1,
    order = 2
}
/**
 * Execute an asynchronous pipeline.
 * @param order order to execute stages in. If `undefined`, the order of the keys of the pipeline's stage datas is used.
 * @param concurrencyMode concurrency mode
 * @returns return of {@link PipelineData.createResults}. `undefined` when {@link PipelineData.createResults} is `undefined`.
 */
declare function executeAsyncPipeline<TParams, TResult, TStageParams, TStageResult>(data: AsyncPipelineData<TParams, TResult, TStageParams, TStageResult>, params: TParams, concurrencyMode: ConcurrencyMode, order?: Array<number> | Array<string>): Promise<TResult | undefined>;

/**
 * Data for a synchronous stage.
 * @template TParams type of `params` passed to this stage.
 * @template TResult type of `result` returned from this stage.
 */
interface SyncStageData<TParams, TResult> {
    /**
     * Execute this stage.
     * @param params used to execute this stage.
     * @returns result of executing this stage.
     */
    doExecute: (params: TParams) => TResult;
}
/**
 * Data for synchronous stage in a pipeline.
 */
type SyncPipelineStageData<TParams, TStageParams, TStageResult> = PipelineStageData<TParams, TStageResult, TStageParams, TStageResult> & SyncStageData<TStageParams, TStageResult>;
/**
 * Data for executing a synchronous pipeline.
 * @template TParams Type of params for this pipeline.
 * @template TResult Type of results of this pipeline.
 * @template TStageParams base type of stage params.
 * @template TStageResult base type of stage results.
 */
interface SyncPipelineData<TParams, TResult, TStageParams, TStageResult> extends BasePipelineData<TParams, TResult, TStageParams, TStageResult> {
    /**
     * Stages to execute.
     */
    readonly stageDatas: Record<string, SyncPipelineStageData<TParams, TStageParams, TStageResult>> | Array<SyncPipelineStageData<TParams, TStageParams, TStageResult>>;
}
/**
 * Execute a pipeline.
 * @param order order to execute stages in. If `undefined`, the order of the keys of the pipeline's stage datas is used.
 * @returns return of {@link PipelineData.createResults}. `undefined` when {@link PipelineData.createResults} is `undefined`.
 */
declare function executeSyncPipeline<TParams, TResult, TStageParams, TStageResult>(data: SyncPipelineData<TParams, TResult, TStageParams, TStageResult>, params: TParams, order?: Array<number> | Array<string>): TResult | undefined;

export { AsyncPipelineData, AsyncPipelineStageData, AsyncStageData, ConcurrencyMode, SyncPipelineData, SyncPipelineStageData, SyncStageData, executeAsyncPipeline, executeSyncPipeline };
