import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能 - AIRecommendationEngine統合', () => {
  // SCEN-568
  test('AIRecommendationEngine呼び出しが成功するときに生成された推奨提案が返される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-12345',
        proposalApproach: '顧客のコスト削減ニーズに基づいた段階導入アプローチ',
        successPatternId: 'PATTERN-789',
        confidenceScore: 0.87,
        reasoning: '過去12件の類似案件で85%の成約率を達成'
      })
    };

    const customerInfo = {
      industry: '製造業',
      employeeCount: 500,
      challenge: '業務効率化'
    };

    const dealConditions = {
      budget: 5000000,
      implementationPeriod: 3
    };

    const result = await generateRecommendation(
      customerInfo,
      dealConditions,
      mockAIEngine
    );

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      customerInfo,
      dealConditions
    );

    expect(result.recommendationId).toBe('REC-12345');
    expect(result.proposalApproach).toBe('顧客のコスト削減ニーズに基づいた段階導入アプローチ');
    expect(result.successPatternId).toBe('PATTERN-789');
    expect(result.confidenceScore).toBe(0.87);
    expect(result.reasoning).toBe('過去12件の類似案件で85%の成約率を達成');
  });
});