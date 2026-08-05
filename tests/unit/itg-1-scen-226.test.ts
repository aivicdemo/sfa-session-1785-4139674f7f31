import { calculateStandardProcessComplianceScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-226
  test("標準プロセス遵守度スコア計算機能 - 商談記録の営業担当者IDが空文字列のときエラーになる", () => {
    const dealRecord = {
      sales_person_id: "",
      customer_id: "CUST001",
      deal_stage: "proposal",
      proposed_at: "2024-01-15T10:00:00Z",
      follow_up_frequency: 2,
      proposal_adherence_score: 85,
    };

    expect(() =>
      calculateStandardProcessComplianceScore(dealRecord)
    ).toThrow(/営業担当者ID/);
  });
});