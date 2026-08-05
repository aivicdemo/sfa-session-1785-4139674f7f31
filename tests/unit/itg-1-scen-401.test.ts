import { evaluateSuccessPatternApplicability } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-401: [error] 成功パターンマトリクス適用判定機能 - 成功パターンの最小サンプルサイズ要件を満たさないとき参照対象外として除外される
  test("should exclude success pattern with insufficient sample size from applicable patterns list", () => {
    const minSampleSizeRequirement = 30;
    const insufficientSampleSize = 29;

    const successPatternWithInsufficientSamples = {
      pattern_id: "pat_001",
      customer_attribute: "enterprise",
      business_stage: "proposal",
      issue_pattern: "cost_reduction",
      sample_size: insufficientSampleSize,
      success_rate: 0.75,
      created_at: new Date("2024-01-15T10:00:00Z").toISOString(),
    };

    const evaluationInput = {
      min_sample_size: minSampleSizeRequirement,
      patterns: [successPatternWithInsufficientSamples],
      evaluation_timestamp: new Date("2024-01-15T11:00:00Z").toISOString(),
    };

    const result = evaluateSuccessPatternApplicability(evaluationInput);

    expect(result.applicable_patterns).toEqual([]);
    expect(result.excluded_patterns).toHaveLength(1);
    expect(result.excluded_patterns[0]).toMatchObject({
      pattern_id: "pat_001",
      exclusion_reason_code: "insufficient_sample_size",
    });
    expect(result.excluded_patterns[0].exclusion_reason).toMatch(
      /サンプルサイズ不足により除外/
    );
  });
});