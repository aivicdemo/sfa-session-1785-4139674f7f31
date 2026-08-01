import { evaluateInferenceAccuracyForMultipleLogs } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-430
  test('監視対象となるAIエージェント推論ログが複数件の場合、全件に対して精度が評価される', () => {
    const inference_logs = [
      {
        inference_id: 'agent-001-20240115-001',
        correct_count: 8,
        total_count: 10,
      },
      {
        inference_id: 'agent-001-20240115-002',
        correct_count: 9,
        total_count: 10,
      },
      {
        inference_id: 'agent-001-20240115-003',
        correct_count: 7,
        total_count: 10,
      },
    ];

    const result = evaluateInferenceAccuracyForMultipleLogs(inference_logs);

    expect(result).toEqual({
      monitoring_records: [
        {
          inference_id: 'agent-001-20240115-001',
          accuracy_score: 80,
        },
        {
          inference_id: 'agent-001-20240115-002',
          accuracy_score: 90,
        },
        {
          inference_id: 'agent-001-20240115-003',
          accuracy_score: 70,
        },
      ],
      total_evaluated: 3,
    });
    expect(result.monitoring_records.length).toBe(3);
    expect(result.monitoring_records[0].accuracy_score).toBe(80);
    expect(result.monitoring_records[1].accuracy_score).toBe(90);
    expect(result.monitoring_records[2].accuracy_score).toBe(70);
    expect(result.total_evaluated).toBe(3);
  });
});