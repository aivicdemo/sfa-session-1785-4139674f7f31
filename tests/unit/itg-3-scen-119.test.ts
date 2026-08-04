import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 提案アプローチ生成', () => {
  // SCEN-119
  test('提案アプローチマスタに該当パターンが存在しない場合にフォールバック推奨が返される', () => {
    const emptyRecommendationPatterns: Array<{
      patternId: string;
      industryCode: string;
      challengeType: string;
      proposalApproach: string;
      successRate: number;
    }> = [];

    const recommendationMaster: Array<{
      patternId: string;
      industryCode: string;
      challengeType: string;
      proposalApproach: string;
      successRate: number;
      proposalContent: string;
      reasoning: string;
    }> = [
      {
        patternId: 'default_001',
        industryCode: 'DEFAULT',
        challengeType: 'GENERIC',
        proposalApproach: 'Standard Discovery Session',
        successRate: 45,
        proposalContent: 'Initial consultation and needs assessment',
        reasoning: 'Default fallback pattern - brief consultation recommended',
      },
      {
        patternId: 'default_002',
        industryCode: 'DEFAULT',
        challengeType: 'GENERIC',
        proposalApproach: 'Follow-up with Case Studies',
        successRate: 38,
        proposalContent: 'Share relevant industry case studies',
        reasoning: 'Secondary fallback - demonstrate similar success stories',
      },
    ];

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproaches: emptyRecommendationPatterns,
        fallbackApproaches: recommendationMaster
          .sort((a, b) => b.successRate - a.successRate)
          .slice(0, 2),
        message:
          '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
        isFallback: true,
        responseTimeMs: 1250,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerInfo = {
      customerId: 'CUST-2024-0819',
      industry: 'IT',
      companySize: 'mid-market',
      challenge: 'コスト削減',
      budget: 5000000,
    };

    const dealCondition = {
      dealId: 'DEAL-2024-1102',
      dealStage: 'discovery',
      customerLifecycleStage: 'prospect',
      competitorPresence: false,
      urgency: 'medium',
    };

    const inputData = {
      customer: customerInfo,
      dealCondition: dealCondition,
      aiEngine: aiRecommendationEngineStub,
      patternMasterData: emptyRecommendationPatterns,
    };

    const result = generateRecommendation(inputData);

    expect(result.recommendedApproaches).toEqual([]);
    expect(result.fallbackApproaches).toHaveLength(2);
    expect(result.fallbackApproaches[0].patternId).toBe('default_001');
    expect(result.fallbackApproaches[0].successRate).toBe(45);
    expect(result.fallbackApproaches[1].patternId).toBe('default_002');
    expect(result.fallbackApproaches[1].successRate).toBe(38);
    expect(result.message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );
    expect(result.isFallback).toBe(true);
    expect(result.fallbackApproaches[0].reasoning).toMatch(/brief/i);
    expect(result.fallbackApproaches[1].reasoning).toMatch(/secondary/i);
  });
});