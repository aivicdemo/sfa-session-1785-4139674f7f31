import { visualize } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1095: 参照する成功パターンIDがnullのとき、根拠可視化処理がエラーになる", () => {
    const recommendation = {
      recommendationId: "rec-001",
      successPatternId: null,
      proposalApproach: "段階的フォローアップ戦略",
      confidenceScore: 85,
      supportingData: {
        customerHistory: "過去3件の類似案件で成功",
        timingRationale: "購買サイクル分析による最適時期",
      },
    };

    expect(() => visualize(recommendation)).toThrow(/成功パターンID/);
  });
});