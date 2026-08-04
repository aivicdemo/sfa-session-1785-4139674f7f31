import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-173: [edge] 期限切れレポート自動削除機能 - 保持期限直後のレポートが削除対象として判定される
  test('保持期限が現在時刻と同一のレポートが削除対象として判定され、S3削除APIへ該当レポートのオブジェクトキーが正確に渡されること', async () => {
    const mockCurrentTime = new Date('2026-02-01T00:00:00Z');
    const reportCreatedAt = new Date('2026-01-01T00:00:00Z');
    const reportRetentionDeadline = new Date('2026-02-01T00:00:00Z');
    const retentionDays = 31;

    const reportMetadata = {
      reportId: 'report-001',
      fileName: 'recommendation-report-2026-01-01.pdf',
      objectKey: 's3://ai-recommendation-reports/report-001/recommendation-report-2026-01-01.pdf',
      createdAt: reportCreatedAt,
      retentionDeadline: reportRetentionDeadline,
      retentionDays: retentionDays,
      status: 'active'
    };

    const mockS3DeleteApi = jest.fn().mockResolvedValue({
      success: true,
      deletedObjectKeys: [reportMetadata.objectKey]
    });

    const mockFileStorageAdapter = {
      queryExpiredReports: jest.fn().mockResolvedValue([reportMetadata]),
      deleteFromS3: mockS3DeleteApi,
      deleteMetadataRecord: jest.fn().mockResolvedValue({ rowsDeleted: 1 })
    };

    const result = await deleteExpiredReports(
      mockFileStorageAdapter,
      mockCurrentTime
    );

    expect(mockS3DeleteApi).toHaveBeenCalledWith(
      expect.objectContaining({
        objectKey: 's3://ai-recommendation-reports/report-001/recommendation-report-2026-01-01.pdf'
      })
    );

    expect(mockFileStorageAdapter.deleteMetadataRecord).toHaveBeenCalledWith(
      reportMetadata.reportId
    );

    expect(result).toEqual({
      deletedCount: 1,
      deletedReports: [
        expect.objectContaining({
          reportId: 'report-001',
          objectKey: 's3://ai-recommendation-reports/report-001/recommendation-report-2026-01-01.pdf'
        })
      ],
      failedDeletions: []
    });
  });
});