import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

const mockAIRecommendationEngine = {
  findSimilarPatterns: jest.fn(),
  evaluatePatternRelevance: jest.fn(),
  explainRecommendationReasoning: jest.fn(),
};

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-162: 複数の根拠情報から統合された説明文が生成される", () => {
    const similarPatterns = [
      {
        patternId: "pattern_A",
        customerSize: "mid_enterprise",
        industry: "manufacturing",
        implementationPeriodMonths: 3,
        similarityScore: 0.92,
        adoptionRate: 0.88,
      },
      {
        patternId: "pattern_B",
        customerSize: "large_enterprise",
        industry: "manufacturing",
        implementationPeriodMonths: 6,
        similarityScore: 0.88,
        adoptionRate: 0.82,
      },
      {
        patternId: "pattern_C",
        customerSize: "mid_enterprise",
        industry: "manufacturing",
        implementationPeriodMonths: 1,
        similarityScore: 0.85,
        adoptionRate: 0.85,
      },
    ];

    const patternRelevanceScores = {
      pattern_A: 0.9,
      pattern_B: 0.82,
      pattern_C: 0.88,
    };

    const reasoningBases = {
      basis_1: "類似度92%の過去案件で同様の顧客規模かつ同一業界での成功実績あり",
      basis_2: "提案アプローチ「段階的導入」は同規模顧客で採用率88%",
      basis_3: "初期接触から提案までのリードタイム短縮により成約率が15%向上",
    };

    mockAIRecommendationEngine.findSimilarPatterns.mockReturnValue(
      similarPatterns
    );

    mockAIRecommendationEngine.evaluatePatternRelevance.mockImplementation(
      (patternId: string) => patternRelevanceScores[patternId]
    );

    mockAIRecommendationEngine.explainRecommendationReasoning.mockReturnValue(
      reasoningBases
    );

    const dealCondition = {
      customerName: "テスト会社X",
      industry: "manufacturing",
      employeeCount: 250,
      businessChallenge: "業務効率化",
    };

    const generatedExplanation = explainRecommendationReasoning(
      dealCondition,
      mockAIRecommendationEngine
    );

    expect(generatedExplanation).toBeDefined();
    expect(typeof generatedExplanation).toBe("string");

    expect(generatedExplanation).toContain("テスト会社X");
    expect(generatedExplanation).toContain("92%");
    expect(generatedExplanation).toContain("類似度");
    expect(generatedExplanation).toContain("段階的導入");
    expect(generatedExplanation).toContain("88%");
    expect(generatedExplanation).toContain("採用率");
    expect(generatedExplanation).toContain("リードタイム");
    expect(generatedExplanation).toContain("15%");
    expect(generatedExplanation).toContain("成約率");

    const basisCount = (generatedExplanation.match(/実績|導入|短縮/g) || [])
      .length;
    expect(basisCount).toBeGreaterThanOrEqual(3);

    expect(generatedExplanation).toMatch(/因果|により|実績/);
  });
});