import { evaluateProposalAppropriateness } from '../../src/logic/it-1-br-3-1-1-1';

// Mock AIRecommendationEngine
const mockAIRecommendationEngine = {
  evaluatePatternRelevance: jest.fn(),
  generateRecommendation: jest.fn(),
  findSimilarPatterns: jest.fn(),
  explainRecommendationReasoning: jest.fn(),
};

describe('提案妥当性判定機能 - 営業プロセスリスクスコア許容範囲上限判定', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1196
  test('営業プロセスリスクスコアがちょうど許容範囲上限の場合に承認判定される', () => {
    const proposal_risk_score = 100;
    const risk_score_upper_limit = 100;

    mockAIRecommendationEngine.evaluatePatternRelevance.mockReturnValue({
      relevance_score: proposal_risk_score,
      is_applicable: true,
    });

    const test_input = {
      proposal_content: {
        product_name: 'Cloud Platform Solution',
        estimated_investment: 500000,
        implementation_period_days: 90,
        expected_roi_percent: 25,
      },
      customer_constraints: {
        budget_limit: 600000,
        schedule_constraint_days: 120,
        risk_tolerance_level: 3,
      },
      sales_process_data: {
        process_step: 'proposal_presentation',
        customer_engagement_score: 85,
        sales_team_experience_level: 2,
        proposal_alignment_score: 90,
      },
      business_process_risk_score: proposal_risk_score,
      risk_tolerance_threshold: risk_score_upper_limit,
    };

    const result = evaluateProposalAppropriateness(
      test_input,
      mockAIRecommendationEngine
    );

    expect(result.approval_status).toBe('approved');
    expect(result.judgment_log).toMatch(/営業プロセスリスクスコア: 100/);
    expect(result.judgment_log).toMatch(/許容範囲内/);
    expect(result.judgment_log).toMatch(/上限値: 100/);
    expect(result.judgment_reason_detail).toEqual({
      risk_score: 100,
      risk_upper_limit: 100,
      is_within_tolerance: true,
    });
  });
});