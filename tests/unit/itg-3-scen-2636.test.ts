import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2636
  test('推奨内容が空のとき、根拠表示エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: '',
        confidence: 0,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: null,
        errorCode: 'RECOMMENDATION_EMPTY_ERROR',
        errorMessage: '推奨内容が空のため根拠説明生成に失敗',
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    const systemLogRecords: Array<{
      errorCode: string;
      message: string;
      timestamp: string;
    }> = [];

    const mockSystemLogger = {
      logError: (errorCode: string, message: string) => {
        systemLogRecords.push({
          errorCode,
          message,
          timestamp: new Date().toISOString(),
        });
      },
    };

    const dealCondition = {
      customerId: 'CUST-001',
      customerIndustry: 'manufacturing',
      customerSize: 'large',
      dealAmount: 5000000,
      dealStage: 'negotiation',
    };

    const emptyRecommendation = '';

    expect(() => {
      explainRecommendationReasoning(
        emptyRecommendation,
        dealCondition,
        mockAIEngine,
        mockSystemLogger
      );
    }).toThrow(/推奨内容が取得されていない可能性があります/);

    expect(systemLogRecords).toContainEqual(
      expect.objectContaining({
        errorCode: 'RECOMMENDATION_EMPTY_ERROR',
        message: '推奨内容が空のため根拠説明生成に失敗',
      })
    );

    expect(systemLogRecords.length).toBe(1);
  });
});