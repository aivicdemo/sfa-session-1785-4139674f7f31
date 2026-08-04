import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案アプローチ推奨機能", () => {
  // SCEN-1805
  test("提案アプローチが複数回生成されても同じ結果が返却される（べき等性）", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "顧客の経営課題解決型提案",
        reasoningExplanation:
          "過去の類似案件で同業種・同規模の企業に対して、経営課題解決型の提案が73%の成約率を達成している",
        recommendationScore: 85,
        recommendedPatternId: "PATTERN_ECH_001",
        successExamples: [
          {
            caseId: "CASE_2024_0142",
            industryType: "製造業",
            companyScale: "中堅企業",
            adoptionRate: 0.73,
          },
        ],
      }),
    };

    const newDealData = {
      customerId: "CUST_20250115_001",
      customerName: "テスト企業A",
      industryType: "製造業",
      companyScale: "中堅企業",
      businessChallenge: "デジタル化推進",
      estimatedBudget: 5000000,
      dealStage: "初期商談",
    };

    const firstRecommendation = generateRecommendation(newDealData, mockAIEngine);
    const secondRecommendation = generateRecommendation(
      newDealData,
      mockAIEngine
    );
    const thirdRecommendation = generateRecommendation(newDealData, mockAIEngine);

    expect(firstRecommendation).toEqual(secondRecommendation);
    expect(secondRecommendation).toEqual(thirdRecommendation);
    expect(firstRecommendation.recommendedApproach).toBe(
      "顧客の経営課題解決型提案"
    );
    expect(firstRecommendation.reasoningExplanation).toBe(
      "過去の類似案件で同業種・同規模の企業に対して、経営課題解決型の提案が73%の成約率を達成している"
    );
    expect(firstRecommendation.recommendationScore).toBe(85);
    expect(firstRecommendation.recommendedPatternId).toBe("PATTERN_ECH_001");
    expect(firstRecommendation.successExamples).toHaveLength(1);
    expect(firstRecommendation.successExamples[0].caseId).toBe(
      "CASE_2024_0142"
    );
    expect(firstRecommendation.successExamples[0].industryType).toBe(
      "製造業"
    );
    expect(firstRecommendation.successExamples[0].companyScale).toBe(
      "中堅企業"
    );
    expect(firstRecommendation.successExamples[0].adoptionRate).toBe(0.73);
  });
});