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
     * create params for this stage.
     * @param pipelineStageResults current results of the stage pipeline.
     */
    readonly createParams: (pipelineParams: TPipelineParams, pipelineStageResults: Record<number, TPipelineStageResult | void>) => TStageParams;
    /**
     * should execute this stage?
     */
    shouldExecute?: (params: TStageParams, pipelineStageResults: Record<number, TPipelineStageResult | void>) => boolean;
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
    readonly stageDatas: Record<number | string, PipelineStageData<TParams, TStageResult, TStageParams, TStageResult>> | Array<PipelineStageData<TParams, TStageResult, TStageParams, TStageResult>>;
    /**
     * create this pipeline's results.
     */
    readonly createResults?: (params: TParams, results: Record<number, TStageResult | void>) => TResult;
}
/**
 * Execute a pipeline.
 * Stagees {@link StageResult.nextStageParams} of each stage into the `params` of the next stage.
 * @param params stageed to the initial stage.
 * @returns results of the last stage.
 */
declare function executePipeline<TParams, TResult, TStageParams, TStageResult>(data: PipelineData<TParams, TResult, TStageParams, TStageResult>, params: TParams): TResult | void;

export { PipelineData, StageData, executePipeline };
