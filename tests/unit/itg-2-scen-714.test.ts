import { calculateNeedsAlignmentScore } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-714
  test("提案資料と顧客ニーズの適合度スコア化機能 - 顧客課題が提案内容で部分的に解決できる場合", () => {
    const customerNeeds = [
      "在庫管理の効率化",
      "コスト削減",
      "レポート自動化",
    ];

    const proposalSolutions = [
      "在庫管理の効率化",
      "レポート自動化",
    ];

    const result = calculateNeedsAlignmentScore({
      customerNeeds,
      proposalSolutions,
    });

    expect(result.score).toBe(66.7);
    expect(result.classification).toBe("中間値");
    expect(result.matchedCount).toBe(2);
    expect(result.totalNeeds).toBe(3);
  });
});