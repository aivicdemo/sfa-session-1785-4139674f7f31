import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { determineInferenceExecutionPermission } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let mockLogs: string[];

  beforeEach(() => {
    mockLogs = [];
    const originalLog = console.log;
    console.log = (message: string) => {
      mockLogs.push(message);
      originalLog(message);
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockLogs = [];
  });

  // SCEN-153
  test('学習データ量が最小要件を1件超過するとき推論実行が許可される', () => {
    const min_required_training_data = 100;
    const actual_training_data_count = 101;
    const data_quality_score = 95;

    const result = determineInferenceExecutionPermission({
      min_required_training_data,
      actual_training_data_count,
      data_quality_score,
    });

    expect(result.is_execution_permitted).toBe(true);
    expect(result.execution_status).toBe('実行許可');

    const expected_log_message = `学習データ件数: ${actual_training_data_count}件、最小要件: ${min_required_training_data}件、判定結果: 実行許可`;
    expect(mockLogs).toContainEqual(expect.stringContaining(expected_log_message));
  });
});