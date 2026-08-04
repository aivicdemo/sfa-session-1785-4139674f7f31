import { evaluateRecommendationCredibility } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2405
  test('推論精度スコア算出機能 - 推論根拠データが存在しないとき、エラーが発生する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 0,
        patterns: []
      })
    };

    const recommendationResponse = {
      recommendationId: 'REC-2024-001',
      score: 0,
      patterns: []
    };

    expect(() => {
      evaluateRecommendationCredibility(recommendationResponse, mockAIEngine);
    }).toThrow(/推論根拠データ/);
  });
});