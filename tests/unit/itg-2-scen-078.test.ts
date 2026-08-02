import { validateSalesData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-078
  test('営業データが1件の場合、その1件に対する検証を実行する', () => {
    const input_sales_data = {
      sales_rep_id: 'REP001',
      customer_name: '株式会社テスト',
      sales_amount: 150000,
      contract_date: '2024-01-15'
    };

    const result = validateSalesData(input_sales_data);

    expect(result.total_records).toBe(1);
    expect(result.validation_status).toBe('完了');
    expect(result.validation_details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field_name: 'sales_rep_id',
          check_type: 'データ型チェック',
          validation_result: true
        }),
        expect.objectContaining({
          field_name: 'sales_rep_id',
          check_type: '必須フィールドチェック',
          validation_result: true
        }),
        expect.objectContaining({
          field_name: 'customer_name',
          check_type: 'データ型チェック',
          validation_result: true
        }),
        expect.objectContaining({
          field_name: 'customer_name',
          check_type: '必須フィールドチェック',
          validation_result: true
        }),
        expect.objectContaining({
          field_name: 'sales_amount',
          check_type: 'データ型チェック',
          validation_result: true
        }),
        expect.objectContaining({
          field_name: 'sales_amount',
          check_type: '範囲値チェック',
          validation_result: true
        }),
        expect.objectContaining({
          field_name: 'contract_date',
          check_type: 'データ型チェック',
          validation_result: true
        }),
        expect.objectContaining({
          field_name: 'contract_date',
          check_type: '必須フィールドチェック',
          validation_result: true
        })
      ])
    );
    expect(result.validation_details.length).toBe(8);
  });
});