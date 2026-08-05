import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { monitorInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let errorLogEntries: Array<{
    timestamp: string;
    testId: string;
    reason: string;
  }> = [];

  beforeEach(() => {
    errorLogEntries = [];
  });

  afterEach(() => {
    errorLogEntries = [];
  });

  // SCEN-683
  test('推論ログが null のとき、精度監視処理は適切なエラーをスロー', () => {
    const nullInferenceLog = null;
    const testId = 'SCEN-683';
    const testTimestamp = '2024-01-15T11:00:00Z';

    let caughtError: Error | null = null;
    let caughtErrorType: string | null = null;

    try {
      monitorInferenceAccuracy(nullInferenceLog as any);
    } catch (error) {
      caughtError = error as Error;
      caughtErrorType = error instanceof TypeError ? 'TypeError' : 'ValidationError';

      errorLogEntries.push({
        timestamp: testTimestamp,
        testId: testId,
        reason: (error as Error).message,
      });
    }

    expect(caughtError).not.toBeNull();
    expect(
      caughtErrorType === 'TypeError' || caughtErrorType === 'ValidationError'
    ).toBe(true);
    expect(
      caughtError?.message.match(/推論ログ|null/) !== null
    ).toBe(true);

    expect(errorLogEntries).toHaveLength(1);
    expect(errorLogEntries[0]).toEqual({
      timestamp: '2024-01-15T11:00:00Z',
      testId: 'SCEN-683',
      reason: expect.stringMatching(/推論ログデータが空または不正です|Cannot read property of null/),
    });
  });
});