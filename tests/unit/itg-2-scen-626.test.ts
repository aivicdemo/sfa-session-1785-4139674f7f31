import { determineCustomerMergeCandidateWithConfidence } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-626
  test('複数の判定基準が部分的に一致する場合、確度が按分計算される', () => {
    const recordA = {
      customerId: 'CUST001',
      name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };

    const recordB = {
      customerId: 'CUST002',
      name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5679',
    };

    const criteria = [
      {
        criteriaId: 'CRIT_NAME',
        criteriaName: '名前',
        weight: 100,
      },
      {
        criteriaId: 'CRIT_ADDRESS',
        criteriaName: '住所',
        weight: 100,
      },
      {
        criteriaId: 'CRIT_PHONE',
        criteriaName: '電話',
        weight: 0,
      },
    ];

    const result = determineCustomerMergeCandidateWithConfidence(
      recordA,
      recordB,
      criteria
    );

    expect(result.mergeConfidence).toBe(66.67);
    expect(result.matchStatus).toBe('部分一致');
    expect(result.matchedCriteria).toEqual(['CRIT_NAME', 'CRIT_ADDRESS']);
    expect(result.unmatchedCriteria).toEqual(['CRIT_PHONE']);
  });
});