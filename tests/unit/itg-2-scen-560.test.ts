import { detectDuplicateCustomersAndClassify } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複検出・分類と正規化履歴記録機能', () => {
  // SCEN-560
  test('正規化適用後の分類履歴に正規化済みデータが記録される', () => {
    const beforeNormalizationCustomer = {
      customerId: 'CUST-001',
      customerName: '　山田　太郎　',
      phoneNumber: '03-1234-5678',
      email: 'yamada@example.com',
      createdAt: new Date('2024-01-15T10:00:00Z'),
    };

    const normalizationRules = [
      {
        ruleId: 'NORM-001',
        field: 'customerName',
        pattern: /\s+/g,
        replacement: '',
        priority: 1,
      },
      {
        ruleId: 'NORM-002',
        field: 'phoneNumber',
        pattern: /[-]/g,
        replacement: '',
        priority: 2,
      },
    ];

    const result = detectDuplicateCustomersAndClassify({
      customerId: beforeNormalizationCustomer.customerId,
      customerName: beforeNormalizationCustomer.customerName,
      phoneNumber: beforeNormalizationCustomer.phoneNumber,
      email: beforeNormalizationCustomer.email,
      createdAt: beforeNormalizationCustomer.createdAt,
      normalizationRules: normalizationRules,
      classificationStatus: '正規化済み',
    });

    expect(result.classificationHistory).toHaveLength(1);

    const historyRecord = result.classificationHistory[0];
    expect(historyRecord.customerId).toBe('CUST-001');
    expect(historyRecord.normalizedCustomerName).toBe('山田太郎');
    expect(historyRecord.normalizedPhoneNumber).toBe('0312345678');
    expect(historyRecord.classificationStatus).toBe('正規化済み');
    expect(historyRecord.normalizedEmail).toBe('yamada@example.com');

    const recordTimestamp = new Date(historyRecord.timestamp);
    const currentTime = new Date('2024-01-15T10:05:00Z');
    const timeDifferenceMs = Math.abs(recordTimestamp.getTime() - currentTime.getTime());
    expect(timeDifferenceMs).toBeLessThan(5 * 60 * 1000);
  });
});