import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeNaigiBehaviorPatternAndContractResult } from '../../src/logic/it-1-br-2-1-1';

const fetchMock = require('jest-fetch-mock');

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-1140
  test('分析対象期間の開始日が空のとき、HTTP 400 エラーが返却されること', async () => {
    const startDate = null;
    const endDate = '2024-12-31';
    const targetEmployeeId = 'EMP001';

    fetchMock.mockResponseOnce(
      JSON.stringify({
        statusCode: 400,
        errorMessage: '分析対象期間の開始日は必須項目です',
        errorCode: 'MISSING_START_DATE'
      }),
      { status: 400 }
    );

    const result = await analyzeNaigiBehaviorPatternAndContractResult({
      startDate: startDate,
      endDate: endDate,
      targetEmployeeId: targetEmployeeId
    });

    expect(result.statusCode).toBe(400);
    expect(result.errorMessage).toMatch(/開始日/);
    expect(result.errorCode).toBe('MISSING_START_DATE');
    expect(result.analysisRecordCreated).toBeUndefined();
  });
});