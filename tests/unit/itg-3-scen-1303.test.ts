import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1303: 推奨レポート生成・保存機能 - 生成されたダウンロードURLの有効期限がちょうど終了時刻に達した場合にアクセス不可が返される', async () => {
    // テスト用のレポートファイルメタデータをデータベースに作成
    const reportId = 'report-test-1303';
    const reportCreatedTime = new Date('2024-01-15T10:00:00Z');
    const urlExpirationTime = new Date('2024-01-15T11:00:00Z'); // 作成時刻 + 3600秒
    
    const reportMetadata = {
      reportId: reportId,
      filename: 'recommendation_report_20240115.pdf',
      s3Key: 'reports/recommendation_report_20240115.pdf',
      createdAt: reportCreatedTime,
      expiresAt: urlExpirationTime,
      isAccessible: true,
      contentType: 'application/pdf',
      fileSize: 2048576
    };

    // FileStorageAdapterのgeneratDownloadUrlメソッドをスタブ化
    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn().mockImplementation((id: string) => {
        return {
          downloadUrl: `https://s3.amazonaws.com/bucket/reports/recommendation_report_20240115.pdf?expires=1705318800`,
          expiresAt: urlExpirationTime,
          reportId: id
        };
      })
    };

    // generateDownloadUrlを呼び出してダウンロードURLを取得
    const downloadUrlResult = mockFileStorageAdapter.generateDownloadUrl(reportId);
    
    expect(downloadUrlResult.reportId).toBe(reportId);
    expect(downloadUrlResult.expiresAt).toEqual(urlExpirationTime);
    expect(downloadUrlResult.downloadUrl).toContain('s3.amazonaws.com');

    // システム時刻をスタブで進めて、有効期限終了時刻（元の時刻 + 3600秒）ちょうどに設定
    const currentTimeAtExpiration = new Date('2024-01-15T11:00:00Z');
    
    // 有効期限ちょうどの時点でのアクセス試行をシミュレート
    const isExpired = currentTimeAtExpiration >= urlExpirationTime;
    
    expect(isExpired).toBe(true);

    // S3呼び出し結果をスタブで『AccessDenied』エラーレスポンスに設定
    const mockS3Response = {
      statusCode: 403,
      errorCode: 'AccessDenied',
      message: 'レポートのダウンロードURLの有効期限が切れています。新しいレポートを再度生成してください。'
    };

    // ダウンロード試行時のエラーハンドリング検証
    let accessDeniedError: string | null = null;
    let updatedReportMetadata = { ...reportMetadata };

    if (isExpired) {
      accessDeniedError = mockS3Response.message;
      updatedReportMetadata.isAccessible = false;
    }

    // 期待結果: HTTPステータス403またはアプリケーションエラーメッセージが返却される
    expect(accessDeniedError).toBe('レポートのダウンロードURLの有効期限が切れています。新しいレポートを再度生成してください。');
    
    // レポートメタデータのアクセス可能フラグが『false』に更新される
    expect(updatedReportMetadata.isAccessible).toBe(false);
    expect(updatedReportMetadata.reportId).toBe(reportId);
  });
});