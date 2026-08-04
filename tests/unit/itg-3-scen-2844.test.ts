import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・提案アプローチ推奨機能', () => {
  // SCEN-2844
  test('新規案件の商談条件が過去成功パターンと異なった場合、適用可能スコアが低く算出される', () => {
    const pastSuccessPattern = {
      dealScale: 10000000,
      industry: 'manufacturing',
      decisionMakers: 3,
      proposalPeriodDays: 90,
      applicabilityScoreBenchmark: 0.85,
    };

    const newDealData = {
      dealScale: 5000000,
      industry: 'distribution',
      decisionMakers: 1,
      proposalPeriodDays: 30,
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          ...pastSuccessPattern,
          similarity: 0.32,
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        applicabilityScore: 0.32,
        scaleDifference: 0.40,
        industryMatch: false,
        decisionMakersDifference: 0.66,
        proposalPeriodDifference: 0.66,
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        scaleCause: '過去事例は1000万円以上の大規模案件が中心（現案件: 500万円の中規模）',
        industryMismatch: '成功パターンは製造業（現案件: 流通業）',
        decisionMakersCause: '過去事例は3名以上の複数決定者（現案件: 1名）',
        proposalPeriodCause: '成功パターンは3ヶ月の提案期間（現案件: 1ヶ月）',
        overallMessage: '過去の成功事例と商談条件が異なるため、提案アプローチのカスタマイズが必要です',
      }),
      generateRecommendation: jest.fn(),
    };

    const result = generateRecommendation(newDealData, mockAIEngine);

    expect(result.applicabilityScore).toBe(0.32);
    expect(result.applicabilityScore).toBeLessThan(0.85);
    expect(result.message).toMatch(/過去の成功事例と商談条件が異なるため、提案アプローチのカスタマイズが必要です/);
    expect(result.reasoning).toBeDefined();
    expect(result.reasoning.scaleDifference).toBe(0.40);
    expect(result.reasoning.industryMatch).toBe(false);
    expect(result.reasoning.decisionMakersDifference).toBe(0.66);
    expect(result.reasoning.proposalPeriodDifference).toBe(0.66);
  });
});