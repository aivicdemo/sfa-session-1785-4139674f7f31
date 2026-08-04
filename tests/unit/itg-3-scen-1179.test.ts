import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 期限切れレポート自動削除', () => {
  test('SCEN-1179: 保有期限を超過したレポートが自動削除される', async () => {
    const now = new Date('2024-12-15T10:00:00Z');
    const retentionDays = 90;

    // 保有期限超過レコード: 作成日時が91日前
    const expiredReportMetadata = {
      id: 'report-expired-001',
      s3ObjectKey: 'reports/recommendation-2024-09-15-001.pdf',
      createdAt: new Date(now.getTime() - 91 * 24 * 60 * 60 * 1000),
      fileName: 'recommendation-2024-09-15-001.pdf',
      retentionDays: retentionDays,
    };

    // 保有期限内レコード: 作成日時が30日前
    const validReportMetadata = {
      id: 'report-valid-001',
      s3ObjectKey: 'reports/recommendation-2024-11-15-001.pdf',
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      fileName: 'recommendation-2024-11-15-001.pdf',
      retentionDays: retentionDays,
    };

    // 削除対象メタデータのリスト
    const allReportMetadata = [expiredReportMetadata, validReportMetadata];

    // モック S3 アダプタ
    const mockFileStorageAdapter = {
      deleteExpiredReports: jest.fn().mockResolvedValue({
        deletedCount: 1,
        deletedKeys: [expiredReportMetadata.s3ObjectKey],
      }),
    };

    // 削除機能実行
    const result = await deleteExpiredReports(
      allReportMetadata,
      mockFileStorageAdapter,
      now,
    );

    // deleteExpiredReports メソッドが呼び出されたことを検証
    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalled();

    // deleteExpiredReports の引数として、保有期限超過のオブジェクトキーが渡されたことを検証
    const callArgs = mockFileStorageAdapter.deleteExpiredReports.mock
      .calls[0][0];
    expect(callArgs).toContain(expiredReportMetadata.s3ObjectKey);
    expect(callArgs).not.toContain(validReportMetadata.s3ObjectKey);

    // 削除対象だったレコードが結果から除外されていることを検証
    expect(result.remainingMetadata).toHaveLength(1);
    expect(result.remainingMetadata[0].id).toBe('report-valid-001');

    // 期限内のレポートメタデータが残っていることを検証
    const remainingIds = result.remainingMetadata.map((m) => m.id);
    expect(remainingIds).toContain('report-valid-001');
    expect(remainingIds).not.toContain('report-expired-001');

    // 削除されたレコード数が正確であることを検証
    expect(result.deletedCount).toBe(1);

    // 削除されたS3オブジェクトキーが正確であることを検証
    expect(result.deletedS3Keys).toEqual([
      expiredReportMetadata.s3ObjectKey,
    ]);
  });
});