import { detectCustomerDuplicates } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-138
  test("メールアドレスが欠落しているレコードは検査対象外に除外される", () => {
    const recordA = {
      customerId: "001",
      customerName: "山田太郎",
      emailAddress: "yamada@example.com",
    };

    const recordB = {
      customerId: "002",
      customerName: "山田太郎",
      emailAddress: null,
    };

    const inputRecords = [recordA, recordB];

    const result = detectCustomerDuplicates(inputRecords);

    expect(result.inspectedRecords).toHaveLength(1);
    expect(result.inspectedRecords[0]).toEqual(recordA);
    expect(result.excludedRecords).toHaveLength(1);
    expect(result.excludedRecords[0]).toEqual(recordB);
    expect(result.duplicateCandidates).toHaveLength(0);
  });
});