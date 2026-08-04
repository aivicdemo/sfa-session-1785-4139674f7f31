import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1955
  test('成功パターンマスタが欠落しているときにパターン照合がスキップされる', () => {
    const dealCondition = {
      customerId: 'CUST-001',
      dealAmount: 5000000,
      industry: '製造業',
    };

    const mockPatternMaster = null;

    const mockAIEngine = {
      findSimilarPatterns: jest.fn(),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockCachedRecommendations = [
      {
        recommendationId: 'REC-CACHE-001',
        dealId: 'DEAL-9001',
        approach: '既存顧客との関係強化による段階的提案',
        confidence: 75,
        timestamp: '2024-01-10T14:30:00Z',
      },
      {
        recommendationId: 'REC-CACHE-002',
        dealId: 'DEAL-9002',
        approach: '製造業向けコスト削減ソリューション提案',
        confidence: 68,
        timestamp: '2024-01-09T10:15:00Z',
      },
    ];

    const result = findSimilarPatterns(
      dealCondition,
      mockPatternMaster,
      mockAIEngine,
      mockCachedRecommendations
    );

    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();

    expect(result).toEqual({
      isSkipped: true,
      message: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      cachedRecommendations: mockCachedRecommendations,
      patterns: [],
      error: null,
    });

    expect(result.cachedRecommendations).toHaveLength(2);
    expect(result.cachedRecommendations[0].confidence).toBe(75);
    expect(result.cachedRecommendations[1].approach).toContain('製造業');
  });
});