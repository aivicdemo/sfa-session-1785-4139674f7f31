import { calculateDuplicateCandidateScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-343
  test('顧客名が欠けている場合、重複候補スコア計算で当該項目がスキップされる', () => {
    const customerDataA = {
      customer_name: null,
      email_address: 'test@example.com',
      phone_number: '09012345678'
    };

    const customerDataB = {
      customer_name: '山田太郎',
      email_address: 'test@example.com',
      phone_number: '09012345678'
    };

    const result = calculateDuplicateCandidateScore(customerDataA, customerDataB);

    expect(result.score).toBeGreaterThanOrEqual(0.8);
    expect(result.score).toBeLessThanOrEqual(0.95);
    expect(result.calculation_log).not.toContain('顧客名');
    expect(result.calculation_log).toContain('メールアドレス');
    expect(result.calculation_log).toContain('電話番号');
    expect(result.score).toBe(0.8);
  });
});