import { detectCustomerDuplicate } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-471
  test('重複判定の信頼度スコアが閾値にちょうど達する場合、重複と判定される', () => {
    const duplicateThreshold = 75.0;

    const customerDataA = {
      customerId: 'CUST-001',
      name: '山田太郎',
      phone: '090-1234-5678',
      address: '東京都渋谷区',
    };

    const customerDataB = {
      customerId: 'CUST-002',
      name: '山田太郎',
      phone: '090-1234-5678',
      address: '東京都渋谷区',
    };

    const result = detectCustomerDuplicate(
      customerDataA,
      customerDataB,
      duplicateThreshold,
    );

    expect(result.isDuplicate).toBe(true);
    expect(result.status).toBe('DUPLICATE');
    expect(result.confidenceScore).toBe(75.0);
    expect(result.recommendedAction).toBe('統合候補');
  });
});