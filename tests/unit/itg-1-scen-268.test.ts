import { judgeProposalApproachApplicability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-268
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 成功パターンの成功率が業務基準値の下限より高い場合、適用可能と判定される', () => {
    const business_threshold_lower_limit = 60;
    const success_pattern_success_rate = 65;

    const result = judgeProposalApproachApplicability({
      success_pattern_success_rate: success_pattern_success_rate,
      business_threshold_lower_limit: business_threshold_lower_limit,
    });

    expect(result.isApplicable).toBe(true);
    expect(result.success_rate).toBe(65);
  });
});