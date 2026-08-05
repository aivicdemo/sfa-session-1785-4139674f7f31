import { monitorAiInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-482
  test('AIエージェント推論精度監視テーブルが欠落している場合、エラーを返す', async () => {
    const mockDbConnection = {
      query: jest.fn().mockRejectedValueOnce(
        new Error('Table "ai_agent_inference_accuracy_monitoring" does not exist')
      ),
    };

    const input_params = {
      db_connection: mockDbConnection,
      monitoring_table_name: 'ai_agent_inference_accuracy_monitoring',
      inference_id: 'INF_20240115_001',
      accuracy_score: 85.5,
      timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
    };

    await expect(() =>
      monitorAiInferenceAccuracy(input_params)
    ).rejects.toThrow(/AIエージェント推論精度監視テーブル/);
  });
});