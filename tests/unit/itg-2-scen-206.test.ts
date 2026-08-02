import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-206
  test('重複判定スコアが閾値より1低いとき、統合推奨判定がNOとなる', () => {
    const thresholdScore = 80;
    const duplicateScore = thresholdScore - 1; // 79

    const customerDataA = {
      customerId: 'CUST-001',
      customerName: '株式会社サンプル',
      email: 'contact@sample.co.jp',
      phone: '03-XXXX-XXXX',
      address: '東京都渋谷区'
    };

    const customerDataB = {
      customerId: 'CUST-002',
      customerName: 'サンプル株式会社',
      email: 'info@sample.co.jp',
      phone: '03-XXXX-XXXX',
      address: '東京都渋谷区'
    };

    const result = detectDuplicateCustomers(
      customerDataA,
      customerDataB,
      thresholdScore,
      duplicateScore
    );

    expect(result.mergeRecommendation).toBe('NO');
    expect(result.duplicateScore).toBe(79);
    expect(result.thresholdScore).toBe(80);
  });
});