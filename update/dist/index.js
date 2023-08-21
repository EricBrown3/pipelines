// src/index.ts
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
    if (iStageData.shouldExecute?.(
      iStageParams,
      stageResults
    ) ?? true) {
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
  executePipeline
};
//# sourceMappingURL=index.js.map