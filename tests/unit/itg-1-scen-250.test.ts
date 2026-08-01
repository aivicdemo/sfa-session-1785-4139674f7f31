import { evaluateSuccessPatternApproach } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-250
  test("成功パターンマトリクス参照による提案アプローチ判定機能 - 過去の成功商談パターンが0件の場合、適用可能なアプローチが特定されない", () => {
    const newCustomerCase = {
      customerIndustry: "製造業",
      dealSize: 5000000,
      productCategory: "クラウドERP",
      customerScale: "中堅企業",
      currentChallenges: ["業務効率化", "データ統合"],
    };

    const successPatternMatrix = [];

    const result = evaluateSuccessPatternApproach(
      newCustomerCase,
      successPatternMatrix
    );

    expect(result).toEqual([]);
  });
});