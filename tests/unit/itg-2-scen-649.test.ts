import { visualizeRecommendationBasis } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-649
  test("推奨根拠が1件のとき、その根拠が正しく構成されること", () => {
    const mockRecommendationBasisData = {
      id: "001",
      recommendationId: "REC-123",
      reason: "売上成長率が業界平均を超過",
      dataSource: "売上レポート",
      confidence: 0.95,
    };

    const result = visualizeRecommendationBasis([mockRecommendationBasisData]);

    expect(result).toEqual([
      {
        id: "001",
        recommendationId: "REC-123",
        reason: "売上成長率が業界平均を超過",
        dataSource: "売上レポート",
        confidence: 0.95,
      },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("001");
    expect(result[0].recommendationId).toBe("REC-123");
    expect(result[0].reason).toBe("売上成長率が業界平均を超過");
    expect(result[0].dataSource).toBe("売上レポート");
    expect(result[0].confidence).toBe(0.95);
  });
});