import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - 推奨スコア算出機能', () => {
  // SCEN-1668
  test('パターン適用可能性スコアが100を超えるときエラーが発生する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 101,
      }),
    };

    const testDealCondition = {
      customerIndustry: 'manufacturing',
      dealAmount: 5000000,
      proposalContent: 'ERP system implementation',
      customerScale: 'large',
    };

    const calculateWithMock = () =>
      calculateRecommendationScore(testDealCondition, mockAIRecommendationEngine);

    expect(calculateWithMock).toThrow(/スコアは0～100の範囲内である必要があります/);
  });
});