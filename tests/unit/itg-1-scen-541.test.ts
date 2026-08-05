import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

const fetchMock = require('jest-fetch-mock');

describe('営業担当者の行動パターン分析・レポート生成', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-541
  test('分析対象期間の終了日が欠落している場合、INVALID_PERIOD_END_DATEエラーが返される', async () => {
    const requestPayload = {
      salesRepId: 'EMP-001',
      analysisStartDate: '2024-01-01',
      analysisEndDate: null,
    };

    fetchMock.mockResponseOnce(
      JSON.stringify({
        statusCode: 400,
        errorCode: 'INVALID_PERIOD_END_DATE',
        errorMessage: '分析対象期間の終了日は必須項目です',
      }),
      { status: 400 }
    );

    try {
      await generateSalesActivityPatternAnalysisReport(requestPayload);
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.message).toMatch(/分析対象期間の終了日/);
      expect(error.statusCode).toBe(400);
      expect(error.errorCode).toBe('INVALID_PERIOD_END_DATE');
    }

    const lastRequest = fetchMock.mock.calls[fetchMock.mock.calls.length - 1];
    expect(lastRequest).toBeDefined();
    const requestBody = JSON.parse(lastRequest[1].body);
    expect(requestBody.analysisEndDate).toBeNull();
  });
});