import { evaluateSystemHealth } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-246
  test("システムヘルスチェック判定機能 - 営業データ品質スコアが合格基準を満たさないとき不合格判定が出力される", () => {
    const input = {
      systemStatus: "OPERATIONAL",
      dataQualityScore: 58,
      aiInferenceAccuracy: 92,
      dataQualityThreshold: 60,
      inferenceAccuracyThreshold: 90,
    };

    const result = evaluateSystemHealth(input);

    expect(result.overallJudgment).toBe("FAILED");
    expect(result.statusCode).toBe("FAILED");
    expect(result.message).toContain("営業データ品質スコア: 58点");
    expect(result.message).toContain("合格基準 60点");
    expect(result.message).toContain("に達していません");
  });
});