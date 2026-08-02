import { calculateProposalNeedsAlignment } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-699
  test("提案資料の項目が0件のとき、適合度スコアが0で返される", () => {
    const proposal_items = [];
    const customer_needs = {
      industry: "製造業",
      company_size: "大企業",
      business_challenges: ["生産性向上", "コスト削減"],
      budget_limit: 5000000,
      implementation_timeline: "2024-06-30",
    };

    const result = calculateProposalNeedsAlignment(proposal_items, customer_needs);

    expect(result.score).toBe(0);
    expect(result.status).toBe("COMPLETED");
    expect(result.message).toBe("提案資料の項目がないため、スコアは0となります");
  });
});