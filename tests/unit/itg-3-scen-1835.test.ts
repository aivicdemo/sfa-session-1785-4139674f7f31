import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1835
  test('営業担当者IDが空文字列のとき根拠情報取得に失敗する', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(() => {
        throw new Error('営業担当者IDが無効です');
      }),
    };

    const salesPersonId = '';
    const recommendationId = 'REC-2024-001';

    expect(() =>
      explainRecommendationReasoning(
        salesPersonId,
        recommendationId,
        mockAIEngine
      )
    ).toThrow(/営業担当者ID/);
  });
});