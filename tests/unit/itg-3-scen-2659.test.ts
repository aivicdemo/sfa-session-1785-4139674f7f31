import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動判定機能', () => {
  test('SCEN-2659: 顧客属性マッチスコアが閾値直下（99.9%）のとき、不適用として判定される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        matchScore: 99.9,
        isApplicable: false,
        reason: 'マッチスコアが閾値に達していません（99.9% < 100%）'
      })
    };

    const customerAttributeData = {
      industry: 'manufacturing',
      companySize: 'large',
      revenue: 1000000000,
      employeeCount: 5000,
      region: 'asia-pacific'
    };

    const successPatternTemplate = {
      patternId: 'pattern-001',
      targetIndustry: 'manufacturing',
      targetCompanySize: 'large',
      minRevenueThreshold: 800000000,
      successRateHistory: 87.5
    };

    return evaluatePatternRelevance(
      customerAttributeData,
      successPatternTemplate,
      mockAIEngine
    ).then(result => {
      expect(result.judgmentStatus).toBe('NOT_APPLICABLE');
      expect(result.matchScore).toBe(99.9);
      expect(result.judgmentReason).toBe('マッチスコアが閾値に達していません（99.9% < 100%)');
      expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
        customerAttributeData,
        successPatternTemplate
      );
    });
  });
});