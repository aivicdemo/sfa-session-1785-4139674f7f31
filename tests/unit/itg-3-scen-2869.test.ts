import { evaluateRecommendationDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 推奨内容検証判定', () => {
  test('SCEN-2869: 標準プロセスとの乖離度が100を超えるとき、エラーを返す', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        deviationScore: 101,
        matchPercentage: 0
      })
    };

    const dealData = {
      customerId: 'CUST-001',
      industry: 'manufacturing',
      companySize: 'large',
      proposalContent: 'Custom integration solution',
      successPatternMatchDegree: 0.25,
      standardProcessAlignment: false
    };

    const expectedError = {
      code: 'DEVIATION_EXCEEDED',
      message: '標準プロセスとの乖離度が許容範囲を超過しています（乖離度: 101）',
      statusCode: 400
    };

    expect(() => {
      evaluateRecommendationDeviation(dealData, mockAIEngine);
    }).toThrow(/乖離度/);

    try {
      evaluateRecommendationDeviation(dealData, mockAIEngine);
    } catch (error: any) {
      expect(error.code).toBe(expectedError.code);
      expect(error.message).toContain('乖離度');
      expect(error.statusCode).toBe(expectedError.statusCode);
    }
  });
});