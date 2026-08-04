import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 期限切れレポート削除', () => {
  // SCEN-093
  test('期限切れレポート削除機能 - Amazon S3からのファイル削除が正常に実行される', async () => {
    const now = new Date('2024-06-15T10:00:00Z');
    const expiredDate = new Date('2024-05-16T09:00:00Z'); // 30日以上前
    const validDate = new Date('2024-06-01T10:00:00Z'); // 有効期限内

    const expiredReportKey = 'reports/recommendation-2024-05-16-expired.pdf';
    const validReportKey = 'reports/recommendation-2024-06-01-valid.pdf';

    const s3BucketName = 'sales-ai-reports';

    // メタデータテーブルの初期状態
    const initialMetadata = [
      {
        fileKey: expiredReportKey,
        createdAt: expiredDate.toISOString(),
        expiresAt: new Date(expiredDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        fileKey: validReportKey,
        createdAt: validDate.toISOString(),
        expiresAt: new Date(validDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // S3削除API呼び出しの検証用バッファ
    const s3DeleteCalls: Array<{ bucket: string; key: string }> = [];
    const systemLogs: Array<{ message: string; timestamp: string }> = [];

    // FileStorageAdapterスタブ
    const fileStorageAdapterStub = {
      deleteObject: jest.fn(async (bucket: string, key: string) => {
        s3DeleteCalls.push({ bucket, key });
        return { status: 204 };
      }),
      getMetadata: jest.fn(async () => initialMetadata),
      removeMetadata: jest.fn(async (key: string) => {
        const index = initialMetadata.findIndex((m) => m.fileKey === key);
        if (index !== -1) {
          initialMetadata.splice(index, 1);
        }
      }),
    };

    // システムログスタブ
    const loggerStub = {
      info: jest.fn((message: string) => {
        systemLogs.push({ message, timestamp: now.toISOString() });
      }),
    };

    // テスト実行
    await deleteExpiredReports(
      fileStorageAdapterStub,
      loggerStub,
      s3BucketName,
      now
    );

    // 検証: S3削除API呼び出し
    expect(s3DeleteCalls).toHaveLength(1);
    expect(s3DeleteCalls[0].bucket).toBe(s3BucketName);
    expect(s3DeleteCalls[0].key).toBe(expiredReportKey);

    // 検証: メタデータテーブルから期限切れレコードが削除されている
    expect(initialMetadata).toHaveLength(1);
    expect(initialMetadata[0].fileKey).toBe(validReportKey);

    // 検証: システムログに削除成功イベントが記録されている
    expect(systemLogs).toHaveLength(1);
    expect(systemLogs[0].message).toMatch(
      /Expired report deleted: key=reports\/recommendation-2024-05-16-expired\.pdf, timestamp=/
    );
  });
});