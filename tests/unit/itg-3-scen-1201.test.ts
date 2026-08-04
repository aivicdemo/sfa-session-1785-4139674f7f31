import { evaluateProposalFeasibility } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1201
  test('[normal] 提案妥当性判定機能 - 同じ提案内容で2回判定しても同じ改善指摘が返される', () => {
    const proposalContent = {
      customerId: 'CUST-001',
      industry: '製造業',
      issue: '生産効率化',
      budget: 5000000,
      proposalApproach: '自動化ソリューション導入',
      timeline: 6,
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-001',
        approach: '自動化ソリューション導入',
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PAT-001',
          matchScore: 0.92,
          successRate: 0.88,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: '過去の類似事例から、製造業の生産効率化課題に対して自動化ソリューション導入は高い成功率を示しています。',
        keyFactors: ['業種適合性', '予算適合性', 'ROI見込み'],
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.89,
        applicability: true,
      }),
    };

    const expectedImprovementAdvice = {
      adviceId: 'ADV-001',
      adviceText: '提案内容と顧客の経営目標が適合していますが、実装スケジュールを2ヶ月短縮することで投資対効果が向上します。',
      recommendedAction: 'スケジュール短縮を顧客と協議',
      reasoningBasis: '過去の類似案件では、6ヶ月から4ヶ月への短縮により導入効果が30%向上した実績があります。',
      feasibilityScore: 78,
    };

    const firstEvaluation = evaluateProposalFeasibility(
      proposalContent,
      aiRecommendationEngineStub as any
    );

    expect(firstEvaluation).toEqual(
      expect.objectContaining({
        feasibilityAssessment: expect.objectContaining({
          overallScore: expect.any(Number),
          improvementAdvice: expect.arrayContaining([
            expect.objectContaining({
              adviceId: 'ADV-001',
              adviceText: 'provide具体的な改善指摘',
              recommendedAction: expect.any(String),
              reasoningBasis: expect.any(String),
              feasibilityScore: expect.any(Number),
            }),
          ]),
        }),
      })
    );

    const firstAdviceId = firstEvaluation.feasibilityAssessment.improvementAdvice[0].adviceId;
    const firstAdviceText = firstEvaluation.feasibilityAssessment.improvementAdvice[0].adviceText;
    const firstRecommendedAction = firstEvaluation.feasibilityAssessment.improvementAdvice[0].recommendedAction;
    const firstReasoningBasis = firstEvaluation.feasibilityAssessment.improvementAdvice[0].reasoningBasis;
    const firstFeasibilityScore = firstEvaluation.feasibilityAssessment.improvementAdvice[0].feasibilityScore;

    const secondEvaluation = evaluateProposalFeasibility(
      proposalContent,
      aiRecommendationEngineStub as any
    );

    const secondAdviceId = secondEvaluation.feasibilityAssessment.improvementAdvice[0].adviceId;
    const secondAdviceText = secondEvaluation.feasibilityAssessment.improvementAdvice[0].adviceText;
    const secondRecommendedAction = secondEvaluation.feasibilityAssessment.improvementAdvice[0].recommendedAction;
    const secondReasoningBasis = secondEvaluation.feasibilityAssessment.improvementAdvice[0].reasoningBasis;
    const secondFeasibilityScore = secondEvaluation.feasibilityAssessment.improvementAdvice[0].feasibilityScore;

    expect(secondAdviceId).toBe(firstAdviceId);
    expect(secondAdviceText).toBe(firstAdviceText);
    expect(secondRecommendedAction).toBe(firstRecommendedAction);
    expect(secondReasoningBasis).toBe(firstReasoningBasis);
    expect(secondFeasibilityScore).toBe(firstFeasibilityScore);

    expect(secondEvaluation.feasibilityAssessment.improvementAdvice.length).toBe(
      firstEvaluation.feasibilityAssessment.improvementAdvice.length
    );
  });
});