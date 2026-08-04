import { recordRecommendationHistory } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2246
  test("推奨内容が推奨履歴として記録される", () => {
    // 顧客情報と商談条件の入力
    const customer_info = {
      company_size: "中堅企業",
      industry: "製造業",
      budget: 50000000,
    };

    const deal_condition = {
      first_contact: true,
      challenge: "業務効率化",
    };

    const sales_user_id = "user-001";
    const recommendation_content = "既存顧客との成功事例A提示";
    const reasoning_score = 0.92;
    const record_timestamp = new Date("2024-01-15T10:30:00Z");

    // 推奨履歴記録関数を呼び出し
    const result = recordRecommendationHistory({
      sales_user_id: sales_user_id,
      customer_info: customer_info,
      deal_condition: deal_condition,
      recommendation_content: recommendation_content,
      reasoning_score: reasoning_score,
      recorded_at: record_timestamp,
    });

    // 期待結果の検証
    expect(result).toEqual({
      recommendation_id: expect.any(String),
      generated_datetime: record_timestamp.toISOString(),
      sales_user_id: sales_user_id,
      customer_info_hash: expect.any(String),
      recommendation_content: recommendation_content,
      reasoning_score: reasoning_score,
      status: "保存完了",
    });

    // 推奨IDがUUID形式であることを検証（基本的な形式チェック）
    expect(result.recommendation_id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );

    // 根拠スコアが正確に記録されていることを確認
    expect(result.reasoning_score).toBe(0.92);

    // ステータスが「保存完了」であることを確認
    expect(result.status).toBe("保存完了");
  });
});