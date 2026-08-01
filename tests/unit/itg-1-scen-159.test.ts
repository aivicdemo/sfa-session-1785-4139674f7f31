import { generateBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-159
  test('改善指導優先順位が低スコアの営業担当者から高い順に決定される', () => {
    const sales_reps = [
      {
        sales_rep_id: 'rep_001',
        sales_rep_name: '田中太郎',
        improvement_priority_score: 45,
      },
      {
        sales_rep_id: 'rep_002',
        sales_rep_name: '佐藤次郎',
        improvement_priority_score: 72,
      },
      {
        sales_rep_id: 'rep_003',
        sales_rep_name: '鈴木三郎',
        improvement_priority_score: 23,
      },
      {
        sales_rep_id: 'rep_004',
        sales_rep_name: '伊藤四郎',
        improvement_priority_score: 88,
      },
      {
        sales_rep_id: 'rep_005',
        sales_rep_name: '渡辺五郎',
        improvement_priority_score: 56,
      },
    ];

    const report = generateBehaviorAnalysisReport(sales_reps);

    expect(report.sorted_sales_reps).toEqual([
      {
        sales_rep_id: 'rep_003',
        sales_rep_name: '鈴木三郎',
        improvement_priority_score: 23,
      },
      {
        sales_rep_id: 'rep_001',
        sales_rep_name: '田中太郎',
        improvement_priority_score: 45,
      },
      {
        sales_rep_id: 'rep_005',
        sales_rep_name: '渡辺五郎',
        improvement_priority_score: 56,
      },
      {
        sales_rep_id: 'rep_002',
        sales_rep_name: '佐藤次郎',
        improvement_priority_score: 72,
      },
      {
        sales_rep_id: 'rep_004',
        sales_rep_name: '伊藤四郎',
        improvement_priority_score: 88,
      },
    ]);
  });
});