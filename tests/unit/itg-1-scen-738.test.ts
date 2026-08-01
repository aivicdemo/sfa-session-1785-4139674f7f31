import { getComprehensionScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-738
  test("成功パターン適用ガイドラインの周知完了判定機能 - 営業担当者の理解度スコアが小数を含むときそのまま保持される", async () => {
    const fetchMock = require("jest-fetch-mock");
    fetchMock.resetMocks();

    const salesRepId = "SALES_A";
    const expectedScore = 87.5;

    fetchMock.mockResponseOnce(
      JSON.stringify({
        scoreValue: expectedScore,
      }),
      { status: 200 }
    );

    const result = await getComprehensionScore(salesRepId);

    expect(result).toEqual({
      scoreValue: 87.5,
    });
    expect(result.scoreValue).toBe(87.5);
  });
});