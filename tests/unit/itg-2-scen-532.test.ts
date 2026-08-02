import { detectAndClassifyDuplicates } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-532
  test("重複候補データが1件のとき、そのデータを正しい原因パターンに分類する", () => {
    const master_record = {
      customer_id: "CUST-001",
      customer_name: "山田太郎",
      email: "yamada.taro@example.com",
      phone: "09012345678",
    };

    const duplicate_candidate = {
      customer_id: "CUST-502",
      customer_name: "山田太郎",
      email: "yamada.taro@example.com",
      phone: "09012345679",
    };

    const result = detectAndClassifyDuplicates(master_record, duplicate_candidate);

    expect(result.is_duplicate).toBe(true);
    expect(result.duplicate_candidate_id).toBe("CUST-502");
    expect(result.cause_pattern).toBe("電話番号の末尾1桁相違");
    expect(result.status).toBe("要確認");
    expect(result.confidence_score).toBeGreaterThanOrEqual(0.92);
  });
});