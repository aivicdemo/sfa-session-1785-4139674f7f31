import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('顧客条件照合機能 - 過去成功パターンの条件が商談条件と矛盾するケース', () => {
  // SCEN-642
  test('過去成功パターンと新規商談条件の矛盾をチェックして適用不可と判定する', () => {
    // 過去成功パターンの定義
    const pastSuccessPattern = {
      patternId: 'pattern-001',
      customerSize: 'LARGE_ENTERPRISE',
      industry: 'MANUFACTURING',
      budget: 10000000, // 1000万円以上の最小値
      implementationPeriodDays: 180, // 6ヶ月以内
    };

    // 新規商談条件
    const dealCondition = {
      dealId: 'deal-001',
      customerSize: 'MIDSIZE_COMPANY',
      industry: 'MANUFACTURING',
      budget: 5000000, // 500万円
      implementationPeriodDays: 90, // 3ヶ月
    };

    // AIRecommendationEngineのスタブ化
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        scoreBeforeConflict: 0.85,
      }),
    };

    // 顧客条件照合機能を実行
    const result = evaluatePatternRelevance(
      pastSuccessPattern,
      dealCondition,
      mockAIEngine
    );

    // 期待結果の検証
    expect(result.status).toBe('INAPPLICABLE');
    expect(result.conflicts).toContain(
      expect.objectContaining({
        field: 'customerSize',
        pastValue: 'LARGE_ENTERPRISE',
        dealValue: 'MIDSIZE_COMPANY',
      })
    );
    expect(result.conflicts).toContain(
      expect.objectContaining({
        field: 'budget',
        pastValue: 10000000,
        dealValue: 5000000,
      })
    );
    expect(result.recommendationScore).toBeLessThanOrEqual(0);
    expect(result.isApplicable).toBe(false);
  });
});