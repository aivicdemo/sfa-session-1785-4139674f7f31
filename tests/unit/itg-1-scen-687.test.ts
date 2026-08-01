import { calculatePriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-687
  test('改善優先度スコア算出機能 - 提案内容の問題パターンについて優先度スコアが計算される', () => {
    const proposalIssues = {
      technical_spec_clarity: false,
      customer_requirement_clarity: false,
      budget_basis_provided: false,
      implementation_schedule_defined: false,
    };

    const result = calculatePriorityScore(proposalIssues);

    expect(result).toEqual({
      technical_spec_score: 30,
      customer_requirement_score: 25,
      budget_basis_score: 35,
      implementation_schedule_score: 28,
      total_priority_score: 118,
    });
  });
});