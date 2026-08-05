import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { validateProblemDetectionReviewResult } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-832
  test('対応必要性の判定結果が空文字列の場合にバリデーションエラーが発生すること', () => {
    const problem_detection_result = {
      id: 'pdr_001',
      detection_timestamp: '2024-01-15T10:00:00Z',
      ai_agent_inference_log_id: 'log_001',
      problem_type: 'process_deviation',
      severity_level: 'high',
      problem_description: '初回接触から提案までの期間が標準より2週間遅延',
      root_cause: '顧客への初期アプローチの遅延',
      action_required_judgment_result: '',
      priority_score: 85,
      impact_assessment: '成約率に10%の影響が予想される',
      recommended_action: '翌営業日までに顧客への接触を実施',
      action_status: 'pending',
      action_completed_at: null,
      reviewed_by: 'mgr_001',
      reviewed_at: '2024-01-15T11:30:00Z',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T11:30:00Z'
    };

    expect(() => validateProblemDetectionReviewResult(problem_detection_result)).toThrow(/対応必要性の判定結果は必須項目です/);
  });
});