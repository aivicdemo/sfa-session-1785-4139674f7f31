import { calculateProposalNeedsCompatibilityScore } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-712
  test("提案資料と顧客ニーズの適合度スコア化機能 - 顧客課題が提案内容で完全に解決でき、課題適合スコアが最高値になる", () => {
    const customer_needs = [
      { need_id: "need_001", need_title: "既存システムの保守コスト削減", need_category: "cost" },
      { need_id: "need_002", need_title: "運用業務の自動化", need_category: "automation" },
      { need_id: "need_003", need_title: "セキュリティ強化", need_category: "security" }
    ];

    const proposal_content = [
      { item_id: "item_001", solution_name: "既存システムの保守コスト削減", coverage_status: "対応", need_id: "need_001" },
      { item_id: "item_002", solution_name: "運用業務の自動化", coverage_status: "対応", need_id: "need_002" },
      { item_id: "item_003", solution_name: "セキュリティ強化", coverage_status: "対応", need_id: "need_003" }
    ];

    const result = calculateProposalNeedsCompatibilityScore({
      customer_needs: customer_needs,
      proposal_content: proposal_content
    });

    expect(result.compatibility_score).toBe(100);
    expect(result.coverage_count).toBe(3);
    expect(result.total_needs_count).toBe(3);
    expect(result.judgment_result).toBe("すべての顧客課題が提案内容により解決可能");
    expect(result.mapping_results).toEqual([
      { need_id: "need_001", need_title: "既存システムの保守コスト削減", is_covered: true },
      { need_id: "need_002", need_title: "運用業務の自動化", is_covered: true },
      { need_id: "need_003", need_title: "セキュリティ強化", is_covered: true }
    ]);
  });
});