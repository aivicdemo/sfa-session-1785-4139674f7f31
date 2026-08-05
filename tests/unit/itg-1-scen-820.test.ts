import { calculateIssueImportance } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-820: [normal] 問題検出結果の重要度・根拠・対応必要性判定機能 - 提案内容の問題と顧客対応パターンの問題の組み合わせで重要度が判定される
  test('提案金額超過と顧客接触断絶の複合要因で重要度が高と判定される', () => {
    const proposalIssue = {
      type: 'budget_exceeded' as const,
      exceeded_percentage: 20,
    };

    const contactPatternIssue = {
      type: 'contact_discontinued' as const,
      contact_absence_months: 3,
    };

    const result = calculateIssueImportance({
      proposal_issue: proposalIssue,
      contact_pattern_issue: contactPatternIssue,
    });

    expect(result.importance_level).toBe('high');
    expect(result.reason).toMatch(/提案金額超過.*20%/);
    expect(result.reason).toMatch(/顧客接触断絶/);
    expect(result.reason).toMatch(/複合要因/);
    expect(result.action_required).toBe(true);
  });
});