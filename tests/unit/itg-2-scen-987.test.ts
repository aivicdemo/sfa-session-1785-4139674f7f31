import { determineNextActions } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-987
  test('[normal] 購買結果記録・営業データ統合機能 - 品質検証結果が複数件の場合に全ての次のアクション判定が実行される', () => {
    const qualityValidationResults = [
      {
        validation_result_id: 'vr_001',
        quality_score: 0.95,
        validation_status: 'passed',
        error_count: 0,
        checked_at: '2024-01-15T10:00:00Z',
      },
      {
        validation_result_id: 'vr_002',
        quality_score: 0.85,
        validation_status: 'passed',
        error_count: 2,
        checked_at: '2024-01-15T10:05:00Z',
      },
      {
        validation_result_id: 'vr_003',
        quality_score: 0.75,
        validation_status: 'warning',
        error_count: 5,
        checked_at: '2024-01-15T10:10:00Z',
      },
    ];

    const salesData = {
      sales_data_id: 'sd_001',
      customer_id: 'cust_001',
      proposal_amount: 500000,
      proposal_date: '2024-01-15T09:00:00Z',
      quality_validation_results: qualityValidationResults,
    };

    const result = determineNextActions(salesData);

    expect(result.next_action_judgments).toHaveLength(3);
    expect(result.next_action_judgments[0]).toEqual({
      validation_result_id: 'vr_001',
      action_type: 'proceed',
      priority: 'normal',
      reason: 'high_quality_score',
    });
    expect(result.next_action_judgments[1]).toEqual({
      validation_result_id: 'vr_002',
      action_type: 'review',
      priority: 'normal',
      reason: 'moderate_quality_with_errors',
    });
    expect(result.next_action_judgments[2]).toEqual({
      validation_result_id: 'vr_003',
      action_type: 'review',
      priority: 'high',
      reason: 'warning_status_with_multiple_errors',
    });
    expect(result.execution_status).toBe('completed');
    expect(result.total_judgments_executed).toBe(3);
  });
});