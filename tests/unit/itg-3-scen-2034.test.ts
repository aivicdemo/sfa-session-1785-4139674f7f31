import { generateExecutivePersuasionMaterial } from '../../src/logic/it-1-br-3-1-1-1';

const mockAIRecommendationEngine = {
  generateRecommendation: jest.fn(),
  findSimilarPatterns: jest.fn(),
  explainRecommendationReasoning: jest.fn(),
  evaluatePatternRelevance: jest.fn(),
};

const mockFileStorageAdapter = {
  uploadRecommendationReport: jest.fn(),
  generateDownloadUrl: jest.fn(),
  deleteExpiredReports: jest.fn(),
};

describe('Executive Persuasion Material Generation - Fiscal Year Boundary Handling', () => {
  // SCEN-2034
  test('should correctly aggregate and present evaluation results spanning fiscal years (2024-03-15 to 2025-04-20) with clear fiscal year separation', async () => {
    mockAIRecommendationEngine.generateRecommendation.mockResolvedValue({
      approach: 'customer_retention_upsell',
      confidence_score: 82,
      success_patterns: [
        {
          pattern_id: 'SP_001',
          pattern_name: 'High-value customer expansion',
          match_confidence: 0.87,
        },
      ],
    });

    mockAIRecommendationEngine.findSimilarPatterns.mockResolvedValue([
      {
        case_id: 'CASE_2024_001',
        fiscal_year: 2024,
        similarity_score: 0.91,
        customer_segment: 'enterprise',
        proposal_value: 5000000,
        result: 'adopted',
        contract_date: '2024-11-15',
      },
      {
        case_id: 'CASE_2025_001',
        fiscal_year: 2025,
        similarity_score: 0.88,
        customer_segment: 'enterprise',
        proposal_value: 4800000,
        result: 'adopted',
        contract_date: '2025-02-28',
      },
    ]);

    mockAIRecommendationEngine.explainRecommendationReasoning.mockResolvedValue({
      primary_reason: 'Customer demonstrated strong budget utilization in prior fiscal years',
      supporting_evidence: [
        'FY2024 Q4 spending increased 15% vs Q3',
        'FY2025 Q1 pipeline shows 12% growth',
      ],
    });

    mockFileStorageAdapter.uploadRecommendationReport.mockResolvedValue({
      report_url: 's3://reports/exec_persuasion_2024_2025_eval.pdf',
      upload_timestamp: '2025-04-25T10:30:00Z',
    });

    const evaluation_results_input = {
      evaluation_period_start: '2024-03-15',
      evaluation_period_end: '2025-04-20',
      fiscal_year_boundary: '2025-04-01',
      evaluations: [
        {
          evaluation_id: 'EVAL_202403_001',
          fiscal_year: 2024,
          evaluation_date: '2024-03-15',
          customer_id: 'CUST_001',
          proposal_value: 2000000,
          adoption_score: 85,
        },
        {
          evaluation_id: 'EVAL_202405_001',
          fiscal_year: 2024,
          evaluation_date: '2024-05-10',
          customer_id: 'CUST_002',
          proposal_value: 3500000,
          adoption_score: 92,
        },
        {
          evaluation_id: 'EVAL_202411_001',
          fiscal_year: 2024,
          evaluation_date: '2024-11-20',
          customer_id: 'CUST_003',
          proposal_value: 5000000,
          adoption_score: 88,
        },
        {
          evaluation_id: 'EVAL_202504_001',
          fiscal_year: 2025,
          evaluation_date: '2025-04-05',
          customer_id: 'CUST_004',
          proposal_value: 1800000,
          adoption_score: 79,
        },
        {
          evaluation_id: 'EVAL_202504_002',
          fiscal_year: 2025,
          evaluation_date: '2025-04-20',
          customer_id: 'CUST_005',
          proposal_value: 2200000,
          adoption_score: 86,
        },
      ],
      constraint_conditions: {
        budget_limit: 15000000,
        schedule_constraint: 'Q2_2025_delivery',
        risk_tolerance: 'moderate',
      },
    };

    const proposal_content = {
      proposal_id: 'PROP_2024_2025_001',
      customer_id: 'CUST_EXEC_001',
      proposed_solutions: [
        {
          solution_id: 'SOL_001',
          category: 'digital_transformation',
          value: 4000000,
        },
        {
          solution_id: 'SOL_002',
          category: 'operational_efficiency',
          value: 2500000,
        },
      ],
      roi_projection: {
        year_1_benefit: 5200000,
        year_2_benefit: 7800000,
        implementation_cost: 6500000,
        payback_months: 15,
      },
    };

    const generated_material = await generateExecutivePersuasionMaterial(
      evaluation_results_input,
      proposal_content,
      mockAIRecommendationEngine,
      mockFileStorageAdapter,
    );

    // FY2024 calculations (2024-04-01 to 2025-03-31)
    // Period covered from 2024-03-15: 2024-04-01 to 2025-03-31
    const fy2024_evaluations = [
      { date: '2024-05-10', value: 3500000, score: 92 },
      { date: '2024-11-20', value: 5000000, score: 88 },
    ];
    const fy2024_total_value = 8500000;
    const fy2024_avg_adoption = (92 + 88) / 2;

    // FY2025 calculations (2025-04-01 to 2026-03-31)
    // Period covered until 2025-04-20: 2025-04-01 to 2025-04-20
    const fy2025_evaluations = [
      { date: '2025-04-05', value: 1800000, score: 79 },
      { date: '2025-04-20', value: 2200000, score: 86 },
    ];
    const fy2025_total_value = 4000000;
    const fy2025_avg_adoption = (79 + 86) / 2;

    // Combined calculations
    const combined_total_value = fy2024_total_value + fy2025_total_value;
    const combined_avg_adoption = (fy2024_avg_adoption * 2 + fy2025_avg_adoption * 2) / 4;

    expect(generated_material).toBeDefined();
    expect(generated_material.material_type).toBe('executive_persuasion_document');
    expect(generated_material.fiscal_year_sections).toBeDefined();
    expect(generated_material.fiscal_year_sections).toHaveLength(2);

    expect(generated_material.fiscal_year_sections[0]).toEqual({
      fiscal_year: 2024,
      period_start: '2024-04-01',
      period_end: '2025-03-31',
      evaluations_count: 2,
      total_proposal_value: 8500000,
      average_adoption_score: 90,
      evaluation_ids: ['EVAL_202405_001', 'EVAL_202411_001'],
    });

    expect(generated_material.fiscal_year_sections[1]).toEqual({
      fiscal_year: 2025,
      period_start: '2025-04-01',
      period_end: '2025-04-20',
      evaluations_count: 2,
      total_proposal_value: 4000000,
      average_adoption_score: 82.5,
      evaluation_ids: ['EVAL_202504_001', 'EVAL_202504_002'],
    });

    expect(generated_material.summary_metrics).toEqual({
      combined_evaluation_period: {
        start: '2024-03-15',
        end: '2025-04-20',
      },
      combined_total_proposal_value: 12500000,
      combined_average_adoption_score: 86.25,
      fiscal_boundary_date: '2025-04-01',
      fy2024_contribution_ratio: 0.68,
      fy2025_contribution_ratio: 0.32,
    });

    expect(generated_material.recommendation_basis).toEqual({
      success_pattern_id: 'SP_001',
      pattern_confidence: 82,
      pattern_name: 'High-value customer expansion',
      similar_case_count: 2,
      average_similarity_score: 0.895,
    });

    expect(generated_material.persuasion_narrative).toBeDefined();
    expect(generated_material.persuasion_narrative).toContain('fiscal year 2024');
    expect(generated_material.persuasion_narrative).toContain('fiscal year 2025');
    expect(generated_material.persuasion_narrative).toContain('8500000');
    expect(generated_material.persuasion_narrative).toContain('4000000');
    expect(generated_material.persuasion_narrative).toContain('12500000');

    expect(generated_material.risk_factors).toBeDefined();
    expect(generated_material.risk_factors.length).toBeGreaterThanOrEqual(0);

    expect(generated_material.financial_summary).toEqual({
      total_roi_year1: 5200000,
      total_roi_year2: 7800000,
      implementation_cost: 6500000,
      payback_months: 15,
      fy2024_estimated_benefit: 3536000,
      fy2025_estimated_benefit: 1664000,
    });

    expect(generated_material.document_metadata).toEqual({
      generation_timestamp: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/),
      fiscal_year_separation_applied: true,
      fiscal_boundary_handled: true,
      no_duplicate_values: true,
      period_span_count: 2,
    });

    expect(generated_material.storage_location).toBe(
      's3://reports/exec_persuasion_2024_2025_eval.pdf',
    );

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalled();
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalled();
  });
});