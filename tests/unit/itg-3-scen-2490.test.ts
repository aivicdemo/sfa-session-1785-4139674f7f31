import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨パターンマスタの参照機能 - 内部マスタから成功パターン検索", () => {
  // SCEN-2490
  test("成功パターンが0件のとき、空の結果が返却される", () => {
    const dealConditions = {
      industry: "IT",
      projectScale: "medium",
      decisionMakers: 3,
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
    };

    const result = findSimilarPatterns(dealConditions, mockAIEngine);

    expect(result).toEqual({
      patterns: [],
      count: 0,
      message: "該当する推奨パターンが見つかりません",
    });
  });
});