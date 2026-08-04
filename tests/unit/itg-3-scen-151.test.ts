import { generateRecommendation, explainRecommendationReasoning } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能 - 成功パターンマッチング', () => {
  test('SCEN-151: 顧客条件が完全に一致する成功パターンが推奨される', () => {
    // Setup: テストデータの成功パターン
    const successPatternId = 'pattern_001';
    const successPattern = {
      id: successPatternId,
      customerScale: 'large_enterprise',
      industry: 'finance',
      budgetMin: 10000000,
      budgetMax: 50000000,
      implementationPeriodDays: 90,
      approachName: '金融大企業向けの標準化ソリューション導入パッケージ',
      successRate: 0.92,
    };

    // Setup: 新規案件の条件
    const newOpportunity = {
      customerId: 'new_cust_001',
      customerScale: 'large_enterprise',
      industry: 'finance',
      budget: 12000000,
      implementationPeriodDays: 60,
    };

    // Setup: AIRecommendationEngineのスタブ
    const aiEngineStub = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          pattern: successPattern,
          relevanceScore: 0.95,
        },
      ]),
      generateRecommendation: jest.fn().mockReturnValue({
        recommendedApproach: '金融大企業向けの標準化ソリューション導入パッケージ',
        confidenceScore: 92,
        matchedPatternId: successPatternId,
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        reasoning:
          '過去事例との一致度95%以上。同一業種・規模・予算帯で3ヶ月以内の導入実績あり。推奨アプローチの成功確度が高い',
        supportingData: {
          matchScore: 0.95,
          similarCasesCount: 1,
          successRateOfPattern: 0.92,
        },
      }),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.95),
    };

    // Execute: generateRecommendationを呼び出し
    const recommendationResult = generateRecommendation(newOpportunity, aiEngineStub);

    // Verify: 推奨内容の検証
    expect(recommendationResult.recommendedApproach).toBe(
      '金融大企業向けの標準化ソリューション導入パッケージ'
    );
    expect(recommendationResult.confidenceScore).toBe(92);
    expect(recommendationResult.matchedPatternId).toBe(successPatternId);

    // Execute: explainRecommendationReasoningを呼び出し
    const reasoningResult = explainRecommendationReasoning(
      recommendationResult,
      aiEngineStub
    );

    // Verify: 根拠説明の検証
    expect(reasoningResult.reasoning).toBe(
      '過去事例との一致度95%以上。同一業種・規模・予算帯で3ヶ月以内の導入実績あり。推奨アプローチの成功確度が高い'
    );
    expect(reasoningResult.supportingData.matchScore).toBe(0.95);
    expect(reasoningResult.supportingData.successRateOfPattern).toBe(0.92);
    expect(reasoningResult.supportingData.similarCasesCount).toBe(1);

    // Verify: AIエンジンの呼び出しが期待通り行われたか確認
    expect(aiEngineStub.findSimilarPatterns).toHaveBeenCalledWith(newOpportunity);
    expect(aiEngineStub.generateRecommendation).toHaveBeenCalled();
    expect(aiEngineStub.explainRecommendationReasoning).toHaveBeenCalled();
  });
});