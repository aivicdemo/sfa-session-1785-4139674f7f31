import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('購買履歴データ品質判定機能', () => {
  // SCEN-1477
  test('商品カテゴリが欠けているときエラーを返す', () => {
    const purchase_history_record = {
      productId: 'P001',
      purchaseDate: '2024-01-15',
      quantity: 2,
      price: 5000,
      category: null
    };

    const result = evaluatePurchaseHistoryDataQuality(purchase_history_record);

    expect(result).toEqual({
      error_code: 'MISSING_REQUIRED_FIELD',
      error_message: '商品カテゴリが必須項目です',
      target_field: 'category',
      target_product_id: 'P001',
      is_valid: false,
      quality_score: 0
    });
    expect(result.is_valid).toBe(false);
  });
});