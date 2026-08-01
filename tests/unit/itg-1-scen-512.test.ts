import { describe, test, expect, beforeEach, jest } from "@jest/globals";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-512
  test("AIエージェント推論精度スコア算出機能 - 分析対象データが0件の場合、精度スコアが算出されない", async () => {
    const { calculateInferenceAccuracyScore } = await import(
      "../../src/logic/it-1-br-target4-1-1-1"
    );

    const salesPersonId = "SP-001";
    const emptyAnalysisData: never[] = [];

    jest.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify(emptyAnalysisData), { status: 200 })
    );

    const result = await calculateInferenceAccuracyScore(salesPersonId);

    expect(result).toEqual(
      expect.objectContaining({
        code: "DATA_EMPTY",
        message: "分析対象データが0件のため精度スコアを算出できません",
      })
    );
  });
});