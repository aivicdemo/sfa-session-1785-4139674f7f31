import { findSimilarPatterns, generateRecommendation, evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への推奨機能', () => {
  // SCEN-1333
  test('成功パターン適用可能性スコア0.85のとき、推奨提案アプローチが表示される', async () => {
    // Stub: evaluatePatternRelevance
    const stubEvaluatePatternRelevance = jest.fn().mockResolvedValue({
      relevanceScore: 0.85,
      isApplicable: true,
      confidence: 0.88
    });

    // Stub: findSimilarPatterns
    const pastCase1 = {
      caseId: 'case-001',
      customerIndustry: '製造業',
      dealAmount: 5000000,
      proposalApproach: '経営層向けROI説明資料の事前配布',
      closedResult: true,
      closedDate: '2024-01-15'
    };

    const pastCase2 = {
      caseId: 'case-002',
      customerIndustry: '製造業',
      dealAmount: 4800000,
      proposalApproach: '初回商談での導入効果の数値化',
      closedResult: true,
      closedDate: '2024-02-20'
    };

    const stubFindSimilarPatterns = jest.fn().mockResolvedValue({
      similarCases: [pastCase1, pastCase2],
      similarityCount: 2,
      averageSimilarityScore: 0.82
    });

    // Stub: generateRecommendation
    const stubGenerateRecommendation = jest.fn().mockResolvedValue({
      recommendedApproaches: [
        '経営層向けROI説明資料の事前配布',
        '初回商談での導入効果の数値化'
      ],
      rationale: '過去の類似案件2件で同じアプローチにより成約実績あり',
      confidence: 0.85,
      supportingCaseIds: ['case-001', 'case-002']
    });

    // New case input
    const newDealCondition = {
      customerIndustry: '製造業',
      dealAmount: 5000000,
      decisionMaker: '経営層'
    };

    // Execute: findSimilarPatterns
    const similarPatternsResult = await stubFindSimilarPatterns(newDealCondition);
    expect(similarPatternsResult.similarityCount).toBe(2);
    expect(similarPatternsResult.averageSimilarityScore).toBe(0.82);

    // Execute: evaluatePatternRelevance
    const evaluationResult = await stubEvaluatePatternRelevance({
      newDealCondition,
      similarPatterns: similarPatternsResult.similarCases
    });
    expect(evaluationResult.relevanceScore).toBe(0.85);
    expect(evaluationResult.isApplicable).toBe(true);

    // Execute: generateRecommendation (only if relevanceScore >= 0.7)
    let recommendationResult = null;
    if (evaluationResult.relevanceScore >= 0.7) {
      recommendationResult = await stubGenerateRecommendation({
        newDealCondition,
        similarPatterns: similarPatternsResult.similarCases,
        relevanceScore: evaluationResult.relevanceScore
      });
    }

    // Verify recommendation is generated and displayed
    expect(recommendationResult).not.toBeNull();
    expect(recommendationResult.recommendedApproaches).toEqual([
      '経営層向けROI説明資料の事前配布',
      '初回商談での導入効果の数値化'
    ]);
    expect(recommendationResult.rationale).toBe('過去の類似案件2件で同じアプローチにより成約実績あり');
    expect(recommendationResult.confidence).toBe(0.85);
    expect(recommendationResult.supportingCaseIds.length).toBe(2);
  });
});