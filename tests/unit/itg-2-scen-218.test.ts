import { executeIntegrationJudgment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-218
  test('重複候補ペアが逆順序で実行されたとき、同じ判定スコアが得られる', () => {
    const customerRecordA = {
      customer_id: 'CUST001',
      customer_name: '株式会社A',
      postal_code: '100-0001',
      address: '東京都千代田区丸の内1-1-1',
      phone: '03-1234-5678',
      email: 'contact@company-a.jp',
      industry: '製造業',
      employee_count: 500,
      revenue: 5000000000,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    const customerRecordB = {
      customer_id: 'CUST002',
      customer_name: '(株)A',
      postal_code: '100-0001',
      address: '東京都千代田区丸の内1丁目1番地1号',
      phone: '03-12345678',
      email: 'contact@company-a.jp',
      industry: '製造業',
      employee_count: 505,
      revenue: 5010000000,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    };

    const judgmentResultAB = executeIntegrationJudgment(customerRecordA, customerRecordB);
    const judgmentResultBA = executeIntegrationJudgment(customerRecordB, customerRecordA);

    expect(judgmentResultAB.judgment_score).toBe(judgmentResultBA.judgment_score);
  });
});