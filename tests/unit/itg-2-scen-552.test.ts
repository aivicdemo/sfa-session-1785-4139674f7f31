import { detectAndClassifyDuplicates } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-552
  test("重複候補の住所が空文字のとき、住所に基づく分類ができないと記録される", () => {
    const customerDataA = {
      customer_id: "CUST001",
      customer_name: "株式会社テスト",
      address: "東京都渋谷区道玄坂1-2-3",
      phone: "03-1234-5678",
      email: "contact@test.co.jp",
    };

    const customerDataB = {
      customer_id: "CUST002",
      customer_name: "株式会社テスト",
      address: "",
      phone: "03-1234-5678",
      email: "contact@test.co.jp",
    };

    const customers = [customerDataA, customerDataB];

    const result = detectAndClassifyDuplicates(customers);

    expect(result.duplicate_candidates).toHaveLength(1);

    const duplicateCandidate = result.duplicate_candidates[0];
    expect(duplicateCandidate.primary_customer_id).toBe("CUST001");
    expect(duplicateCandidate.secondary_customer_id).toBe("CUST002");

    const classificationResult = duplicateCandidate.classification_result;
    expect(classificationResult.address_based_classification_status).toBe(
      "実行不可"
    );
    expect(classificationResult.classification_reason).toContain(
      "住所が空文字のため住所ベースの分類ができない"
    );
  });
});