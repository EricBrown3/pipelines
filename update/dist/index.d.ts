/**
 * Data for executing a stage.
 */
interface PassData<TParams, TResult> {
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
 * Data for executing a stage with multiple passes.
 */
interface MultiPassStageData<TPipelineParams, TPassParams, TPassResult> extends PassData<TPassParams, TPassResult> {
    readonly passData: Array<PassData<TPassParams, TPassResult>>;
    /**
     * Produce params for all passes in this stage.
     */
    readonly produceParams: (pipelineParams: TPipelineParams) => TPassParams;
    /**
     * Before executing pass(es).
     */
    readonly beforeExecute?: (pipelineParams: TPipelineParams, params: TPassParams) => void;
    /**
     * After executing pass(es).
     * Invoked when {@link shouldExecute} returns `false`.
     * @param results return of `doExecute`. `void` when `shouldExecute` returned `false`.
     */
    readonly afterExecute?: (pipelineParams: TPipelineParams, params: TPassParams, results: Array<TPassResult | void>) => void;
}
/**
 * Data for executing a stage with a single pass.
 */
interface SinglePassStageData<TPipelineParams, TPassParams, TPassResult> {
    readonly passData: PassData<TPassParams, TPassResult>;
    /**
     * Produce params for this stage.
     */
    readonly produceParams: (pipelineParams: TPipelineParams) => TPassParams;
    /**
     * Before executing any stage.
     */
    readonly beforeExecute?: (pipelineParams: TPipelineParams, params: TPassParams) => void;
    /**
     * After executing any stage.
     * Invoked when {@link shouldExecute} returns `false`.
     * @param result return of `doExecute`. `void` when `shouldExecute` returned `false`.
     */
    readonly afterExecute?: (pipelineParams: TPipelineParams, params: TPassParams, result: TPassResult | void) => void;
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
    readonly stageDatas: Array<SinglePassStageData<TParams, TPassParams, TPassResult> | MultiPassStageData<TParams, TPassParams, TPassResult>>;
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

export { PipelineData, PassData as StageData, executePipeline };
