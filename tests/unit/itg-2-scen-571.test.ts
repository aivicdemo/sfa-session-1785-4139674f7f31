import { judgeRuleApproval } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-571
  test('修正ルール承認判定機能 - 承認対象の修正ルール案が0件の場合、処理が正常に完了し結果が空となる', () => {
    const emptyRuleCandidates: any[] = [];
    
    const result = judgeRuleApproval({
      rule_candidates: emptyRuleCandidates,
      approver_id: 'approver_001',
      approval_authority: true,
    });

    expect(result.status).toBe('completed');
    expect(result.approval_results).toEqual([]);
    expect(result.error_flag).toBe(false);
    expect(result.error_message).toBeNull();
  });
});