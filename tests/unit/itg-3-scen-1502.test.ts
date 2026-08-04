import { validatePurchaseHistoryData } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  // SCEN-1502
  test("購買日付が空文字列のとき不適合項目に追加される", () => {
    const purchaseHistoryDataset = [
      {
        purchaseId: "PUR-001",
        customerId: "CUST-123",
        purchaseDate: "",
        productCategory: "ソフトウェア",
        quantity: 5,
        unitPrice: 10000,
      },
      {
        purchaseId: "PUR-002",
        customerId: "CUST-123",
        purchaseDate: "",
        productCategory: "ハードウェア",
        quantity: 2,
        unitPrice: 50000,
      },
      {
        purchaseId: "PUR-003",
        customerId: "CUST-124",
        purchaseDate: "2024-01-15",
        productCategory: "サービス",
        quantity: 1,
        unitPrice: 100000,
      },
    ];

    const result = validatePurchaseHistoryData(purchaseHistoryDataset);

    expect(result.qualityScore).toBeLessThan(100);
    expect(result.defectiveItems).toHaveLength(2);
    expect(result.defectiveItems[0]).toEqual({
      purchaseId: "PUR-001",
      defectCode: "MISSING_PURCHASE_DATE",
      defectMessage: "購買日付: 必須項目が未入力です",
    });
    expect(result.defectiveItems[1]).toEqual({
      purchaseId: "PUR-002",
      defectCode: "MISSING_PURCHASE_DATE",
      defectMessage: "購買日付: 必須項目が未入力です",
    });
    expect(result.isLearningDataQuality).toBe(false);
  });
});