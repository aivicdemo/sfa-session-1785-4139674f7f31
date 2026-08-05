import { monitorAIAgentInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1132
  test('開始日時が終了日時より後のとき、処理がエラーになること', () => {
    const start_datetime = new Date('2024-01-15T10:00:00Z');
    const end_datetime = new Date('2024-01-15T09:00:00Z');
    const monitoring_config = {
      start_datetime,
      end_datetime,
      target_agent_id: 'agent_001',
      accuracy_threshold: 95,
    };

    expect(() => monitorAIAgentInferenceAccuracy(monitoring_config)).toThrow(/開始日時は終了日時より前である必要があります/);
  });
});