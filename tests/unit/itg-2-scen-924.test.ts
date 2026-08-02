import { validateCustomerPurchaseConsiderationDataCompleteness } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-924
  test("提案IDが最大許容文字列長（256文字）でもデータ完全性検証が実行される", () => {
    const max_length_proposal_id = "A".repeat(256);
    
    const input_data = {
      customer_name: "テスト顧客",
      proposal_id: max_length_proposal_id,
      proposal_amount: 1000000,
      proposal_date: "2024-01-15",
      customer_email: "customer@example.com",
      proposal_description: "提案内容の説明"
    };

    const result = validateCustomerPurchaseConsiderationDataCompleteness(input_data);

    expect(result.is_valid).toBe(true);
    expect(result.validation_errors).toEqual([]);
    expect(result.saved_proposal_id).toBe(max_length_proposal_id);
    expect(result.saved_proposal_id.length).toBe(256);
    expect(result.db_save_status).toBe("success");
  });
});