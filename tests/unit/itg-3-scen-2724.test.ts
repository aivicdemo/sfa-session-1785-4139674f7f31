import { evaluatePatternMatchForNewDeal } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件に対して提案アプローチを推奨する', () => {
  // SCEN-2724
  test('[normal] 顧客・商談条件の照合判定 - 新規案件の顧客属性が成功パターンの顧客条件と完全一致した場合、提案アプローチが推奨される', () => {
    const newDealInput = {
      customerAttributes: {
        industry: '製造業',
        employeeCount: '500-1000名',
        revenue: '50-100億円',
        region: '関東'
      },
      dealConditions: {
        budget: '1000万円以上',
        implementationTimeline: '3ヶ月以内',
decisionMakerPresent: true
      }
    };

    const successPatternFromMaster = {
      customerAttributes: {
        industry: '製造業',
        employeeCount: '500-1000名',
        revenue: '50-100億円',
        region: '関東'
      },
      dealConditions: {
        budget: '1000万円以上',
        implementationTimeline: '3ヶ月以内',
        decisionMakerPresent: true
      },
      recommendedApproach: 'プロダクトデモ中心のアプローチ',
      successScorePercentage: 95
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 1.0,
        matchStatus: 'perfect_match'
      }),
      generateRecommendation: jest.fn().mockReturnValue({
        approach: 'プロダクトデモ中心のアプローチ',
        rationale: '顧客属性と商談条件が過去成功事例と完全一致',
        confidenceScore: 95
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([successPatternFromMaster]),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        '顧客の業種・従業員数・売上規模・地域および予算・導入予定時期・決裁者在席の条件がすべて過去の成功事例と一致しており、同じアプローチが有効である'
      )
    };

    const result = evaluatePatternMatchForNewDeal(
      newDealInput,
      [successPatternFromMaster],
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      newDealInput,
      successPatternFromMaster
    );

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      newDealInput,
      [successPatternFromMaster]
    );

    expect(result.recommendedApproach).toBe('プロダクトデモ中心のアプローチ');
    expect(result.rationale).toBe(
      '顧客の業種・従業員数・売上規模・地域および予算・導入予定時期・決裁者在席の条件がすべて過去の成功事例と一致しており、同じアプローチが有効である'
    );
    expect(result.confidenceLevel).toBe('高');
    expect(result.confidenceScorePercentage).toBe(95);
    expect(result.patternRelevanceScore).toBe(1.0);
    expect(result.matchStatus).toBe('perfect_match');
  });
});