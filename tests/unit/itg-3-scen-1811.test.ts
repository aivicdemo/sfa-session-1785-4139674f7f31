import { generateRecommendation } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-1811: 推奨内容の根拠説明機能 - 根拠説明に過去成功事例の概要が含まれる", () => {
    // Arrange: AIRecommendationEngine のスタブ準備
    const mockSimilarPattern1 = {
      caseId: "case_001",
      customerIndustry: "製造業",
      dealDurationMonths: 3,
      contractAmount: 5000000,
      successFactor: "導入効果の数値化",
    };

    const mockSimilarPattern2 = {
      caseId: "case_002",
      customerIndustry: "製造業",
      dealDurationMonths: 3,
      contractAmount: 4800000,
      successFactor: "初期ヒアリングで生産効率課題を特定",
    };

    const mockSimilarPattern3 = {
      caseId: "case_003",
      customerIndustry: "製造業",
      dealDurationMonths: 2,
      contractAmount: 5200000,
      successFactor: "ROI試算を提示することで信頼を獲得",
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        mockSimilarPattern1,
        mockSimilarPattern2,
        mockSimilarPattern3,
      ]),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(
          "類似業種の成功事例では、初期ヒアリングで顧客の生産効率課題を特定し、ROI試算を提示することで信頼を獲得。本案件も同じアプローチで成約確度を高められます"
        ),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      customerName: "製造業A社",
      customerIndustry: "製造業",
      estimatedDealDurationMonths: 2,
      dealStage: "initial_inquiry",
    };

    // Act: generateRecommendation メソッドを呼び出す
    const recommendationResult = generateRecommendation(
      newDealData,
      mockAIEngine
    );

    // Assert: 推奨内容の根拠説明が3要素を全て含むことを確認
    expect(recommendationResult).toBeDefined();
    expect(recommendationResult.reasoningExplanation).toBeDefined();

    const reasoningExplanation = recommendationResult.reasoningExplanation;

    // (1) 過去成功事例の顧客業種『製造業』が含まれている
    expect(reasoningExplanation).toMatch(/製造業/);

    // (2) 過去事例での成功要因『初期ヒアリングで生産効率課題を特定』が含まれている
    expect(reasoningExplanation).toMatch(/初期ヒアリング/);
    expect(reasoningExplanation).toMatch(/生産効率課題/);
    expect(reasoningExplanation).toMatch(/特定/);

    // (3) 本案件への適用方法『同じアプローチで成約確度を高める』が含まれている
    expect(reasoningExplanation).toMatch(/同じアプローチ/);
    expect(reasoningExplanation).toMatch(/成約確度/);
    expect(reasoningExplanation).toMatch(/高/);

    // 根拠説明が営業担当者向けの自然言語で記述されていることを確認
    expect(typeof reasoningExplanation).toBe("string");
    expect(reasoningExplanation.length).toBeGreaterThan(0);

    // 具体的な根拠が説明されていることを確認
    expect(reasoningExplanation).toContain("ROI試算");
  });
});