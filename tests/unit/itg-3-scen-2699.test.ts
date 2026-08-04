import { evaluatePatternApplicability } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨ロジック - 成功パターン適用優先度判定', () => {
  test('SCEN-2699: evaluatePatternRelevanceスコア100時に最高優先度が返却される', () => {
    // Arrange: AIRecommendationEngineのスタブ準備
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 100,
        relevanceLevel: 'maximum',
        timestamp: '2024-01-15T11:00:00Z',
      }),
    };

    const successPatternInput = {
      patternId: 'pattern-sp-001',
      customerId: 'cust-12345',
      industryCode: '5411',
      companySize: 'medium',
      dealAmount: 5000000,
      dealStage: 'proposal',
      successPatternName: '大規模案件の段階的提案アプローチ',
      approachDescription: '顧客の予算確保プロセスに合わせた3段階提案',
      historicalSuccessCount: 12,
      successRate: 0.92,
    };

    const newDealCondition = {
      customerId: 'cust-67890',
      industryCode: '5411',
      companySize: 'medium',
      estimatedDealAmount: 4800000,
      currentStage: 'initial_contact',
      customerBudgetSituation: 'fiscalYearEnd',
      decisionMakerCount: 4,
    };

    // Act: 推奨ロジック実行
    const result = evaluatePatternApplicability(
      successPatternInput,
      newDealCondition,
      mockAIRecommendationEngine
    );

    // Assert: evaluatePatternRelevanceが呼び出されたことを確認
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        patternId: 'pattern-sp-001',
        customerId: 'cust-67890',
      })
    );

    // Assert: スコアが100であることを確認
    expect(result.relevanceScore).toBe(100);

    // Assert: 適用優先度が最高（1）として判定されること
    expect(result.applicationPriority).toBe(1);
    expect(result.priorityLevel).toBe('highest');

    // Assert: 成功パターンが最上位に分類されることを確認
    expect(result.priorityRanking).toBe('rank_1_maximum');
    expect(result.isHighestPriority).toBe(true);
    expect(result.recommendationStatus).toBe('apply_immediately');
  });
});