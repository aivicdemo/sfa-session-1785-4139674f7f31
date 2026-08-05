import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-522: [edge] AIエージェント推論精度の自動監視とアラート機能 - AIエージェント推論ログの記録順序が逆順で入力された場合も時系列で正しく精度が計算される
  test('should calculate inference accuracy correctly when logs are provided in reverse chronological order and generate time-series graph with ascending timestamps', () => {
    const inference_log_1 = {
      inference_id: 'inf-001',
      timestamp: new Date('2024-01-15T14:00:00Z'),
      input_data: { customer_id: 'cust-123', proposal_type: 'solution_a' },
      inference_result: 'success',
      correct_value: 'success',
      is_correct: true,
    };

    const inference_log_2 = {
      inference_id: 'inf-002',
      timestamp: new Date('2024-01-15T14:30:00Z'),
      input_data: { customer_id: 'cust-124', proposal_type: 'solution_b' },
      inference_result: 'failure',
      correct_value: 'success',
      is_correct: false,
    };

    const inference_log_3 = {
      inference_id: 'inf-003',
      timestamp: new Date('2024-01-15T15:00:00Z'),
      input_data: { customer_id: 'cust-125', proposal_type: 'solution_c' },
      inference_result: 'success',
      correct_value: 'success',
      is_correct: true,
    };

    const logs_in_reverse_order = [inference_log_3, inference_log_2, inference_log_1];

    const result = calculateInferenceAccuracy(logs_in_reverse_order);

    expect(result.accuracy_score).toBe(66.67);
    expect(result.total_inferences).toBe(3);
    expect(result.correct_count).toBe(2);
    expect(result.incorrect_count).toBe(1);
    
    expect(result.chronologically_sorted_logs).toHaveLength(3);
    expect(result.chronologically_sorted_logs[0].timestamp).toEqual(new Date('2024-01-15T14:00:00Z'));
    expect(result.chronologically_sorted_logs[1].timestamp).toEqual(new Date('2024-01-15T14:30:00Z'));
    expect(result.chronologically_sorted_logs[2].timestamp).toEqual(new Date('2024-01-15T15:00:00Z'));
    
    expect(result.chronologically_sorted_logs[0].inference_id).toBe('inf-001');
    expect(result.chronologically_sorted_logs[1].inference_id).toBe('inf-002');
    expect(result.chronologically_sorted_logs[2].inference_id).toBe('inf-003');

    expect(result.time_series_graph).toBeDefined();
    expect(result.time_series_graph.x_axis_timestamps).toHaveLength(3);
    expect(result.time_series_graph.x_axis_timestamps[0]).toEqual(new Date('2024-01-15T14:00:00Z'));
    expect(result.time_series_graph.x_axis_timestamps[1]).toEqual(new Date('2024-01-15T14:30:00Z'));
    expect(result.time_series_graph.x_axis_timestamps[2]).toEqual(new Date('2024-01-15T15:00:00Z'));
    
    expect(result.time_series_graph.y_axis_accuracy_values).toEqual([100, 50, 66.67]);
  });
});