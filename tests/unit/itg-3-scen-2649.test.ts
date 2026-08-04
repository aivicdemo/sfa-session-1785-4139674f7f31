import { describe, test, expect, beforeEach } from '@jest/globals';
import { extractPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出ロジック', () => {
  // SCEN-2649
  test('成功要因・失敗要因の言語化が完了していないとき、パターン抽出エラーが発生する', () => {
    const dealData = {
      dealId: 'DEAL-001',
      customerId: 'CUST-001',
      industry: 'IT',
      dealSize: 500000,
      successFactors: ['顧客の経営課題を正確に把握', 'ROI見積を提示'],
      failureFactors: [],
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() => extractPatterns(dealData, mockAIEngine)).toThrow(/失敗要因の言語化/);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});