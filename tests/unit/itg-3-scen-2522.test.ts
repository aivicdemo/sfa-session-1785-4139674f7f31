import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2522
  test('失敗要因の件数がちょうど閾値のとき、テンプレートに含まれる', () => {
    const FAILURE_THRESHOLD = 3;
    
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const failureFactors = [
      {
        id: 'fail_001',
        type: 'inadequate_timing',
        description: '営業タイミングが早すぎた',
      },
      {
        id: 'fail_002',
        type: 'wrong_approach',
        description: '提案アプローチが顧客ニーズと不一致',
      },
      {
        id: 'fail_003',
        type: 'insufficient_followup',
        description: 'フォローアップが不足していた',
      },
    ];

    const extractedPatternResult = {
      successFactors: [
        {
          id: 'success_001',
          type: 'proper_timing',
          description: '顧客購買シグナルを正確に検出',
        },
      ],
      failureFactors: failureFactors,
      patternCount: 1,
      confidenceScore: 0.92,
    };

    mockAIEngine.findSimilarPatterns.mockResolvedValue(extractedPatternResult);

    const testData = {
      customerId: 'cust_12345',
      customerIndustry: 'manufacturing',
      customerSize: 'large',
      dealAmount: 5000000,
      dealStage: 'proposal',
      historicalDeals: [
        {
          dealId: 'deal_001',
          outcome: 'won',
          reason: 'proper_timing',
        },
      ],
    };

    return extractSuccessPatterns(testData, mockAIEngine).then((template) => {
      expect(template.failureFactors).toBeDefined();
      expect(template.failureFactors).toHaveLength(FAILURE_THRESHOLD);
      expect(template.failureFactors[0].id).toBe('fail_001');
      expect(template.failureFactors[1].id).toBe('fail_002');
      expect(template.failureFactors[2].id).toBe('fail_003');
      expect(template.failureInclusionStatus).toBe('included');
      expect(template.failureFactorCount).toBe(3);
      expect(template.failureThresholdMet).toBe(true);
      expect(template.templateStructure).toBeDefined();
      expect(template.templateStructure.sections).toContain('failureFactors');
    });
  });
});