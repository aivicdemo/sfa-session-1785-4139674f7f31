import { calculateDataQualityImprovementPriorityRank } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - データ品質改善優先度ランク算出", () => {
  // SCEN-488
  test("改善対象項目の実装難易度が負の値のとき、バリデーションエラーが発生する", () => {
    const inputData = {
      improvementTargetItems: [
        {
          itemId: "item_001",
          itemName: "顧客マスタ重複チェック",
          currentQualityScore: 65,
          targetQualityScore: 90,
          implementationDifficulty: -5,
          estimatedEffectScore: 25,
        },
      ],
      baselineQualityScore: 72,
    };

    expect(() =>
      calculateDataQualityImprovementPriorityRank(inputData)
    ).toThrow(/実装難易度/);
  });
});