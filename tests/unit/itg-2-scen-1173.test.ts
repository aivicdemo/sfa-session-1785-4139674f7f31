import { normalizeAndJudgeCustomerMerge } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1173
  test('正規化ルールが0件の場合、入力データがそのまま出力される', () => {
    const inputCustomer = {
      customer_id: 'CUST001',
      customer_name: '山田太郎',
      email: 'yamada@example.com',
      phone: '09012345678',
      created_at: new Date('2024-01-15T10:00:00Z'),
      updated_at: new Date('2024-01-15T10:00:00Z'),
    };

    const normalizationRules: Array<{
      rule_id: string;
      field_name: string;
      rule_pattern: string;
      priority: number;
    }> = [];

    const result = normalizeAndJudgeCustomerMerge(inputCustomer, normalizationRules);

    expect(result.customer_name).toBe('山田太郎');
    expect(result.email).toBe('yamada@example.com');
    expect(result.phone).toBe('09012345678');
    expect(result.customer_id).toBe('CUST001');
  });
});