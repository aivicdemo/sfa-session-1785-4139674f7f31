import { detectDuplicateCustomersAndMergeJudgment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-618
  test('電話番号完全一致で同一顧客と判定される', () => {
    const customerA = {
      customer_id: 'CUST001',
      phone_number: '09012345678',
      customer_name: '山田太郎',
      address: '東京都渋谷区',
    };

    const customerB = {
      customer_id: 'CUST002',
      phone_number: '09012345678',
      customer_name: '山田太郎',
      address: '東京都渋谷区',
    };

    const result = detectDuplicateCustomersAndMergeJudgment([
      customerA,
      customerB,
    ]);

    expect(result).toEqual({
      is_duplicate: true,
      merge_target_flag: true,
      duplicate_score: 100,
      merge_judgment: '同一顧客',
      primary_customer_id: 'CUST001',
      secondary_customer_id: 'CUST002',
      matching_criteria: ['phone_number'],
    });
  });
});