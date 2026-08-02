import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業プロセス遵守度スコア計算エンジン', () => {
  // SCEN-284
  test('標準プロセス遵守度スコア計算 - 成約ステップが標準プロセスから1日遅いとき、乖離度として負の値が計算される', () => {
    const standardProcessSteps = [
      {
        step_name: '初期接触',
        scheduled_date: new Date('2024-01-10T09:00:00Z'),
      },
      {
        step_name: '提案',
        scheduled_date: new Date('2024-01-12T10:00:00Z'),
      },
      {
        step_name: '見積提示',
        scheduled_date: new Date('2024-01-13T14:00:00Z'),
      },
      {
        step_name: '成約',
        scheduled_date: new Date('2024-01-15T16:00:00Z'),
      },
    ];

    const actualSteps = [
      {
        step_name: '初期接触',
        actual_date: new Date('2024-01-10T09:00:00Z'),
      },
      {
        step_name: '提案',
        actual_date: new Date('2024-01-12T10:00:00Z'),
      },
      {
        step_name: '見積提示',
        actual_date: new Date('2024-01-13T14:00:00Z'),
      },
      {
        step_name: '成約',
        actual_date: new Date('2024-01-16T16:00:00Z'),
      },
    ];

    const score = calculateProcessComplianceScore({
      standard_process_steps: standardProcessSteps,
      actual_steps: actualSteps,
    });

    expect(score).toBeLessThan(0);
  });
});