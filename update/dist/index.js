// src/index.ts
function executePipeline(data, params) {
  let stageResults = {};
  for (let iStageOrderIndex = 0; iStageOrderIndex < data.stageDatas.length; iStageOrderIndex++) {
    const iStageData = data.stageDatas[iStageOrderIndex];
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
    let iShouldExecute;
    switch (typeof iStageData.shouldExecute) {
      case "boolean":
        iShouldExecute = iStageData.shouldExecute;
        break;
      case "function":
        iShouldExecute = iStageData.shouldExecute(iStageParams);
        break;
      default:
        iShouldExecute = true;
        break;
    }
    let iStageResult;
    if (iShouldExecute === true) {
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