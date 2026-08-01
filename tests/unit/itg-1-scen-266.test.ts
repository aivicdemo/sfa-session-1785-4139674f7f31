import { evaluateSuccessPatternApplicability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-266
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 成功率が業務基準値の下限と完全に一致する場合、適用可能と判定される', () => {
    const business_threshold_lower_limit = 75;
    const success_pattern_success_rate = 75;

    const result = evaluateSuccessPatternApplicability({
      success_rate: success_pattern_success_rate,
      business_threshold_lower_limit: business_threshold_lower_limit,
    });

    expect(result).toEqual({
      status: 200,
      is_applicable: true,
    });
  });
});