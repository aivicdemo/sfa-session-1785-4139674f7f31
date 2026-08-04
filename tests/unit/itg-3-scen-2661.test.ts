import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動判定機能 - マッチスコア閾値判定', () => {
  // SCEN-2661
  test('商談条件マッチスコアが閾値ちょうど（80%）のとき、適用対象として判定される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: 80.0,
        confidence: 0.95,
      }),
    };

    const dealCondition = {
      customerIndustry: '製造業',
      companyScale: 'large',
      budgetRange: '5000000-10000000',
      decisionMakerRole: '経営層',
      previousPurchaseHistory: true,
      contractTerm: 12,
    };

    const result = evaluatePatternRelevance(
      dealCondition,
      mockAIEngine,
      80.0
    );

    expect(result.success).toBe(true);
    expect(result.applicabilityStatus).toBe('ELIGIBLE_FOR_PATTERN_APPLICATION');
    expect(result.applicabilityReason).toBe(
      'matchScore: 80.0 / threshold: 80.0 - 閾値に達しているため適用対象と判定'
    );
    expect(result.matchScore).toBe(80.0);
    expect(result.thresholdValue).toBe(80.0);
  });
});