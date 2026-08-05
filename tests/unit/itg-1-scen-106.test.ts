import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { extractSalesProcessLogRange } from '../../src/logic/it-1-br-2-1-1';

const fetchMock = require('jest-fetch-mock');

describe('営業プロセスログ抽出範囲確定機能', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-106
  test('IT部門への指示データ送信が失敗したときエラーになる', async () => {
    const extractStartDate = new Date('2024-01-01T00:00:00Z');
    const extractEndDate = new Date('2024-01-31T23:59:59Z');
    const targetSalesPersonIds = ['sales_001', 'sales_002'];

    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: '内部サーバーエラー',
      }),
      { status: 500 }
    );

    const result = await extractSalesProcessLogRange({
      extractStartDate,
      extractEndDate,
      targetSalesPersonIds,
      apiEndpoint: 'https://api.example.com/it-instructions',
    });

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('ERR_API_SEND_FAILED');
    expect(result.errorMessage).toMatch(/IT部門への指示データ送信/);
    expect(result.state).toBe('未実行');
    expect(result.executionDetails).toMatchObject({
      apiCallAttempted: true,
      apiHttpStatus: 500,
    });
  });
});