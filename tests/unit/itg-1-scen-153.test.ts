import { generateSalesProcessAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-153: 標準プロセスの1ステップのみが乖離したとき、乖離パターンが正常に記録される', () => {
    const standard_process_steps = [
      { step_id: 'step_a', step_name: 'A', sequence: 1 },
      { step_id: 'step_b', step_name: 'B', sequence: 2 },
      { step_id: 'step_c', step_name: 'C', sequence: 3 },
      { step_id: 'step_d', step_name: 'D', sequence: 4 }
    ];

    const sales_rep_id = 'rep_001';
    const action_timestamp = new Date('2024-01-15T10:00:00Z');
    const deviation_timestamp = new Date('2024-01-15T14:30:00Z');

    const sales_activities = [
      {
        sales_rep_id: sales_rep_id,
        activity_id: 'activity_001',
        process_step_id: 'step_a',
        activity_timestamp: action_timestamp
      },
      {
        sales_rep_id: sales_rep_id,
        activity_id: 'activity_002',
        process_step_id: 'step_b',
        activity_timestamp: new Date('2024-01-15T11:00:00Z')
      },
      {
        sales_rep_id: sales_rep_id,
        activity_id: 'activity_003',
        process_step_id: 'step_d',
        activity_timestamp: deviation_timestamp
      },
      {
        sales_rep_id: sales_rep_id,
        activity_id: 'activity_004',
        process_step_id: 'step_c',
        activity_timestamp: new Date('2024-01-15T15:00:00Z')
      }
    ];

    const report = generateSalesProcessAnalysisReport({
      standard_process_steps: standard_process_steps,
      sales_activities: sales_activities,
      sales_rep_id: sales_rep_id
    });

    expect(report).toBeDefined();
    expect(report.sales_rep_id).toBe('rep_001');
    expect(report.deviation_patterns).toBeDefined();
    expect(Array.isArray(report.deviation_patterns)).toBe(true);
    expect(report.deviation_patterns.length).toBe(1);

    const deviation_record = report.deviation_patterns[0];
    expect(deviation_record.deviation_step_position).toBe(3);
    expect(deviation_record.standard_step_name).toBe('C');
    expect(deviation_record.actual_step_name).toBe('D');
    expect(deviation_record.deviation_classification).toBe('ステップ順序の逆転');
    expect(deviation_record.deviation_count).toBe(1);
    expect(deviation_record.deviation_occurred_at).toEqual(deviation_timestamp);
  });
});