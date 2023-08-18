/**
 * Data for executing a stage.
 */
interface StageData<TParams, TResult> {
    /**
     * Execute this stage.
     */
    doExecute: (params: TParams) => TResult | void;
}
/**
 * Data for executing a stage within a pipeline.
 */
interface PipelineStageData<TPipelineParams, TPipelineStageResult, TStageParams, TStageResult> extends StageData<TStageParams, TStageResult> {
    /**
     * Produce params for this stage.
     * @param pipelineStageResults current results of the stage pipeline.
     */
    readonly produceParams: (pipelineParams: TPipelineParams, pipelineStageResults: Record<number, TPipelineStageResult | void>) => TStageParams;
    /**
     * should execute this stage?
     */
    shouldExecute?: boolean | ((params: TStageParams, pipelineStageResults: Record<number, TPipelineStageResult | void>) => boolean);
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
    readonly stageDatas: Array<PipelineStageData<TParams, TStageResult, TStageParams, TStageResult>>;
    /**
     * Produce this pipeline's results.
     */
    readonly produceResults?: (params: TParams, results: Record<number, TStageResult | void>) => TResult;
}
declare function shouldExecutePipelineStage<TPipelineParams, TPipelineStageResult, TStageParams, TStageResult>(iStageData: PipelineStageData<TPipelineParams, TPipelineStageResult, TStageParams, TStageResult>, iStageParams: TStageParams, pipelineStageResults: Record<number, TPipelineStageResult | void>): boolean;
/**
 * Execute a pipeline.
 * Stagees {@link StageResult.nextStageParams} of each stage into the `params` of the next stage.
 * @param params stageed to the initial stage.
 * @returns results of the last stage.
 */
declare function executePipeline<TParams, TResult, TStageParams, TStageResult>(data: PipelineData<TParams, TResult, TStageParams, TStageResult>, params: TParams): TResult | void;

export { PipelineData, StageData, executePipeline, shouldExecutePipelineStage };
