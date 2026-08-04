import { evaluateProposalFeasibility } from "../../src/logic/it-1-br-3-1-1-1";

// Mock AIRecommendationEngine
const mockAIRecommendationEngine = {
  generateRecommendation: jest.fn(),
  findSimilarPatterns: jest.fn(),
  explainRecommendationReasoning: jest.fn(),
  evaluatePatternRelevance: jest.fn(),
};

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-1255
  test("提案妥当性判定機能 - 複数の営業プロセス遵守事項がすべて妥当性判定に反映される", () => {
    fetchMock.resetMocks();

    // 事前登録: 営業プロセス遵守事項マスタに3件の遵守事項レコード
    const compliance_item_1 = {
      id: "compliance_001",
      description: "初回提案は顧客の経営課題ヒアリング後に実施",
      category: "proposal_timing",
      is_applicable: true,
    };

    const compliance_item_2 = {
      id: "compliance_002",
      description: "見積提示前に予算確認",
      category: "budget_confirmation",
      is_applicable: true,
    };

    const compliance_item_3 = {
      id: "compliance_003",
      description: "フォローアップメールは商談翌日以内",
      category: "followup_timing",
      is_applicable: true,
    };

    const compliance_items = [compliance_item_1, compliance_item_2, compliance_item_3];

    // AIRecommendationEngineスタブの設定
    // generateRecommendationが呼ばれたときに、3件の遵守事項IDを参照元として含むレコメンデーションを返す
    const recommendation_result = {
      recommendation_id: "rec_20240815_001",
      proposed_approach: "顧客経営課題に基づく段階的提案戦略",
      confidence_score: 0.92,
      referenced_compliance_items: ["compliance_001", "compliance_002", "compliance_003"],
      success_pattern_ids: ["pattern_0015", "pattern_0042"],
      risk_factors: ["market_volatility"],
      recommended_timing: new Date("2024-08-20T10:00:00Z").toISOString(),
    };

    mockAIRecommendationEngine.generateRecommendation.mockResolvedValue(recommendation_result);

    // 新規案件データの入力
    const new_deal_data = {
      customer_name: "テスト太郎",
      industry: "IT",
      budget_range: "5000000",
      company_size: "mid_market",
      deal_stage: "initial_contact",
      customer_id: "cust_20240815_001",
      sales_owner_id: "emp_salesman_001",
    };

    // 提案妥当性判定機能の実行
    // この関数がAIRecommendationEngine.generateRecommendationを内部で呼び出す
    const feasibility_result = evaluateProposalFeasibility(
      new_deal_data,
      mockAIRecommendationEngine,
      compliance_items
    );

    // 検証1: AIRecommendationEngine.generateRecommendationが呼び出されたことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(new_deal_data);

    // 検証2: 妥当性判定結果オブジェクトの『参照遵守事項一覧』に3件すべてが含まれている
    expect(feasibility_result.referenced_compliance_items).toHaveLength(3);
    expect(feasibility_result.referenced_compliance_items).toContain("compliance_001");
    expect(feasibility_result.referenced_compliance_items).toContain("compliance_002");
    expect(feasibility_result.referenced_compliance_items).toContain("compliance_003");

    // 検証3: 各遵守事項に対する個別の適用可否判定が付与されている
    expect(feasibility_result.compliance_assessment).toBeDefined();
    expect(feasibility_result.compliance_assessment).toHaveProperty("compliance_001");
    expect(feasibility_result.compliance_assessment).toHaveProperty("compliance_002");
    expect(feasibility_result.compliance_assessment).toHaveProperty("compliance_003");

    // 各遵守事項の判定結果がboolean値であることを確認
    expect(typeof feasibility_result.compliance_assessment.compliance_001).toBe("boolean");
    expect(typeof feasibility_result.compliance_assessment.compliance_002).toBe("boolean");
    expect(typeof feasibility_result.compliance_assessment.compliance_003).toBe("boolean");

    // 検証4: 『判定スコア』が3件の遵守事項すべての判定結果を加味した値である
    // 全て適用可能な場合は1.0、一部不適用の場合は適用可能な件数/全件数で計算
    const applicable_count = Object.values(feasibility_result.compliance_assessment).filter(
      (item: boolean) => item === true
    ).length;
    const expected_score = applicable_count / 3;

    expect(feasibility_result.feasibility_score).toBe(expected_score);
    expect(feasibility_result.feasibility_score).toBeGreaterThanOrEqual(0);
    expect(feasibility_result.feasibility_score).toBeLessThanOrEqual(1);

    // 検証5: 判定スコアが1.0（全て適用可能）であることを確認
    // 今回のシナリオではすべての遵守事項が適用可能なため、スコアは1.0
    expect(feasibility_result.feasibility_score).toBe(1.0);
  });
});