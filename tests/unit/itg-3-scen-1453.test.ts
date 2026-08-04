import { evaluatePurchaseHistoryDataQuality } from "../../src/logic/it-1-br-3-3-2-1";

describe("購買履歴データ品質判定機能", () => {
  test("SCEN-1453: 商品カテゴリが欠けている購買履歴データが不適合項目に含まれて返される", () => {
    const purchase_history_dataset = [
      {
        product_id: "P001",
        purchase_date: "2026-01-15",
        amount: 5000,
        category: null,
      },
      {
        product_id: "P002",
        purchase_date: "2026-01-16",
        amount: 3000,
        category: "Software",
      },
      {
        product_id: "P003",
        purchase_date: "2026-01-17",
        amount: 8000,
        category: "Hardware",
      },
      {
        product_id: "P004",
        purchase_date: "2026-01-18",
        amount: 2000,
        category: null,
      },
      {
        product_id: "P005",
        purchase_date: "2026-01-19",
        amount: 6000,
        category: "Consulting",
      },
    ];

    const result = evaluatePurchaseHistoryDataQuality(purchase_history_dataset);

    expect(result.overall_status).toBe("不適合");

    expect(result.non_conforming_items).toHaveLength(2);

    const non_conforming_product_ids = result.non_conforming_items.map(
      (item) => item.product_id
    );
    expect(non_conforming_product_ids).toContain("P001");
    expect(non_conforming_product_ids).toContain("P004");

    const item_p001 = result.non_conforming_items.find(
      (item) => item.product_id === "P001"
    );
    expect(item_p001).toEqual({
      product_id: "P001",
      purchase_date: "2026-01-15",
      amount: 5000,
      category: null,
      reason: "商品カテゴリが欠けています",
    });

    const item_p004 = result.non_conforming_items.find(
      (item) => item.product_id === "P004"
    );
    expect(item_p004).toEqual({
      product_id: "P004",
      purchase_date: "2026-01-18",
      amount: 2000,
      category: null,
      reason: "商品カテゴリが欠けています",
    });

    const conforming_product_ids = [
      "P002",
      "P003",
      "P005",
    ];
    conforming_product_ids.forEach((product_id) => {
      const found = result.non_conforming_items.find(
        (item) => item.product_id === product_id
      );
      expect(found).toBeUndefined();
    });
  });
});