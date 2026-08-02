import { detectCustomerDuplicatesAndJudgeIntegration } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-381
  test("[normal] 顧客データ重複検出と統合判定機能 - 顧客名が完全一致する場合、重複候補に含められる", () => {
    const existingCustomer = {
      customer_id: "CUST001",
      customer_name: "山田太郎",
      address: "東京都渋谷区1-1-1",
      phone: "090-1234-5678",
    };

    const newCustomer = {
      customer_id: "CUST002",
      customer_name: "山田太郎",
      address: "東京都渋谷区1-1-2",
      phone: "090-1234-5679",
    };

    const result = detectCustomerDuplicatesAndJudgeIntegration(
      [existingCustomer],
      newCustomer
    );

    expect(result.duplicate_candidates).toHaveLength(1);
    expect(result.duplicate_candidates[0]).toEqual({
      existing_customer_id: "CUST001",
      new_customer_id: "CUST002",
      duplicate_score: 100,
      match_fields: ["customer_name"],
    });
    expect(result.integration_judgment).toBe("READY_FOR_MERGE");
  });
});