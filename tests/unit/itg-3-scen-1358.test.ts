import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1358
  test("提案金額が顧客の予算上限を超えているとき不適合を示す", () => {
    // Arrange: テスト用の顧客制約条件オブジェクトを作成
    const customer_constraint = {
      customer_id: "CUST-001",
      budget_limit: 1000000,
      purchase_frequency_limit: 12,
      category_restrictions: ["category_a"],
    };

    // テスト用の提案内容オブジェクトを作成
    const proposal_content = {
      proposal_id: "PROP-001",
      proposal_amount: 1200000,
      items: [
        {
          item_id: "ITEM-001",
          category: "category_a",
          unit_price: 1200000,
          quantity: 1,
        },
      ],
      customer_id: "CUST-001",
    };

    // AIRecommendationEngineのスタブを設定
    const ai_recommendation_engine_stub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposal_amount: 1200000,
        recommendation_items: proposal_content.items,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // logic モジュールから照合機能をインポート
    const {
      validateProposalAgainstConstraints,
    } = require("../../src/logic/it-1-br-3-2-1-1");

    // Act: 提案内容と顧客制約条件の自動照合機能を実行
    const compliance_result = validateProposalAgainstConstraints(
      proposal_content,
      customer_constraint,
      ai_recommendation_engine_stub
    );

    // Assert: 照合結果を検証
    expect(compliance_result.isCompliant).toBe(false);
    expect(compliance_result.error_message).toMatch(/提案金額/);
    expect(compliance_result.error_message).toMatch(/1200000/);
    expect(compliance_result.error_message).toMatch(/1000000/);
    expect(compliance_result.excess_amount).toBe(200000);
    expect(compliance_result.reason).toMatch(/金額超過/);
    expect(compliance_result.reason).toMatch(/200000/);
  });
});