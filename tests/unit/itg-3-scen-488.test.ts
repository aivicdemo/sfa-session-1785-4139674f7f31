import { calculateImprovementPriorityRank } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 改善優先度ランク算出", () => {
  // SCEN-488
  test("改善対象項目の実装難易度が負の値のとき、バリデーションエラーが発生する", () => {
    const input = {
      dataQualityScore: 75,
      improvementItems: [
        {
          itemName: "顧客マスタの重複排除",
          currentScore: 65,
          targetScore: 85,
          implementationDifficulty: -5,
          estimatedImpactScore: 20,
        },
      ],
    };

    expect(() => calculateImprovementPriorityRank(input)).toThrow(
      /実装難易度/
    );
  });
});