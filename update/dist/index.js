// src/index.ts
function executePipeline(data, params) {
  for (let iStageOrderIndex = 0; iStageOrderIndex < data.stageDatas.length; iStageOrderIndex++) {
    const iPipelineStageData = data.stageDatas[iStageOrderIndex];
    if (iPipelineStageData === void 0) {
      throw new Error(`Missing data!`);
    }
    if (Array.isArray(iPipelineStageData.passData)) {
      let iStageResults = new Array(
        iPipelineStageData.passData.length
      );
      const iStageParams = iPipelineStageData.produceParams(
        params
      );
      iPipelineStageData.beforeExecute?.(
        params,
        iStageParams
      );
      const iStages = iPipelineStageData.passData;
      for (let jStageGroupIndex = 0; jStageGroupIndex < iStages.length; jStageGroupIndex++) {
        const jStageData = iStages[jStageGroupIndex];
        if (jStageData === void 0) {
          throw new Error(`Missing data!`);
        }
        const jShouldExecute = jStageData.shouldExecute(
          iStageParams
        );
        if (jShouldExecute === true) {
          iStageResults[jStageGroupIndex] = jStageData.doExecute(
            iStageParams
          );
        }
      }
      iPipelineStageData.afterExecute?.(
        params,
        iStageParams,
        iStageResults
      );
    } else {
      const iStageParams = iPipelineStageData.produceParams(
        params
      );
      iPipelineStageData.beforeExecute?.(
        params,
        iStageParams
      );
      const iStageData = iPipelineStageData.passData;
      let iShouldExecute = iStageData.shouldExecute(
        iStageParams
      );
      let iStageResult;
      if (iShouldExecute === true) {
        iStageResult = iStageData.doExecute(
          iStageParams
        );
      }
      iPipelineStageData.afterExecute?.(
        params,
        iStageParams,
        iStageResult
      );
    }
  }
  return data.produceResults(
    params
  );
}
export {
  executePipeline
};
//# sourceMappingURL=index.js.map