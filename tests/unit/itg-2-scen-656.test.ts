import { visualizeRecommendationRationale } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-656
  test("推奨内容根拠の可視化機能 - 成功パターンマスタから抽出した成功パターンが0件のとき、パターンなしを示すデータが返される", async () => {
    const mockDealsId = "DEAL-001";
    const mockCustomerId = "CUST-20240115";

    const mockFetchResponse = {
      status: "NO_PATTERN",
      message: "マッチする成功パターンが見つかりません",
      successPatterns: [],
      recommendationContent: null,
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => mockFetchResponse,
      })
    ) as jest.Mock;

    const result = await visualizeRecommendationRationale({
      dealsId: mockDealsId,
      customerId: mockCustomerId,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/success-patterns"),
      expect.objectContaining({
        method: "GET",
      })
    );

    expect(result.status).toBe("NO_PATTERN");
    expect(result.message).toBe("マッチする成功パターンが見つかりません");
    expect(result.successPatterns).toEqual([]);
    expect(result.recommendationContent).toBeNull();
  });
});