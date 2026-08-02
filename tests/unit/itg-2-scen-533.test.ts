import { detectAndClassifyDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-533
  test("重複候補データが複数件のとき、全件を原因パターンごとに分類する", () => {
    const inputData = [
      {
        customer_id: "CUST001",
        customer_name: "株式会社テスト",
        phone: "090-1234-5678",
        email: "contact@test.com",
        address: "東京都渋谷区",
      },
      {
        customer_id: "CUST002",
        customer_name: "株式会社テスト",
        phone: "090-9999-9999",
        email: "contact@test.com",
        address: "東京都渋谷区",
      },
      {
        customer_id: "CUST003",
        customer_name: "テスト商事",
        phone: "03-5555-5555",
        email: "info@testsyouji.com",
        address: "大阪府北区",
      },
      {
        customer_id: "CUST004",
        customer_name: "テスト商事",
        phone: "03-5555-5555",
        email: "info@testsyouji.com",
        address: "兵庫県神戸市",
      },
      {
        customer_id: "CUST005",
        customer_name: "株式会社テスト",
        phone: "045-1111-1111",
        email: "contact@test.com",
        address: "神奈川県横浜市",
      },
    ];

    const result = detectAndClassifyDuplicateCustomers(inputData);

    expect(result).toHaveProperty("duplicate_candidates");
    expect(Array.isArray(result.duplicate_candidates)).toBe(true);
    expect(result.duplicate_candidates.length).toBe(3);

    const pattern1 = result.duplicate_candidates.find(
      (candidate: {
        pattern_code: string;
        primary_customer_id: string;
        duplicate_customer_id: string;
      }) =>
        candidate.primary_customer_id === "CUST001" &&
        candidate.duplicate_customer_id === "CUST002"
    );
    expect(pattern1).toBeDefined();
    expect(pattern1.pattern_code).toBe("NAME_MATCH_PHONE_MISMATCH");

    const pattern2 = result.duplicate_candidates.find(
      (candidate: {
        pattern_code: string;
        primary_customer_id: string;
        duplicate_customer_id: string;
      }) =>
        candidate.primary_customer_id === "CUST003" &&
        candidate.duplicate_customer_id === "CUST004"
    );
    expect(pattern2).toBeDefined();
    expect(pattern2.pattern_code).toBe("EMAIL_MATCH_ADDRESS_MISMATCH");

    const pattern3 = result.duplicate_candidates.find(
      (candidate: {
        pattern_code: string;
        primary_customer_id: string;
        duplicate_customer_id: string;
      }) =>
        candidate.primary_customer_id === "CUST001" &&
        candidate.duplicate_customer_id === "CUST005"
    );
    expect(pattern3).toBeDefined();
    expect(pattern3.pattern_code).toBe("NAME_PARTIAL_MATCH_EMAIL_MATCH");
  });
});