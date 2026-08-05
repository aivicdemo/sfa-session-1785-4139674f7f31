import { determineTransitionToTemplateDesign } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-970
  test('テンプレート設計への遷移判定 - 承認基準を満たした要因からテンプレート設計フェーズへの遷移フラグが正常に生成される', () => {
    const input_factors = {
      sales_target_achievement_rate: 85,
      customer_satisfaction_score: 4.2,
      report_completeness_percentage: 100,
    };

    const result = determineTransitionToTemplateDesign(input_factors);

    expect(result.transitionToTemplateDesign).toBe(true);
    expect(result.transitionStatus).toBe('TEMPLATE_DESIGN_PHASE');
  });
});