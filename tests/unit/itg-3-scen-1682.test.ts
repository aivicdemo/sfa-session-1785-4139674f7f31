import { generateRecommendationWithReasoningDisplay } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1682
  test('[error] 推奨内容表示機能 - 推奨内容が null のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue(null),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerCondition = {
      customerId: 'CUST-001',
      industry: '製造',
      scale: 'large',
      budget: 5000000,
    };

    const dealCondition = {
      dealId: 'DEAL-001',
      productCategory: 'システム導入',
      timeline: 'Q2',
      priority: 'high',
    };

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      generateRecommendationWithReasoningDisplay(
        customerCondition,
        dealCondition,
        mockAIRecommendationEngine
      );
    }).toThrow(/recommendation/);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('recommendation is null')
    );

    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});