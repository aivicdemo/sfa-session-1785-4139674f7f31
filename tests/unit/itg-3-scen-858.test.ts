import { calculateTrustScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-858
  test("推奨根拠データが0件のとき信頼度スコアが0と算出される", async () => {
    const emptyRecommendationBases: Array<{
      baseId: string;
      evidenceType: string;
      relevanceScore: number;
    }> = [];

    const trustScore = await calculateTrustScore(emptyRecommendationBases);

    expect(trustScore).toBe(0);
  });
});