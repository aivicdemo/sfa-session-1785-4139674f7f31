import { generateSalesAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者ごとの行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-473
  test('成約実績データが空の場合、ERR_NO_CONTRACT_DATAエラーを返す', async () => {
    const salesPersonId = 'SALES001';
    const analysisStartDate = '2024-01-01';
    const analysisEndDate = '2024-01-31';

    const mockFetch = require('jest-fetch-mock');
    mockFetch.resetMocks();

    mockFetch.mockResponseOnce(
      JSON.stringify({
        error_code: 'ERR_NO_CONTRACT_DATA',
        error_message:
          '成約実績データが存在しません。レポート生成対象期間に成約実績がない営業担当者です。',
      }),
      { status: 400 }
    );

    try {
      await generateSalesAnalysisReport({
        salesPersonId,
        analysisStartDate,
        analysisEndDate,
      });
      fail('エラーが発生するはずです');
    } catch (error: any) {
      expect(error.message).toMatch(/成約実績データ/);
      expect(error.statusCode).toBe(400);
      expect(error.errorCode).toBe('ERR_NO_CONTRACT_DATA');
    }
  });
});