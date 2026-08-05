import { monitorInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度自動監視機能', () => {
  // SCEN-1038
  test('推論ログIDが欠落しているとき推論精度監視がエラーになること', () => {
    const inferenceLogDataSet = {
      inferenceLogId: undefined,
      inferenceTimestamp: '2024-01-15T11:00:00Z',
      inferenceModel: 'sales_process_analyzer_v1',
      inputData: {
        salesActivityData: [
          {
            activityId: 'act_001',
            activityType: 'proposal',
            timestamp: '2024-01-15T10:30:00Z',
            content: 'customer meeting for product proposal',
          },
        ],
      },
      outputResult: {
        predictionScore: 0.87,
        recommendedAction: 'follow_up_within_3_days',
        confidenceLevel: 0.92,
      },
      executionDuration: 245,
    };

    expect(() => monitorInferenceAccuracy(inferenceLogDataSet)).toThrow(/推論ログID/);
  });
});