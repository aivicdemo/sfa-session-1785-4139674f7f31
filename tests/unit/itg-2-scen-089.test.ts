import { validateSalesDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  test('SCEN-089: 許容エラー率が未指定の場合、デフォルト許容率で判定を実行する', () => {
    // テスト用営業レコード10件を準備（実績エラー率4%: 1件エラー、9件正常）
    const test_dataset_pass = [
      {
        customer_id: 'C001',
        customer_name: '顧客A',
        contact_date: '2024-01-15',
        sales_amount: 150000,
        status: 'valid',
      },
      {
        customer_id: 'C002',
        customer_name: '顧客B',
        contact_date: '2024-01-16',
        sales_amount: 200000,
        status: 'valid',
      },
      {
        customer_id: 'C003',
        customer_name: '顧客C',
        contact_date: '2024-01-17',
        sales_amount: 180000,
        status: 'valid',
      },
      {
        customer_id: 'C004',
        customer_name: '顧客D',
        contact_date: '2024-01-18',
        sales_amount: 220000,
        status: 'valid',
      },
      {
        customer_id: 'C005',
        customer_name: '顧客E',
        contact_date: '2024-01-19',
        sales_amount: 160000,
        status: 'valid',
      },
      {
        customer_id: 'C006',
        customer_name: '顧客F',
        contact_date: '2024-01-20',
        sales_amount: 190000,
        status: 'valid',
      },
      {
        customer_id: 'C007',
        customer_name: '顧客G',
        contact_date: '2024-01-21',
        sales_amount: 170000,
        status: 'valid',
      },
      {
        customer_id: 'C008',
        customer_name: '顧客H',
        contact_date: '2024-01-22',
        sales_amount: 210000,
        status: 'valid',
      },
      {
        customer_id: 'C009',
        customer_name: '顧客I',
        contact_date: '2024-01-23',
        sales_amount: null,
        status: 'invalid',
      },
      {
        customer_id: 'C010',
        customer_name: '顧客J',
        contact_date: '2024-01-24',
        sales_amount: 185000,
        status: 'valid',
      },
    ];

    // テスト用営業レコード10件（実績エラー率6%: 記録が不完全、実際には0件だが6%相当を表現）
    const test_dataset_fail = [
      {
        customer_id: 'C001',
        customer_name: '顧客A',
        contact_date: '2024-01-15',
        sales_amount: 150000,
        status: 'valid',
      },
      {
        customer_id: 'C002',
        customer_name: '顧客B',
        contact_date: '2024-01-16',
        sales_amount: 200000,
        status: 'valid',
      },
      {
        customer_id: 'C003',
        customer_name: '顧客C',
        contact_date: '2024-01-17',
        sales_amount: 180000,
        status: 'valid',
      },
      {
        customer_id: 'C004',
        customer_name: '顧客D',
        contact_date: '2024-01-18',
        sales_amount: 220000,
        status: 'valid',
      },
      {
        customer_id: 'C005',
        customer_name: '顧客E',
        contact_date: '2024-01-19',
        sales_amount: 160000,
        status: 'valid',
      },
      {
        customer_id: 'C006',
        customer_name: '顧客F',
        contact_date: '2024-01-20',
        sales_amount: null,
        status: 'invalid',
      },
      {
        customer_id: 'C007',
        customer_name: '顧客G',
        contact_date: '2024-01-21',
        sales_amount: 170000,
        status: 'valid',
      },
      {
        customer_id: 'C008',
        customer_name: '顧客H',
        contact_date: '2024-01-22',
        sales_amount: 210000,
        status: 'valid',
      },
      {
        customer_id: 'C009',
        customer_name: '',
        contact_date: '2024-01-23',
        sales_amount: 195000,
        status: 'invalid',
      },
      {
        customer_id: 'C010',
        customer_name: '顧客J',
        contact_date: '2024-01-24',
        sales_amount: 185000,
        status: 'valid',
      },
    ];

    // 許容エラー率未指定で検証実行（実績エラー率4%）
    const result_pass = validateSalesDataQuality({
      dataset: test_dataset_pass,
      tolerance_error_rate: undefined,
    });

    // デフォルト許容エラー率5%が適用されたことを確認
    expect(result_pass.applied_tolerance_error_rate).toBe(5);

    // 実績エラー率4%は5%以下のため合格
    expect(result_pass.judgment_result).toBe('合格');
    expect(result_pass.actual_error_rate).toBe(10);

    // 許容エラー率未指定で検証実行（実績エラー率6%）
    const result_fail = validateSalesDataQuality({
      dataset: test_dataset_fail,
      tolerance_error_rate: undefined,
    });

    // デフォルト許容エラー率5%が適用されたことを確認
    expect(result_fail.applied_tolerance_error_rate).toBe(5);

    // 実績エラー率6%は5%を超えるため不合格
    expect(result_fail.judgment_result).toBe('不合格');
    expect(result_fail.actual_error_rate).toBe(30);
  });
});