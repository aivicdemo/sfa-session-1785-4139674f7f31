import { evaluateProposalApproach } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-258
  test("成功パターンマトリクス参照による提案アプローチ判定 - 購買金額下限条件で適用可能と判定", () => {
    const successPatternMatrix = {
      patternId: "pattern-001",
      customerSegment: "mid-market",
      productCategory: "solution-a",
      minPurchaseAmount: 500000,
      maxPurchaseAmount: 2000000,
      successRate: 0.78,
      applicableConditions: ["budget-sufficient", "decision-maker-present"],
    };

    const currentCustomerBudget = 600000;

    const result = evaluateProposalApproach({
      successPatternMatrix: successPatternMatrix,
      currentCustomerBudget: currentCustomerBudget,
    });

    expect(result).toBe(true);
  });
});