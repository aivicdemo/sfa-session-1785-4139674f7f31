import { findSimilarPatterns, evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1526
  test('類似顧客マッチング処理 - 過去の類似顧客パターンが1件のみ存在する場合、その1件に対して一致度スコアが数値化される', async () => {
    const newDealCondition = {
      customerName: 'テスト太郎商社',
      industry: '製造業',
      budgetSize: 5000000,
      dealStage: '提案準備'
    };

    const mockSimilarPattern = {
      pastDealId: 'DEAL-20240101-001',
      customerName: 'テスト太郎商社グループ',
      industry: '製造業',
      budgetSize: 4800000,
      dealStage: '提案準備',
      successFlag: true,
      completionDate: '2024-06-15'
    };

    const mockAiRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([mockSimilarPattern]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        pastDealId: 'DEAL-20240101-001',
        relevanceScore: 0.85,
        reasoning: {
          industryMatch: '業界が完全に一致（製造業）',
          budgetSizeMatch: '予算規模が98%一致（過去480万、現在500万）',
          dealStageMatch: 'ディール段階が完全に一致（提案準備）'
        }
      })
    };

    const similarPatterns = await findSimilarPatterns(
      newDealCondition,
      mockAiRecommendationEngine
    );

    expect(similarPatterns).toHaveLength(1);
    expect(similarPatterns[0]).toEqual(mockSimilarPattern);

    const evaluationResult = await evaluatePatternRelevance(
      mockSimilarPattern,
      newDealCondition,
      mockAiRecommendationEngine
    );

    expect(evaluationResult.relevanceScore).toBe(0.85);
    expect(typeof evaluationResult.relevanceScore).toBe('number');
    expect(evaluationResult.relevanceScore).toBeGreaterThanOrEqual(0.0);
    expect(evaluationResult.relevanceScore).toBeLessThanOrEqual(1.0);
    expect(evaluationResult.reasoning).toBeDefined();
    expect(evaluationResult.reasoning.industryMatch).toBe('業界が完全に一致（製造業）');
    expect(evaluationResult.reasoning.budgetSizeMatch).toBe('予算規模が98%一致（過去480万、現在500万）');
    expect(evaluationResult.reasoning.dealStageMatch).toBe('ディール段階が完全に一致（提案準備）');
  });
});