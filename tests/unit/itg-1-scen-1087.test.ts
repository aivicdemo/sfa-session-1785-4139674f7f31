import { calculateBehaviorPatternMetrics } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-1087
  test("行動パターン分析対象指標の自動選定機能 - 提案成功率の計算で分母がゼロのときに業務上の規定値が適用される", () => {
    const input = {
      proposals_count: 5,
      closed_deals_count: 0,
      default_proposal_success_rate: 0.0,
    };

    const result = calculateBehaviorPatternMetrics(input);

    expect(result.proposal_success_rate).toBe(0.0);
    expect(typeof result.proposal_success_rate).toBe("number");
    expect(Number.isFinite(result.proposal_success_rate)).toBe(true);
  });
});