import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-149
  test('乖離度が100%のとき、標準プロセス遵守度スコアが0として計算される', () => {
    const sales_rep_id = 'SR-001';
    const analysis_period_start = '2024-01-01';
    const analysis_period_end = '2024-01-31';
    const standard_process_steps = [
      { step_id: 'STEP-1', step_name: '初回接触', required: true },
      { step_id: 'STEP-2', step_name: '提案', required: true },
      { step_id: 'STEP-3', step_name: '交渉', required: true },
      { step_id: 'STEP-4', step_name: '成約', required: true }
    ];
    const actual_behavior_steps = [];
    const contract_results = [
      { deal_id: 'DEAL-001', contract_date: '2024-01-15', amount: 1000000 }
    ];

    const result = generateBehaviorPatternAnalysisReport({
      sales_rep_id,
      analysis_period_start,
      analysis_period_end,
      standard_process_steps,
      actual_behavior_steps,
      contract_results
    });

    expect(result.standard_process_adherence_score).toBe(0);
    expect(result.divergence_rate).toBe(100);
    expect(result.deviation_patterns).toBeDefined();
    expect(Array.isArray(result.deviation_patterns)).toBe(true);
  });
});