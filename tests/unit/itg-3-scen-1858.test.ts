import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('推奨根拠の可視化機能 - データ整合性検証', () => {
  // SCEN-1858
  test('推奨根拠データの整合性が取れないとき根拠情報の生成に失敗する', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        recommendation_id: 'REC-2024-001',
        customer_id: 'CUST-12345',
        reasoning_score: '85',
        reasoning_basis: {
          past_cases: [
            {
              case_id: 'CASE-2023-156',
              similarity_score: 0.92,
              outcome: 'success'
            }
          ],
          success_pattern: {
            pattern_id: 'PAT-001',
            match_degree: 0.88
          },
          timing_rationale: 'Customer purchasing cycle aligned with Q4 budget cycle',
          risk_factors: []
        },
        confidence_score: 0.94,
        generated_at: '2024-12-15T09:30:00Z'
      })
    };

    const recommendationId = 'REC-2024-001';
    const customerData = {
      customer_id: 'CUST-12345',
      industry: 'Manufacturing',
      company_size: 'Large',
      annual_budget: 5000000
    };

    expect(() => {
      visualizeRecommendationReasoning(
        recommendationId,
        customerData,
        mockAIEngine
      );
    }).toThrow(/reasoning_score/);
  });
});