import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動判定機能 - 顧客属性マッチスコア閾値判定', () => {
  test('SCEN-2660: 顧客属性マッチスコアが閾値直上（100.1%）のとき、適用対象として判定される', () => {
    const mockCustomerAttributes = {
      industry: 'manufacturing',
      employeeCount: 500,
      annualRevenue: 50000000,
      region: 'Tokyo',
      businessPhase: 'growth'
    };

    const mockSuccessPattern = {
      patternId: 'SP-001',
      targetIndustry: 'manufacturing',
      targetEmployeeCountRange: { min: 300, max: 1000 },
      targetRevenueRange: { min: 30000000, max: 100000000 },
      targetRegion: 'Tokyo',
      applicableBusinessPhases: ['growth', 'expansion'],
      successRate: 0.82,
      adoptionCount: 45,
      matchThreshold: 100.0
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        matchScore: 100.1,
        isApplicable: true,
        reasoning: 'Customer attributes exceed minimum threshold'
      })
    };

    const result = evaluatePatternRelevance(
      mockCustomerAttributes,
      mockSuccessPattern,
      mockAIEngine
    );

    expect(result.isApplicable).toBe(true);
    expect(result.matchScore).toBe(100.1);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      mockCustomerAttributes,
      mockSuccessPattern
    );
  });
});