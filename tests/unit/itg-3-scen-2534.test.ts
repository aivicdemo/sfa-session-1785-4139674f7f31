import { generateSuccessPatternTemplate } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・構造化機能", () => {
  // SCEN-2534
  test("営業プロセスステップが0件のとき、テンプレートに空のステップ配列が生成される", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "REC-20240115-001",
        generatedAt: new Date("2024-01-15T11:00:00Z"),
        proposalApproach: "顧客企業のデジタル化課題に対応したクラウド導入提案",
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          caseId: "CASE-2023-001",
          successRate: 0.85,
          customerIndustry: "製造業",
          solutionCategory: "クラウド基盤",
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        "過去の製造業顧客のクラウド導入成功事例から、同一業種の顧客に対する提案アプローチを推奨"
      ),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 78,
        applicabilityIndicators: ["customer_size_match", "industry_alignment"],
      }),
    };

    const inputData = {
      dealId: "DEAL-20240115-A",
      customerId: "CUST-2024-001",
      customerIndustry: "製造業",
      customerSize: "大企業",
      currentChallenge: "デジタル化推進",
      processSteps: [],
    };

    const result = generateSuccessPatternTemplate(inputData, mockAIEngine);

    expect(result).toBeDefined();
    expect(result.recommendationId).toBe("REC-20240115-001");
    expect(result.generatedAt).toEqual(new Date("2024-01-15T11:00:00Z"));
    expect(result.proposalApproach).toBe(
      "顧客企業のデジタル化課題に対応したクラウド導入提案"
    );
    expect(result.processSteps).toEqual([]);
    expect(Array.isArray(result.processSteps)).toBe(true);
    expect(result.processSteps.length).toBe(0);
    expect(result.recommendationReasoning).toBe(
      "過去の製造業顧客のクラウド導入成功事例から、同一業種の顧客に対する提案アプローチを推奨"
    );
    expect(result.relevanceScore).toBe(78);
  });
});