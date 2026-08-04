import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1105
  test('[error] 推奨内容の根拠表示機能 - 参照する過去商談レコードが存在しないとき、根拠表示処理がエラーになる', () => {
    const newDealId = 'NEW_DEAL_001';
    const recommendationId = 'REC_001';

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      explainRecommendationReasoning(
        newDealId,
        recommendationId,
        aiRecommendationEngineStub
      )
    ).toThrow(/過去商談レコード/);
  });
});