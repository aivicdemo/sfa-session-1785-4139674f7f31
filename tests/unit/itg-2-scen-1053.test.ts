import { executeIntegrationJudgment } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化 - 統合判定機能", () => {
  // SCEN-1053
  test("統合判定が却下状態の場合に統合処理が実行されない", () => {
    const customer1 = {
      customer_id: "CUST-001",
      customer_name: "株式会社ABC",
      email: "contact@abc.com",
      phone: "03-1234-5678",
      created_at: new Date("2024-01-15T10:00:00Z"),
    };

    const customer2 = {
      customer_id: "CUST-002",
      customer_name: "ABC株式会社",
      email: "contact@abc.com",
      phone: "03-1234-5678",
      created_at: new Date("2024-01-16T10:00:00Z"),
    };

    const integrationJudgmentInput = {
      primary_customer_id: "CUST-001",
      duplicate_customer_id: "CUST-002",
      judgment_status: "却下",
      judgment_reason: "顧客情報の相違が確認されたため統合を見送る",
      evaluated_at: new Date("2024-01-20T11:00:00Z"),
    };

    const result = executeIntegrationJudgment(integrationJudgmentInput);

    expect(result).toEqual({
      execution_status: "スキップ",
      integration_executed: false,
      message: "統合判定が却下状態のため処理をスキップしました",
      primary_customer_id: "CUST-001",
      duplicate_customer_id: "CUST-002",
      judgment_status: "却下",
      processed_at: expect.any(Date),
    });

    expect(result.integration_executed).toBe(false);
    expect(result.execution_status).toBe("スキップ");
  });
});