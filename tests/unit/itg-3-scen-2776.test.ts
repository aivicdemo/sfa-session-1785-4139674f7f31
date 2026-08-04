import { extractSuccessPatternsWithWeighting } from '../../src/logic/it-1-br-3-3-2-1';

describe('Success Pattern Extraction and Weighting Logic', () => {
  // SCEN-2776
  test('should throw error when historical deal data is empty array', () => {
    const emptyHistoricalData: any[] = [];
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      extractSuccessPatternsWithWeighting(emptyHistoricalData, mockAIEngine)
    ).toThrow(/過去商談データが空|EMPTY_DEAL_DATA|推奨生成に必要な過去商談データ/);
  });
});