import { calculateDuplicateScore, recordIntegrationJudgmentHistory } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-170
  test("統合判定履歴に計算されたスコア値が記録される", () => {
    const customerA = {
      customer_id: "CUST-001",
      name: "田中太郎",
      address: "東京都渋谷区",
    };

    const customerB = {
      customer_id: "CUST-002",
      name: "田中太郎",
      address: "東京都渋谷区",
    };

    const calculated_score = calculateDuplicateScore(customerA, customerB);
    expect(calculated_score).toBe(0.95);

    const integration_judgment_history = recordIntegrationJudgmentHistory(
      customerA.customer_id,
      customerB.customer_id,
      calculated_score
    );

    expect(integration_judgment_history).toEqual({
      primary_customer_id: "CUST-001",
      secondary_customer_id: "CUST-002",
      calculated_score_value: 0.95,
      integration_status: "completed",
      judgment_timestamp: expect.any(String),
    });

    expect(integration_judgment_history.calculated_score_value).toBe(0.95);
  });
});