import { detectDuplicateCustomersWithQualityCheck } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1097
  test('データ品質ルール違反の顧客が重複候補に含まれるとき、不整合ログが記録される', () => {
    const customerA = {
      customerId: 'CUST-001',
      emailAddress: null,
      phoneNumber: '09012345678',
      createdAt: new Date('2024-01-15T10:00:00Z'),
    };

    const customerB = {
      customerId: 'CUST-002',
      emailAddress: 'test@example.com',
      phoneNumber: '09012345678',
      createdAt: new Date('2024-01-15T10:05:00Z'),
    };

    const qualityRuleViolations = [
      {
        customerId: 'CUST-001',
        violationType: 'required_field_missing',
        violatedField: 'emailAddress',
        detectedAt: new Date('2024-01-15T10:30:00Z'),
      },
    ];

    const duplicateMatchingCriteria = {
      phoneNumber: true,
      emailAddress: true,
    };

    const result = detectDuplicateCustomersWithQualityCheck(
      [customerA, customerB],
      qualityRuleViolations,
      duplicateMatchingCriteria,
    );

    expect(result.inconsistencyLogs).toHaveLength(1);
    expect(result.inconsistencyLogs[0]).toEqual({
      logType: '品質ルール違反の重複候補',
      targetCustomerId1: 'CUST-001',
      targetCustomerId2: 'CUST-002',
      violatedField: 'emailAddress',
      duplicateDetectionReason: '電話番号一致',
      timestamp: expect.any(Date),
    });
    expect(result.inconsistencyLogs[0].timestamp.toISOString()).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
    );
    expect(result.duplicateCandidates).toContainEqual({
      customer1Id: 'CUST-001',
      customer2Id: 'CUST-002',
      matchingFields: ['phoneNumber'],
      hasQualityViolation: true,
    });
  });
});