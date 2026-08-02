import { detectDuplicateCustomersWithQualityValidation } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-261
  test('データ品質ルールが0件のとき、品質検証判定がスキップされる', () => {
    const input = {
      customers: [
        {
          customerId: 'CUST001',
          customerName: 'テスト顧客A',
          email: 'test_a@example.com',
          phone: '090-1111-1111',
        },
        {
          customerId: 'CUST002',
          customerName: 'テスト顧客B',
          email: 'test_a@example.com',
          phone: '090-1111-1111',
        },
      ],
      qualityRules: [],
      duplicateDetectionRules: [
        {
          ruleId: 'DUP_RULE_001',
          name: 'メールアドレスが同じ',
          condition: { field: 'email', operator: 'EQUALS' },
        },
      ],
    };

    const result = detectDuplicateCustomersWithQualityValidation(input);

    expect(result.status).toBe('SKIPPED');
    expect(result.rulesApplied).toBe(0);
    expect(result.duplicatesDetected).toEqual([]);
    expect(result.qualityValidationExecuted).toBe(false);
  });
});