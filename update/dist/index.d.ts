/**
 * Data for executing a stage.
 */
interface StageData<TParams, TResult> {
    /**
     * should execute this pass?
     */
    shouldExecute: (params: TParams) => boolean;
    /**
     * Execute this pass.
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
 * @template TPassParams base type of stage params.
 * @template TPassResult base type of stage results.
 */
interface PipelineData<TParams, TResult, TPassParams, TPassResult> {
    /**
     * Stages to execute.
     */
    readonly stageDatas: Array<PipelineStageData<TParams, TPassParams, TPassResult>>;
    /**
     * Produce this pipeline's results.
     */
    readonly produceResults: (params: TParams) => TResult;
}
/**
 * Execute a pipeline.
 * Passes {@link StageResult.nextStageParams} of each stage into the `params` of the next stage.
 * @param params passed to the initial stage.
 * @returns results of the last stage.
 */
declare function executePipeline<TParams, TResult, TPassParams, TPassResult>(data: PipelineData<TParams, TResult, TPassParams, TPassResult>, params: TParams): TResult;

export { PipelineData, StageData, executePipeline };
