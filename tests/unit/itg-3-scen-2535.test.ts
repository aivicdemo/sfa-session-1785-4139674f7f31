import { generateSuccessPatternTemplate } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2535
  test('営業プロセスステップが1件のとき、1つのステップ要素を持つテンプレートが生成される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: '顧客の経営課題をヒアリングし、初期信頼関係を構築する',
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    const processSteps = [
      {
        stepId: 'step_001',
        stepName: '初期接触',
        stepOrder: 1,
      },
    ];

    const testData = {
      customerId: 'cust_12345',
      customerIndustry: '製造業',
      customerScale: '中堅企業',
      dealAmount: 5000000,
      dealStage: 'proposal',
      processSteps: processSteps,
    };

    const result = generateSuccessPatternTemplate(testData, mockAIEngine);

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'cust_12345',
        customerIndustry: '製造業',
      })
    );

    expect(result.steps).toHaveLength(1);
    expect(result.steps[0]).toEqual(
      expect.objectContaining({
        stepId: 'step_001',
        stepName: '初期接触',
        stepOrder: 1,
        recommendedAction: '顧客の経営課題をヒアリングし、初期信頼関係を構築する',
        successPatternMapping: expect.objectContaining({
          confidenceScore: 85,
        }),
      })
    );
    expect(result.templateStructure).toBeDefined();
    expect(result.templateStructure.totalSteps).toBe(1);
  });
});