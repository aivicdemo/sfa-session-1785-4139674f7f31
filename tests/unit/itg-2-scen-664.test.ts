import { visualizeRecommendationBasis } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-664
  test("推奨内容根拠の可視化機能 - 推奨アプローチIDが空文字のときValidationErrorが発生", () => {
    const emptyApproachId = "";

    expect(() => {
      visualizeRecommendationBasis({ approachId: emptyApproachId });
    }).toThrow(/推奨アプローチID/);
  });
});