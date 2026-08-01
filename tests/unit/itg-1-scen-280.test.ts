import { determineApplicableApproach } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-280
  test("成功パターンマトリクス参照による提案アプローチ判定機能 - 成功パターンマトリクスのレコードが存在しない場合、適用可能なアプローチは特定されない", () => {
    const input = {
      industry: "製造業",
      company_size: "中堅",
      issue_classification: "営業効率化",
    };

    const result = determineApplicableApproach(input);

    expect(result).toEqual({
      approaches: [],
      status: "NO_APPLICABLE_APPROACH",
    });
    expect(result.approaches).toHaveLength(0);
    expect(result.status).toBe("NO_APPLICABLE_APPROACH");
  });
});