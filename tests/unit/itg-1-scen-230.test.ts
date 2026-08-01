import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';
import { checkSystemHealth } from '../../src/logic/it-1-br-2-1-1-1';

fetchMock.enableMocks();

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-230
  test('should throw exception with MISSING_INFERENCE_PRECISION_DATA when AI inference precision data is missing', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(null), { status: 200 });

    await expect(checkSystemHealth()).rejects.toThrow(/AIエージェント推論精度データ/);
  });
});