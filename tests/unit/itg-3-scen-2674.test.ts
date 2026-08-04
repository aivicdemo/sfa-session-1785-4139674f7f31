import { visualizeRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2674
  test("適用成功パターンが1件のとき、その1件の根拠が営業担当者向けに自然言語で出力される", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        "この顧客は過去の成功事例の業界・規模・課題に合致し、提案内容Aが80%の確度で受注につながる見込みです。理由は以下の通りです：1)類似した業界での過去3件の成功事例がある 2)顧客の予算規模が過去成功事例の平均値と一致している"
      ),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        patternId: "pattern-001",
        relevanceScore: 80,
      }),
    };

    const newProjectData = {
      customerId: "cust-12345",
      customerIndustry: "製造業",
      customerSize: "大企業",
      dealAmount: 50000000,
      dealDescription: "業務効率化ソリューション導入",
    };

    const applicablePattern = {
      patternId: "pattern-001",
      successRate: 0.8,
      industryMatch: "製造業",
      sizeMatch: "大企業",
    };

    const result = visualizeRecommendationReasoning(
      newProjectData,
      [applicablePattern],
      mockAIEngine
    );

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      newProjectData,
      applicablePattern
    );

    expect(result).toEqual({
      reasoningText:
        "この顧客は過去の成功事例の業界・規模・課題に合致し、提案内容Aが80%の確度で受注につながる見込みです。理由は以下の通りです：1)類似した業界での過去3件の成功事例がある 2)顧客の予算規模が過去成功事例の平均値と一致している",
      patternCount: 1,
      displayFormat: "営業担当者向け自然言語",
    });
  });
});