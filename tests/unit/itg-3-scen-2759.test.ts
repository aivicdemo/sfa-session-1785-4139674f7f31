import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けルール生成機能', () => {
  // SCEN-2759
  test('過去商談データが0件の場合、デフォルト重み付けルールが生成される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const pastDealsData = [];

    const result = extractSuccessPatterns(pastDealsData, mockAIEngine);

    expect(result.defaultWeightingRuleGenerated).toBe(true);

    expect(result.successPatterns).toHaveLength(3);

    expect(result.successPatterns[0]).toHaveProperty('pattern');
    expect(result.successPatterns[0]).toHaveProperty('weights');

    expect(result.successPatterns[0].weights).toEqual({
      industry: 0.3,
      dealSize: 0.25,
      proposalMethod: 0.25,
      salesStage: 0.2,
    });

    expect(result.successPatterns[1].weights).toEqual({
      industry: 0.3,
      dealSize: 0.25,
      proposalMethod: 0.25,
      salesStage: 0.2,
    });

    expect(result.successPatterns[2].weights).toEqual({
      industry: 0.3,
      dealSize: 0.25,
      proposalMethod: 0.25,
      salesStage: 0.2,
    });

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});