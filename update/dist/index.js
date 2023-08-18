// src/index.ts
function executePipeline(data, params) {
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
    }
    iStageData.afterExecute?.(
      params,
      iStageParams,
      iStageResult
    );
  }
  return data.produceResults(
    params
  );
}
export {
  executePipeline
};
//# sourceMappingURL=index.js.map