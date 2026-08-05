import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-1207
  test('[error] 相関分析レポート生成機能 - 行動パターン分析結果の参照に失敗したとき処理がエラーになる', async () => {
    const { generateCorrelationAnalysisReport } = await import(
      '../../src/logic/it-1-br-2-1-1-1'
    );

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: 500,
        error: 'Internal Server Error',
      }),
      { status: 500 }
    );

    const inputContext = {
      analysisResultsUrl: 'https://api.example.com/behavior-patterns',
      reportMonth: '2024-01',
      requestId: 'req-001',
    };

    expect(() => generateCorrelationAnalysisReport(inputContext)).toThrow(
      /BPA_ANALYSIS_FETCH_FAILED/
    );
  });
});