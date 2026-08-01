import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-346
  test('営業プロセス定義の標準フローに基づいて乖離度が計算される', () => {
    const standard_process_definition = {
      process_id: 'PROC-001',
      standard_flow_steps: [
        { step_order: 1, step_name: '初期接触' },
        { step_order: 2, step_name: 'ヒアリング' },
        { step_order: 3, step_name: '提案' },
        { step_order: 4, step_name: '商談' },
        { step_order: 5, step_name: 'クローズ' },
      ],
      total_steps: 5,
    };

    const salesperson_id = 'SALES-A001';
    const actual_behavior_log = [
      { step_order: 1, step_name: '初期接触', execution_date: '2024-01-10' },
      { step_order: 2, step_name: '提案', execution_date: '2024-01-12' },
      { step_order: 3, step_name: 'ヒアリング', execution_date: '2024-01-14' },
      { step_order: 4, step_name: '商談', execution_date: '2024-01-16' },
      { step_order: 5, step_name: 'クローズ', execution_date: '2024-01-18' },
    ];

    const analysis_period_start = '2024-01-01';
    const analysis_period_end = '2024-01-31';

    const report = generateBehaviorPatternAnalysisReport(
      standard_process_definition,
      salesperson_id,
      actual_behavior_log,
      analysis_period_start,
      analysis_period_end
    );

    expect(report).toEqual(
      expect.objectContaining({
        salesperson_id: 'SALES-A001',
        analysis_period_start: '2024-01-01',
        analysis_period_end: '2024-01-31',
        deviation_rate: 60,
        standard_flow_steps: [
          { step_order: 1, step_name: '初期接触' },
          { step_order: 2, step_name: 'ヒアリング' },
          { step_order: 3, step_name: '提案' },
          { step_order: 4, step_name: '商談' },
          { step_order: 5, step_name: 'クローズ' },
        ],
        actual_behavior_steps: [
          { step_order: 1, step_name: '初期接触', execution_date: '2024-01-10' },
          { step_order: 2, step_name: '提案', execution_date: '2024-01-12' },
          { step_order: 3, step_name: 'ヒアリング', execution_date: '2024-01-14' },
          { step_order: 4, step_name: '商談', execution_date: '2024-01-16' },
          { step_order: 5, step_name: 'クローズ', execution_date: '2024-01-18' },
        ],
      })
    );

    expect(report.deviation_rate).toBe(60);
  });
});