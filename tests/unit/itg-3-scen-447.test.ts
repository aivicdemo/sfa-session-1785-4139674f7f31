import { classifyErrorsByCategory } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - エラーカテゴリ別分類機能", () => {
  test("SCEN-447: 不整合ログが0件の場合、分類されたカテゴリが0件で返される", async () => {
    // Setup: 不整合ログデータとして空配列を用意
    const inconsistencyLogs: any[] = [];

    // AIRecommendationEngine のスタブを設定
    const aiEngineStub = {
      classifyErrorCategories: jest.fn().mockResolvedValue([]),
    };

    // エラーカテゴリ別分類機能を実行
    const result = await classifyErrorsByCategory(
      inconsistencyLogs,
      aiEngineStub
    );

    // 返却された分類カテゴリの件数をアサート
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });
});