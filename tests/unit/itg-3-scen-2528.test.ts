import { extractAndStructureSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能 - 失敗要因リスト処理', () => {
  // SCEN-2528
  test('失敗要因リストが空のとき、空配列として処理される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue({
        patterns: [
          {
            patternId: 'pattern_001',
            customerIndustry: '製造業',
            customerSize: 'large',
            proposalApproach: '総合的な業務改善提案',
            successRate: 0.85,
            successReasons: ['導入前後のコンサルティング実施', 'ROI明確化'],
            failureReasons: [],
            applicableConditions: {
              minAnnualRevenue: 5000,
              maxImplementationDays: 180,
              requiredApprovals: 2,
            },
          },
          {
            patternId: 'pattern_002',
            customerIndustry: '流通業',
            customerSize: 'medium',
            proposalApproach: 'システム導入支援',
            successRate: 0.78,
            successReasons: ['段階的な導入', 'ユーザー研修の充実'],
            failureReasons: [],
            applicableConditions: {
              minAnnualRevenue: 1000,
              maxImplementationDays: 120,
              requiredApprovals: 1,
            },
          },
        ],
        totalMatches: 2,
      }),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputDealData = {
      dealId: 'deal_12345',
      customerId: 'cust_67890',
      customerIndustry: '製造業',
      customerSize: 'large',
      annualRevenue: 8000,
      businessChallenge: '業務プロセスの効率化',
      proposalBudget: 2500000,
      implementationDays: 150,
      requiredApprovals: 2,
    };

    const result = extractAndStructureSuccessPatterns(
      inputDealData,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      dealId: 'deal_12345',
      customerId: 'cust_67890',
      applicablePatterns: [
        {
          patternId: 'pattern_001',
          customerIndustry: '製造業',
          customerSize: 'large',
          proposalApproach: '総合的な業務改善提案',
          successRate: 0.85,
          successReasons: ['導入前後のコンサルティング実施', 'ROI明確化'],
          failureReasons: [],
          applicableConditions: {
            minAnnualRevenue: 5000,
            maxImplementationDays: 180,
            requiredApprovals: 2,
          },
          matchScore: 0.92,
        },
        {
          patternId: 'pattern_002',
          customerIndustry: '流通業',
          customerSize: 'medium',
          proposalApproach: 'システム導入支援',
          successRate: 0.78,
          successReasons: ['段階的な導入', 'ユーザー研修の充実'],
          failureReasons: [],
          applicableConditions: {
            minAnnualRevenue: 1000,
            maxImplementationDays: 120,
            requiredApprovals: 1,
          },
          matchScore: 0.68,
        },
      ],
      recommendedApproach: '総合的な業務改善提案',
      structuredData: {
        successFactorCount: 4,
        failureFactorCount: 0,
        averageSuccessRate: 0.815,
        highestMatchingPattern: 'pattern_001',
      },
      processingStatus: 'success',
    });

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      inputDealData
    );
  });
});