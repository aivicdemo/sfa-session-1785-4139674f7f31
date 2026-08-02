import { detectAndClassifyDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-558
  test('顧客データ重複検出・分類機能 - 分類結果に原因パターン名が正しく記録される', () => {
    const recordA = {
      customer_name: '山田太郎',
      phone_number: '090-1234-5678',
      address: '東京都渋谷区',
    };

    const recordB = {
      customer_name: '山田太郎',
      phone_number: '090-1234-5678',
      address: '東京都渋谷区',
    };

    const result = detectAndClassifyDuplicateCustomers([recordA, recordB]);

    expect(result.is_duplicate).toBe(true);
    expect(result.pattern_code).toBe(3);
    expect(result.pattern_name).toBe('顧客名・電話番号・住所が完全一致');
  });
});