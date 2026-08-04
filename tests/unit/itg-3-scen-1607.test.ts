import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("類似顧客マッチング処理 - 推奨ロジック", () => {
  test("SCEN-1607: 同じ入力データで処理を2回実行したとき、同一の特定顧客群が返却される", () => {
    // テスト用の顧客データ
    const input_customer_data = {
      customer_id: "C-001",
      industry: "manufacturing",
      revenue_scale: 5000000000,
      challenge_keywords: ["cost_reduction", "supply_chain"],
    };

    // 類似顧客マッチング結果の型定義
    interface SimilarCustomerMatch {
      customer_id: string;
      match_score: number;
      reason: string;
    }

    // モック化されたAIRecommendationEngineを定義
    const mock_ai_engine = {
      findSimilarPatterns: jest.fn(
        (customer_data: typeof input_customer_data): SimilarCustomerMatch[] => {
          // 固定の返却結果を設定
          return [
            {
              customer_id: "C-101",
              match_score: 92,
              reason: "Industry match: manufacturing, revenue scale similar",
            },
            {
              customer_id: "C-102",
              match_score: 87,
              reason:
                "Challenge pattern match: cost reduction focus, supply chain optimization",
            },
            {
              customer_id: "C-103",
              match_score: 78,
              reason: "Industry match: manufacturing, partial revenue overlap",
            },
          ];
        }
      ),
    };

    // 1回目の処理実行
    const first_result = findSimilarPatterns(
      input_customer_data,
      mock_ai_engine
    );

    // 1回目の結果をメモリに保存
    const first_saved_result = JSON.parse(JSON.stringify(first_result));

    // 2回目の処理実行
    const second_result = findSimilarPatterns(
      input_customer_data,
      mock_ai_engine
    );

    // 検証: 1回目と2回目の結果が完全に同一であることを確認
    expect(second_result).toEqual(first_saved_result);

    // 詳細検証: 各顧客の顧客ID、マッチスコア、理由がすべて一致
    expect(second_result.length).toBe(3);

    expect(second_result[0].customer_id).toBe("C-101");
    expect(second_result[0].match_score).toBe(92);
    expect(second_result[0].reason).toBe(
      "Industry match: manufacturing, revenue scale similar"
    );

    expect(second_result[1].customer_id).toBe("C-102");
    expect(second_result[1].match_score).toBe(87);
    expect(second_result[1].reason).toBe(
      "Challenge pattern match: cost reduction focus, supply chain optimization"
    );

    expect(second_result[2].customer_id).toBe("C-103");
    expect(second_result[2].match_score).toBe(78);
    expect(second_result[2].reason).toBe(
      "Industry match: manufacturing, partial revenue overlap"
    );

    // モック関数が2回呼び出されたことを確認
    expect(mock_ai_engine.findSimilarPatterns).toHaveBeenCalledTimes(2);
    expect(mock_ai_engine.findSimilarPatterns).toHaveBeenCalledWith(
      input_customer_data
    );
  });
});