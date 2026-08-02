import { validateCustomerPurchaseConsiderationData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-920: 顧客購買検討データ入力検証機能 - すべてのフィールドが正常に入力された場合検証成功を返す', () => {
    const inputData = {
      customerId: 12345,
      customerName: 'テスト顧客A',
      productId: 67890,
      considerationStage: '比較検討',
      considerationStartDate: '2024-01-15',
      budgetAmount: 500000,
      salesRepId: 11111
    };

    const result = validateCustomerPurchaseConsiderationData(inputData);

    expect(result.success).toBe(true);
    expect(result.validationErrors).toEqual([]);
    expect(result.isReadyForRegistration).toBe(true);
  });
});