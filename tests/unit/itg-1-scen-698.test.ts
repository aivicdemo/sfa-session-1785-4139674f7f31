import { extractAndJudgeSuccessFactors } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-698
  test("[normal] 成功・失敗要因の抽出と承認基準判定機能 - 成功要因が複数件のとき、全件が承認基準判定の対象となる", () => {
    const test_case_id = "TEST-698";
    const success_factors = [
      {
        factor_id: "SF-001",
        project_id: test_case_id,
        factor_type: "営業スキル",
        factor_description: "営業担当者のスキル",
        approval_status: null,
      },
      {
        factor_id: "SF-002",
        project_id: test_case_id,
        factor_type: "顧客適合性",
        factor_description: "顧客ニーズ合致度",
        approval_status: null,
      },
      {
        factor_id: "SF-003",
        project_id: test_case_id,
        factor_type: "タイミング",
        factor_description: "提案タイミング",
        approval_status: null,
      },
    ];

    const result = extractAndJudgeSuccessFactors({
      project_id: test_case_id,
      success_factors: success_factors,
    });

    expect(result).toBeDefined();
    expect(result.processed_factors_count).toBe(3);
    expect(result.all_factors_judged).toBe(true);

    expect(result.judgment_results).toHaveLength(3);

    expect(result.judgment_results[0]).toEqual({
      factor_id: "SF-001",
      project_id: test_case_id,
      factor_type: "営業スキル",
      approval_judgment: expect.any(String),
    });
    expect(["合格", "不合格"]).toContain(result.judgment_results[0].approval_judgment);

    expect(result.judgment_results[1]).toEqual({
      factor_id: "SF-002",
      project_id: test_case_id,
      factor_type: "顧客適合性",
      approval_judgment: expect.any(String),
    });
    expect(["合格", "不合格"]).toContain(result.judgment_results[1].approval_judgment);

    expect(result.judgment_results[2]).toEqual({
      factor_id: "SF-003",
      project_id: test_case_id,
      factor_type: "タイミング",
      approval_judgment: expect.any(String),
    });
    expect(["合格", "不合格"]).toContain(result.judgment_results[2].approval_judgment);

    expect(result.unjudged_factors_count).toBe(0);
  });
});