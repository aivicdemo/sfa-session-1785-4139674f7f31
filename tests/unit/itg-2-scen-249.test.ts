import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-249
  test("類似度がちょうど判定閾値のとき、統合判定が閾値以上として判定される", () => {
    const threshold = 0.85;
    const customerDataA = {
      id: "CUST_001",
      name: "山田太郎",
      address: "東京都渋谷区",
      phone: "090-1234-5678",
    };
    const customerDataB = {
      id: "CUST_002",
      name: "山田太郎",
      address: "東京都渋谷区",
      phone: "090-1234-5679",
    };

    const result = detectDuplicateCustomers([customerDataA, customerDataB], {
      similarityThreshold: threshold,
    });

    expect(result).toEqual({
      duplicates: [
        {
          customerA_id: "CUST_001",
          customerB_id: "CUST_002",
          similarity_score: 0.85,
          merge_decision: "重複の可能性あり",
          is_threshold_met: true,
        },
      ],
      quality_score: expect.any(Number),
    });

    expect(result.duplicates[0].similarity_score).toBe(0.85);
    expect(result.duplicates[0].is_threshold_met).toBe(true);
    expect(result.duplicates[0].merge_decision).toBe("重複の可能性あり");
  });
});