import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-1098
  test('参照先の成功パターンレコードが存在しないとき、根拠可視化処理がエラーになる', () => {
    const nonExistentPatternId = 'pattern_999999_nonexistent';
    const recommendationId = 'rec_001';
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() => {
      explainRecommendationReasoning({
        recommendationId,
        successPatternId: nonExistentPatternId,
        aiEngine: mockAIEngine,
      });
    }).toThrow(/成功パターンレコード/);
  });
});