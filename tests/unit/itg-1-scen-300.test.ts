import { recordCustomerReaction } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-300: 顧客反応記録・標準化機能 - 反応タイプが不正な値の場合エラーが発生する", () => {
    const invalidReactionInput = {
      customerId: "CUST-001",
      dealId: "DEAL-001",
      reactionType: "invalid_type",
      recordedAt: "2024-01-15T11:00:00Z",
      recordedBy: "USER-001",
    };

    expect(() => recordCustomerReaction(invalidReactionInput)).toThrow(
      /反応タイプ/
    );
  });
});