import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-2315
  test('成功パターン抽出・照合機能 - 過去商談データが複数件のとき全件から成功パターンが抽出される', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_001',
          dealId: 'deal_001',
          industry: 'manufacturing',
          productCategory: 'software',
          contractAmount: 5000000,
          contractPeriodMonths: 12,
          similarityScore: 0.95,
          successFactors: ['rapid_decision', 'technical_team_alignment'],
          dealAttributes: {
            customerIndustry: 'manufacturing',
            productCategory: 'software',
            contractAmount: 5000000,
            contractPeriodMonths: 12
          }
        },
        {
          patternId: 'pattern_002',
          dealId: 'deal_002',
          industry: 'retail',
          productCategory: 'logistics',
          contractAmount: 8000000,
          contractPeriodMonths: 24,
          similarityScore: 0.87,
          successFactors: ['competitive_pressure', 'roi_focused'],
          dealAttributes: {
            customerIndustry: 'retail',
            productCategory: 'logistics',
            contractAmount: 8000000,
            contractPeriodMonths: 24
          }
        },
        {
          patternId: 'pattern_003',
          dealId: 'deal_003',
          industry: 'financial',
          productCategory: 'compliance',
          contractAmount: 12000000,
          contractPeriodMonths: 36,
          similarityScore: 0.82,
          successFactors: ['regulatory_requirement', 'cfo_involvement'],
          dealAttributes: {
            customerIndustry: 'financial',
            productCategory: 'compliance',
            contractAmount: 12000000,
            contractPeriodMonths: 36
          }
        }
      ])
    };

    const newDealCondition = {
      customerIndustry: 'manufacturing',
      budgetRange: 'medium',
      purchasingDecisionMaker: 'cto',
      purchasingAuthority: 'high'
    };

    const result = findSimilarPatterns(newDealCondition, mockAIEngine);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealCondition);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(3);

    result.forEach((pattern: any) => {
      expect(pattern).toHaveProperty('patternId');
      expect(pattern).toHaveProperty('dealId');
      expect(pattern).toHaveProperty('similarityScore');
      expect(typeof pattern.similarityScore).toBe('number');
      expect(pattern.similarityScore).toBeGreaterThanOrEqual(0);
      expect(pattern.similarityScore).toBeLessThanOrEqual(1);
    });

    expect(result[0].similarityScore).toBeGreaterThanOrEqual(result[1].similarityScore);
    expect(result[1].similarityScore).toBeGreaterThanOrEqual(result[2].similarityScore);

    result.forEach((pattern: any) => {
      expect(pattern.dealAttributes).toHaveProperty('customerIndustry');
      expect(pattern.dealAttributes).toHaveProperty('productCategory');
      expect(pattern.dealAttributes).toHaveProperty('contractAmount');
      expect(pattern.dealAttributes).toHaveProperty('contractPeriodMonths');
    });

    expect(result[0].patternId).toBe('pattern_001');
    expect(result[1].patternId).toBe('pattern_002');
    expect(result[2].patternId).toBe('pattern_003');
    expect(result[0].similarityScore).toBe(0.95);
    expect(result[1].similarityScore).toBe(0.87);
    expect(result[2].similarityScore).toBe(0.82);
  });
});