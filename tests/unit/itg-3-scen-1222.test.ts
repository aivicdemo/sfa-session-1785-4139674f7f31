import { describe, test, expect, beforeEach } from "@jest/globals";
import { validateAndCheckProposalSuitability } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1222
  test("提案妥当性確認判定機能 - 商談IDがnullのとき、エラーを返す", () => {
    const dealId = null;
    const proposalContent = {
      title: "提案タイトル",
      description: "提案内容の説明",
      recommendedApproach: "推奨アプローチ",
    };
    const customerConstraints = {
      budgetLimit: 1000000,
      implementationSchedule: "Q2 2026",
      requiredFeatures: ["機能A", "機能B"],
    };

    expect(() =>
      validateAndCheckProposalSuitability(
        dealId,
        proposalContent,
        customerConstraints
      )
    ).toThrow(/DEAL_ID_REQUIRED|商談ID/);
  });
});