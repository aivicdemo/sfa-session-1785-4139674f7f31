import { calculateProposalNeedsAlignmentScore } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-693
  test("提案資料と顧客ニーズの適合度スコア化機能 - 提案資料の全項目が顧客ニーズと完全に適合し、スコア100が算出される", () => {
    const customer_needs = {
      budget_range: "500万円～1000万円",
      delivery_period: "3ヶ月以内",
      feature_a: "データ分析機能",
      feature_b: "リアルタイム更新機能",
      support_system: "24時間サポート体制",
    };

    const proposal_document = {
      budget_coverage: "500万円～1000万円対応",
      delivery_commitment: "3ヶ月以内納期保証",
      feature_a_description: "高度なデータ分析機能を搭載",
      feature_b_description: "リアルタイム更新機能を完全実装",
      support_description: "24時間サポート体制を提供",
    };

    const result = calculateProposalNeedsAlignmentScore(
      customer_needs,
      proposal_document
    );

    expect(result.score).toBe(100);
    expect(result.evaluation_status).toBe("完全適合");
  });
});