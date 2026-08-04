import { evaluatePatternRelevanceForManagement } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化 - 管理職への数値化結果提示", () => {
  // SCEN-2193
  test("マッチスコアのみ計算でき、乖離スコアが計算できない場合、マッチスコアだけが提示される", () => {
    // Setup: モック化されたAIRecommendationEngine
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(85),
      explainRecommendationReasoning: jest.fn(),
    };

    // 新規案件データ（顧客情報、商談条件等）
    const newDealData = {
      customer_id: "CUST-001",
      customer_name: "Sample Corporation",
      industry: "IT",
      company_size: "medium",
      deal_amount: 5000000,
      product_category: "SaaS",
      sales_stage: "proposal",
    };

    // 過去の成功パターンデータ
    const successPatterns = [
      {
        pattern_id: "PAT-001",
        industry: "IT",
        company_size: "medium",
        deal_amount_range: { min: 3000000, max: 8000000 },
        product_category: "SaaS",
        success_count: 12,
        total_cases: 14,
      },
    ];

    // 管理職ユーザー情報
    const managerUser = {
      user_id: "MGR-001",
      role: "manager",
      name: "Manager User",
    };

    // マッチスコアの計算: 12/14 * 100 = 85.71... → 85
    const expectedMatchScore = 85;

    // evaluatePatternRelevanceForManagement 実行
    const result = evaluatePatternRelevanceForManagement(
      newDealData,
      successPatterns,
      managerUser,
      mockAIEngine
    );

    // 期待結果の検証
    // ① マッチスコアのみが数値で提示される
    expect(result.match_score).toBe(expectedMatchScore);

    // ② 乖離スコアプロパティが存在しない、もしくは null/undefined
    expect(result.deviation_score).toBeUndefined();

    // ③ エラーメッセージが存在しない
    expect(result.error_message).toBeUndefined();

    // ④ フォールバック表示フラグが false（エラーフォールバックなし）
    expect(result.has_fallback).toBe(false);

    // ⑤ マッチスコアの値が AIRecommendationEngine の戻り値と一致
    expect(result.match_score).toBe(mockAIEngine.evaluatePatternRelevance());

    // ⑥ 提示対象ユーザーが管理職である
    expect(result.presented_to_role).toBe("manager");
  });
});