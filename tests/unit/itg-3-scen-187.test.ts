import { recordRecommendationHistory } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨履歴記録機能 - 年度をまたぐ場合の記録精度", () => {
  // SCEN-187
  test("推奨実行時刻が年度をまたぐ場合に正確に記録される", async () => {
    const execution_datetime = new Date("2024-03-31T23:59:59Z");
    const record_datetime = new Date("2024-04-01T00:00:01Z");

    const customer_id = "CUST-001";
    const project_name = "春季新規提案";
    const recommendation_id = "REC-20240331-001";

    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: recommendation_id,
        approach: "顧客ニーズに基づいた新商品の提案",
        confidence_score: 85,
        success_pattern_ids: ["PAT-001", "PAT-002"],
      }),
    };

    const input_params = {
      customer_id: customer_id,
      project_name: project_name,
      execution_datetime: execution_datetime,
      record_datetime: record_datetime,
      ai_engine: mock_ai_engine,
    };

    const recorded_history = await recordRecommendationHistory(input_params);

    expect(recorded_history.recommendation_id).toBe(recommendation_id);

    expect(new Date(recorded_history.execution_datetime).toISOString()).toBe(
      "2024-03-31T23:59:59.000Z"
    );

    expect(recorded_history.fiscal_year).toBe("2023年度");

    expect(recorded_history.created_date).toBe("2024-04-01");

    expect(recorded_history.created_time).toBe("00:00:01");

    expect(recorded_history.customer_id).toBe(customer_id);

    expect(recorded_history.project_name).toBe(project_name);
  });
});