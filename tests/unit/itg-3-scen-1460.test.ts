import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Evaluation', () => {
  test('SCEN-1460: Quality score below threshold (0.79) is rejected for learning', () => {
    const input_purchase_history = {
      customer_id: 'CUST-12345',
      purchase_date: '2024-01-15',
      product_category: 'Software License',
      purchase_amount: 150000,
      payment_status: 'Completed',
      order_id: 'ORD-98765',
      quality_metrics: {
        completeness: 0.85,
        consistency: 0.75,
        timeliness: 0.78,
        accuracy: 0.78,
      },
    };

    const quality_threshold = 0.80;
    const expected_quality_score = 0.79;

    const result = evaluatePurchaseHistoryDataQuality(
      input_purchase_history,
      quality_threshold
    );

    expect(result.qualityScore).toBe(0.79);
    expect(result.isUsableForLearning).toBe(false);
    expect(result.judgmentReason).toBe(
      '品質スコアが許容値未満のため学習データとして使用不可'
    );
    expect(result.log).toMatch(/DataQualityCheck: score=0.79, threshold=0.80, result=REJECTED/);
  });
});