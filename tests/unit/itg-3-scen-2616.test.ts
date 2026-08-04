import { displayRecommendationRationale } from "../../src/logic/it-1-br-3-2-1-1";

describe("推奨内容の根拠表示機能", () => {
  test("SCEN-2616: 推奨提案アプローチの根拠データから過去成約率が計算され、その値が表示される", () => {
    // テストデータ: 過去成約事例を含むモック商談データ
    const mockSimilarPatterns = [
      {
        patternId: "pattern_001",
        customerIndustry: "製造業",
        dealSize: 5000000,
        proposalType: "システム導入",
        closedWon: true,
        closedDate: "2024-01-15",
      },
      {
        patternId: "pattern_002",
        customerIndustry: "製造業",
        dealSize: 4500000,
        proposalType: "システム導入",
        closedWon: true,
        closedDate: "2024-02-10",
      },
      {
        patternId: "pattern_003",
        customerIndustry: "製造業",
        dealSize: 5200000,
        proposalType: "システム導入",
        closedWon: true,
        closedDate: "2024-03-05",
      },
      {
        patternId: "pattern_004",
        customerIndustry: "製造業",
        dealSize: 4800000,
        proposalType: "システム導入",
        closedWon: true,
        closedDate: "2024-04-20",
      },
      {
        patternId: "pattern_005",
        customerIndustry: "製造業",
        dealSize: 5100000,
        proposalType: "システム導入",
        closedWon: false,
        closedDate: "2024-05-30",
      },
    ];

    // モック化されたAIRecommendationEngine
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue(mockSimilarPatterns),
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation((pattern: typeof mockSimilarPatterns[0]) => {
          return {
            patternId: pattern.patternId,
            relevanceScore: 0.85,
          };
        }),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // 現在の商談条件
    const currentDealCondition = {
      customerId: "cust_12345",
      customerIndustry: "製造業",
      dealSize: 5000000,
      proposalType: "システム導入",
    };

    // 推奨内容の根拠表示機能を呼び出し
    const result = displayRecommendationRationale(
      currentDealCondition,
      mockAIRecommendationEngine
    );

    // 成約した事例: 5件中4件 → 成約率 = 4 / 5 = 0.8 = 80.0%
    const expectedClosureRate = 80.0;

    // 根拠表示領域に「成約率: 80.0%」の形式で正確に表示されていることを確認
    expect(result.rationale).toBeDefined();
    expect(result.rationale.closureRate).toBe(expectedClosureRate);
    expect(result.rationale.displayText).toMatch(/成約率:\s*80\.0%/);

    // 根拠データが正確に計算されたことを検証
    expect(result.rationale.totalSimilarPatterns).toBe(5);
    expect(result.rationale.closedWonPatterns).toBe(4);

    // AIRecommendationEngineが正しく呼び出されたことを確認
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      currentDealCondition
    );
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});