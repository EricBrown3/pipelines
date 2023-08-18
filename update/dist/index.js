// src/index.ts
function shouldExecutePipelineStage(iStageData, iStageParams, pipelineStageResults) {
  switch (typeof iStageData.shouldExecute) {
    case "boolean":
      return iStageData.shouldExecute;
    case "function":
      return iStageData.shouldExecute(iStageParams, pipelineStageResults);
    default:
      return true;
  }
}
function executePipeline(data, params) {
  let stageResults = {};
  const stageEntries = Object.entries(data.stageDatas);
  for (const [iStageOrderIndex, iStageData] of stageEntries) {
    if (iStageData === void 0) {
      throw new Error(`Missing data!`);
    }
    const iStageParams = iStageData.produceParams(
      params,
      stageResults
    );
    iStageData.beforeExecute?.(
      params,
      iStageParams
    );
    let iStageResult;
    if (shouldExecutePipelineStage(
      iStageData,
      iStageParams,
      stageResults
    )) {
      iStageResult = iStageData.doExecute(
        iStageParams
      );
      stageResults[iStageOrderIndex] = iStageResult;
    }
    iStageData.afterExecute?.(
      params,
      iStageParams,
      iStageResult
    );
  }
  if (data.produceResults !== void 0) {
    return data.produceResults(
      params,
      stageResults
    );
  } else {
    return;
  }
}
export {
  executePipeline,
  shouldExecutePipelineStage
};
//# sourceMappingURL=index.js.map