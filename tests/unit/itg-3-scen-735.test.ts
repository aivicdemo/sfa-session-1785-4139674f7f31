import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-735
  test('推奨根拠データが空のとき根拠説明文が生成されない', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealConditions = {
      customerId: 'cust_001',
      industryType: 'IT',
      companyScale: 'large',
      dealAmount: 5000000,
    };

    const logRecords: string[] = [];
    const mockLogger = {
      error: (message: string) => {
        logRecords.push(message);
      },
    };

    const result = explainRecommendationReasoning(
      dealConditions,
      [],
      mockAIEngine,
      mockLogger
    );

    expect(result).toBe('');
    expect(logRecords).toContain('推奨根拠データが存在しません');
  });
});