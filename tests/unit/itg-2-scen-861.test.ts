import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-861
  test("should judge as non-duplicate when similarity score falls 1 point below threshold", () => {
    const threshold = 80;
    const customerA = {
      id: "cust_001",
      name: "山田太郎",
      address: "東京都渋谷区",
      phone: "09012345678",
    };
    const customerB = {
      id: "cust_002",
      name: "山田太郎",
      address: "東京都渋谷区",
      phone: "09012345679",
    };

    const result = detectDuplicateCustomers(
      {
        customers: [customerA, customerB],
        similarityThreshold: threshold,
      },
      {
        calculateSimilarityScore: () => 79,
      }
    );

    expect(result.isDuplicate).toBe(false);
    expect(result.similarityScore).toBe(79);
    expect(result.threshold).toBe(80);
    expect(result.judgmentLog).toMatch(/類似度スコア: 79ポイント/);
    expect(result.judgmentLog).toMatch(/閾値: 80ポイント/);
    expect(result.judgmentLog).toMatch(/判定: 重複対象外/);
  });
});