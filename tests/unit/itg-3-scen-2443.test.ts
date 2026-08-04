import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2443: 推奨精度スコア算出機能 - 信頼度スコアが-1のときの異常処理', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        confidence: -1,
        relevanceScore: 0.5,
      }),
    };

    const mockLogger = {
      error: jest.fn(),
    };

    const input = {
      aiEngine: mockAIEngine,
      logger: mockLogger,
      patternId: 'pattern_001',
      customerId: 'cust_123',
      businessConditions: {
        industryType: 'manufacturing',
        companySize: 'large',
        budgetRange: [1000000, 5000000],
      },
    };

    expect(() => {
      calculateRecommendationScore(input);
    }).toThrow(/信頼度スコアが有効範囲外/);

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('信頼度スコアが有効範囲外です。信頼度: -1')
    );

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith({
      patternId: 'pattern_001',
      customerId: 'cust_123',
      businessConditions: {
        industryType: 'manufacturing',
        companySize: 'large',
        budgetRange: [1000000, 5000000],
      },
    });
  });
});