import { evaluateProposalValidity } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - 提案妥当性判定", () => {
  test("SCEN-1181: [normal] 提案妥当性判定機能 - 顧客ニーズに適合し営業プロセスは標準フロー・リスク要因なしの場合に承認判定される", () => {
    // Arrange: テスト用の商談データを構成
    const proposal_data = {
      customer_industry: "製造業",
      customer_challenge: "業務効率化",
      budget_amount: 5000000,
      sales_stage: "提案準備段階",
    };

    // AIRecommendationEngineのスタブを構成
    const ai_engine_stub = {
      generateRecommendation: jest.fn(() => ({
        customer_need_match_score: 0.95,
        sales_process_status: "標準フロー",
        risk_factors: [],
      })),
    };

    // AIRecommendationEngineのgenerateRecommendationメソッドを呼び出し
    const recommendation_result = ai_engine_stub.generateRecommendation();

    // Act: 提案妥当性判定ロジックを実行
    const evaluation_result = evaluateProposalValidity(
      {
        customer_need_match_score: recommendation_result.customer_need_match_score,
        sales_process_status: recommendation_result.sales_process_status,
        risk_factors: recommendation_result.risk_factors,
      },
      proposal_data,
      "2024-01-15T11:00:00Z"
    );

    // Assert: 判定結果を確認
    expect(evaluation_result.approval_status).toBe("APPROVED");
    expect(evaluation_result.approval_reason).toContain("0.95");
    expect(evaluation_result.approval_reason).toContain("標準フロー");
    expect(evaluation_result.approval_reason).toContain("リスク要因なし");
    expect(evaluation_result.approval_datetime).toBe("2024-01-15T11:00:00Z");
  });
});