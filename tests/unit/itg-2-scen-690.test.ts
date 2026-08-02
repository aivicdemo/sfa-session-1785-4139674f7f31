import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-690
  test('推奨内容根拠の可視化機能 - 根拠データの信頼度スコアが50のとき、根拠として含まれる', () => {
    const input_recommendation_id = 'rec-001';
    const input_basis_data = [
      {
        basis_id: 'basis-001',
        recommendation_id: 'rec-001',
        basis_type: 'past_case',
        source_deal_id: 'deal-123',
        confidence_score: 50,
        description: '過去の類似案件',
        created_at: new Date('2024-01-15T10:00:00Z'),
      },
      {
        basis_id: 'basis-002',
        recommendation_id: 'rec-001',
        basis_type: 'customer_data',
        source_customer_id: 'cust-456',
        confidence_score: 75,
        description: '顧客の購買履歴',
        created_at: new Date('2024-01-15T10:30:00Z'),
      },
      {
        basis_id: 'basis-003',
        recommendation_id: 'rec-001',
        basis_type: 'success_pattern',
        source_pattern_id: 'pattern-789',
        confidence_score: 30,
        description: '成功パターンマッチング',
        created_at: new Date('2024-01-15T11:00:00Z'),
      },
    ];

    const result = visualizeRecommendationBasis(
      input_recommendation_id,
      input_basis_data
    );

    expect(result.recommendation_id).toBe('rec-001');
    expect(result.basis_list).toHaveLength(2);
    expect(
      result.basis_list.some(
        (b) =>
          b.basis_id === 'basis-001' &&
          b.confidence_score === 50 &&
          b.basis_type === 'past_case'
      )
    ).toBe(true);
    expect(
      result.basis_list.some(
        (b) =>
          b.basis_id === 'basis-002' &&
          b.confidence_score === 75 &&
          b.basis_type === 'customer_data'
      )
    ).toBe(true);
    expect(result.basis_list.some((b) => b.confidence_score === 30)).toBe(
      false
    );
    expect(result.total_basis_count).toBe(2);
    expect(result.min_confidence_threshold).toBe(50);
  });
});