import { evaluateProposalFeasibility } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1390
  test("提案内容と顧客制約条件の自動照合機能 - 顧客のスケジュール制約が提案実装期間より短いとき、実装可能性が0%と判定される", () => {
    const customerConstraint = {
      scheduleConstraintDays: 30,
    };

    const proposalContent = {
      implementationPeriodDays: 60,
    };

    const result = evaluateProposalFeasibility(
      proposalContent,
      customerConstraint
    );

    expect(result.feasibilityScore).toBe(0);
  });
});