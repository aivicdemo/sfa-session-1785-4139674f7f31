import { calculateProposalNeedsAlignment } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-737
  test("提案資料と顧客ニーズの適合度スコア化機能 - 不適合項目の理由が正確に明示される", () => {
    const proposal = {
      product_category: "クラウドストレージ",
      deployment_type: "cloud",
      price_min_monthly: 50000,
      price_max_monthly: 150000,
    };

    const customer_needs = {
      required_deployment: "on_premises",
      budget_limit_monthly: 30000,
    };

    const result = calculateProposalNeedsAlignment(proposal, customer_needs);

    expect(result.alignment_score).toBe(0);
    expect(result.misaligned_items).toHaveLength(2);

    const deployment_mismatch = result.misaligned_items.find(
      (item) => item.field === "デプロイ方式"
    );
    expect(deployment_mismatch).toBeDefined();
    expect(deployment_mismatch?.reason).toBe(
      "顧客がオンプレミス対応を必須としているが、提案資料ではクラウドストレージのみの対応となっている"
    );

    const price_mismatch = result.misaligned_items.find(
      (item) => item.field === "価格"
    );
    expect(price_mismatch).toBeDefined();
    expect(price_mismatch?.reason).toBe(
      "提案資料の価格帯（月額5万円～）が顧客予算上限（月額3万円）を超過している"
    );
  });
});