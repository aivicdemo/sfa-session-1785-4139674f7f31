import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容の妥当性評価 - 評価スコア0.5の条件付き推奨判定', () => {
  // SCEN-1040
  test('評価スコアが0.5の場合、推奨ステータスがCONDITIONALで条件情報が設定される', async () => {
    const mockRecommendationData = {
      dealId: 'DEAL-001',
      customerId: 'CUST-001',
      customerIndustry: 'manufacturing',
      customerSize: 'mid-market',
      proposalApproach: 'consultative_selling',
      recommendedActions: [
        'conduct_needs_assessment',
        'schedule_executive_meeting'
      ],
      confidenceScore: 0.75
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 0.5,
        matchedPatterns: [
          {
            patternId: 'PAT-1001',
            relevanceIndicators: [
              'customer_size_mismatch',
              'industry_moderate_match'
            ]
          }
        ],
        requiresManualReview: true
      })
    };

    const result = await evaluatePatternRelevance(
      mockRecommendationData,
      mockAIEngine
    );

    expect(result.recommendationStatus).toBe('CONDITIONAL');
    expect(result.evaluationScore).toBe(0.5);
    expect(result.conditionNotes).not.toBe('');
    expect(typeof result.conditionNotes).toBe('string');
    expect(result.conditionNotes).toMatch(/確認|判断/);
    expect(result.requiresApproval).toBe(true);
  });
});