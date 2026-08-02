import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化", () => {
  // SCEN-1050
  test("重複判定の相似度が閾値の上限を超える場合に重複と判定される", () => {
    const similarityThreshold = 99.5;
    const customerDataA = {
      id: "CUST-001",
      name: "株式会社テストシステムズ",
      address: "東京都渋谷区1-1-1",
      phone: "090-1234-5678",
    };
    const customerDataB = {
      id: "CUST-002",
      name: "株式会社テストシステムズ",
      address: "東京都渋谷区1-1-1",
      phone: "090-1234-5679",
    };

    const result = detectDuplicateCustomers(
      [customerDataA, customerDataB],
      similarityThreshold
    );

    expect(result.isDuplicate).toBe(true);
    expect(result.duplicateFlag).toBe(true);
    expect(result.similarityScore).toBeGreaterThan(99.5);
    expect(result.mergeCandidate).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "CUST-001" }),
        expect.objectContaining({ id: "CUST-002" }),
      ])
    );
  });
});