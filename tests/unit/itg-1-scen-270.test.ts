import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-270
  test('営業担当者の商談進捗データが null のとき、処理が中断されエラーオブジェクトが返却される', () => {
    // Import the function under test
    const { analyzeAndJudgeImprovementDirective } = require('../../src/logic/it-1-br-2-1-1-1');

    // Setup: Create input with null sales_progress_data
    const input = {
      sales_rep_id: 'sales_rep_001',
      sales_rep_name: '田中太郎',
      sales_progress_data: null,
      standard_process_steps: [
        { step_id: 'step_1', step_name: '初回接触', expected_days: 1 },
        { step_id: 'step_2', step_name: '提案', expected_days: 7 },
        { step_id: 'step_3', step_name: '交渉', expected_days: 14 },
        { step_id: 'step_4', step_name: '成約', expected_days: 21 },
      ],
      contract_results: [
        {
          contract_id: 'contract_001',
          customer_id: 'customer_001',
          contract_amount: 100000,
          contract_date: '2024-01-15',
          success: true,
        },
      ],
    };

    // Execute function and expect error
    const result = analyzeAndJudgeImprovementDirective(input);

    // Verify error object structure and content
    expect(result).toEqual({
      error_code: 'DATA_NULL_ERROR',
      error_message: '営業担当者の商談進捗データが取得できません',
      sales_rep_id: 'sales_rep_001',
      analysis_completed: false,
      improvement_directives: null,
      database_update_executed: false,
    });

    // Verify that no further processing occurred
    expect(result.improvement_directives).toBeNull();
    expect(result.database_update_executed).toBe(false);
    expect(result.analysis_completed).toBe(false);
  });
});