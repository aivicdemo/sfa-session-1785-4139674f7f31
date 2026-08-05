import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeProcessDeviation } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-277
  test('標準プロセスとの乖離度が0以下のとき、処理が中断される', () => {
    const testData = {
      salesperson_id: 'SP001',
      deviation_rate: -0.5,
      analysis_period_start: '2024-01-01',
      analysis_period_end: '2024-01-31',
      process_steps_executed: 2,
      process_steps_required: 4,
    };

    expect(() => {
      analyzeProcessDeviation(testData);
    }).toThrow(/DEVIATION_INVALID/);
  });
});