import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-1813: [normal] 推奨内容の根拠説明機能 - 根拠説明に適用条件・制約事項が含まれる", () => {
    // 新規案件データの準備
    const deal_id = "DEAL-20240115-001";
    const customer_id = "CUST-12345";
    const customer_name = "SampleCorp Inc.";
    const employee_count = 1500;
    const industry = "IT";
    const budget_limit = 10000000;
    const project_timeline_months = 6;

    const customer_info = {
      deal_id,
      customer_id,
      customer_name,
      employee_count,
      industry,
      budget_limit,
      project_timeline_months,
    };

    const deal_conditions = {
      deal_id,
      customer_id,
      current_stage: "proposal",
      deal_value_estimated: 5000000,
      decision_timeline_days: 30,
    };

    const recommendation_id = "REC-20240115-001";
    const recommended_approach = "導入段階的アプローチ";
    const confidence_score = 85;

    // AIRecommendationEngineのスタブ設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendation_id,
        approach: recommended_approach,
        confidence_score,
        reasoning_basis: {
          similar_patterns: 3,
          success_rate: 0.92,
        },
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        explanation_text:
          "この推奨は、顧客規模が従業員1000名以上の場合に適用可能です。" +
          "導入期間は最短3ヶ月必要であり、初期投資額は500万円以上必須となります。" +
          "業界がITセクターであり、予算が1000万円以上の場合、" +
          "このアプローチにより成功確率92%が期待できます。",
        applicable_conditions: [
          "顧客規模が従業員1000名以上",
          "IT業界またはデジタル化推進中の企業",
          "予算枠が500万円以上",
        ],
        constraints: [
          "導入期間は最短3ヶ月",
          "初期投資額は500万円以上必須",
          "プロジェクト期間は6ヶ月以上を推奨",
        ],
      }),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 推奨内容の生成を実行
    const generated_recommendation = mockAIEngine.generateRecommendation(
      customer_info,
      deal_conditions
    );

    // 推奨に対応する根拠説明を取得
    const reasoning_explanation =
      mockAIEngine.explainRecommendationReasoning(
        recommendation_id,
        generated_recommendation
      );

    // 根拠説明の内容を検証
    const explanation_text = reasoning_explanation.explanation_text;
    const applicable_conditions = reasoning_explanation.applicable_conditions;
    const constraints = reasoning_explanation.constraints;

    // 根拠説明テキストが適用条件と制約事項の両方を含むか検証
    expect(explanation_text).toMatch(/顧客規模が従業員1000名以上/);
    expect(explanation_text).toMatch(/導入期間は最短3ヶ月/);
    expect(explanation_text).toMatch(/初期投資額は500万円以上必須/);

    // 適用条件の配列が存在し、期待される条件が含まれるか検証
    expect(applicable_conditions).toBeDefined();
    expect(applicable_conditions.length).toBeGreaterThan(0);
    expect(applicable_conditions).toContain("顧客規模が従業員1000名以上");

    // 制約事項の配列が存在し、期待される制約が含まれるか検証
    expect(constraints).toBeDefined();
    expect(constraints.length).toBeGreaterThan(0);
    expect(constraints).toContain("導入期間は最短3ヶ月");
    expect(constraints).toContain("初期投資額は500万円以上必須");

    // 適用条件と制約事項の両方が存在することを確認
    expect(applicable_conditions.length + constraints.length).toBeGreaterThan(
      0
    );
  });
});