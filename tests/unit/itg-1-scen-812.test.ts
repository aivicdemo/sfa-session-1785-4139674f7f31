import { calculateBehaviorPatternAnalysis } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者行動パターン分析レポート生成機能', () => {
  // SCEN-812
  test('特定のステップが営業活動ログに複数件記録されている場合、最初の実行日時をステップ開始時点として記録する', () => {
    const sales_rep_id = 'SR001';
    const step_name = '初回接触';
    const activity_logs = [
      {
        sales_rep_id: sales_rep_id,
        step_name: step_name,
        executed_at: new Date('2024-01-15T09:00:00Z'),
      },
      {
        sales_rep_id: sales_rep_id,
        step_name: step_name,
        executed_at: new Date('2024-01-15T14:30:00Z'),
      },
      {
        sales_rep_id: sales_rep_id,
        step_name: step_name,
        executed_at: new Date('2024-01-15T18:45:00Z'),
      },
    ];

    const result = calculateBehaviorPatternAnalysis({
      sales_rep_id: sales_rep_id,
      activity_logs: activity_logs,
    });

    expect(result.step_start_datetime).toEqual(new Date('2024-01-15T09:00:00Z'));
  });
});