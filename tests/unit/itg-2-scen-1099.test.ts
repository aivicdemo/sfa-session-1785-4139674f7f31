import { detectAndRecordDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データ重複判定・統合エンジン", () => {
  // SCEN-1099
  test("判定結果が統合判定履歴テーブルに記録される", async () => {
    const testExecutionTime = new Date("2024-01-15T10:30:00Z");
    
    const customerA = {
      customer_id: "CUST-001",
      customer_name: "山田太郎",
      email: "yamada@example.com",
      phone: "090-1234-5678",
      company_name: "株式会社山田",
      created_at: new Date("2024-01-01T00:00:00Z"),
    };

    const customerB = {
      customer_id: "CUST-002",
      customer_name: "山田太郎",
      email: "yamada@example.com",
      phone: "090-1234-5678",
      company_name: "株式会社山田",
      created_at: new Date("2024-01-02T00:00:00Z"),
    };

    const duplicateJudgmentRule = "exact_match_name_email_phone";

    const result = await detectAndRecordDuplicateCustomers({
      customers: [customerA, customerB],
      judgment_rule: duplicateJudgmentRule,
      judgment_timestamp: testExecutionTime,
    });

    expect(result.judgment_history_records).toHaveLength(1);
    
    const recordedHistory = result.judgment_history_records[0];
    expect(recordedHistory.judgment_timestamp).toEqual(testExecutionTime);
    expect(recordedHistory.judgment_result).toBe("重複");
    expect(recordedHistory.target_customer_id_1).toBe("CUST-001");
    expect(recordedHistory.target_customer_id_2).toBe("CUST-002");
    expect(recordedHistory.applied_judgment_rule).toBe(duplicateJudgmentRule);
    expect(recordedHistory.status).toBe("未統合");
  });
});