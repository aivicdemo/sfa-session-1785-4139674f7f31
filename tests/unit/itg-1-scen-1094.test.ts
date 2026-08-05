import { calculateProcessDeviationScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターン分析・標準プロセス乖離分析機能', () => {
  test('SCEN-1094: 標準プロセスステップに従った営業担当者の行動について、乖離度0として計算される', () => {
    const standard_process_steps = [
      { step_id: 1, step_name: '初期接触', sequence_order: 1 },
      { step_id: 2, step_name: 'ニーズ把握', sequence_order: 2 },
      { step_id: 3, step_name: '提案', sequence_order: 3 },
      { step_id: 4, step_name: '交渉', sequence_order: 4 },
      { step_id: 5, step_name: '契約締結', sequence_order: 5 }
    ];

    const sales_rep_activity_history = [
      { activity_id: 101, sales_rep_id: 'A001', process_step_id: 1, activity_date: '2024-01-15' },
      { activity_id: 102, sales_rep_id: 'A001', process_step_id: 2, activity_date: '2024-01-16' },
      { activity_id: 103, sales_rep_id: 'A001', process_step_id: 3, activity_date: '2024-01-17' },
      { activity_id: 104, sales_rep_id: 'A001', process_step_id: 4, activity_date: '2024-01-18' },
      { activity_id: 105, sales_rep_id: 'A001', process_step_id: 5, activity_date: '2024-01-19' }
    ];

    const deviation_score = calculateProcessDeviationScore(
      standard_process_steps,
      sales_rep_activity_history,
      'A001'
    );

    expect(deviation_score).toBe(0.0);
  });
});