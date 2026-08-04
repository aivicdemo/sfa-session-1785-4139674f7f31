import { describe, test, expect, beforeEach } from '@jest/globals';
import type { AIRecommendationEngine } from '../../src/types/AIRecommendationEngine';
import { extractAndMatchSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  let mockAIEngine: AIRecommendationEngine;

  beforeEach(() => {
    mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };
  });

  // SCEN-979
  test('過去商談データが空配列のとき、抽出結果は空配列で返される', async () => {
    const pastDealData: any[] = [];

    const result = await extractAndMatchSuccessPatterns(
      pastDealData,
      mockAIEngine
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});