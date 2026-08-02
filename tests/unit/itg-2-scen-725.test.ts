import { calculateProposalNeedsFitScore } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-725
  test("提案資料と顧客ニーズの適合度スコア化機能 - 予算適合度が許容範囲内未満でスコアが許容範囲内スコアより低くなる", () => {
    const proposalBudget = 1000000;
    const customerNeedsBudgetLimit = 1500000;
    const budgetToleranceLowerBound = 0.70;
    const acceptableRangeScoreBenchmark = 75;

    const result = calculateProposalNeedsFitScore({
      proposalBudget,
      customerNeedsBudgetLimit,
      budgetToleranceLowerBound,
      acceptableRangeScoreBenchmark,
    });

    const expectedBudgetFitRatio = proposalBudget / customerNeedsBudgetLimit;
    expect(expectedBudgetFitRatio).toBeLessThan(budgetToleranceLowerBound);
    expect(result.score).toBeLessThanOrEqual(acceptableRangeScoreBenchmark - 1);
    expect(result.budgetFitRatio).toBe(0.6666666666666666);
    expect(result.withinAcceptableRange).toBe(false);
  });
});