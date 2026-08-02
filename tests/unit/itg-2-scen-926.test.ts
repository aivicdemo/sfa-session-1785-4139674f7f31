import { validatePurchaseConsiderationData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-926
  test('購買履歴の購買金額が業務上の最大規模でもデータ完全性検証が実行される', () => {
    const input = {
      customerId: 'CUST-00001',
      productId: 'PROD-12345',
      purchaseDate: '2024-01-15',
      amount: 999999999,
      quantity: 100,
      purchaseMethod: 'online',
      status: 'completed',
    };

    const result = validatePurchaseConsiderationData(input);

    expect(result.isValid).toBe(true);
    expect(result.errorMessages).toEqual([]);
    expect(result.amount).toBe(999999999);
  });
});