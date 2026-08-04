import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-110
  test('ダウンロードURL生成時に有効期限がないURLが生成される場合にエラーになる', () => {
    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn().mockReturnValue({
        url: 'https://s3.amazonaws.com/bucket/report-12345.pdf',
        expirationTime: null,
      }),
      uploadRecommendationReport: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const reportFileMetadataId = 'metadata-001';

    expect(() =>
      generateDownloadUrl(reportFileMetadataId, mockFileStorageAdapter)
    ).toThrow(/有効期限/);
  });
});