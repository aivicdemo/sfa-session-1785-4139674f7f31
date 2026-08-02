import { calculateDuplicateCandidateScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-346
  test('電話番号が欠けている場合、重複候補スコア計算で当該項目がスキップされる', () => {
    const customerA = {
      customer_id: 'CUST_001',
      name: '山田太郎',
      email: 'taro.yamada@example.com',
      address: '東京都渋谷区1-2-3',
      phone: null,
    };

    const customerB = {
      customer_id: 'CUST_002',
      name: '山田太郎',
      email: 'taro.yamada@example.com',
      address: '東京都渋谷区1-2-3',
      phone: undefined,
    };

    const result = calculateDuplicateCandidateScore(customerA, customerB);

    expect(result.score).toBeGreaterThanOrEqual(75);
    expect(result.score).toBeLessThanOrEqual(95);
    expect(result.evaluated_fields).not.toContain('phone');
    expect(result.evaluated_fields).toContain('name');
    expect(result.evaluated_fields).toContain('email');
    expect(result.evaluated_fields).toContain('address');
    expect(result.field_matches).toHaveProperty('name');
    expect(result.field_matches).toHaveProperty('email');
    expect(result.field_matches).toHaveProperty('address');
    expect(result.field_matches).not.toHaveProperty('phone');
    expect(result.skipped_fields).toContain('phone');
  });
});