import { judgeAiInferenceExecutionEligibility } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行可否判定機能', () => {
  // SCEN-159
  test('営業活動ログの業務上最大件数が学習データ要件を満たすと判定される', () => {
    const sales_activity_log_count = 10000;
    const learning_data_requirement_threshold = 10000;
    const data_quality_score = 0.95;

    const result = judgeAiInferenceExecutionEligibility({
      sales_activity_log_count,
      learning_data_requirement_threshold,
      data_quality_score,
    });

    expect(result.is_eligible).toBe(true);
    expect(result.status).toBe('推論実行可能');
    expect(result.reason).toContain('営業活動ログ件数（10000件）が学習データ要件（10000件）以上を満たしています');
  });
});