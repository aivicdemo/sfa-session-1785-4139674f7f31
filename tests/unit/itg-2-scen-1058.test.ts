import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化", () => {
  test("SCEN-1058: 比較対象の顧客データが逆順である場合でも重複判定結果が同じになる", () => {
    // 顧客データA
    const customerDataA = {
      customerId: "C001",
      name: "山田太郎",
      email: "yamada@example.com",
      phone: "09012345678"
    };

    // 顧客データB
    const customerDataB = {
      customerId: "C002",
      name: "山田太郎",
      email: "yamada@example.com",
      phone: "09012345678"
    };

    // A → B の順序で比較
    const resultAtoB = detectDuplicateCustomers(customerDataA, customerDataB);

    // B → A の逆順で比較
    const resultBtoA = detectDuplicateCustomers(customerDataB, customerDataA);

    // 重複判定フラグが同じ
    expect(resultAtoB.isDuplicate).toBe(true);
    expect(resultBtoA.isDuplicate).toBe(true);

    // マッチスコアが同じ
    expect(resultAtoB.matchScore).toBe(resultBtoA.matchScore);

    // 一致項目リストが同じ
    expect(resultAtoB.matchedFields.sort()).toEqual(
      resultBtoA.matchedFields.sort()
    );

    // 一致項目が正しく検出されている（名前、メール、電話が一致）
    expect(resultAtoB.matchedFields).toContain("name");
    expect(resultAtoB.matchedFields).toContain("email");
    expect(resultAtoB.matchedFields).toContain("phone");
  });
});