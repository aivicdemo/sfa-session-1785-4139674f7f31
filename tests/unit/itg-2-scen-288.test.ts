import { calculateProcessComplianceScore } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン - 標準プロセス遵守度スコア計算", () => {
  // SCEN-288
  test("成約ステップが商談記録から欠落しているとき、スコア計算がエラーになる", () => {
    const dealRecord = {
      dealId: "DEAL-001",
      customerId: "CUST-001",
      initialContactStep: {
        completed: true,
        completedAt: "2024-01-15T09:00:00Z",
      },
      proposalStep: {
        completed: true,
        completedAt: "2024-01-20T14:30:00Z",
      },
      negotiationStep: {
        completed: true,
        completedAt: "2024-01-25T16:45:00Z",
      },
    };

    expect(() => calculateProcessComplianceScore(dealRecord)).toThrow(
      /成約ステップ/
    );
  });
});