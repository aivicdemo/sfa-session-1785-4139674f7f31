import { classifyAndPrioritizeDetectedProblems } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-800
  test('問題検出結果の分類・優先度付け機能 - 検出日時がシステム日時より未来の問題が混在する場合、エラーになる', () => {
    const system_current_time = new Date('2024-01-15T10:00:00Z');
    const problem_dataset = [
      {
        problem_id: '問題A',
        detection_datetime: new Date('2024-01-15T09:30:00Z'),
        severity: 'high' as const,
        pattern: 'process_deviation',
      },
      {
        problem_id: '問題B',
        detection_datetime: new Date('2024-01-15T11:00:00Z'),
        severity: 'medium' as const,
        pattern: 'data_quality_issue',
      },
      {
        problem_id: '問題C',
        detection_datetime: new Date('2024-01-15T10:00:00Z'),
        severity: 'low' as const,
        pattern: 'proposal_mismatch',
      },
    ];

    const result = classifyAndPrioritizeDetectedProblems(
      problem_dataset,
      system_current_time
    );

    expect(result).toHaveProperty('error_type', 'InvalidDetectionDateError');
    expect(result).toHaveProperty('error_message');
    expect((result as any).error_message).toMatch(/検出日時がシステム日時より未来である問題が存在します/);
    expect((result as any).error_message).toMatch(/問題B/);
  });
});