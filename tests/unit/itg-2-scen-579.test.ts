import { judgeRuleModerationApproval } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-579
  test('修正ルール案の妥当性スコアが基準値直上である場合、承認判定が実行される', () => {
    const rule_input = {
      rule_id: 'RULE-001',
      rule_name: 'duplicate_customer_merge',
      validity_score: 0.75,
      correction_criteria: 'name_and_phone_match',
      past_approval_count: 12,
      past_rejection_count: 2,
      approval_authority_role: 'manager',
      has_approval_authority: true,
    };

    const result = judgeRuleModerationApproval(rule_input);

    expect(result.status).toBe('approval_judgment_executed');
    expect(result.validity_score).toBe(0.75);
    expect(result.recommendation).toBeDefined();
    expect(result.recommendation).toMatch(/approval|reject/i);
    expect(result.recommendation_basis).toBeDefined();
    expect(typeof result.recommendation_basis).toBe('string');
  });
});