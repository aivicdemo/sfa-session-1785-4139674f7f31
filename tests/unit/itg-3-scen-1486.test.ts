import { evaluateRecommendationWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1486: AIRecommendationEngineが応答不可のとき代替処理へ遷移する', async () => {
    const customerId = 'CUST-001';
    const dealCondition = {
      industry: 'manufacturing',
      companySize: 'large',
      budget: 5000000,
      timeline: 'Q2',
    };
    const purchaseHistory = [
      {
        productId: 'PROD-A',
        purchaseDate: '2024-01-15',
        quantity: 100,
        unitPrice: 10000,
      },
      {
        productId: 'PROD-B',
        purchaseDate: '2024-02-20',
        quantity: 50,
        unitPrice: 20000,
      },
    ];

    const mockAIEngine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('Timeout'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Service unavailable')),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFallbackPatterns = [
      {
        patternId: 'PATTERN-001',
        successRate: 0.92,
        description: 'Large manufacturing with Q2 timeline - direct engagement',
        reasoning: 'Historical pattern: Similar companies achieved 92% success rate with this approach',
      },
      {
        patternId: 'PATTERN-002',
        successRate: 0.85,
        description: 'Budget-focused negotiation strategy',
        reasoning: 'Top pattern from recommendation master based on statistical analysis',
      },
    ];

    const result = await evaluateRecommendationWithFallback(
      customerId,
      dealCondition,
      purchaseHistory,
      mockAIEngine,
      mockFallbackPatterns,
    );

    expect(result.isFromFallback).toBe(true);
    expect(result.retryCount).toBe(3);
    expect(result.recommendation.patternId).toBe('PATTERN-001');
    expect(result.recommendation.successRate).toBe(0.92);
    expect(result.recommendation.description).toBe('Large manufacturing with Q2 timeline - direct engagement');
    expect(result.explanation).toBe('Historical pattern: Similar companies achieved 92% success rate with this approach');
    expect(result.userMessage).toBe('推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します');
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
  });
});