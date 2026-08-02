import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複・不整合検出と統合判定', () => {
  test('SCEN-102: メールアドレスが一致する場合、重複確度判定に加味される', () => {
    // Arrange
    const recordA = {
      customer_id: 'CUST-001',
      name: '山田太郎',
      email: 'yamada@example.com',
      phone: '090-1234-5678',
    };

    const recordB = {
      customer_id: 'CUST-002',
      name: '山田太郎',
      email: 'yamada@example.com',
      phone: '090-9999-9999',
    };

    // Act
    const result = detectDuplicateCustomers(recordA, recordB);

    // Assert
    // 重複確度スコアが85点以上であることを確認
    expect(result.duplicate_probability_score).toBeGreaterThanOrEqual(85);

    // 判定結果が『重複の可能性が高い』であることを確認
    expect(result.judgment_result).toBe('重複の可能性が高い');

    // メール一致項目の加算点が20点以上であることを確認
    expect(result.email_score_contribution).toBeGreaterThanOrEqual(20);

    // 判定ロジックの内訳が記録されていることを確認
    expect(result.score_breakdown).toBeDefined();
    expect(result.score_breakdown.name_match_score).toBeGreaterThanOrEqual(0);
    expect(result.score_breakdown.email_match_score).toBeGreaterThanOrEqual(20);
    expect(result.score_breakdown.phone_match_score).toBeGreaterThanOrEqual(0);

    // スコアの合計が期待値と一致することを確認
    const calculated_total_score =
      result.score_breakdown.name_match_score +
      result.score_breakdown.email_match_score +
      result.score_breakdown.phone_match_score;
    expect(result.duplicate_probability_score).toBe(calculated_total_score);
  });
});