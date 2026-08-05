import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-733: [normal] AIエージェント推論精度評価機能 - 提案内容と顧客対応パターン両方の分析が完了した状態での推論精度が正しく評価される
  test('提案内容と顧客対応パターン分析結果から推論精度が正しく評価される', () => {
    const proposal_analysis_score = 0.92;
    const customer_response_score = 0.88;
    const expected_integrated_accuracy = 0.90;
    const evaluation_status = 'completed';

    const proposal_input = {
      title: 'クラウドERP導入',
      amount: 5000000,
      proposal_date: '2024-01-15',
      analysis_score: proposal_analysis_score,
    };

    const customer_response_input = {
      customer_id: 'C001',
      response_pattern: '事前ヒアリング→提案→交渉',
      response_score: customer_response_score,
      total_contact_count: 5,
    };

    const evaluation_timestamp_before = new Date();
    const result = calculateInferenceAccuracy({
      proposal_analysis: proposal_input,
      customer_response_analysis: customer_response_input,
    });
    const evaluation_timestamp_after = new Date();

    expect(result.proposal_analysis_score).toBe(0.92);
    expect(result.customer_response_analysis_score).toBe(0.88);
    expect(result.integrated_inference_accuracy).toBe(0.90);
    expect(result.evaluation_status).toBe('completed');
    expect(new Date(result.evaluation_timestamp).getTime()).toBeGreaterThanOrEqual(
      evaluation_timestamp_before.getTime()
    );
    expect(new Date(result.evaluation_timestamp).getTime()).toBeLessThanOrEqual(
      evaluation_timestamp_after.getTime()
    );
  });
});