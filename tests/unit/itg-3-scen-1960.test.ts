import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1960
  test('[edge] 成功パターン抽出・照合機能 - 過去成功事例の成約までの日数が業務上の最大値のときにパターンが適用される', async () => {
    const MAX_DAYS_TO_CONTRACT = 180;

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern-180-days-max',
          contractorType: 'enterprise',
          daysToContract: MAX_DAYS_TO_CONTRACT,
          successRate: 0.82,
          sampleSize: 24,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        '過去の類似顧客グループでは、エンタープライズ層への提案では180日の商談期間内での成約が標準パターンとして確認されています。',
      ),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        patternId: 'pattern-180-days-max',
        relevanceScore: 0.85,
        applicableReason: '成約日数が最大値範囲内で合致',
      }),
    };

    const newCaseInput = {
      customerId: 'customer-new-001',
      customerType: 'enterprise',
      industry: 'manufacturing',
      estimatedDaysToContract: 180,
      dealSize: 5000000,
      productCategory: 'ERP_System',
    };

    const result = await generateRecommendation(newCaseInput, mockAIEngine);

    expect(result).toBeDefined();
    expect(result.recommendations).toBeDefined();
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(result.recommendations.length).toBeGreaterThan(0);

    const appliedPattern = result.recommendations[0];
    expect(appliedPattern.patternId).toBe('pattern-180-days-max');
    expect(appliedPattern.relevanceScore).toBeGreaterThanOrEqual(0.8);
    expect(appliedPattern.relevanceScore).toBeLessThanOrEqual(1.0);
    expect(appliedPattern.applicableReason).toMatch(/成約日数が最大値範囲内で合致/);
    expect(appliedPattern.daysToContract).toBe(MAX_DAYS_TO_CONTRACT);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newCaseInput);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});