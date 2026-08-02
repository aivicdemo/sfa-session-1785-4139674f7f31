import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-688
  test('推奨内容根拠の可視化機能 - 根拠データの信頼度スコアが0のとき、根拠として含まれる', () => {
    const basis_data_with_zero_confidence = [
      {
        basis_id: 'basis_001',
        recommendation_id: 'rec_001',
        source_type: 'past_case',
        source_id: 'case_001',
        confidence_score: 0,
        reason_text: 'Historical case match',
        created_at: new Date('2024-01-15T10:00:00Z'),
      },
      {
        basis_id: 'basis_002',
        recommendation_id: 'rec_001',
        source_type: 'customer_data',
        source_id: 'cust_001',
        confidence_score: 0.85,
        reason_text: 'Customer profile alignment',
        created_at: new Date('2024-01-15T11:00:00Z'),
      },
    ];

    const result = visualizeRecommendationBasis({
      basis_list: basis_data_with_zero_confidence,
    });

    expect(result.basis_array.length).toBeGreaterThanOrEqual(1);
    expect(
      result.basis_array.some((item) => item.confidence_score === 0)
    ).toBe(true);

    const zero_confidence_item = result.basis_array.find(
      (item) => item.confidence_score === 0
    );
    expect(zero_confidence_item).toBeDefined();
    expect(zero_confidence_item!.confidence_score).toBe(0);
    expect(zero_confidence_item!.basis_id).toBe('basis_001');
  });
});