import { evaluateDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-513
  test('複数の重複基準のうち一部だけ満たすとき、統合対象外として判定される', () => {
    const criteriaA = {
      id: 'criteria_a',
      name: '基準A',
      fields: ['email', 'name'],
      matchType: 'exact',
    };

    const criteriaB = {
      id: 'criteria_b',
      name: '基準B',
      fields: ['phone', 'address'],
      matchType: 'exact',
    };

    const criteriaC = {
      id: 'criteria_c',
      name: '基準C',
      fields: ['companyName', 'department'],
      matchType: 'exact',
    };

    const criteria = [criteriaA, criteriaB, criteriaC];

    const dataset1 = {
      customerId: 'cust_001',
      email: 'test@example.com',
      name: '山田太郎',
      phone: '090-1234-5678',
      address: '東京都渋谷区',
      companyName: 'A社',
      department: '営業部',
    };

    const dataset2 = {
      customerId: 'cust_002',
      email: 'test@example.com',
      name: '山田太郎',
      phone: '090-9999-9999',
      address: '大阪府大阪市',
      companyName: 'B社',
      department: '営業部',
    };

    const result = evaluateDuplicateCustomers({
      criteria,
      dataset1,
      dataset2,
    });

    expect(result.shouldMerge).toBe(false);
    expect(result.reason).toBe('複数基準の完全一致が必須です');
    expect(result.criteriaStatus).toEqual({
      criteria_a: { satisfied: true, reason: 'メールアドレスと氏名が一致' },
      criteria_b: { satisfied: false, reason: '電話番号と住所が不一致' },
      criteria_c: { satisfied: false, reason: '企業名が不一致' },
    });
  });
});