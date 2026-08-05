import { validateSuccessFactorConfidenceThreshold } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-992
  test("成功要因・失敗要因の抽出と承認基準判定機能 - 要因テキストの信頼度スコアが閾値直上のとき有効と判定される", () => {
    const threshold = 0.70;
    const factorText = "顧客との関係構築が不十分だった";
    const confidenceScore = 0.70;

    const result = validateSuccessFactorConfidenceThreshold({
      factorText,
      confidenceScore,
      threshold,
    });

    expect(result.isValid).toBe(true);
    expect(result.confidenceScore).toBe(0.70);
    expect(result.validationStatus).toBe("APPROVED");
  });
});