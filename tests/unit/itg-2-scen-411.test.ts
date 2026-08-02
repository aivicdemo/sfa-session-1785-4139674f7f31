import { detectAndMergeDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-411
  test("重複候補リストに同一ペアが重複して含まれる場合、重複を除外した結果が返される", () => {
    const duplicateCandidates = [
      { id1: "CUST001", id2: "CUST002" },
      { id1: "CUST001", id2: "CUST002" },
      { id1: "CUST003", id2: "CUST004" },
    ];

    const result = detectAndMergeDuplicateCustomers(duplicateCandidates);

    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { id1: "CUST001", id2: "CUST002" },
      { id1: "CUST003", id2: "CUST004" },
    ]);
  });
});