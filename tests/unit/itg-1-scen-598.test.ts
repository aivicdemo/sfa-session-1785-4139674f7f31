import { calculateProposalDeviationDegree } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-598
  test('提案内容が標準プロセスから完全に乖離している場合、乖離度が100として数値化される', () => {
    // 標準営業プロセスの定義: 5つのステップ
    const standard_process_steps = [
      { step_id: 1, step_name: '初期接触', required: true },
      { step_id: 2, step_name: 'ニーズ把握', required: true },
      { step_id: 3, step_name: '提案', required: true },
      { step_id: 4, step_name: '合意', required: true },
      { step_id: 5, step_name: '契約', required: true },
    ];

    // 営業担当者Aの実際の行動: 全ステップに対して乖離
    const salesperson_actual_behavior = [
      { step_id: 1, step_name: '初期接触', completed: false, deviation: true },
      { step_id: 2, step_name: 'ニーズ把握', completed: false, deviation: true },
      { step_id: 3, step_name: '提案', completed: false, deviation: true },
      { step_id: 4, step_name: '合意', completed: false, deviation: true },
      { step_id: 5, step_name: '契約', completed: true, deviation: false },
    ];

    // 提案内容の詳細
    const proposal_content = {
      salesperson_id: 'SP_001',
      proposal_timing: 'contract_negotiation_start',
      needs_analysis_performed: false,
      proposal_relevant_to_requirements: false,
      agreement_process_skipped: true,
      total_steps: 5,
      steps_deviated: 4,
    };

    // 乖離度計算処理を実行
    const deviation_degree = calculateProposalDeviationDegree(
      standard_process_steps,
      salesperson_actual_behavior,
      proposal_content
    );

    // 期待結果: 提案内容が標準プロセスから完全に乖離しているため、乖離度が100
    expect(deviation_degree).toBe(100);
  });
});