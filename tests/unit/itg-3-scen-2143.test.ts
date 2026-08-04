import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("AIRecommendationEngine.findSimilarPatterns - 類似パターン検索とランク付け", () => {
  test("SCEN-2143: 現在の商談条件が null のとき、エラーが発生する", () => {
    expect(() => findSimilarPatterns(null)).toThrow(/商談条件/);
  });
});