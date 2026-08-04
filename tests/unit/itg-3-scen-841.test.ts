import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIRecommendationEngine推奨根拠可視化機能', () => {
  // SCEN-841
  test('explainRecommendationReasoning が失敗したとき、簡略版の根拠説明を表示する', () => {
    // Arrange
    const recommendationId = 'rec-20240115-001';
    const customerId = 'cust-12345';
    const dealConditions = {
      industry: '製造業',
      companySize: '中堅企業',
      annualRevenue: 5000000000,
      decisionMaker: '営業部長',
      budgetRange: { min: 1000000, max: 5000000 },
      implementationTimeline: '2024-Q2',
    };

    const recommendationData = {
      recommendationId,
      customerId,
      proposalApproach: '段階的導入アプローチ',
      confidenceScore: 82,
      successPatternId: 'sp-manufacturing-001',
      matchingFactors: ['業種適合', '予算範囲内', '実装期間内'],
    };

    // AIRecommendationEngine.explainRecommendationReasoning が API エラーを返すスタブ
    const failingAiEngine = {
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error('API call timeout')
      ),
      generateRecommendation: jest.fn().mockResolvedValue(recommendationData),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Act
    const result = explainRecommendationReasoning(
      {
        recommendationId,
        customerId,
        dealConditions,
      },
      failingAiEngine
    );

    // Assert
    expect(result).toEqual({
      status: 'fallback',
      userMessage: '推奨の詳細説明に一時的な遅延が発生しています。基本的な根拠情報を表示します',
      briefExplanation: {
        format: 'simplified',
        successPatternId: 'sp-manufacturing-001',
        applicableReason: '過去の類似案件で高い成功率を示しているパターン',
        historicalSuccessRate: 78,
        recommendedApproach: '段階的導入アプローチ',
        keyFactors: ['業種適合', '予算範囲内', '実装期間内'],
      },
      detailedExplanation: null,
      errorLog: {
        timestamp: expect.any(String),
        errorReason: 'API call timeout',
        fallbackApplied: true,
        aiEngineStatus: 'unavailable',
      },
    });

    // Verify that the fallback mechanism used the top statistical pattern from master
    expect(result.briefExplanation.successPatternId).toBe('sp-manufacturing-001');
    expect(result.briefExplanation.historicalSuccessRate).toBe(78);
    expect(result.briefExplanation.format).toBe('simplified');
    expect(result.detailedExplanation).toBeNull();
    expect(result.userMessage).toContain('一時的な遅延');
    expect(result.status).toBe('fallback');
    expect(result.errorLog.fallbackApplied).toBe(true);
  });
});