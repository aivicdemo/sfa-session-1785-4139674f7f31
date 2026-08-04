import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  test("SCEN-1544: [normal] 成功パターン抽出と提案アプローチ自動推奨 - 過去商談データから1つの成功パターンが抽出される場合、その1つが新規案件条件との照合対象となる", () => {
    const mockSuccessPattern = {
      patternId: "SUC-2024-001",
      industry: "SaaS",
      dealSize: "large",
      successFactors: [
        "初期段階での経営層巻き込み",
        "導入効果の可視化"
      ],
      successRate: 0.85
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([mockSuccessPattern]),
      generateRecommendation: jest.fn().mockReturnValue({
        patternId: "SUC-2024-001",
        approachName: "初期段階での経営層巻き込みアプローチ",
        description: "初期段階での経営層巻き込みアプローチを採用してください。類似事例での成功率85%",
        successRate: 0.85,
        basedOnPatternCount: 1
      }),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        patternId: "SUC-2024-001",
        relevanceScore: 0.85,
        isApplicable: true
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        "SaaS業界の大規模商談において、初期段階での経営層巻き込みが成功の鍵となっています。"
      )
    };

    const newDealCondition = {
      customerIndustry: "SaaS",
      dealSize: "large",
      customerChallenge: "業務効率化"
    };

    const result = generateRecommendation(newDealCondition, mockAIEngine);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealCondition);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(mockSuccessPattern, newDealCondition);

    const evaluateCall = mockAIEngine.evaluatePatternRelevance.mock.calls[0];
    expect(evaluateCall[0].patternId).toBe("SUC-2024-001");

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);

    expect(result).toBeDefined();
    expect(result.patternId).toBe("SUC-2024-001");
    expect(result.approachName).toBe("初期段階での経営層巻き込みアプローチ");
    expect(result.description).toBe("初期段階での経営層巻き込みアプローチを採用してください。類似事例での成功率85%");
    expect(result.successRate).toBe(0.85);
    expect(result.basedOnPatternCount).toBe(1);

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(1);
  });
});