import { calculateRecommendationConfidenceScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-714
  test("成功・失敗要因の抽出と承認基準判定機能 - ワークショップ参加者数が定義された最小値のとき、抽出要因の信頼度が正しく計算される", () => {
    const minimumParticipants = 5;
    const extractedFactorsCount = 8;
    const consistencyRate = 0.875;

    const confidenceScore = calculateRecommendationConfidenceScore({
      workshopParticipantCount: minimumParticipants,
      extractedFactorCount: extractedFactorsCount,
      factorConsistencyRate: consistencyRate,
    });

    expect(confidenceScore).toBe(0.6);
    expect(confidenceScore).toBeGreaterThanOrEqual(0.55);
    expect(confidenceScore).toBeLessThanOrEqual(1.0);
  });
});