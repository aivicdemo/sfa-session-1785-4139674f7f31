import { judgeCustomerDuplication } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-269: 統合判定履歴の判定結果が欠けているとき、判定処理がエラーになる", () => {
    const integration_history_null_result = {
      integration_history_id: "IH001",
      customer_master_id_1: "C001",
      customer_master_id_2: "C002",
      judgment_date: new Date("2024-01-15T11:00:00Z"),
      judgment_result: null,
      merge_status: "PENDING",
      created_at: new Date("2024-01-15T10:00:00Z"),
    };

    expect(() => judgeCustomerDuplication(integration_history_null_result)).toThrow(/判定結果/);
  });
});