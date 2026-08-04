import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("類似パターン検索機能", () => {
  // SCEN-048
  test("類似パターンが複数件の場合にスコアの降順でランク付けされた結果が返される", () => {
    const current_deal_condition = {
      product_category: "クラウドサービス",
      customer_scale: "中堅企業",
      budget_range: "500万～1000万円"
    };

    const mock_similar_patterns = [
      {
        pattern_id: "PATTERN_001",
        score: 0.95,
        similarity: 0.95,
        past_deal_id: "DEAL_100"
      },
      {
        pattern_id: "PATTERN_002",
        score: 0.87,
        similarity: 0.87,
        past_deal_id: "DEAL_101"
      },
      {
        pattern_id: "PATTERN_003",
        score: 0.92,
        similarity: 0.92,
        past_deal_id: "DEAL_102"
      }
    ];

    const mock_ai_engine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(mock_similar_patterns)
    };

    return findSimilarPatterns(current_deal_condition, mock_ai_engine).then(
      (result) => {
        expect(result).toHaveLength(3);

        expect(result[0]).toEqual({
          pattern_id: "PATTERN_001",
          score: 0.95,
          similarity: 0.95,
          past_deal_id: "DEAL_100"
        });

        expect(result[1]).toEqual({
          pattern_id: "PATTERN_003",
          score: 0.92,
          similarity: 0.92,
          past_deal_id: "DEAL_102"
        });

        expect(result[2]).toEqual({
          pattern_id: "PATTERN_002",
          score: 0.87,
          similarity: 0.87,
          past_deal_id: "DEAL_101"
        });

        expect(result[0].score).toBe(0.95);
        expect(result[1].score).toBe(0.92);
        expect(result[2].score).toBe(0.87);

        expect(result[0].score).toBeGreaterThanOrEqual(result[1].score);
        expect(result[1].score).toBeGreaterThanOrEqual(result[2].score);
      }
    );
  });
});