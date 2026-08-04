import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2141
  test('推奨根拠の自然言語説明生成 - 生成された説明文が null のとき、エラーが発生する', () => {
    const recommendationId = 'REC-20260801-001';
    const timestamp = new Date('2026-08-01T11:00:00Z').toISOString();

    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(null),
    };

    expect(() => {
      explainRecommendationReasoning(recommendationId, mockAIRecommendationEngine);
    }).toThrow(/推奨根拠の説明文生成に失敗しました/);
  });
});