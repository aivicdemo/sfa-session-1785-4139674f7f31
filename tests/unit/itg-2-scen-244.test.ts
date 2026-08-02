import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-244
  test('正規化ルールが1件のとき、正規化処理が1つのルールで実行される', () => {
    const normalizationRules = [
      {
        rule_id: 'NORM-001',
        rule_name: 'スペース削除',
        processing_content: '前後の空白を削除',
        execution_order: 1,
        is_active: true,
      },
    ];

    const customerData = {
      customer_id: 'CUST-001',
      customer_name: '  山田太郎  ',
      email: '  yamada@example.com  ',
    };

    const executionLogs: Array<{
      rule_id: string;
      execution_count: number;
    }> = [];

    const result = detectDuplicateCustomers(
      customerData,
      normalizationRules,
      executionLogs
    );

    expect(result.normalized_customer_name).toBe('山田太郎');
    expect(result.normalized_email).toBe('yamada@example.com');
    expect(executionLogs).toHaveLength(1);
    expect(executionLogs[0].rule_id).toBe('NORM-001');
    expect(executionLogs[0].execution_count).toBe(1);
  });
});