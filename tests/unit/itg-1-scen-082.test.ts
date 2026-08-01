import { validateInferencePrerequisites } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-082: [normal] AIエージェント推論実行前の学習データ量・品質検証機能 - 学習データが複数件存在し品質がすべて良好な場合、推論実行が許可される', () => {
    const learning_data_records = [
      {
        id: 'ld001',
        quality_score: 85,
        data_completeness_flag: '完全',
        created_at: '2024-01-10T09:00:00Z'
      },
      {
        id: 'ld002',
        quality_score: 90,
        data_completeness_flag: '完全',
        created_at: '2024-01-11T10:30:00Z'
      },
      {
        id: 'ld003',
        quality_score: 82,
        data_completeness_flag: '完全',
        created_at: '2024-01-12T14:15:00Z'
      }
    ];

    const result = validateInferencePrerequisites(learning_data_records);

    expect(result.status).toBe('OK');
    expect(result.inference_execution_permission).toBe('許可');
    expect(result.error_message).toBe('');
    expect(result.minimum_data_count_satisfied).toBe(true);
    expect(result.all_quality_scores_good).toBe(true);
    expect(result.all_data_complete).toBe(true);
  });
});