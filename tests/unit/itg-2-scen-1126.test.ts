import { detectDuplicatesAndApplyNormalization } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1126
  test('1つの顧客データのみが入力された場合、重複判定は実行されない', () => {
    const input_customer_data = [
      {
        customer_id: 'CUST-001',
        customer_name: '山田太郎',
        address: '東京都渋谷区',
      },
    ];

    const result = detectDuplicatesAndApplyNormalization(input_customer_data);

    expect(result).toEqual({
      duplicate_check_executed: false,
      duplicate_status: '重複なし',
      normalization_status: '正規化完了',
      processed_customers: [
        {
          customer_id: 'CUST-001',
          customer_name: '山田太郎',
          address: '東京都渋谷区',
        },
      ],
    });
  });
});