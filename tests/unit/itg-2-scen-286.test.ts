import { calculateProcessComplianceScore } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  // SCEN-286
  test("標準プロセス遵守度スコア計算 - 提案ステップが商談記録から欠落しているとき、スコア計算がエラーになる", () => {
    const deal_record = {
      deal_id: "DEAL-001",
      customer_id: "CUST-001",
      sales_person_id: "SP-001",
      steps: [
        {
          step_name: "初回接触",
          step_code: "INITIAL_CONTACT",
          completed_at: "2024-01-10T09:00:00Z",
          status: "completed",
        },
        {
          step_name: "ニーズ分析",
          step_code: "NEEDS_ANALYSIS",
          completed_at: "2024-01-15T10:30:00Z",
          status: "completed",
        },
      ],
      created_at: "2024-01-10T09:00:00Z",
      updated_at: "2024-01-15T10:30:00Z",
    };

    expect(() => calculateProcessComplianceScore(deal_record)).toThrow(
      /提案/
    );
  });
});