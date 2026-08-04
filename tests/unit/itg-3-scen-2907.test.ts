import { 
  generateRecommendationAcrossYearBoundary 
} from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-2907: 推奨の生成対象期間の判定 - 年度境界の正確な処理", () => {
    // テスト対象期間：年度をまたぐ日付範囲（前年度末日から当年度初日）
    const fiscalYearBoundaryStartDate = new Date("2024-03-31T23:59:59Z");
    const fiscalYearBoundaryEndDate = new Date("2024-04-01T00:00:00Z");
    
    // 前年度に属する成功事例（2024年3月15日）
    const previousFiscalYearDealData = {
      dealId: "deal-prev-fy-001",
      customerId: "cust-001",
      dealDate: new Date("2024-03-15T10:00:00Z"),
      dealAmount: 5000000,
      dealStatus: "won",
      fiscalYear: 2023,
      successPattern: "pattern-a",
      successFactors: ["factor-1", "factor-2"],
    };

    // 当年度に属する成功事例（2024年4月10日）
    const currentFiscalYearDealData = {
      dealId: "deal-curr-fy-001",
      customerId: "cust-002",
      dealDate: new Date("2024-04-10T14:30:00Z"),
      dealAmount: 3500000,
      dealStatus: "won",
      fiscalYear: 2024,
      successPattern: "pattern-b",
      successFactors: ["factor-3", "factor-4"],
    };

    // 年度境界の正確な時点を挟むテストデータ
    const boundaryEdgeCaseData = [
      {
        dealId: "deal-boundary-edge-001",
        dealDate: new Date("2024-03-31T23:59:59Z"),
        fiscalYear: 2023,
        classification: "previous",
      },
      {
        dealId: "deal-boundary-edge-002",
        dealDate: new Date("2024-04-01T00:00:00Z"),
        fiscalYear: 2024,
        classification: "current",
      },
    ];

    // AIRecommendationEngineのスタブ
    // 年度判定ロジック：4月1日～翌年3月31日を1年度とする
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn((input) => {
        const deals = input.dealsWithinPeriod;
        const previousFYDeals = deals.filter((d) => d.fiscalYear === 2023);
        const currentFYDeals = deals.filter((d) => d.fiscalYear === 2024);
        
        return {
          recommendedApproach: "combined-pattern",
          confidenceScore: 85,
          previousFiscalYearPatterns: previousFYDeals.map((d) => ({
            dealId: d.dealId,
            pattern: d.successPattern,
            yearClassification: "previous",
          })),
          currentFiscalYearPatterns: currentFYDeals.map((d) => ({
            dealId: d.dealId,
            pattern: d.successPattern,
            yearClassification: "current",
          })),
          totalPatternsExtracted: previousFYDeals.length + currentFYDeals.length,
        };
      }),
      evaluatePatternRelevance: jest.fn((pattern, dealData) => {
        return {
          isRelevant: true,
          relevanceScore: 92,
          yearClassification:
            dealData.fiscalYear === 2023 ? "previous" : "current",
        };
      }),
    };

    // 推奨パターンマスタのキャッシュデータ
    const recommendationPatternCache = {
      previousFY: [previousFiscalYearDealData],
      currentFY: [currentFiscalYearDealData],
      boundary: boundaryEdgeCaseData,
    };

    // 検証対象期間判定メソッドの呼び出し
    const input = {
      periodStartDate: fiscalYearBoundaryStartDate,
      periodEndDate: new Date("2024-06-30T23:59:59Z"),
      dealsWithinPeriod: [
        previousFiscalYearDealData,
        currentFiscalYearDealData,
        ...boundaryEdgeCaseData,
      ],
      recommendationPatternCache,
      aiEngine: mockAIRecommendationEngine,
    };

    const result = generateRecommendationAcrossYearBoundary(input);

    // 前年度のデータが『前年度』として分類されていることを確認
    expect(result.previousFiscalYearPatterns).toHaveLength(2);
    expect(result.previousFiscalYearPatterns[0].dealId).toBe("deal-prev-fy-001");
    expect(result.previousFiscalYearPatterns[1].dealId).toBe(
      "deal-boundary-edge-001"
    );
    expect(result.previousFiscalYearPatterns[0].yearClassification).toBe(
      "previous"
    );

    // 当年度のデータが『当年度』として分類されていることを確認
    expect(result.currentFiscalYearPatterns).toHaveLength(2);
    expect(result.currentFiscalYearPatterns[0].dealId).toBe("deal-curr-fy-001");
    expect(result.currentFiscalYearPatterns[1].dealId).toBe(
      "deal-boundary-edge-002"
    );
    expect(result.currentFiscalYearPatterns[0].yearClassification).toBe(
      "current"
    );

    // 年度境界日（2024年3月31日23:59:59と2024年4月1日00:00:00）の
    // データがそれぞれ正しい年度に属していることを確認
    const previousBoundaryData = result.previousFiscalYearPatterns.find(
      (p) => p.dealId === "deal-boundary-edge-001"
    );
    const currentBoundaryData = result.currentFiscalYearPatterns.find(
      (p) => p.dealId === "deal-boundary-edge-002"
    );

    expect(previousBoundaryData).toBeDefined();
    expect(previousBoundaryData.yearClassification).toBe("previous");
    expect(currentBoundaryData).toBeDefined();
    expect(currentBoundaryData.yearClassification).toBe("current");

    // 推奨パターンマスタ内のキャッシュデータが
    // 同じ年度判定ロジックで分類されていることを確認
    expect(result.cacheClassification.previousFY).toHaveLength(1);
    expect(result.cacheClassification.currentFY).toHaveLength(1);
    expect(result.cacheClassification.boundary).toHaveLength(2);

    // 前年度の成功パターンと当年度の成功パターンが
    // 推奨生成時に統合可能な状態で取得されたことを確認
    expect(result.totalPatternsExtracted).toBe(4);
    expect(result.recommendedApproach).toBe("combined-pattern");
    expect(result.confidenceScore).toBe(85);

    // AIRecommendationEngineのスタブが両年度のパターンを
    // 正しい年度属性で受け取ったことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalled();
    const callArgs =
      mockAIRecommendationEngine.generateRecommendation.mock.calls[0][0];
    expect(callArgs.dealsWithinPeriod).toHaveLength(4);

    const passedPreviousFYDeals = callArgs.dealsWithinPeriod.filter(
      (d) => d.fiscalYear === 2023
    );
    const passedCurrentFYDeals = callArgs.dealsWithinPeriod.filter(
      (d) => d.fiscalYear === 2024
    );

    expect(passedPreviousFYDeals).toHaveLength(2);
    expect(passedCurrentFYDeals).toHaveLength(2);

    // 年度判定の正確性を最終確認
    expect(result.yearBoundaryProcessingStatus).toBe("success");
    expect(result.isYearBoundaryCrossed).toBe(true);
  });
});