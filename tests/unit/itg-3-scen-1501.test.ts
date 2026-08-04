import { evaluateDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  // SCEN-1501
  test('購買商品カテゴリフィールドが欠落しているとき不適合項目に追加される', () => {
    const purchase_record = {
      purchase_id: 'PUR-20240115-001',
      customer_id: 'CUST-12345',
      purchase_date: '2024-01-15T10:30:00Z',
      amount: 150000,
      product_category: null,
    };

    const result = evaluateDataQuality(purchase_record);

    expect(result.is_valid).toBe(false);
    expect(result.quality_score).toBeLessThan(100);
    expect(result.validation_errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field_name: 'product_category',
          error_level: 'error',
          message: expect.stringMatching(/productCategory|product_category|必須フィールド|欠落/i),
        }),
      ]),
    );
    expect(result.validation_errors.length).toBe(1);
  });
});