import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let fetchMock: any;

  beforeEach(() => {
    fetchMock = require('jest-fetch-mock');
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-1045
  test('推論ログデータが0件のとき推論精度監視がエラーになること', async () => {
    const { monitorInferenceAccuracy } = await import(
      '../../src/logic/it-1-br-2-1-1-1'
    );

    fetchMock.mockResponseOnce(JSON.stringify([]), { status: 200 });

    let thrown_error: any = null;
    try {
      await monitorInferenceAccuracy();
    } catch (error) {
      thrown_error = error;
    }

    expect(thrown_error).not.toBeNull();
    expect(thrown_error.code).toBe('NO_INFERENCE_LOGS');
    expect(thrown_error.message).toMatch(/No inference logs available for monitoring/);
  });
});