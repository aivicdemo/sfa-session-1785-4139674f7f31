import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-209
  test('複数の照合属性の一部が不整合のとき、統合判定結果がレビュー必須状態となる', () => {
    const recordA = {
      customerName: '山田太郎',
      emailAddress: 'yamada@example.com',
      phoneNumber: '090-1234-5678',
      address: '東京都渋谷区',
    };

    const recordB = {
      customerName: '山田太郎',
      emailAddress: 'yamada@example.com',
      phoneNumber: '090-9999-9999',
      address: '東京都渋谷区',
    };

    const result = detectDuplicateCustomers([recordA, recordB]);

    expect(result.status).toBe('レビュー必須');
    expect(result.mismatchAttributes).toContain('phoneNumber');
    expect(result.matchingPercentage).toBeGreaterThanOrEqual(60);
    expect(result.matchingPercentage).toBeLessThanOrEqual(80);
  });
});