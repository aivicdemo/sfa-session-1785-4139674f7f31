import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンマッチング機能', () => {
  // SCEN-2651
  test('新規案件の商談条件が未設定のとき、マッチングエラーが発生し代替動作が実行される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatternMaster = [
      {
        patternId: 'pattern_001',
        successRate: 85,
        industrySegment: 'manufacturing',
        dealSize: 'large',
        approachDescription: '大規模製造業向け提案パターン',
        recommendationScore: 85,
      },
      {
        patternId: 'pattern_002',
        successRate: 75,
        industrySegment: 'retail',
        dealSize: 'medium',
        approachDescription: '中堅小売業向け提案パターン',
        recommendationScore: 75,
      },
    ];

    const dealConditions = {
      expectedBudget: null,
      implementationDate: null,
      decisionMaker: null,
      timeline: null,
      constraints: null,
    };

    const newDeal = {
      dealId: 'deal_001',
      customerId: 'cust_001',
      customerIndustry: 'manufacturing',
      customerSize: 'large',
      dealConditions: dealConditions,
    };

    const result = generateRecommendation(
      newDeal,
      mockAIEngine,
      mockPatternMaster
    );

    expect(result).toEqual({
      success: false,
      errorCode: 'MATCHING_ERROR_MISSING_NEGOTIATION_CONDITIONS',
      errorMessage: '商談条件が未設定のため、成功パターンのマッチングが実行できません',
      userMessage: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      fallbackRecommendations: [
        {
          patternId: 'pattern_001',
          successRate: 85,
          industrySegment: 'manufacturing',
          dealSize: 'large',
          approachDescription: '大規模製造業向け提案パターン',
          recommendationScore: 85,
        },
      ],
      aiEngineNotCalled: true,
    });

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});