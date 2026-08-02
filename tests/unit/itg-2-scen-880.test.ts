import { determineCustomerMergeEligibility } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-880
  test('信頼度スコアが閾値を1ポイント下回るとき、統合非推奨と判定される', () => {
    const confidenceThreshold = 80;
    const confidenceScore = 79;

    const recordA = {
      customerId: 'CUST-001',
      customerName: '株式会社サンプルA',
      email: 'contact@sample-a.co.jp',
      phone: '03-1234-5678',
    };

    const recordB = {
      customerId: 'CUST-002',
      customerName: '株式会社サンプルA',
      email: 'contact@sample-a.co.jp',
      phone: '03-1234-5678',
    };

    const result = determineCustomerMergeEligibility({
      recordA,
      recordB,
      confidenceThreshold,
      confidenceScore,
    });

    expect(result.mergeRecommendation).toBe('非推奨');
    expect(result.confidenceScore).toBe(79);
    expect(result.threshold).toBe(80);
    expect(result.isBelowThreshold).toBe(true);
  });
});