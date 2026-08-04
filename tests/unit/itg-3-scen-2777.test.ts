import { extractSuccessPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・重み付けロジック", () => {
  test("SCEN-2777: 過去商談データがnullのとき、エラーを返す", () => {
    const pastDealData = null;

    const result = extractSuccessPatterns(pastDealData);

    expect(result).toEqual({
      success: false,
      error: {
        code: "PAST_DEAL_DATA_NULL",
        message:
          "過去商談データが存在しません。成功パターンの抽出に必要なデータが不足しています",
      },
      httpStatus: 400,
      internalLog: {
        past_deal_data: null,
      },
    });
  });
});