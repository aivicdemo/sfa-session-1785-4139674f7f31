import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件へ推奨する機能", () => {
  // SCEN-1149
  test("類似パターン検索機能 - 類似商談がデータベースに0件のとき、空の検索結果を返却する", async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
    };

    const dealCondition = {
      customerIndustry: "金融",
      dealAmount: 5000000,
      stageCode: "PROPOSAL",
    };

    const result = await findSimilarPatterns(dealCondition, mockAIEngine);

    expect(result).toEqual({
      count: 0,
      patterns: [],
    });
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(dealCondition);
  });
});