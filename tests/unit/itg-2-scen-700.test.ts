import { calculateProposalNeedsAlignment } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-700
  test("提案資料の項目が1件のとき、スコアが正常に算出される", () => {
    const proposalMaterial = {
      id: "prop_001",
      title: "予算対応プラン",
      items: [
        {
          itemId: "item_001",
          itemName: "予算対応",
          description: "顧客予算内での実装",
        },
      ],
    };

    const customerNeeds = {
      customerId: "cust_001",
      requiredNeeds: [
        {
          needId: "need_001",
          needName: "予算対応",
        },
        {
          needId: "need_002",
          needName: "納期短縮",
        },
        {
          needId: "need_003",
          needName: "サポート体制",
        },
      ],
    };

    const result = calculateProposalNeedsAlignment(
      proposalMaterial,
      customerNeeds
    );

    expect(result.alignmentScore).toBe(33.33);
    expect(result.matchedCount).toBe(1);
    expect(result.totalNeeds).toBe(3);
    expect(result.status).toBe("success");
    expect(result.matchedItems).toEqual(["予算対応"]);
  });
});