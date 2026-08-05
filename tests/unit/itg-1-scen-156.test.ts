import { determineInferenceExecutionPermission } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行可否判定機能', () => {
  // SCEN-156
  test('データ品質スコアが許容下限を直上で推論実行が許可される', () => {
    const data_quality_score = 60.1;
    const quality_threshold = 60;
    const user_has_permission = true;
    const input_data_format_valid = true;
    const business_rules_satisfied = true;

    const result = determineInferenceExecutionPermission({
      data_quality_score,
      quality_threshold,
      user_has_permission,
      input_data_format_valid,
      business_rules_satisfied,
    });

    expect(result.inference_execution_permitted).toBe(true);
    expect(result.inference_execution_status).toBe('executable');
  });
});