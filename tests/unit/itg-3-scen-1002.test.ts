import { deleteExpiredReports } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 期限切レポート自動削除', () => {
  // SCEN-1002
  test('ファイル作成日時が未設定のとき、削除判定処理が開始されず警告が返される', async () => {
    // Setup: レポートファイルメタデータのモック
    const reportMetadata = [
      {
        id: 'report-001',
        fileName: 'proposal_report_001.pdf',
        createdAt: null,
        expiresAt: new Date('2024-01-15T00:00:00Z'),
        s3Key: 's3://bucket/proposal_report_001.pdf',
      },
      {
        id: 'report-002',
        fileName: 'proposal_report_002.pdf',
        createdAt: undefined,
        expiresAt: new Date('2024-01-16T00:00:00Z'),
        s3Key: 's3://bucket/proposal_report_002.pdf',
      },
    ];

    // FileStorageAdapterのスタブを作成
    const fileStorageAdapterStub = {
      deleteExpiredReports: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
    };

    // テスト実行
    const result = await deleteExpiredReports(reportMetadata, fileStorageAdapterStub);

    // 期待結果の検証
    expect(result).toEqual({
      success: false,
      warning: 'ファイル作成日時が設定されていないレコードが存在するため、削除判定処理をスキップしました',
      deletedCount: 0,
    });

    // FileStorageAdapterのdeleteExpiredReportsが呼び出されていないこと
    expect(fileStorageAdapterStub.deleteExpiredReports).not.toHaveBeenCalled();

    // レポートメタデータが変更されていないこと
    expect(reportMetadata).toHaveLength(2);
    expect(reportMetadata[0].createdAt).toBeNull();
    expect(reportMetadata[1].createdAt).toBeUndefined();
  });
});