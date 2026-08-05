import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

const fetchMock = require('jest-fetch-mock');

fetchMock.enableMocks();

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-138
  it('[error] AIエージェント推論実行前データ品質検証機能 - 品質検証結果データへのアクセスが失敗したとき警告エラーが返される', async () => {
    // Arrange
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: 'Internal Server Error',
      }),
      { status: 500 }
    );

    const { validateDataQualityBeforeInference } = await import(
      '../../src/logic/it-1-br-2-1-1-1'
    );

    // Act
    let thrownError: any;
    try {
      await validateDataQualityBeforeInference({
        inferenceRequestId: 'req_20240115_001',
        dataSourceEndpoint: 'https://api.example.com/quality-results',
      });
    } catch (error) {
      thrownError = error;
    }

    // Assert
    expect(thrownError).toBeDefined();
    expect(thrownError.message).toMatch(/品質検証結果データへのアクセス失敗/);
    expect(thrownError.errorCode).toBe('DATA_ACCESS_FAILED');
    expect(thrownError.level).toBe('warning');
    expect(fetchMock.mock.calls).toHaveLength(1);
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://api.example.com/quality-results'
    );
  });
});