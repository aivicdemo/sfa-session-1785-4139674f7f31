import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-634
  test("重複判定結果に確度スコアが含まれる", () => {
    const customerA = {
      id: "cust_001",
      name: "山田太郎",
      address: "東京都渋谷区",
      phone: "090-1234-5678",
    };

    const customerB = {
      id: "cust_002",
      name: "山田太郎",
      address: "東京都渋谷区",
      phone: "090-1234-5678",
    };

    const result = detectDuplicateCustomers([customerA, customerB]);

    expect(result).toHaveProperty("duplicates");
    expect(Array.isArray(result.duplicates)).toBe(true);
    expect(result.duplicates.length).toBeGreaterThan(0);

    const duplicate = result.duplicates[0];
    expect(duplicate).toHaveProperty("confidenceScore");

    const confidenceScore = duplicate.confidenceScore;
    expect(typeof confidenceScore).toBe("number");
    expect(confidenceScore).toBeGreaterThanOrEqual(0);
    expect(confidenceScore).toBeLessThanOrEqual(100);

    const decimalPlaces = (confidenceScore.toString().split(".")[1] || "").length;
    expect(decimalPlaces).toBeLessThanOrEqual(1);

    expect(confidenceScore).toBe(95.5);
  });
});