import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-451
  test("顧客名と住所の両方が一致する場合、重複と判定される", () => {
    const record1 = {
      customerId: "C001",
      customerName: "山田太郎",
      address: "東京都渋谷区道玄坂1-2-3",
    };

    const record2 = {
      customerId: "C002",
      customerName: "山田太郎",
      address: "東京都渋谷区道玄坂1-2-3",
    };

    const result = detectDuplicateCustomers([record1, record2]);

    expect(result.isDuplicate).toBe(true);
    expect(result.mergeRecommendationScore).toBe(100);
    expect(result.duplicatePairIds).toEqual(["C001", "C002"]);
  });
});