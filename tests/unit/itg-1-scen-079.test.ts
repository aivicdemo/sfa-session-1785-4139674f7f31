import { validateLearningDataBeforeInference } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-079: [edge] AIエージェント推論実行前の学習データ量・品質検証機能 - 学習データが最小要件を1件下回る場合、推論実行が保留される
  test("学習データが最小要件より1件少ない場合、推論実行が保留されてエラーメッセージが返される", () => {
    const minimum_required_data_count = 1000;
    const current_data_count = 999;

    const result = validateLearningDataBeforeInference({
      minimumRequiredDataCount: minimum_required_data_count,
      currentLearningDataCount: current_data_count,
    });

    expect(result.status).toBe("PENDING");
    expect(result.errorCode).toBe("DATA_INSUFFICIENT");
    expect(result.message).toBe(
      "学習データが最小要件に達していません。現在999件 / 必要1000件"
    );
    expect(result.isInferenceAllowed).toBe(false);
  });
});