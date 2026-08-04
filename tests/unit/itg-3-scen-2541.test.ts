import { extractAndStructureSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2541
  test('営業プロセスステップ名が欠落しているとき、例外が発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    mockAIEngine.generateRecommendation.mockResolvedValue({
      recommendedApproach: 'テクニカルデモ',
      confidence: 85,
    });

    mockAIEngine.findSimilarPatterns.mockResolvedValue([
      {
        patternId: 'PAT-001',
        customerId: 'CUST-A',
        dealValue: 5000000,
        successRate: 0.92,
      },
    ]);

    mockAIEngine.explainRecommendationReasoning.mockResolvedValue({
      reasoning:
        '過去の類似案件で成功した提案アプローチ',
    });

    mockAIEngine.evaluatePatternRelevance.mockResolvedValue({
      applicabilityScore: 0.88,
    });

    const invalidSuccessPatternWithEmptyProcessStepName = {
      patternId: 'PAT-2541',
      processStepName: '',
      customerIndustry: '製造業',
      customerSize: '中堅企業',
      dealAmount: 3000000,
      successCriteria: '3ヶ月以内の成約',
      approachType: '初回提案',
      successMetrics: {
        conversionRate: 0.78,
        avgDealSize: 2500000,
      },
    };

    expect(() =>
      extractAndStructureSuccessPatterns(
        invalidSuccessPatternWithEmptyProcessStepName,
        mockAIEngine,
      ),
    ).toThrow(/processStepName/);
  });
});