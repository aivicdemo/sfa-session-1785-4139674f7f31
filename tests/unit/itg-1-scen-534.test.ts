import { calculateTeamImprovementIssues } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-534: [normal] チーム全体の改善課題の数値化と提示機能
  test('営業担当者全体の成約率から改善課題が数値化されて抽出される', () => {
    // 営業担当者5名のデータセット
    const sales_reps = [
      { rep_id: 'rep_001', rep_name: '営業担当者A', close_rate: 65.0 },
      { rep_id: 'rep_002', rep_name: '営業担当者B', close_rate: 72.0 },
      { rep_id: 'rep_003', rep_name: '営業担当者C', close_rate: 58.0 },
      { rep_id: 'rep_004', rep_name: '営業担当者D', close_rate: 80.0 },
      { rep_id: 'rep_005', rep_name: '営業担当者E', close_rate: 70.0 },
    ];

    // 期待結果の計算
    // チーム全体の平均成約率: (65 + 72 + 58 + 80 + 70) / 5 = 345 / 5 = 69.0%
    // 平均値（69.0%）以下の担当者: rep_001（65%）、rep_003（58%）= 2名
    // 改善目標: 75%以上
    // 改善効果試算: 月間提案件数の仮定値から +3件/月

    const improvement_issues = calculateTeamImprovementIssues(sales_reps);

    // 改善課題の構成を検証
    expect(improvement_issues).toEqual({
      team_avg_close_rate: 69.0,
      below_avg_count: 2,
      below_avg_reps: [
        { rep_id: 'rep_001', rep_name: '営業担当者A', close_rate: 65.0 },
        { rep_id: 'rep_003', rep_name: '営業担当者C', close_rate: 58.0 },
      ],
      improvement_issue: {
        description: '成約率が69.0%（平均値）以下の担当者2名を対象に、成約率向上トレーニング実施（目標：75%以上）',
        priority: '高',
        target_close_rate: 75.0,
        estimated_additional_deals_per_month: 3,
      },
    });

    // 個別フィールドの値検証
    expect(improvement_issues.team_avg_close_rate).toBe(69.0);
    expect(improvement_issues.below_avg_count).toBe(2);
    expect(improvement_issues.improvement_issue.priority).toBe('高');
    expect(improvement_issues.improvement_issue.target_close_rate).toBe(75.0);
    expect(improvement_issues.improvement_issue.estimated_additional_deals_per_month).toBe(3);
  });
});