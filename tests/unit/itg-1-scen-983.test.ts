import { evaluateFailureFactors } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-983
  test('言語化された失敗要因がすべて承認基準を満たさないとき、テンプレート設計への進行がブロックされる', () => {
    const failure_factors = [
      {
        factor_id: 'ff001',
        factor_text: '営業資料の準備不足',
        specificity_score: 2,
        clarity_score: 1,
        actionability_score: 1,
      },
      {
        factor_id: 'ff002',
        factor_text: '顧客ニーズの把握不足',
        specificity_score: 2,
        clarity_score: 1,
        actionability_score: 1,
      },
      {
        factor_id: 'ff003',
        factor_text: '提案タイミングの誤り',
        specificity_score: 2,
        clarity_score: 1,
        actionability_score: 1,
      },
    ];

    const approval_threshold = {
      min_specificity_score: 3,
      min_clarity_score: 3,
      min_actionability_score: 3,
    };

    const result = evaluateFailureFactors(failure_factors, approval_threshold);

    expect(result.all_factors_approved).toBe(false);
    expect(result.approval_status).toBe('unapproved');
    expect(result.can_proceed_to_template_design).toBe(false);
    expect(result.error_message).toMatch(/承認基準/);
    expect(result.unapproved_factor_count).toBe(3);
    expect(result.approved_factor_count).toBe(0);
  });
});