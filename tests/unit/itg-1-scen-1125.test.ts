import {
  monitorAiInferenceAccuracy,
  AlertConfigNotFoundError,
} from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-1125
  test("[error] アラート設定が存在しないとき、処理がエラーになること", () => {
    const mockInferenceAccuracy = 0.5;
    const mockAlertConfig = null;

    expect(() => {
      monitorAiInferenceAccuracy({
        inferenceAccuracy: mockInferenceAccuracy,
        alertConfig: mockAlertConfig,
      });
    }).toThrow(/Alert configuration not found/);
  });
});