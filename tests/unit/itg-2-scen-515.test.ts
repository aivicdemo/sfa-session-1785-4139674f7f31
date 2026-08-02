import { detectAndMergeCustomerDuplicates } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-515
  test("重複候補リストに同一の顧客レコードが重複して含まれるとき、重複排除後に判定される", () => {
    const customerId = "C-001";
    const duplicateCandidates = [
      {
        customerId: "C-001",
        customerName: "山田太郎",
        address: "東京都渋谷区",
        phoneNumber: "090-1234-5678",
      },
      {
        customerId: "C-001",
        customerName: "山田太郎",
        address: "東京都渋谷区",
        phoneNumber: "090-1234-5678",
      },
    ];

    const result = detectAndMergeCustomerDuplicates({
      customerId,
      duplicateCandidates,
    });

    expect(result.deduplicatedCandidates).toHaveLength(1);
    expect(result.deduplicatedCandidates[0]).toEqual({
      customerId: "C-001",
      customerName: "山田太郎",
      address: "東京都渋谷区",
      phoneNumber: "090-1234-5678",
    });
    expect(result.mergeJudgmentExecuted).toBe(true);
  });
});