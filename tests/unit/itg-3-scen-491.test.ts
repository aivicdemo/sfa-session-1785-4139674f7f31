import { calculateImprovementPriorityRank } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 改善優先度ランク算出機能", () => {
  test("SCEN-491: 影響度が0から100の範囲外のとき、エラーが発生する", () => {
    const testCases = [
      { impact: -1, description: "影響度が負数" },
      { impact: 101, description: "影響度が100を超過" },
      { impact: 0.5, description: "影響度が整数でない" },
    ];

    testCases.forEach(({ impact, description }) => {
      expect(() => {
        calculateImprovementPriorityRank(impact);
      }).toThrow(expect.objectContaining({
        type: "ValidationError",
        code: "INVALID_IMPACT_SCORE",
        message: expect.stringContaining("影響度は0から100の範囲内である必要があります"),
      }));
    });

    // 各ケースで詳細検証
    try {
      calculateImprovementPriorityRank(-1);
    } catch (error: any) {
      expect(error.type).toBeDefined();
      expect(error.type).toEqual("ValidationError");
      expect(error.code).toBeDefined();
      expect(error.code).toEqual("INVALID_IMPACT_SCORE");
      expect(error.message).toBeDefined();
      expect(error.message).toEqual(expect.stringContaining("影響度は0から100の範囲内である必要があります"));
    }

    try {
      calculateImprovementPriorityRank(101);
    } catch (error: any) {
      expect(error.type).toBeDefined();
      expect(error.type).toEqual("ValidationError");
      expect(error.code).toBeDefined();
      expect(error.code).toEqual("INVALID_IMPACT_SCORE");
      expect(error.message).toBeDefined();
      expect(error.message).toEqual(expect.stringContaining("影響度は0から100の範囲内である必要があります"));
    }

    try {
      calculateImprovementPriorityRank(0.5);
    } catch (error: any) {
      expect(error.type).toBeDefined();
      expect(error.type).toEqual("ValidationError");
      expect(error.code).toBeDefined();
      expect(error.code).toEqual("INVALID_IMPACT_SCORE");
      expect(error.message).toBeDefined();
      expect(error.message).toEqual(expect.stringContaining("影響度は0から100の範囲内である必要があります"));
    }
  });
});