import { judgeProposalApproachFromSuccessMatrix } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-291: 成功パターンマトリクス参照による提案アプローチ判定機能 - 購買シグナルが弱い場合の優先度判定", () => {
    const successMatrixData = [
      {
        patternId: "pattern_001",
        customerSegment: "enterprise",
        productCategory: "solution_a",
        purchaseSignalStrength: 8,
        proposalApproach: "consultative",
        successRate: 0.85,
        priorityScore: 9,
      },
      {
        patternId: "pattern_002",
        customerSegment: "enterprise",
        productCategory: "solution_a",
        purchaseSignalStrength: 2,
        proposalApproach: "educational",
        successRate: 0.45,
        priorityScore: 3,
      },
      {
        patternId: "pattern_003",
        customerSegment: "enterprise",
        productCategory: "solution_b",
        purchaseSignalStrength: 5,
        proposalApproach: "relationship_building",
        successRate: 0.62,
        priorityScore: 5,
      },
    ];

    const currentCustomer = {
      customerId: "cust_001",
      segment: "enterprise",
      productInterest: "solution_a",
      purchaseSignalScore: 2,
    };

    const result = judgeProposalApproachFromSuccessMatrix(
      successMatrixData,
      currentCustomer
    );

    expect(result.proposalApproach).toBe("educational");
    expect(result.priorityScore).toBeLessThanOrEqual(3);
    expect(result.recommendedAction).toMatch(/信号弱|低優先度|段階的|教育/i);
    expect(result.executionTiming).toMatch(/段階的|準備|継続|月|段階/i);
  });
});