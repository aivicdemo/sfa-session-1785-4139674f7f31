import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-237: 推奨根拠レコードの作成日時が null のとき、可視化処理がエラーになる', () => {
    const recommendationReasoningRecord = {
      id: 'reason-001',
      recommendation_id: 'rec-001',
      reasoning_type: 'past_success_pattern',
      reasoning_content: '過去成功事例との合致度: 85%',
      created_at: null as unknown as Date,
      updated_at: new Date('2024-01-15T12:00:00Z'),
    };

    expect(() =>
      visualizeRecommendationReasoning(recommendationReasoningRecord)
    ).toThrow(/推奨根拠レコードの作成日時が不正です/);
  });
});