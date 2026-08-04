import { displayRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1123
  test('信頼度スコアの合計が1.0を超過するとき、エラーをスロー', () => {
    const recommendationReasons = [
      {
        reason_id: 'reason_001',
        recommendation_id: 'rec_001',
        reason_type: 'pattern_match',
        reason_content: '過去の類似成功事例との合致',
        confidence_score: 0.6,
        supporting_data: 'Case ID: C001',
        created_at: new Date('2024-01-15T10:00:00Z'),
      },
      {
        reason_id: 'reason_002',
        recommendation_id: 'rec_001',
        reason_type: 'customer_profile',
        reason_content: '顧客属性マッチング',
        confidence_score: 0.45,
        supporting_data: 'Industry: IT, Scale: 1000+',
        created_at: new Date('2024-01-15T10:05:00Z'),
      },
      {
        reason_id: 'reason_003',
        recommendation_id: 'rec_001',
        reason_type: 'timing_signal',
        reason_content: '購買シグナル検出',
        confidence_score: 0.05,
        supporting_data: 'Signal strength: low',
        created_at: new Date('2024-01-15T10:10:00Z'),
      },
    ];

    expect(() => {
      displayRecommendationReasoning(recommendationReasons);
    }).toThrow(/信頼度/);
  });
});