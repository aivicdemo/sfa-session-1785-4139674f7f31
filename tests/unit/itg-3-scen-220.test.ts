import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('新規案件への成功パターン推奨 - 成功パターンマスタ検証', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-220
  test('成功パターンマスタがnullのとき、推奨処理がエラーになる', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockImplementation(() => {
        throw new Error('成功パターンマスタが未初期化です。推奨処理を実行できません');
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealCondition = {
      customerIndustry: '製造業',
      dealAmount: 50000000,
      decisionMakerCount: 3,
      implementationPeriodMonths: 3,
    };

    expect(() => {
      generateRecommendation(newDealCondition, mockAIRecommendationEngine);
    }).toThrow(/成功パターンマスタが未初期化/);
  });
});