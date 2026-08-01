import { evaluateSuccessPatternApplicability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-267
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 成功率が業務基準値下限より低い場合、適用不可と判定される', () => {
    const businessStandardMinSuccessRate = 60;
    const successPattern = {
      successRatePercent: 55,
      customerAttributes: {
        industry: 'IT',
        companySize: 'large',
      },
      productCategory: 'cloud_solution',
      proposalApproach: 'technical_deep_dive',
      executionTiming: 'quarterly_review',
      sampleSize: 40,
      successCount: 22,
    };

    const result = evaluateSuccessPatternApplicability(
      successPattern,
      businessStandardMinSuccessRate
    );

    expect(result.applicable).toBe(false);
    expect(result.reason).toMatch(/成功率/);
    expect(result.successRatePercent).toBe(55);
    expect(result.businessStandardMinSuccessRate).toBe(60);
  });
});