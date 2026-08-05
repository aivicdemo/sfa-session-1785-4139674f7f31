import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { classifyAndPrioritizeDetectedProblems } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // SCEN-796
  test('AIエージェント推論ログが存在しない状態で問題分類処理が実行された場合、エラーになる', () => {
    const problemDetectionResult = {
      id: 'prob_001',
      description: '提案内容が標準プロセスから大きく乖離している',
      detectionTimestamp: '2024-01-15T10:30:00Z',
      severity: 'high',
      affectedUserId: 'sales_rep_001',
      affectedDealId: 'deal_2024_001'
    };

    expect(() => {
      classifyAndPrioritizeDetectedProblems(problemDetectionResult, undefined);
    }).toThrow(/AIエージェント推論ログ/);
  });
});