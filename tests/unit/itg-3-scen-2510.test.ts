import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateTemplate } from '../../src/logic/it-1-br-3-1-1-1';

describe('成功パターンテンプレート設計機能', () => {
  // SCEN-2510
  test('[error] 各営業プロセスステップに成功パターンが0件のときテンプレート生成がエラーになる', () => {
    const processSteps = ['初期接触', 'ニーズ把握', '提案', 'クローズ'];
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(() => ({
        matchingPatterns: [],
        relevanceScore: 0,
      })),
    };

    const input = {
      processSteps,
      aiEngine: mockAIRecommendationEngine,
    };

    expect(() => generateTemplate(input)).toThrow(/成功パターン/);
  });
});