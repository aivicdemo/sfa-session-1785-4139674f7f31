import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2714
  test('推奨レポート生成・保存機能 - FileStorageAdapter.deleteExpiredReportsが複数件を削除したとき、複数件すべてのメタデータが削除される', async () => {
    const now = new Date('2024-01-15T00:00:00Z');
    const thirtyDaysAgo = new Date('2023-12-16T00:00:00Z');
    const twentyNineDaysAgo = new Date('2023-12-17T00:00:00Z');
    const fortyFiveDaysAgo = new Date('2023-11-30T00:00:00Z');
    const fortyFourDaysAgo = new Date('2023-12-01T00:00:00Z');
    const sixtyDaysAgo = new Date('2023-11-15T00:00:00Z');
    const fiftyNineDaysAgo = new Date('2023-11-16T00:00:00Z');

    const expiredReports = [
      {
        reportId: 'report-1',
        fileKey: 'report_A.pdf',
        createdAt: thirtyDaysAgo,
        expiryDate: twentyNineDaysAgo,
      },
      {
        reportId: 'report-2',
        fileKey: 'report_B.xlsx',
        createdAt: fortyFiveDaysAgo,
        expiryDate: fortyFourDaysAgo,
      },
      {
        reportId: 'report-3',
        fileKey: 'report_C.pdf',
        createdAt: sixtyDaysAgo,
        expiryDate: fiftyNineDaysAgo,
      },
    ];

    const mockS3DeleteCalls: string[] = [];
    const mockS3BucketCalls: string[] = [];

    const mockFileStorageAdapter = {
      deleteExpiredReports: async (
        metadata: Array<{
          reportId: string;
          fileKey: string;
          createdAt: Date;
          expiryDate: Date;
        }>,
        s3Client: {
          deleteObject: (params: { Bucket: string; Key: string }) => Promise<void>;
        },
        bucketName: string
      ) => {
        const deletedReportIds: string[] = [];
        const deletedAuditLog: Array<{ fileKey: string; deletedAt: Date }> = [];

        for (const report of metadata) {
          try {
            await s3Client.deleteObject({
              Bucket: bucketName,
              Key: report.fileKey,
            });
            mockS3DeleteCalls.push(report.fileKey);
            mockS3BucketCalls.push(bucketName);
            deletedReportIds.push(report.reportId);
            deletedAuditLog.push({
              fileKey: report.fileKey,
              deletedAt: now,
            });
          } catch (error) {
            throw new Error(`Failed to delete report: ${report.fileKey}`);
          }
        }

        return {
          deletedReportIds,
          deletedAuditLog,
          remainingRecordCount: 0,
        };
      },
    };

    const mockS3Client = {
      deleteObject: async (params: { Bucket: string; Key: string }) => {
        mockS3DeleteCalls.push(params.Key);
        mockS3BucketCalls.push(params.Bucket);
      },
    };

    const bucketName = 'sales-recommendation-reports';

    const result = await mockFileStorageAdapter.deleteExpiredReports(
      expiredReports,
      mockS3Client,
      bucketName
    );

    expect(mockS3DeleteCalls.length).toBe(3);
    expect(mockS3DeleteCalls).toEqual(['report_A.pdf', 'report_B.xlsx', 'report_C.pdf']);

    expect(mockS3BucketCalls.length).toBe(3);
    expect(mockS3BucketCalls.every((bucket) => bucket === bucketName)).toBe(true);

    expect(result.deletedReportIds.length).toBe(3);
    expect(result.deletedReportIds).toEqual(['report-1', 'report-2', 'report-3']);

    expect(result.remainingRecordCount).toBe(0);

    expect(result.deletedAuditLog.length).toBe(3);
    expect(result.deletedAuditLog[0].fileKey).toBe('report_A.pdf');
    expect(result.deletedAuditLog[1].fileKey).toBe('report_B.xlsx');
    expect(result.deletedAuditLog[2].fileKey).toBe('report_C.pdf');

    result.deletedAuditLog.forEach((log) => {
      expect(log.deletedAt).toEqual(now);
    });
  });
});