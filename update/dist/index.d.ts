/**
 * Data for executing a stage.
 */
interface StageData<TParams, TResult> {
    /**
     * should execute this stage?
     */
    shouldExecute: (params: TParams) => boolean;
    /**
     * Execute this stage.
     */
    doExecute: (params: TParams) => TResult;
}
/**
 * Data for executing a stage within a pipeline.
 */
interface PipelineStageData<TPipelineParams, TStageParams, TStageResult> extends StageData<TStageParams, TStageResult> {
    /**
     * Produce params for this stage.
     */
    readonly produceParams: (pipelineParams: TPipelineParams) => TStageParams;
    /**
     * Before executing any stage.
     */
    readonly beforeExecute?: (pipelineParams: TPipelineParams, params: TStageParams) => void;
    /**
     * After executing any stage.
     * Invoked when {@link shouldExecute} returns `false`.
     * @param result return of `doExecute`. `void` when `shouldExecute` returned `false`.
     */
    readonly afterExecute?: (pipelineParams: TPipelineParams, params: TStageParams, result: TStageResult | void) => void;
}
/**
 * Data for executing a pipeline.
 * @template TStageParams base type of stage params.
 * @template TStageResult base type of stage results.
 */
interface PipelineData<TParams, TResult, TStageParams, TStageResult> {
    /**
     * Stages to execute.
     */
    readonly stageDatas: Array<PipelineStageData<TParams, TStageParams, TStageResult>>;
    /**
     * Produce this pipeline's results.
     */
    readonly produceResults: (params: TParams, results: Array<TStageResult | void>) => TResult;
}
/**
 * Execute a pipeline.
 * Stagees {@link StageResult.nextStageParams} of each stage into the `params` of the next stage.
 * @param params stageed to the initial stage.
 * @returns results of the last stage.
 */
declare function executePipeline<TParams, TResult, TStageParams, TStageResult>(data: PipelineData<TParams, TResult, TStageParams, TStageResult>, params: TParams): TResult;

export { PipelineData, StageData, executePipeline };
