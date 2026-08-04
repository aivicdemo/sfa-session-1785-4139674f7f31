import { extractAndStructureSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2523
  test('失敗要因の件数が閾値直下のとき、テンプレートに含まれる', () => {
    // 準備: 失敗要因データセット（閾値-1 = 9件）
    const failureFactorsThreshold = 10;
    const failureFactorsCount = failureFactorsThreshold - 1;

    const failureFactors = Array.from({ length: failureFactorsCount }, (_, i) => ({
      id: `failure_${i + 1}`,
      category: `category_${i % 3}`,
      description: `Failed to execute action ${i + 1}`,
      frequency: 5 + i,
    }));

    // AIRecommendationEngineのスタブ
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        templateType: 'structured_pattern',
        includeFailureFactors: true,
        failureFactorsSection: {
          threshold: failureFactorsThreshold,
          count: failureFactorsCount,
          factors: failureFactors,
        },
        successCriteria: [
          { id: 'success_1', description: 'Successful proposal acceptance' },
        ],
        recommendedActions: [
          { id: 'action_1', description: 'Follow-up within 48 hours' },
        ],
      }),
    };

    // 入力パラメータ
    const newDealCondition = {
      customerId: 'cust_001',
      customerIndustry: 'manufacturing',
      customerSize: 'mid-market',
      dealValue: 500000,
      dealStage: 'proposal',
      dealAge: 14,
      failureFactorsThreshold: failureFactorsThreshold,
    };

    // 機能呼び出し
    const result = extractAndStructureSuccessPatterns(
      newDealCondition,
      aiRecommendationEngineStub,
    );

    // 検証: テンプレート種別と失敗要因セクション
    expect(result.templateType).toBe('structured_pattern');
    expect(result.includeFailureFactors).toBe(true);

    // 検証: failureFactorsSection内に9件すべて格納
    expect(result.failureFactorsSection).toBeDefined();
    expect(result.failureFactorsSection.count).toBe(9);
    expect(result.failureFactorsSection.factors).toHaveLength(9);

    // 検証: 各失敗要因が{id, category, description, frequency}構造で格納
    result.failureFactorsSection.factors.forEach((factor, index) => {
      expect(factor).toHaveProperty('id');
      expect(factor).toHaveProperty('category');
      expect(factor).toHaveProperty('description');
      expect(factor).toHaveProperty('frequency');
      expect(factor.id).toBe(`failure_${index + 1}`);
      expect(factor.category).toBe(`category_${index % 3}`);
      expect(factor.description).toBe(`Failed to execute action ${index + 1}`);
      expect(factor.frequency).toBe(5 + index);
    });

    // 検証: evaluatePatternRelevanceが呼び出されたか確認
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'cust_001',
        customerIndustry: 'manufacturing',
        customerSize: 'mid-market',
        dealValue: 500000,
        dealStage: 'proposal',
        dealAge: 14,
        failureFactorsThreshold: 10,
      }),
    );
  });
});