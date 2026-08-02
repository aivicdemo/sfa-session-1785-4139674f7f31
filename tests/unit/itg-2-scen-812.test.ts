import { detectDuplicateAndInconsistency } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-812: 電話番号が空文字列の場合、その項目は検出ロジックからスキップされる", () => {
    // 電話番号フィールドが空文字列で、他のフィールドは有効な値を持つ顧客データレコード2件を準備
    const record1 = {
      customer_id: "CUST001",
      customer_name: "山田太郎",
      email: "yamada@example.com",
      phone: "",
      address: "東京都渋谷区"
    };

    const record2 = {
      customer_id: "CUST002",
      customer_name: "山田太郎",
      email: "yamada@example.com",
      phone: "09012345678",
      address: "東京都渋谷区"
    };

    // 検出ロジックに入力し、重複・不整合判定を実行
    const result = detectDuplicateAndInconsistency([record1, record2]);

    // 期待結果: 電話番号が異なる（または空）複数レコードが同一顧客として誤判定されない
    // 電話番号フィールドがスキップされるため、顧客名・メール・住所が一致していても異なるレコードとして判定される
    expect(result.is_duplicate).toBe(false);
    expect(result.skipped_fields).toContain("phone");
    expect(result.matched_fields).toEqual(["customer_name", "email", "address"]);
  });
});