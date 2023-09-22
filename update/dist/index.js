// src/async.ts
import PLazy from "p-lazy";

// src/base.ts
function getOrderedStageDataEntries(stageDatas, order) {
  if (Array.isArray(stageDatas)) {
    order ??= [...stageDatas.keys()];
  } else {
    order ??= Object.keys(stageDatas);
  }
  const orderedStageEntries = order.map(
    (iStageDataKey) => {
      let iStageDataValue;
      if (Array.isArray(stageDatas)) {
        if (typeof iStageDataKey !== "number") {
          throw new TypeError();
        }
        iStageDataValue = stageDatas[iStageDataKey];
      } else {
        iStageDataValue = stageDatas[iStageDataKey];
      }
      if (iStageDataValue === void 0) {
        throw new Error(`Undefined! ${iStageDataKey}`);
      }
      return [
        iStageDataKey,
        iStageDataValue
      ];
    }
  );
  return orderedStageEntries;
}

// src/async.ts
var ConcurrencyMode = /* @__PURE__ */ ((ConcurrencyMode2) => {
  ConcurrencyMode2[ConcurrencyMode2["all"] = 0] = "all";
  ConcurrencyMode2[ConcurrencyMode2["any"] = 1] = "any";
  ConcurrencyMode2[ConcurrencyMode2["order"] = 2] = "order";
  return ConcurrencyMode2;
})(ConcurrencyMode || {});
async function executeAsyncPipeline(data, params, concurrencyMode, order) {
  let stageResults = {};
  const orderedStageDataEntries = getOrderedStageDataEntries(
    data.stageDatas,
    order
  );
  const stageDataEntryPromises = orderedStageDataEntries.map(
    ([iStageDataKey, iStageDataValue]) => {
      return new PLazy(
        async () => {
          const iStageParams = iStageDataValue.createParams(
            params,
            stageResults
          );
          const iStageShouldExecute = iStageDataValue.shouldExecute?.(
            iStageParams,
            stageResults
          ) ?? true;
          iStageDataValue.beforeExecute?.(
            params,
            iStageParams,
            iStageShouldExecute
          );
          let iStageResult = null;
          if (iStageShouldExecute) {
            iStageResult = await iStageDataValue.doExecute(
              iStageParams
            );
            stageResults[iStageDataKey] = iStageResult;
          }
          iStageDataValue.afterExecute?.(
            params,
            iStageParams,
            iStageResult,
            iStageShouldExecute
          );
        }
      );
    }
  );
  switch (concurrencyMode) {
    case 0 /* all */:
      await Promise.all(stageDataEntryPromises);
      break;
    case 1 /* any */:
      await Promise.any(stageDataEntryPromises);
      break;
    case 2 /* order */:
      for (const i of stageDataEntryPromises) {
        await i;
      }
      break;
    default:
      throw new Error(`Not implemented! Mode '${concurrencyMode}'.`);
  }
  return data.createResults?.(
    params,
    stageResults
  );
}

// src/sync.ts
function executeSyncPipeline(data, params, order) {
  let stageResults = {};
  const orderedStageDataEntries = getOrderedStageDataEntries(
    data.stageDatas,
    order
  );
  for (const [iStageDataKey, iStageDataValue] of orderedStageDataEntries) {
    const iStageParams = iStageDataValue.createParams(
      params,
      stageResults
    );
    const iStageShouldExecute = iStageDataValue.shouldExecute?.(
      iStageParams,
      stageResults
    ) ?? true;
    iStageDataValue.beforeExecute?.(
      params,
      iStageParams,
      iStageShouldExecute
    );
    let iStageResult = null;
    if (iStageShouldExecute) {
      iStageResult = iStageDataValue.doExecute(
        iStageParams
      );
      stageResults[iStageDataKey] = iStageResult;
    }
    iStageDataValue.afterExecute?.(
      params,
      iStageParams,
      iStageResult,
      iStageShouldExecute
    );
  }
  return data.createResults?.(
    params,
    stageResults
  );
}
export {
  ConcurrencyMode,
  executeAsyncPipeline,
  executeSyncPipeline
};
//# sourceMappingURL=index.js.map