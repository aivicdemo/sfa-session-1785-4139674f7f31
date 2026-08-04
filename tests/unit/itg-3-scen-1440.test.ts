import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1440
  test('顧客条件データが欠落しているとき、推奨生成がスキップされる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const callLog: string[] = [];

    const mockAIEngineWithLogging = {
      generateRecommendation: jest.fn(() => {
        callLog.push('generateRecommendation');
        return { approaches: [] };
      }),
      findSimilarPatterns: jest.fn(() => {
        callLog.push('findSimilarPatterns');
        return [];
      }),
      explainRecommendationReasoning: jest.fn(() => {
        callLog.push('explainRecommendationReasoning');
        return '';
      }),
      evaluatePatternRelevance: jest.fn(() => {
        callLog.push('evaluatePatternRelevance');
        return 0;
      }),
    };

    const incompleteCustomerCondition = {
      customerId: 'CUST-001',
      customerName: null,
      dealStage: '初期接触',
      budget: 500000,
      industry: '製造業',
      companySize: '中規模',
    };

    const result = generateRecommendation(
      incompleteCustomerCondition,
      mockAIEngineWithLogging
    );

    expect(result.errorMessage).toMatch(/顧客情報/);
    expect(result.fallbackApproaches).toBeDefined();
    expect(Array.isArray(result.fallbackApproaches)).toBe(true);
    expect(mockAIEngineWithLogging.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngineWithLogging.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngineWithLogging.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngineWithLogging.evaluatePatternRelevance).not.toHaveBeenCalled();
    expect(callLog).toHaveLength(0);
  });
});