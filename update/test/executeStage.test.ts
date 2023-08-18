import { describe, expect, jest, test } from "@jest/globals";
import {
  executeStage,
  PassData,
  StageData,
} from "../src/index";

describe("executeStage", () => {
  test("it does invoke doExecute when shouldExecute returns true", () => {
    const mockPassDataDoExecute = jest.fn();

    const passData: PassData<{}, void> = {
      doExecute(params) {
        mockPassDataDoExecute(params);
      },

      shouldExecute() {
        return true
      },
    };

    const stageData: StageData<{}, { nextStageParams: {} }, {}, {}, void> = {
      passDatas: {
        "foo": passData,
      },
      passOrder: [
        "foo",
      ],
      producePassParams() {
        return {};
      },
      produceResults() {
        return {
          nextStageParams: {},
        };
      },
    };

    executeStage(
      stageData,
      {}
    );

    expect(mockPassDataDoExecute).toHaveBeenCalled();
  });
  test("it does not invoke doExecute when shouldExecute returns false", () => {
    const mockPassDataDoExecute = jest.fn();

    const passData: PassData<{}, void> = {
      doExecute(params) {
        mockPassDataDoExecute(params);
      },

      shouldExecute() {
        return false
      },
    };

    const stageData: StageData<{}, { nextStageParams: {} }, {}, {}, void> = {
      passDatas: {
        "foo": passData,
      },
      passOrder: [
        "foo",
      ],
      producePassParams() {
        return {};
      },
      produceResults() {
        return {
          nextStageParams: {},
        };
      },
    };

    executeStage(
      stageData,
      {}
    );

    expect(mockPassDataDoExecute).not.toHaveBeenCalled();
  });
  test("it does pass params from StageData.producePassParams to PassData.doExecute", () => {
    const mockPassDataDoExecute = jest.fn();
    const mockPassParams = {}

    const passData: PassData<{}, void> = {
      doExecute(params) {
        mockPassDataDoExecute(params);
      },

      shouldExecute() {
        return true
      },
    };

    const stageData: StageData<{}, { nextStageParams: {} }, {}, {}, void> = {
      passDatas: {
        "foo": passData,
      },
      passOrder: [
        "foo",
      ],
      producePassParams() {
        return mockPassParams;
      },
      produceResults() {
        return {
          nextStageParams: {},
        };
      },
    };

    executeStage(
      stageData,
      {}
    );

    expect(mockPassDataDoExecute).toHaveBeenCalledWith(mockPassParams);
  });
});
