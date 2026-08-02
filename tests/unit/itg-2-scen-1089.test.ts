import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1089
  test('顧客名が部分一致し他の複数属性も一致するとき、重複候補として判定される', () => {
    const recordA = {
      customerId: 'CUST001',
      customerName: '山田太郎',
      phoneNumber: '09012345678',
      emailAddress: 'yamada@example.com',
      industry: '製造業',
    };

    const recordB = {
      customerId: 'CUST002',
      customerName: '山田太郎営業部',
      phoneNumber: '09012345678',
      emailAddress: 'yamada@example.com',
      industry: '製造業',
    };

    const result = detectDuplicateCustomers([recordA, recordB]);

    expect(result.duplicateCandidates).toHaveLength(1);
    expect(result.duplicateCandidates[0].recordIdA).toBe('CUST001');
    expect(result.duplicateCandidates[0].recordIdB).toBe('CUST002');
    expect(result.duplicateCandidates[0].duplicateScore).toBeGreaterThanOrEqual(8.0);
    expect(result.duplicateCandidates[0].matchingReasons).toContain('顧客名部分一致');
    expect(result.duplicateCandidates[0].matchingReasons).toContain('電話番号完全一致');
    expect(result.duplicateCandidates[0].matchingReasons).toContain('メールアドレス完全一致');
    expect(result.duplicateCandidates[0].matchingReasons).toContain('業種完全一致');
  });
});