import { generateSignalDetectionReasoning } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-755
  test("信号検出根拠生成機能 - 最終接触日が正常に取得できるとき、根拠に具体的な日付が記載される", () => {
    const sales_record = {
      customer_id: "CUST001",
      last_contact_date: "2024-01-15",
      contact_frequency: 3,
      response_pattern: "positive",
    };

    const result = generateSignalDetectionReasoning(sales_record);

    expect(result).toEqual({
      last_contact_date_reason: "最終接触日: 2024-01-15",
      purchase_cycle_reason: expect.any(String),
      response_pattern_reason: expect.any(String),
    });
    expect(result.last_contact_date_reason).toContain("2024-01-15");
  });
});