import { generateRecommendationReportDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - ダウンロードURL生成', () => {
  // SCEN-086
  test('同じレポートメタデータで複数回URL生成を実行しても同じURLが返される', () => {
    const reportMetadata = {
      reportId: 'RPT-20250801-001',
      contentHash: 'abc123def456',
      generatedAt: '2025-08-01T10:00:00Z',
    };

    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn((metadata: typeof reportMetadata) => {
        return 'https://s3.amazonaws.com/bucket/RPT-20250801-001?token=xyz789&expires=1725177600';
      }),
    };

    const url1 = generateRecommendationReportDownloadUrl(
      reportMetadata,
      mockFileStorageAdapter
    );

    const url2 = generateRecommendationReportDownloadUrl(
      reportMetadata,
      mockFileStorageAdapter
    );

    const url3 = generateRecommendationReportDownloadUrl(
      reportMetadata,
      mockFileStorageAdapter
    );

    const expectedUrl = 'https://s3.amazonaws.com/bucket/RPT-20250801-001?token=xyz789&expires=1725177600';

    expect(url1).toBe(expectedUrl);
    expect(url2).toBe(expectedUrl);
    expect(url3).toBe(expectedUrl);
    expect(url1).toBe(url2);
    expect(url2).toBe(url3);
    expect(url1 === url2 && url2 === url3).toBe(true);
  });
});