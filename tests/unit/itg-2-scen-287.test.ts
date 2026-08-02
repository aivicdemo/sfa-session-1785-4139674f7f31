import { calculateStandardProcessComplianceScore } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  test("SCEN-287: 標準プロセス遵守度スコア計算 - 交渉ステップが欠落しているとき、スコア計算がエラーになる", () => {
    const deal_record_with_missing_negotiation = {
      deal_id: "DEAL-001",
      salesperson_id: "SALES-001",
      customer_id: "CUST-001",
      initial_contact: new Date("2024-01-10T09:00:00Z"),
      proposal: new Date("2024-01-15T10:30:00Z"),
      negotiation: null,
      contract: new Date("2024-02-01T14:00:00Z"),
    };

    expect(() =>
      calculateStandardProcessComplianceScore(deal_record_with_missing_negotiation)
    ).toThrow(/交渉ステップ/);
  });
});