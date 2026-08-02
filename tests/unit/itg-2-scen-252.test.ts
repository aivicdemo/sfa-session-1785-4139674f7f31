import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-252: [normal] 顧客データ重複検出機能 - 顧客名が重複候補の両方に存在するとき、正規化ルールが適用される
  test("should detect duplicate customers with normalization applied when customer names match", () => {
    const recordA = {
      customer_id: "CUST001",
      customer_name: "山田太郎",
      address: "東京都渋谷区",
      phone: "090-1234-5678",
    };

    const recordB = {
      customer_id: "CUST002",
      customer_name: "山田太郎",
      address: "東京都渋谷区",
      phone: "090-1234-5679",
    };

    const customers = [recordA, recordB];

    const result = detectDuplicateCustomers(customers);

    expect(result).toEqual({
      duplicate_groups: [
        {
          group_id: expect.any(String),
          candidates: [
            {
              customer_id: "CUST001",
              normalized_name: "山田太郎",
              normalized_address: "東京都渋谷区",
              normalized_phone: "09012345678",
            },
            {
              customer_id: "CUST002",
              normalized_name: "山田太郎",
              normalized_address: "東京都渋谷区",
              normalized_phone: "09012345679",
            },
          ],
          matching_score: expect.any(Number),
          normalization_applied: true,
        },
      ],
    });

    const group = result.duplicate_groups[0];
    expect(group.normalization_applied).toBe(true);
    expect(group.candidates[0].normalized_name).toBe("山田太郎");
    expect(group.candidates[1].normalized_name).toBe("山田太郎");
    expect(group.candidates[0].normalized_phone).toBe("09012345678");
    expect(group.candidates[1].normalized_phone).toBe("09012345679");
    expect(group.matching_score).toBeGreaterThanOrEqual(0.7);
  });
});