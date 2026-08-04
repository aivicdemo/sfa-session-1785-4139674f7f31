import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1905
  test('商談条件が欠落しているときに推奨根拠の生成がスキップされる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const incompleteDealConditions = {
      customerId: 'CUST-001',
      dealAmount: null,
      industry: 'IT',
      decisionMaker: 'Smith',
    };

    const result = generateReasoning(
      incompleteDealConditions,
      mockAIEngine
    );

    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(result.reasoningText).toBe('');
    expect(result.skipped).toBe(true);
    expect(result.skipReason).toBe('MISSING_DEAL_CONDITIONS');
    expect(result.userMessage).toBe(
      '商談情報が不完全です。すべての必須項目を入力してください'
    );
  });
});