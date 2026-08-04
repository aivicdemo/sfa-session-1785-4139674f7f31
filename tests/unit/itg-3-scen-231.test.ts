import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-231
  test('推奨根拠テーブルが0件のとき、可視化処理がエラーになる', () => {
    const mockAIEngine = {
      getRecommendationReasons: jest.fn().mockResolvedValue([]),
    };

    const recommendationId = 'rec_12345';

    expect(async () => {
      await visualizeRecommendationReasoning(recommendationId, mockAIEngine);
    }).rejects.toThrow(/推奨根拠データが存在しません|テーブル行数が0件のため可視化できません/);
  });
});