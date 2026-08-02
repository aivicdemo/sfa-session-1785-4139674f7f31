import { calculateNeedsCompatibilityScore } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-695
  test("提案資料と顧客ニーズの適合度スコア化機能 - 中間スコアが算出される", () => {
    const customerNeeds = {
      budgetLimit: 5000000,
      implementationTiming: "2024-Q2",
      targetDepartment: "営業部",
    };

    const proposalContent = {
      budgetLimit: 5000000,
      implementationTiming: "2024-Q2",
      targetDepartment: "経営企画部",
    };

    const result = calculateNeedsCompatibilityScore(
      customerNeeds,
      proposalContent
    );

    expect(result.compatibilityScore).toBe(66.67);
    expect(result.status).toBe("部分適合");
    expect(result.matchedItemsCount).toBe(2);
    expect(result.totalRequiredItemsCount).toBe(3);
  });
});