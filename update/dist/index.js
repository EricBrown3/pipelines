// src/index.ts
function executePipeline(data, params) {
  let stageResults = new Array(data.stageDatas.length);
  for (let iStageOrderIndex = 0; iStageOrderIndex < data.stageDatas.length; iStageOrderIndex++) {
    const iStageData = data.stageDatas[iStageOrderIndex];
    if (iStageData === void 0) {
      throw new Error(`Missing data!`);
    }
    const iStageParams = iStageData.produceParams(
      params
    );
    iStageData.beforeExecute?.(
      params,
      iStageParams
    );
    let iShouldExecute = iStageData.shouldExecute(
      iStageParams
    );
    let iStageResult;
    if (iShouldExecute === true) {
      iStageResult = iStageData.doExecute(
        iStageParams
      );
      stageResults[iStageOrderIndex] = iStageResult;
    } else {
      stageResults[iStageOrderIndex] = void 0;
    }
    iStageData.afterExecute?.(
      params,
      iStageParams,
      iStageResult
    );
  }
  return data.produceResults(
    params,
    stageResults
  );
}
export {
  executePipeline
};
//# sourceMappingURL=index.js.map