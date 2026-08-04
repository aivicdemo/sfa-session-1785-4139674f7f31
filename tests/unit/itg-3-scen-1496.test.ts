import { evaluatePurchaseHistoryQualityForLearning } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  // SCEN-1496
  test('品質スコアが最小閾値ちょうど60で学習データ利用可と判定される', () => {
    const purchase_history_data = {
      product_id: 'PROD-001',
      purchase_datetime: '2024-01-15T10:30:00Z',
      amount: 150000,
      customer_segment: 'enterprise',
      quantity: 5,
    };

    const quality_score = 60;

    const result = evaluatePurchaseHistoryQualityForLearning(
      purchase_history_data,
      quality_score
    );

    expect(result.qualityScore).toBe(60);
    expect(result.canUseForLearning).toBe(true);
    expect(result.dataQualityStatus).toBe('APPROVED');
    expect(result.judgmentReason).toMatch(/スコア60は最小閾値以上のため学習データとして利用可能/);
  });
});