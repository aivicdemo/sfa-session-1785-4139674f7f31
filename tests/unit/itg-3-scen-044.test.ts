import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨内容生成機能 - 同じ顧客・商談条件での一貫性確保", () => {
  test("SCEN-044: 同じ顧客・商談条件で複数回推奨生成を実行しても同じ結果が返される", () => {
    const customer_data = {
      customer_id: "CUST-001",
      industry: "IT",
      employee_count_min: 50,
      employee_count_max: 100,
    };

    const deal_condition = {
      deal_id: "DEAL-001",
      budget_amount: 5000000,
      implementation_period_days: 90,
    };

    const ai_engine_stub = {
      generateRecommendation: jest.fn(() => ({
        recommendation: "クラウド導入支援パッケージ",
        confidence_score: 0.87,
        reasoning: "同規模IT企業の成功事例5件に基づく",
      })),
    };

    const result_1 = generateRecommendation(
      customer_data,
      deal_condition,
      ai_engine_stub
    );
    const timestamp_1 = Date.now();

    const result_2 = generateRecommendation(
      customer_data,
      deal_condition,
      ai_engine_stub
    );
    const timestamp_2 = Date.now();

    const result_3 = generateRecommendation(
      customer_data,
      deal_condition,
      ai_engine_stub
    );
    const timestamp_3 = Date.now();

    expect(result_1.recommendation).toBe("クラウド導入支援パッケージ");
    expect(result_1.confidence_score).toBe(0.87);
    expect(result_1.reasoning).toBe("同規模IT企業の成功事例5件に基づく");

    expect(result_2.recommendation).toBe(result_1.recommendation);
    expect(result_2.confidence_score).toBe(result_1.confidence_score);
    expect(result_2.reasoning).toBe(result_1.reasoning);

    expect(result_3.recommendation).toBe(result_1.recommendation);
    expect(result_3.confidence_score).toBe(result_1.confidence_score);
    expect(result_3.reasoning).toBe(result_1.reasoning);

    expect(result_1).toEqual(result_2);
    expect(result_2).toEqual(result_3);
  });
});