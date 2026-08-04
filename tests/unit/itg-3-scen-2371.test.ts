import { calculateRecommendationInferenceScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推論精度スコア算出機能', () => {
  // SCEN-2371
  test('根拠情報を含む推奨結果から精度スコアが正確に算出される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationId: 'rec-001',
        proposedApproach: '顧客の経営課題に対する導入提案',
        confidenceScore: 0.85,
        reasoning: {
          basedOnPatterns: [
            {
              patternId: 'pat-123',
              matchDegree: 0.92,
              historicalSuccessRate: 0.88,
            },
            {
              patternId: 'pat-456',
              matchDegree: 0.78,
              historicalSuccessRate: 0.81,
            },
          ],
          evidenceDataPoints: [
            'customer_budget: 1500000 JPY',
            'industry: IT services',
            'company_size: 100-500 employees',
            'purchase_cycle: quarterly',
          ],
        },
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        '過去の同業種中堅企業5件の成功事例との類似度が高く、' +
          '提案されたアプローチは顧客の予算規模と導入スケジュールに適合しています。' +
          'システム導入後の継続利用率が95%以上の事例が3件あります。'
      ),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        applicabilityScore: 0.89,
        riskFactors: ['competitor_presence', 'budget_constraint'],
        recommendedActions: [
          '初期導入スコープを段階化',
          'ROI試算資料の追加作成',
        ],
      }),
    };

    const recommendationResult = mockAIEngine.generateRecommendation({
      customerId: 'cust-5001',
      customerIndustry: 'IT_services',
      customerSize: 'medium',
      dealAmount: 1500000,
    });

    const reasoningExplanation = mockAIEngine.explainRecommendationReasoning(
      recommendationResult
    );

    const patternRelevance = mockAIEngine.evaluatePatternRelevance(
      recommendationResult
    );

    const result = calculateRecommendationInferenceScore(
      recommendationResult,
      reasoningExplanation,
      patternRelevance
    );

    expect(result.inferenceScore).toBeCloseTo(0.865, 2);
    expect(result.hasReasoningBasis).toBe(true);
    expect(result.reasoningQualityIndicator).toBeGreaterThan(0.8);
    expect(result.patternApplicabilityContribution).toBe(0.89);
    expect(result.confidenceBoostFromEvidence).toBeCloseTo(0.085, 2);

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith({
      customerId: 'cust-5001',
      customerIndustry: 'IT_services',
      customerSize: 'medium',
      dealAmount: 1500000,
    });
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationResult
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      recommendationResult
    );
  });
});