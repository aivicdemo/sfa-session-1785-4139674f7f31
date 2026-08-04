import { generatePersuasionMaterial } from "../../src/logic/it-1-br-3-1-1-1";

// Mock types for external services
interface MockAIRecommendationEngine {
  generateRecommendation: jest.Mock;
  explainRecommendationReasoning: jest.Mock;
  evaluatePatternRelevance: jest.Mock;
}

interface MockFileStorageAdapter {
  uploadRecommendationReport: jest.Mock;
  generateDownloadUrl: jest.Mock;
}

describe("AIエージェント推奨根拠の可視化機能 - 経営層向け説得資料生成", () => {
  test("SCEN-2013: 照合評価結果が複数件のとき、全件の提案妥当性を統合して資料が生成される", () => {
    // Prepare test data: 3 evaluation results with different relevance scores
    const evaluation_result_1 = {
      evaluation_id: "eval_001",
      proposal_id: "prop_001",
      customer_id: "cust_001",
      relevance_score: 0.85,
      pattern_type: "pattern_b_risk_avoidance",
      constraints_match: true,
    };

    const evaluation_result_2 = {
      evaluation_id: "eval_002",
      proposal_id: "prop_002",
      customer_id: "cust_001",
      relevance_score: 0.78,
      pattern_type: "pattern_a_cost_reduction",
      constraints_match: true,
    };

    const evaluation_result_3 = {
      evaluation_id: "eval_003",
      proposal_id: "prop_003",
      customer_id: "cust_001",
      relevance_score: 0.92,
      pattern_type: "pattern_c_growth_strategy",
      constraints_match: true,
    };

    const evaluation_results = [
      evaluation_result_1,
      evaluation_result_2,
      evaluation_result_3,
    ];

    const customer_info = {
      customer_id: "cust_001",
      company_name: "ABC Manufacturing Inc.",
      industry: "manufacturing",
      business_scale: "large_enterprise",
      annual_revenue_million_yen: 50000,
      management_goal: "cost_reduction_and_growth",
      budget_constraint_million_yen: 500,
      schedule_constraint_days: 180,
    };

    // Mock AIRecommendationEngine responses for each evaluation result
    const mock_ai_engine: MockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Configure mock responses for each pattern
    mock_ai_engine.generateRecommendation
      .mockReturnValueOnce({
        pattern_id: "pattern_a_cost_reduction",
        recommendation_text:
          "パターンA：コスト削減優先度78% - 既存プロセスの効率化により年間コスト削減30%を達成可能",
        action_items: ["プロセス診断の実施", "自動化提案"],
      })
      .mockReturnValueOnce({
        pattern_id: "pattern_b_risk_avoidance",
        recommendation_text:
          "パターンB：リスク回避優先度85% - 段階的導入によりリスク軽減と業務継続性を確保",
        action_items: ["パイロット導入", "リスク評価"],
      })
      .mockReturnValueOnce({
        pattern_id: "pattern_c_growth_strategy",
        recommendation_text:
          "パターンC：成長戦略優先度92% - 新市場進出に必要なデジタル基盤構築を加速",
        action_items: ["デジタル化推進", "組織体制整備"],
      });

    mock_ai_engine.explainRecommendationReasoning
      .mockReturnValueOnce(
        "過去の類似案件データから、コスト削減型の提案は導入後12ヶ月以内に平均30%の効果を実現"
      )
      .mockReturnValueOnce(
        "大企業の段階的導入事例から、リスク回避型アプローチは成功率85%"
      )
      .mockReturnValueOnce(
        "成長戦略案件では新規事業立ち上げ支援パターンが最高の採用率92%を記録"
      );

    // Mock FileStorageAdapter for report upload
    const mock_file_storage: MockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
    };

    mock_file_storage.uploadRecommendationReport.mockResolvedValueOnce({
      file_key: "reports/persuasion_2024_01_15_cust_001.pdf",
      upload_timestamp: new Date("2024-01-15T11:00:00Z").toISOString(),
      file_size_bytes: 245680,
    });

    mock_file_storage.generateDownloadUrl.mockResolvedValueOnce({
      download_url:
        "https://s3.amazonaws.com/bucket/reports/persuasion_2024_01_15_cust_001.pdf?X-Amz-Expires=86400",
      expiration_unix_timestamp: 1705340400,
    });

    // Call generatePersuasionMaterial function
    const generated_material = generatePersuasionMaterial(
      customer_info,
      evaluation_results,
      mock_ai_engine,
      mock_file_storage
    );

    // Verify that all 3 relevance scores are included in the generated material
    expect(generated_material.content).toContain("0.85");
    expect(generated_material.content).toContain("0.78");
    expect(generated_material.content).toContain("0.92");

    // Verify that all 3 pattern reasoning explanations are integrated
    expect(generated_material.content).toContain("パターンA：コスト削減優先度78%");
    expect(generated_material.content).toContain("パターンB：リスク回避優先度85%");
    expect(generated_material.content).toContain("パターンC：成長戦略優先度92%");

    // Verify that the material structure contains required 3 sections
    expect(generated_material.structure).toHaveProperty(
      "comparison_table_section"
    );
    expect(generated_material.structure).toHaveProperty(
      "detailed_explanation_section"
    );
    expect(generated_material.structure).toHaveProperty(
      "integrated_recommendation_logic_section"
    );

    // Verify that comparison table section includes all 3 evaluation results
    const comparison_section =
      generated_material.structure.comparison_table_section;
    expect(comparison_section.rows).toHaveLength(3);
    expect(comparison_section.rows[0].relevance_score).toBe(0.78);
    expect(comparison_section.rows[1].relevance_score).toBe(0.85);
    expect(comparison_section.rows[2].relevance_score).toBe(0.92);

    // Verify that detailed explanation section contains reasoning for each pattern
    const detailed_section =
      generated_material.structure.detailed_explanation_section;
    expect(detailed_section.pattern_explanations).toHaveLength(3);
    expect(detailed_section.pattern_explanations[0].pattern_type).toBe(
      "pattern_a_cost_reduction"
    );
    expect(detailed_section.pattern_explanations[0].reasoning).toContain(
      "過去の類似案件"
    );
    expect(detailed_section.pattern_explanations[1].pattern_type).toBe(
      "pattern_b_risk_avoidance"
    );
    expect(detailed_section.pattern_explanations[1].reasoning).toContain(
      "大企業の段階的"
    );
    expect(detailed_section.pattern_explanations[2].pattern_type).toBe(
      "pattern_c_growth_strategy"
    );
    expect(detailed_section.pattern_explanations[2].reasoning).toContain(
      "成長戦略案件"
    );

    // Verify integrated recommendation logic section
    const integrated_section =
      generated_material.structure.integrated_recommendation_logic_section;
    expect(integrated_section.integration_method).toBe(
      "weighted_average_with_context"
    );
    expect(integrated_section.primary_recommendation_index).toBe(2);
    expect(integrated_section.secondary_recommendations).toEqual([1, 0]);

    // Verify that file upload was called with correct parameters
    expect(mock_file_storage.uploadRecommendationReport).toHaveBeenCalledWith({
      file_format: "pdf",
      customer_id: "cust_001",
      evaluation_result_ids: ["eval_003", "eval_001", "eval_002"],
      content_hash: expect.any(String),
      upload_category: "persuasion_material",
    });

    // Verify upload success and file metadata storage
    const upload_result = generated_material.upload_result;
    expect(upload_result.status).toBe("success");
    expect(upload_result.file_key).toBe(
      "reports/persuasion_2024_01_15_cust_001.pdf"
    );
    expect(upload_result.stored_evaluation_ids).toEqual([
      "eval_003",
      "eval_001",
      "eval_002",
    ]);

    // Verify material metadata
    expect(generated_material.metadata).toEqual({
      generation_timestamp: new Date("2024-01-15T11:00:00Z").toISOString(),
      customer_id: "cust_001",
      evaluation_result_count: 3,
      file_format: "pdf",
      highest_relevance_score: 0.92,
      lowest_relevance_score: 0.78,
      average_relevance_score: 0.85,
    });

    // Verify AI engine was called for each evaluation result
    expect(mock_ai_engine.generateRecommendation).toHaveBeenCalledTimes(3);
    expect(mock_ai_engine.explainRecommendationReasoning).toHaveBeenCalledTimes(
      3
    );
  });
});