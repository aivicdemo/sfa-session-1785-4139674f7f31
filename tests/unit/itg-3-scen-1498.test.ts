import { evaluatePurchaseHistoryDataQuality } from "../../src/logic/it-1-br-3-3-2-1";

describe("購買履歴データ品質判定機能", () => {
  test("SCEN-1498: 品質スコア61で学習データ利用可と判定される", () => {
    const mockPurchaseHistoryData = {
      customerId: "CUST-20240115-001",
      purchaseDate: "2024-01-15",
      productCategory: "software",
      amount: 150000,
      quantity: 1,
      completenessScore: 95,
      consistencyScore: 92,
      accuracyScore: 88,
      overallQualityScore: 61,
    };

    const result = evaluatePurchaseHistoryDataQuality(mockPurchaseHistoryData);

    expect(result.isUsableForLearning).toBe(true);
    expect(result.qualityScore).toBe(61);
    expect(result.canUseForLearning).toBe(true);
    expect(result.reasoning).toBe(
      "品質スコアが最小閾値(60)を超過しており、学習モデルの入力データとして適切である"
    );
  });
});