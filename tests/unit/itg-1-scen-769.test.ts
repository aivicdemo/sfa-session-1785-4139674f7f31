import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateRepresentativeConfidenceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-769: [edge] AIエージェント推論精度評価機能 - 推論ログが同一の信頼度値で複数件並ぶとき、代表値算出ルールが正しく適用される
  test('同一信頼度値0.85で複数件の推論ログが存在する場合、代表値算出ルールが正しく適用され、算出された代表値が0.85であり、適用ルール（最頻値使用）が設計仕様に合致している', () => {
    // 推論ログテーブルに同じ信頼度値（例：0.85）を持つレコード5件を想定
    const inference_logs = [
      {
        agent_inference_log_id: 1,
        confidence_score: 0.85,
        inference_timestamp: new Date('2024-01-15T10:00:00Z'),
        model_output_text: 'Pattern A detected',
        reasoning_process: 'Rule-based match'
      },
      {
        agent_inference_log_id: 2,
        confidence_score: 0.85,
        inference_timestamp: new Date('2024-01-15T10:05:00Z'),
        model_output_text: 'Pattern A detected',
        reasoning_process: 'Rule-based match'
      },
      {
        agent_inference_log_id: 3,
        confidence_score: 0.85,
        inference_timestamp: new Date('2024-01-15T10:10:00Z'),
        model_output_text: 'Pattern A detected',
        reasoning_process: 'Rule-based match'
      },
      {
        agent_inference_log_id: 4,
        confidence_score: 0.85,
        inference_timestamp: new Date('2024-01-15T10:15:00Z'),
        model_output_text: 'Pattern A detected',
        reasoning_process: 'Rule-based match'
      },
      {
        agent_inference_log_id: 5,
        confidence_score: 0.85,
        inference_timestamp: new Date('2024-01-15T10:20:00Z'),
        model_output_text: 'Pattern A detected',
        reasoning_process: 'Rule-based match'
      }
    ];

    // 各レコードの信頼度値を確認し、すべてが0.85であることを検証
    inference_logs.forEach((log) => {
      expect(log.confidence_score).toBe(0.85);
    });

    // 代表値算出関数を呼び出し、信頼度値0.85の複数件に対する集計処理を実行
    const result = calculateRepresentativeConfidenceScore(
      inference_logs.map((log) => log.confidence_score)
    );

    // 算出された代表値と適用されたルール（最頻値）をアサート
    expect(result).toEqual({
      representative_score: 0.85,
      calculation_method: 'mode',
      source_record_count: 5,
      all_scores_identical: true
    });

    // 代表値が信頼度値0.85と一致することを確認
    expect(result.representative_score).toBe(0.85);

    // 算出ルールのロジックが期待通り（仕様で定義されたルール = 最頻値使用）であることを検証
    expect(result.calculation_method).toBe('mode');
    expect(result.all_scores_identical).toBe(true);
  });
});