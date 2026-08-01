import {
  validateLearningDataBeforeInference,
} from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-101: AIエージェント推論実行前の学習データ量・品質検証機能 - 行動パターン分析結果の品質スコアが良好ライン直上の場合、推論実行が許可される", () => {
    const quality_score = 75.0;
    const learning_data_count = 100;
    const min_learning_data_count = 50;
    const quality_threshold = 75.0;

    const result = validateLearningDataBeforeInference({
      quality_score,
      learning_data_count,
      min_learning_data_count,
      quality_threshold,
    });

    expect(result.status).toBe("APPROVED");
    expect(result.allowInference).toBe(true);
  });
});