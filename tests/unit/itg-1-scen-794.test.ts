import { analyzeSellerBehaviorPatterns } from '../../src/logic/it-1-br-target4-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-794
  test('営業プロセス標準書が0件のとき、エラーを発生させる', async () => {
    fetchMock.resetMocks();

    fetchMock.mockResponseOnce(JSON.stringify([]), { status: 200 });

    const input = {
      salesRepresentativeId: 'REP001',
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-03-31',
    };

    await expect(() =>
      analyzeSellerBehaviorPatterns(input)
    ).rejects.toThrow(/PROCESS_STANDARD_NOT_FOUND/);
  });
});