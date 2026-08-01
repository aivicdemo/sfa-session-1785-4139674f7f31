import { monitorAIAgentInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-436
  test('同じ入力で監視を2回実行した場合、同じ結果のアラートが生成される', () => {
    const test_inference_accuracy = 80;
    const test_confidence_score = 0.75;
    const test_input_data = {
      agent_id: 'agent_001',
      proposal_content: 'test_proposal',
      customer_id: 'cust_001',
    };

    const first_alert = monitorAIAgentInferenceAccuracy({
      inference_accuracy: test_inference_accuracy,
      confidence_score: test_confidence_score,
      input_data: test_input_data,
    });

    const second_alert = monitorAIAgentInferenceAccuracy({
      inference_accuracy: test_inference_accuracy,
      confidence_score: test_confidence_score,
      input_data: test_input_data,
    });

    expect(first_alert.inference_accuracy).toBe(80);
    expect(first_alert.confidence_score).toBe(0.75);
    expect(second_alert.inference_accuracy).toBe(80);
    expect(second_alert.confidence_score).toBe(0.75);

    expect(first_alert.judgment_reason).toBe(second_alert.judgment_reason);

    expect(first_alert.alert_id).not.toBe(second_alert.alert_id);
    expect(first_alert.occurrence_time).not.toBe(second_alert.occurrence_time);
  });
});