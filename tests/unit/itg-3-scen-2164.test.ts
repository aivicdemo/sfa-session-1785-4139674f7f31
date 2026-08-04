import { generateRecommendationReportDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - ダウンロードURL生成', () => {
  test('SCEN-2164: 有効期限がnullのとき、ValidationErrorが発生する', () => {
    const reportId = 'report_20240115_001';
    const expirationTime = null;

    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn(() => {
        throw new Error('Expiration must not be null');
      }),
    };

    expect(() => {
      generateRecommendationReportDownloadUrl(
        reportId,
        expirationTime,
        mockFileStorageAdapter
      );
    }).toThrow(/有効期限|Expiration/);

    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      reportId,
      expirationTime
    );
  });
});