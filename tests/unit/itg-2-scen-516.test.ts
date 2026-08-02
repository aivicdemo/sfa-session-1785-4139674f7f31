import { judgeCustomerIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-516: [edge] 顧客データ重複検知・統合判定機能 - 重複スコアが0のとき、統合対象外として判定される
  test('重複スコアが0の場合、統合対象外と判定され、統合フラグがfalseになる', () => {
    const recordA = {
      customer_id: 'CUST001',
      name: '株式会社ABC',
      email: 'contact@abc.com',
      phone: '03-1111-2222',
      address: '東京都渋谷区',
      industry: '製造業',
      created_at: new Date('2024-01-15T10:00:00Z'),
    };

    const recordB = {
      customer_id: 'CUST002',
      name: '株式会社XYZ',
      email: 'contact@xyz.com',
      phone: '03-3333-4444',
      address: '大阪府大阪市',
      industry: '小売業',
      created_at: new Date('2024-01-16T10:00:00Z'),
    };

    const duplicate_score = 0;
    const duplicate_threshold = 0.8;

    const result = judgeCustomerIntegration({
      record_a: recordA,
      record_b: recordB,
      duplicate_score: duplicate_score,
      duplicate_threshold: duplicate_threshold,
    });

    expect(result.should_integrate).toBe(false);
    expect(result.integration_status).toBe('対象外');
    expect(result.integration_flag).toBe(false);
  });
});