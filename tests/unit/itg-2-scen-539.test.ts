import { detectAndClassifyDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-539
  test("電話番号の不整合パターンに該当するデータが検出され、正規化ルール適用前後で分類される", () => {
    const customer1 = {
      customer_id: "CUST001",
      customer_name: "田中商事",
      phone_number: "090-1234-5678",
      email: "info@tanaka.com",
      address: "東京都渋谷区",
    };

    const customer2 = {
      customer_id: "CUST002",
      customer_name: "田中商事",
      phone_number: "09012345678",
      email: "info@tanaka.com",
      address: "東京都渋谷区",
    };

    const customers = [customer1, customer2];

    const result = detectAndClassifyDuplicateCustomers({
      customers: customers,
      apply_normalization: false,
    });

    expect(result.before_normalization).toBeDefined();
    expect(result.before_normalization.classification_results).toBeDefined();
    expect(result.before_normalization.classification_results).toHaveLength(2);

    const beforeClassifications = result.before_normalization
      .classification_results;
    expect(beforeClassifications[0]).toEqual({
      customer_id: "CUST001",
      classification: "電話番号不整合",
      duplicate_candidate_with: null,
      confidence_score: expect.any(Number),
    });
    expect(beforeClassifications[1]).toEqual({
      customer_id: "CUST002",
      classification: "電話番号不整合",
      duplicate_candidate_with: null,
      confidence_score: expect.any(Number),
    });

    const resultAfterNormalization = detectAndClassifyDuplicateCustomers({
      customers: customers,
      apply_normalization: true,
    });

    expect(resultAfterNormalization.after_normalization).toBeDefined();
    expect(
      resultAfterNormalization.after_normalization.classification_results
    ).toBeDefined();
    expect(
      resultAfterNormalization.after_normalization.classification_results
    ).toHaveLength(2);

    const afterClassifications =
      resultAfterNormalization.after_normalization.classification_results;

    const duplicateRecords = afterClassifications.filter(
      (record: any) => record.classification === "重複"
    );
    expect(duplicateRecords).toHaveLength(2);

    expect(afterClassifications[0]).toMatchObject({
      customer_id: "CUST001",
      classification: "重複",
    });

    expect(afterClassifications[1]).toMatchObject({
      customer_id: "CUST002",
      classification: "重複",
    });

    expect(afterClassifications[0].duplicate_candidate_with).toBe("CUST002");
    expect(afterClassifications[1].duplicate_candidate_with).toBe("CUST001");

    expect(
      resultAfterNormalization.after_normalization.normalized_customers
    ).toBeDefined();
    expect(
      resultAfterNormalization.after_normalization.normalized_customers
    ).toHaveLength(2);

    const normalized1 = resultAfterNormalization.after_normalization
      .normalized_customers[0];
    const normalized2 = resultAfterNormalization.after_normalization
      .normalized_customers[1];

    expect(normalized1.phone_number).toBe("09012345678");
    expect(normalized2.phone_number).toBe("09012345678");
  });
});