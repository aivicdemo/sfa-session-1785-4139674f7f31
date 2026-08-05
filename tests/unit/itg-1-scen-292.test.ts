import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-292: [edge] 行動パターン分析と改善指導優先順位判定機能 - 標準プロセスとの乖離度がちょうど閾値0%（完全一致）の場合、改善指導対象外と判定される
  test('should classify as non-coaching-target when deviation_score is exactly 0 percent (perfect process compliance)', () => {
    // Setup: 行動パターン分析結果データ（乖離度が0%、つまり完全に標準プロセスと一致）
    const sales_rep_id = 'SR-001';
    const analysis_period = '2024-01-01T00:00:00Z';
    const process_deviation_score = 0; // 0%の乖離度 = 完全一致
    const process_steps_executed = 5; // すべての標準プロセスステップを実行
    const total_process_steps = 5; // 標準プロセスの全ステップ数
    const customer_contact_frequency = 8; // 初回接触から成約までの接触回数
    const proposal_success_rate = 1.0; // 提案成功率100%
    const followup_interval_days = 3; // フォローアップ間隔が標準と一致

    const input_data = {
      sales_rep_id,
      analysis_period,
      process_deviation_score,
      process_steps_executed,
      total_process_steps,
      customer_contact_frequency,
      proposal_success_rate,
      followup_interval_days,
      // ビジネスルール: 乖離度0% = 改善指導対象外の判定基準
      deviation_threshold: 0, // 改善指導対象の乖離度閾値（0%より大きい場合のみ対象）
    };

    const result = calculateProcessComplianceScore(input_data);

    // 期待結果: 改善指導対象フラグが false となる
    expect(result.requires_coaching).toBe(false);
    // 標準プロセス遵守度スコアは100%
    expect(result.process_compliance_score).toBe(100);
    // 乖離度は0%のまま
    expect(result.deviation_score).toBe(0);
    // 改善指導対象優先度スコアは0（対象外のため）
    expect(result.coaching_priority_score).toBe(0);
  });
});