import { calculateDeviationScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-388
  test('提案内容が標準プロセスと部分的に乖離している場合、乖離度が0.0より大きく1.0より小さい値として数値化される', () => {
    const standard_process = {
      visit_frequency_per_month: 4,
      proposal_material_pages: 15,
      customer_followup_days: 7,
    };

    const actual_performance = {
      visit_frequency_per_month: 3,
      proposal_material_pages: 15,
      customer_followup_days: 10,
    };

    const deviation_score = calculateDeviationScore(
      standard_process,
      actual_performance
    );

    expect(deviation_score).toBeGreaterThan(0.0);
    expect(deviation_score).toBeLessThan(1.0);
    expect(deviation_score).toBeCloseTo(0.3333, 3);
  });
});