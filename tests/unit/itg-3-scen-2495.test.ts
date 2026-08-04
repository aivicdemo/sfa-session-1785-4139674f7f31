import { recordRecommendationHistory } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨精度向上の履歴管理機能", () => {
  // SCEN-2495
  test("複数件の推奨に対する結果が記録され、すべて推奨履歴テーブルに追加される", () => {
    const mock_AIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const recommendation_history: Array<{
      recommendation_id: string;
      customer_id: string;
      recommendation_content: string;
      reasoning_explanation: string;
      created_timestamp: string;
      status: string;
    }> = [];

    const first_recommendation_response = {
      recommendation_content:
        "顧客CUST001に対して、同業種の成功事例から抽出した提案アプローチを推奨",
      reasoning_explanation:
        "過去の製造業顧客との1000万円規模の案件で90%の成功率を確認",
      confidence_score: 0.92,
    };

    const second_recommendation_response = {
      recommendation_content:
        "顧客CUST002に対して、小売業向けの段階的提案アプローチを推奨",
      reasoning_explanation:
        "500万円規模の小売業案件での成功パターンを抽出",
      confidence_score: 0.87,
    };

    const third_recommendation_response = {
      recommendation_content:
        "顧客CUST003に対して、IT業向けの高額商材提案アプローチを推奨",
      reasoning_explanation:
        "2000万円規模のIT業案件での成功事例から導出された推奨内容",
      confidence_score: 0.89,
    };

    mock_AIRecommendationEngine.generateRecommendation.mockResolvedValueOnce(
      first_recommendation_response
    );
    mock_AIRecommendationEngine.generateRecommendation.mockResolvedValueOnce(
      second_recommendation_response
    );
    mock_AIRecommendationEngine.generateRecommendation.mockResolvedValueOnce(
      third_recommendation_response
    );

    const first_input = {
      customer_id: "CUST001",
      deal_amount: 10000000,
      industry: "製造業",
    };

    const second_input = {
      customer_id: "CUST002",
      deal_amount: 5000000,
      industry: "小売業",
    };

    const third_input = {
      customer_id: "CUST003",
      deal_amount: 20000000,
      industry: "IT",
    };

    return recordRecommendationHistory(
      [first_input, second_input, third_input],
      recommendation_history,
      mock_AIRecommendationEngine
    ).then((result) => {
      expect(result).toHaveLength(3);

      expect(result[0]).toMatchObject({
        customer_id: "CUST001",
        recommendation_content:
          "顧客CUST001に対して、同業種の成功事例から抽出した提案アプローチを推奨",
        reasoning_explanation:
          "過去の製造業顧客との1000万円規模の案件で90%の成功率を確認",
        status: "recorded",
      });
      expect(result[0].recommendation_id).toBeTruthy();
      expect(result[0].recommendation_id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
      expect(result[0].created_timestamp).toBeTruthy();

      expect(result[1]).toMatchObject({
        customer_id: "CUST002",
        recommendation_content:
          "顧客CUST002に対して、小売業向けの段階的提案アプローチを推奨",
        reasoning_explanation:
          "500万円規模の小売業案件での成功パターンを抽出",
        status: "recorded",
      });
      expect(result[1].recommendation_id).toBeTruthy();
      expect(result[1].recommendation_id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
      expect(result[1].created_timestamp).toBeTruthy();

      expect(result[2]).toMatchObject({
        customer_id: "CUST003",
        recommendation_content:
          "顧客CUST003に対して、IT業向けの高額商材提案アプローチを推奨",
        reasoning_explanation:
          "2000万円規模のIT業案件での成功事例から導出された推奨内容",
        status: "recorded",
      });
      expect(result[2].recommendation_id).toBeTruthy();
      expect(result[2].recommendation_id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
      expect(result[2].created_timestamp).toBeTruthy();

      expect(result[0].recommendation_id).not.toBe(result[1].recommendation_id);
      expect(result[1].recommendation_id).not.toBe(result[2].recommendation_id);
      expect(result[0].recommendation_id).not.toBe(result[2].recommendation_id);
    });
  });
});