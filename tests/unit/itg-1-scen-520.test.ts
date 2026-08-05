import { sortAlertConditionsByPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-520
  test('複数のアラート条件が昇順で正しくソートされて優先度が決定される', () => {
    const unsorted_alert_conditions = [
      { id: 'alert_001', priority: 1, level: 'critical', message: 'System down' },
      { id: 'alert_002', priority: 3, level: 'warning', message: 'High latency' },
      { id: 'alert_003', priority: 2, level: 'high', message: 'Data quality low' },
      { id: 'alert_004', priority: 5, level: 'info', message: 'Update available' },
      { id: 'alert_005', priority: 4, level: 'medium', message: 'CPU usage high' },
    ];

    const sorted_conditions = sortAlertConditionsByPriority(unsorted_alert_conditions);

    expect(sorted_conditions.length).toBe(5);
    expect(sorted_conditions[0].priority).toBe(1);
    expect(sorted_conditions[1].priority).toBe(2);
    expect(sorted_conditions[2].priority).toBe(3);
    expect(sorted_conditions[3].priority).toBe(4);
    expect(sorted_conditions[4].priority).toBe(5);

    const priority_values = sorted_conditions.map(cond => cond.priority);
    expect(priority_values).toEqual([1, 2, 3, 4, 5]);
  });
});