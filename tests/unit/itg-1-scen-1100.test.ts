import { describe, test, expect, beforeEach } from '@jest/globals';
import { analyzeSelespersonBehaviorPattern } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1100: [normal] 営業担当者ごとの行動パターン分析・標準プロセス乖離分析機能 - 営業活動ログ0件の営業担当者について行動パターン分析が実行される
  test('should execute behavior pattern analysis for salesperson with zero activity logs and return analysis-insufficient-data status', () => {
    // Arrange
    const salesperson_id = 'SP-001';
    const salesperson_name = 'Sales Person A';
    const activity_logs = [];
    const standard_process_steps = [
      { step_id: 'STEP-001', step_name: 'Initial Contact', sequence: 1 },
      { step_id: 'STEP-002', step_name: 'Proposal', sequence: 2 },
      { step_id: 'STEP-003', step_name: 'Negotiation', sequence: 3 },
      { step_id: 'STEP-004', step_name: 'Contract', sequence: 4 }
    ];
    const analysis_input = {
      salesperson_id,
      salesperson_name,
      activity_logs,
      standard_process_steps,
      analysis_period_start: '2024-01-01T00:00:00Z',
      analysis_period_end: '2024-01-31T23:59:59Z',
      minimum_log_threshold: 5
    };

    // Act
    const analysis_result = analyzeSelespersonBehaviorPattern(analysis_input);

    // Assert
    expect(analysis_result).toBeDefined();
    expect(analysis_result.salesperson_id).toBe('SP-001');
    expect(analysis_result.salesperson_name).toBe('Sales Person A');
    expect(analysis_result.analysis_status).toBe('完了（警告）');
    expect(analysis_result.data_insufficiency_message).toBe('分析対象データが不足しています');
    expect(analysis_result.deviation_degree).toBe('計算不可（データ不足）');
    expect(analysis_result.activity_log_count).toBe(0);
    expect(analysis_result.minimum_required_logs).toBe(5);
    expect(analysis_result.can_calculate_deviation).toBe(false);
    expect(analysis_result.behavioral_patterns).toEqual([]);
    expect(analysis_result.standard_process_compliance_rate).toBeNull();
  });
});