import { generateDownloadUrl } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - レポートダウンロードURL生成', () => {
  // SCEN-243
  test('メタデータが登録されていないとき、ダウンロードURL生成処理がエラーになる', () => {
    const reportId = 'report-20240115-001';
    const reportFileName = 'recommendation-report.pdf';

    const mockReportMetadata = {
      reportId: reportId,
      fileName: reportFileName,
      uploadedAt: new Date('2024-01-15T10:30:00Z'),
      fileSize: 2048576,
      s3BucketName: 'ai-recommendation-reports',
      s3ObjectKey: `reports/${reportId}/${reportFileName}`,
      uploadStatus: 'COMPLETED',
      expiresAt: new Date('2024-02-15T10:30:00Z')
    };

    const mockReportMetadataTable: typeof mockReportMetadata[] = [];

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        s3BucketName: mockReportMetadata.s3BucketName,
        s3ObjectKey: mockReportMetadata.s3ObjectKey,
        uploadedAt: mockReportMetadata.uploadedAt
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn().mockResolvedValue(undefined)
    };

    const metadataNotFoundError = () => {
      throw new Error('Metadata not found');
    };

    expect(() => {
      generateDownloadUrl(reportId, mockReportMetadataTable, mockFileStorageAdapter);
    }).toThrow(/メタデータ|Metadata/);
  });
});