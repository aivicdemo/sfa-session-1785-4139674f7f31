import { explainRecommendationReasoningWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1856
  test('explainRecommendationReasoning が失敗時に代替根拠説明を返す', () => {
    const recommendationId = 'REC-20240115-001';
    const dealConditions = {
      customerId: 'CUST-A001',
      industry: 'manufacturing',
      companySize: 'large',
      dealValue: 5000000,
      dealStage: 'proposal'
    };
    const recommendationPattern = {
      patternId: 'PAT-SUCCESS-001',
      patternName: '大規模製造業向け提案アプローチ',
      successRate: 0.78
    };

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue(null),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.85)
    };

    const mockLogger = {
      logError: jest.fn()
    };

    const mockPatternMaster = {
      getTopSuccessPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'PAT-TOP-001',
          patternName: 'Top Success Pattern 1',
          frequency: 125,
          successRate: 0.82,
          description: 'Large manufacturing customers with high purchase value'
        },
        {
          patternId: 'PAT-TOP-002',
          patternName: 'Top Success Pattern 2',
          frequency: 98,
          successRate: 0.75,
          description: 'Mid-tier manufacturing with repeat purchases'
        }
      ])
    };

    const result = explainRecommendationReasoningWithFallback(
      recommendationId,
      dealConditions,
      recommendationPattern,
      mockAIEngine,
      mockLogger,
      mockPatternMaster
    );

    expect(result).toBeDefined();
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );
    expect(result.fallbackExplanation).toBeDefined();
    expect(result.fallbackExplanation.patternId).toBe('PAT-TOP-001');
    expect(result.fallbackExplanation.patternName).toBe('Top Success Pattern 1');
    expect(result.fallbackExplanation.successRate).toBe(0.82);
    expect(result.fallbackExplanation.description).toBe(
      'Large manufacturing customers with high purchase value'
    );
    expect(result.isUsingFallback).toBe(true);
    expect(mockLogger.logError).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendationId,
        reason: expect.stringMatching(/explainRecommendationReasoning/)
      })
    );
    expect(result.systemStatus).toBe('handled');
  });
});