import { validateProposalAppraisal } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化 - 提案妥当性判定機能", () => {
  // SCEN-1261
  test("リスク要因スコアが欠落しているときにVALIDATION_ERROR_MISSING_RISK_SCOREエラーを返す", () => {
    const inputData = {
      customer_id: "CUST-00123",
      deal_id: "DEAL-00456",
      proposal_content: "クラウド導入提案",
      risk_factor_score: null,
      schedule_feasibility: 0.85,
      budget_alignment: 0.9,
    };

    expect(() => validateProposalAppraisal(inputData)).toThrow(
      /リスク要因スコア/
    );
  });
});