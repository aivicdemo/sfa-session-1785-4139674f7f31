import { evaluateProposalValidity } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1199
  test("提案内容が顧客制約条件を満たす場合に妥当と判定される", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        isValid: true,
        budgetCheck: {
          proposalAmount: 4500000,
          customerLimit: 5000000,
          status: "合格",
          message: "提案額450万円 ≤ 上限500万円",
        },
        deadlineCheck: {
          proposalDeadline: new Date("2026-03-15T00:00:00Z"),
          customerDeadline: new Date("2026-03-31T00:00:00Z"),
          status: "合格",
          message: "提案納期2026年3月15日 ≤ 期限2026年3月31日",
        },
        functionCheck: {
          requiredFunctions: ["ユーザー管理機能"],
          proposedFunctions: [
            "ユーザー管理機能",
            "レポート機能",
          ],
          status: "合格",
          message: "提案機能にユーザー管理機能を含む",
        },
        osCheck: {
          supportedOS: ["Windows", "Mac"],
          proposalOS: ["Windows", "Mac"],
          status: "合格",
          message: "提案がWindows/Macに対応",
        },
        overallStatus: "提案妥当 - 全制約条件を満たしています",
      }),
    };

    const customerConstraints = {
      budgetLimit: 5000000,
      deadline: new Date("2026-03-31T00:00:00Z"),
      requiredFunctions: ["ユーザー管理機能"],
      supportedOS: ["Windows", "Mac"],
    };

    const proposalContent = {
      estimatedAmount: 4500000,
      deliveryDate: new Date("2026-03-15T00:00:00Z"),
      includedFunctions: ["ユーザー管理機能", "レポート機能"],
      compatibleOS: ["Windows", "Mac"],
    };

    const result = evaluateProposalValidity(
      customerConstraints,
      proposalContent,
      mockAIEngine
    );

    expect(result.isValid).toBe(true);
    expect(result.budgetCheck.status).toBe("合格");
    expect(result.budgetCheck.proposalAmount).toBe(4500000);
    expect(result.budgetCheck.customerLimit).toBe(5000000);
    expect(result.budgetCheck.message).toBe(
      "提案額450万円 ≤ 上限500万円"
    );
    expect(result.deadlineCheck.status).toBe("合格");
    expect(result.deadlineCheck.proposalDeadline).toEqual(
      new Date("2026-03-15T00:00:00Z")
    );
    expect(result.deadlineCheck.customerDeadline).toEqual(
      new Date("2026-03-31T00:00:00Z")
    );
    expect(result.deadlineCheck.message).toBe(
      "提案納期2026年3月15日 ≤ 期限2026年3月31日"
    );
    expect(result.functionCheck.status).toBe("合格");
    expect(result.functionCheck.requiredFunctions).toEqual([
      "ユーザー管理機能",
    ]);
    expect(result.functionCheck.proposedFunctions).toEqual([
      "ユーザー管理機能",
      "レポート機能",
    ]);
    expect(result.functionCheck.message).toBe(
      "提案機能にユーザー管理機能を含む"
    );
    expect(result.osCheck.status).toBe("合格");
    expect(result.osCheck.supportedOS).toEqual(["Windows", "Mac"]);
    expect(result.osCheck.proposalOS).toEqual(["Windows", "Mac"]);
    expect(result.osCheck.message).toBe(
      "提案がWindows/Macに対応"
    );
    expect(result.overallStatus).toBe(
      "提案妥当 - 全制約条件を満たしています"
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      customerConstraints,
      proposalContent
    );
  });
});