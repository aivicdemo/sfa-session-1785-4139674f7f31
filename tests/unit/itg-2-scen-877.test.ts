import { decideMergeTarget } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-877
  test('統合判定対象の重複顧客が1件のとき、統合判定結果が1件で返される', () => {
    const duplicate_candidates = [
      {
        duplicate_candidate_id: 'DUP-001',
        customer_name: '山田太郎',
        customer_email: 'yamada@example.com',
        duplicate_score: 0.97,
        detection_rule_id: 'RULE-001',
      },
    ];

    const result = decideMergeTarget(duplicate_candidates);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      merge_target_customer_id: 'DUP-001',
      merge_judgment_status: '統合対象',
      duplicate_degree_score: 0.97,
      recommended_action: '手動確認が必要',
    });
    expect(result[0].duplicate_degree_score).toBeGreaterThanOrEqual(0.95);
  });
});