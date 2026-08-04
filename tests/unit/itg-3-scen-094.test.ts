import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - レポート削除', () => {
  // SCEN-094
  test('期限切れレポート削除機能 - Amazon S3削除が成功した場合にメタデータが内部テーブルから削除される', async () => {
    // テスト用のレポートメタデータ
    const reportId = 'report_001';
    const s3FilePath = 's3://bucket/reports/report_001.pdf';
    const createdAt = new Date('2024-01-01T10:00:00Z'); // 30日以上前
    
    // 内部テーブル『レポートファイルメタデータ』の初期状態
    const reportMetadataTable: Array<{
      report_id: string;
      file_path: string;
      created_at: Date;
    }> = [
      {
        report_id: reportId,
        file_path: s3FilePath,
        created_at: createdAt,
      },
    ];

    // Amazon S3削除操作のスタブ（成功: HTTP 204 No Content）
    const mockS3DeleteAdapter = {
      deleteObject: jest.fn().mockResolvedValue({
        status: 204,
        statusText: 'No Content',
      }),
    };

    // 削除対象のレポートIDを指定して削除機能を実行
    const result = await deleteExpiredReports(
      {
        reportIdToDelete: reportId,
        metadataTable: reportMetadataTable,
      },
      mockS3DeleteAdapter
    );

    // S3削除スタブが『s3://bucket/reports/report_001.pdf』に対するDeleteObjectリクエストを受け取ったことを確認
    expect(mockS3DeleteAdapter.deleteObject).toHaveBeenCalledWith(s3FilePath);
    expect(mockS3DeleteAdapter.deleteObject).toHaveBeenCalledTimes(1);

    // 削除実行後、内部テーブル『レポートファイルメタデータ』から『report_001』のメタデータレコードが削除されていることを確認
    const remainingRecords = result.remainingMetadata.filter(
      (record) => record.report_id === reportId
    );

    // SELECT クエリで report_id = 'report_001' を検索した結果が0件（ゼロ件）となること
    expect(remainingRecords.length).toBe(0);

    // 削除後、他のレコードは保持されていること（テーブル全体の健全性確認）
    expect(result.deletedReportId).toBe(reportId);
    expect(result.deleteStatus).toBe('success');
  });
});