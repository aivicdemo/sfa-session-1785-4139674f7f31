import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターンテンプレート自動判定機能", () => {
  // SCEN-2600
  test("成功パターンテンプレートの適合度スコアが100点である場合、その判定結果が正確に計算される", () => {
    // テスト用の成功パターンテンプレートを準備
    const successPatternTemplate = {
      patternId: "pattern_001",
      industry: "IT",
      budgetThreshold: 5000000,
      decisionMaker: "CTO",
      dealPhase: "negotiation",
      matchingConditions: [
        { condition: "industry_match", weight: 1 },
        { condition: "budget_match", weight: 1 },
        { condition: "decision_maker_match", weight: 1 },
        { condition: "deal_phase_match", weight: 1 },
        { condition: "company_size_match", weight: 1 },
        { condition: "risk_profile_match", weight: 1 }
      ]
    };

    // 新規案件の顧客・商談条件を用意（全条件が一致）
    const dealCondition = {
      customerId: "cust_12345",
      industry: "IT",
      budget: 5000000,
      decisionMaker: "CTO",
      dealPhase: "negotiation",
      companySize: "mid-size",
      riskProfile: "low"
    };

    // AIRecommendationEngineのevaluatePatternRelevanceメソッドをスタブ化
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        conformityScore: 100,
        matchingStatus: "PERFECT_MATCH",
        calculationDetails: {
          patternId: "pattern_001",
          matchedConditionCount: 6,
          totalConditionCount: 6,
          calculationLogic: "全6項目の重要条件が一致。適合度スコア = (一致条件数/対象条件数) × 100 = 6/6 × 100 = 100"
        }
      })
    };

    // 成功パターンテンプレート自動判定機能を実行
    const result = evaluatePatternRelevance(
      dealCondition,
      successPatternTemplate,
      mockAIRecommendationEngine
    );

    // 適合度スコアが正確に100であることを検証
    expect(result.conformityScore).toBe(100);

    // 判定ステータスが「完全適合（PERFECT_MATCH）」であることを検証
    expect(result.matchingStatus).toBe("PERFECT_MATCH");

    // 計算根拠が内部保持テーブルの該当パターンID、マッチング条件数、スコア計算式を含むことを検証
    expect(result.calculationDetails).toEqual({
      patternId: "pattern_001",
      matchedConditionCount: 6,
      totalConditionCount: 6,
      calculationLogic: "全6項目の重要条件が一致。適合度スコア = (一致条件数/対象条件数) × 100 = 6/6 × 100 = 100"
    });
  });
});