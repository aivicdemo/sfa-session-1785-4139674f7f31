import { evaluateProposalAgainstConstraints } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 提案と顧客制約の自動照合', () => {
  test('SCEN-1308: 提案の実装スケジュールが顧客の期間制約を超過するとき、スケジュール適合性が不適合と判定される', () => {
    // Arrange: テスト入力データの準備
    const customerConstraint = {
      customer_id: 'CUST001',
      project_name: 'システム刷新プロジェクト',
      implementation_period_start: new Date('2026-01-01'),
      implementation_period_end: new Date('2026-03-31'),
      implementation_period_months: 3,
      max_budget_yen: 50000000,
      max_budget_period_months: 3,
    };

    const proposalContent = {
      proposal_id: 'PROP001',
      customer_id: 'CUST001',
      implementation_period_start: new Date('2026-01-01'),
      implementation_period_end: new Date('2026-06-30'),
      implementation_period_months: 6,
      estimated_cost_yen: 45000000,
      recommended_approach: 'フェーズ分割実装',
    };

    // Act: 提案と顧客制約条件の自動照合機能を実行
    const result = evaluateProposalAgainstConstraints(
      customerConstraint,
      proposalContent
    );

    // Assert: 期待結果を検証
    // スケジュール適合性判定が『不適合』であること
    expect(result.schedule_compatibility_judgment).toBe('不適合');

    // 不適合理由が『提案実装期間（6ヶ月）が顧客制約期間（3ヶ月）を3ヶ月超過』と記述されていること
    expect(result.incompatibility_reason).toBe(
      '提案実装期間（6ヶ月）が顧客制約期間（3ヶ月）を3ヶ月超過'
    );

    // 営業担当者向けの警告メッセージが返却されていること
    expect(result.warning_message).toBe(
      'スケジュール調整が必要です。顧客期間制約内での実装計画の見直しを推奨します'
    );

    // スケジュール適合性スコアが0（不適合）であること
    expect(result.schedule_compatibility_score).toBe(0);

    // 照合結果が完全にマッピングされていることを確認
    expect(result).toHaveProperty('schedule_compatibility_judgment');
    expect(result).toHaveProperty('incompatibility_reason');
    expect(result).toHaveProperty('warning_message');
    expect(result).toHaveProperty('schedule_compatibility_score');
    expect(result).toHaveProperty('recommended_action');
    expect(result.recommended_action).toBe(
      'スケジュール調整が必要です。顧客期間制約内での実装計画の見直しを推奨します'
    );
  });
});