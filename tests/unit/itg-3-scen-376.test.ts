import { verifyRecommendationAccuracy } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨精度検証機能 - 重複を含む過去商談データの処理", () => {
  test("SCEN-376: 重複を含む過去商談データから成功パターンが正常に抽出され、精度スコアが計測される", () => {
    // テストデータ：重複を含む過去商談パターン（5件中3件が同一内容）
    const duplicatePatterns = [
      {
        patternId: "pattern_001",
        customerId: "cust_A",
        productId: "prod_X",
        success: true,
        dealValue: 1000000,
        dealDuration: 90,
      },
      {
        patternId: "pattern_002",
        customerId: "cust_A",
        productId: "prod_X",
        success: true,
        dealValue: 1000000,
        dealDuration: 90,
      },
      {
        patternId: "pattern_003",
        customerId: "cust_A",
        productId: "prod_X",
        success: true,
        dealValue: 1000000,
        dealDuration: 90,
      },
      {
        patternId: "pattern_004",
        customerId: "cust_B",
        productId: "prod_Y",
        success: true,
        dealValue: 500000,
        dealDuration: 60,
      },
      {
        patternId: "pattern_005",
        customerId: "cust_C",
        productId: "prod_Z",
        success: true,
        dealValue: 750000,
        dealDuration: 75,
      },
    ];

    // 新規案件の条件
    const newDealCondition = {
      customerId: "cust_D",
      industry: "IT",
      companySize: "mid",
      budget: 1200000,
    };

    // AIRecommendationEngineのスタブ実装
    const aiRecommendationEngineStub = {
      findSimilarPatterns: jest.fn().mockReturnValue(duplicatePatterns),
      evaluatePatternRelevance: jest.fn((patterns: any[]) => {
        // 重複排除後の一意パターン数に基づいて精度スコアを計算
        const uniquePatterns = Array.from(
          new Map(
            patterns.map((p) => [
              JSON.stringify({
                customerId: p.customerId,
                productId: p.productId,
                dealValue: p.dealValue,
                dealDuration: p.dealDuration,
              }),
              p,
            ])
          ).values()
        );
        const deduplicatedCount = uniquePatterns.length;
        const accuracyScore = Math.max(
          0.85,
          1.0 - (duplicatePatterns.length - deduplicatedCount) / 10
        );
        return {
          appliedPatternCount: deduplicatedCount,
          deduplicatedCount: duplicatePatterns.length - deduplicatedCount,
          accuracyScore: accuracyScore,
        };
      }),
    };

    // 推奨精度検証機能を実行
    const result = verifyRecommendationAccuracy(
      newDealCondition,
      aiRecommendationEngineStub
    );

    // 検証：適用パターン数が3であること
    expect(result.appliedPatternCount).toBe(3);

    // 検証：重複排除数が2であること
    expect(result.deduplicatedCount).toBe(2);

    // 検証：最終精度スコアが0.85以上であること
    expect(result.accuracyScore).toBeGreaterThanOrEqual(0.85);

    // 検証：完了ステータスが「成功」であること
    expect(result.status).toBe("success");

    // 検証：エラーログが存在しないこと
    expect(result.errorLog).toBeUndefined();

    // 検証：AIRecommendationEngineのメソッドが期待通りに呼ばれたこと
    expect(aiRecommendationEngineStub.findSimilarPatterns).toHaveBeenCalledWith(
      newDealCondition
    );
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).toHaveBeenCalled();
  });
});