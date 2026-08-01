import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-505
  test('[normal] AIエージェント推論精度スコア算出機能 - 推論結果に重複データが含まれる場合、精度スコアの算出で重複が適切に処理される', () => {
    const infer_result_dataset = [
      {
        inference_id: 'INF-001',
        customer_id: 'C001',
        sales_stage: '提案',
        confidence_score: 0.85,
      },
      {
        inference_id: 'INF-001',
        customer_id: 'C001',
        sales_stage: '提案',
        confidence_score: 0.85,
      },
      {
        inference_id: 'INF-001',
        customer_id: 'C001',
        sales_stage: '提案',
        confidence_score: 0.85,
      },
      {
        inference_id: 'INF-002',
        customer_id: 'C002',
        sales_stage: '初回接触',
        confidence_score: 0.78,
      },
      {
        inference_id: 'INF-003',
        customer_id: 'C003',
        sales_stage: '交渉',
        confidence_score: 0.91,
      },
      {
        inference_id: 'INF-004',
        customer_id: 'C004',
        sales_stage: '成約',
        confidence_score: 0.88,
      },
      {
        inference_id: 'INF-005',
        customer_id: 'C005',
        sales_stage: '提案',
        confidence_score: 0.82,
      },
      {
        inference_id: 'INF-006',
        customer_id: 'C006',
        sales_stage: '初回接触',
        confidence_score: 0.75,
      },
      {
        inference_id: 'INF-007',
        customer_id: 'C007',
        sales_stage: '交渉',
        confidence_score: 0.89,
      },
      {
        inference_id: 'INF-008',
        customer_id: 'C008',
        sales_stage: '成約',
        confidence_score: 0.86,
      },
    ];

    const result = calculateInferenceAccuracyScore(infer_result_dataset);

    expect(result.accuracy_score).toBeGreaterThanOrEqual(0.0);
    expect(result.accuracy_score).toBeLessThanOrEqual(1.0);
    expect(result.accuracy_score).toBe(0.82);
    expect(result.unique_data_count).toBe(7);
    expect(result.duplicate_count).toBe(3);
    expect(result.processing_log).toMatch(/処理対象データ件数：7件/);
    expect(result.processing_log).toMatch(/重複3件を除外/);
  });
});