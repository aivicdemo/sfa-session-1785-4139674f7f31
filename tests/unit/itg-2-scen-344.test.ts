import { detectCustomerDuplicateScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-344
  test('顧客名が空文字列である場合、重複候補スコア計算で当該項目がスキップされる', () => {
    const recordA = {
      customer_id: 'CUST_001',
      customer_name: '',
      email: 'test@example.com',
      phone: '09012345678',
    };

    const recordB = {
      customer_id: 'CUST_002',
      customer_name: '山田太郎',
      email: 'test@example.com',
      phone: '09012345678',
    };

    const result = detectCustomerDuplicateScore(recordA, recordB);

    expect(result.score).toBe(0.9);
    expect(result.breakdown.customer_name_score).toBe(0);
    expect(result.breakdown.email_score).toBe(0.5);
    expect(result.breakdown.phone_score).toBe(0.4);
    expect(result.score_log).toContain('顧客名はスキップされました');
  });
});