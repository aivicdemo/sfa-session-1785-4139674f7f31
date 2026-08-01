import { calculateSuccessPatternApplicationMetrics } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-723
  test('成功パターン適用ガイドラインの周知完了判定機能 - 実務適用報告を提出した営業担当者の実務適用状況が正しく集計される', () => {
    const salesRepA = {
      id: 'rep_001',
      name: 'A',
      assigned_patterns: ['pattern_1'],
    };

    const salesRepB = {
      id: 'rep_002',
      name: 'B',
      assigned_patterns: ['pattern_2'],
    };

    const salesRepC = {
      id: 'rep_003',
      name: 'C',
      assigned_patterns: ['pattern_1', 'pattern_2'],
    };

    const applicationReports = [
      {
        sales_rep_id: 'rep_001',
        pattern_id: 'pattern_1',
        implementation_count: 5,
        success_rate: 0.8,
      },
      {
        sales_rep_id: 'rep_002',
        pattern_id: 'pattern_2',
        implementation_count: 3,
        success_rate: 0.66,
      },
      {
        sales_rep_id: 'rep_003',
        pattern_id: 'pattern_1',
        implementation_count: 2,
        success_rate: 1.0,
      },
      {
        sales_rep_id: 'rep_003',
        pattern_id: 'pattern_2',
        implementation_count: 4,
        success_rate: 0.75,
      },
    ];

    const salesReps = [salesRepA, salesRepB, salesRepC];

    const result = calculateSuccessPatternApplicationMetrics(
      salesReps,
      applicationReports
    );

    expect(result.patterns).toHaveLength(2);

    const pattern1Metrics = result.patterns.find(
      (p) => p.pattern_id === 'pattern_1'
    );
    expect(pattern1Metrics).toBeDefined();
    expect(pattern1Metrics?.target_sales_rep_count).toBe(2);
    expect(pattern1Metrics?.reporting_sales_rep_count).toBe(2);
    expect(pattern1Metrics?.total_implementation_count).toBe(7);
    expect(pattern1Metrics?.weighted_average_success_rate).toBeCloseTo(
      0.857142857,
      5
    );

    const pattern2Metrics = result.patterns.find(
      (p) => p.pattern_id === 'pattern_2'
    );
    expect(pattern2Metrics).toBeDefined();
    expect(pattern2Metrics?.target_sales_rep_count).toBe(2);
    expect(pattern2Metrics?.reporting_sales_rep_count).toBe(2);
    expect(pattern2Metrics?.total_implementation_count).toBe(7);
    expect(pattern2Metrics?.weighted_average_success_rate).toBeCloseTo(
      0.728571429,
      5
    );
  });
});