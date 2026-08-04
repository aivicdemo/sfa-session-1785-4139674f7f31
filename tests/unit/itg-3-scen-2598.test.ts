import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンテンプレート自動判定機能', () => {
  // SCEN-2598
  test('商談期間が30日以上60日未満の成功パターンと一致する場合、判定基準が正しく適用される', () => {
    const dealStartDate = new Date('2026-01-15T00:00:00Z');
    const dealEndDate = new Date('2026-02-28T00:00:00Z');
    const dealDurationDays = 45;

    const successPatternTemplate = {
      patternId: 'SUCCESS_PATTERN_001',
      dealDurationCondition: {
        minDays: 30,
        maxDays: 60,
      },
      successRate: 78,
      appliedCasesCount: 45,
    };

    const aiRecommendationEngineStub = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        patternId: 'SUCCESS_PATTERN_001',
        relevanceScore: 0.92,
        matchedCondition: '商談期間',
      }),
    };

    const dealCondition = {
      dealStartDate: dealStartDate,
      dealEndDate: dealEndDate,
      dealDurationDays: dealDurationDays,
    };

    const result = evaluatePatternRelevance(
      dealCondition,
      successPatternTemplate,
      aiRecommendationEngineStub
    );

    expect(result.appliedPatternId).toBe('SUCCESS_PATTERN_001');
    expect(result.evaluationType).toBe('商談期間');
    expect(result.evaluationDetails).toBe('商談期間45日間（30日以上60日未満）');
    expect(result.successRatePercent).toBe(78);
    expect(result.appliedCasesCount).toBe(45);
    expect(result.isPatternMatched).toBe(true);
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).toHaveBeenCalledWith(
      dealCondition,
      successPatternTemplate
    );
  });
});