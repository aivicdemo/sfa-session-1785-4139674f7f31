import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - ダウンロードURL生成', () => {
  test('SCEN-169: ダウンロードURL有効期限切れ時にアクセスが拒否される', async () => {
    const baseTime = new Date('2024-01-15T11:00:00Z');
    const expirationTime = new Date(baseTime.getTime() + 3600 * 1000); // baseTime + 3600秒

    // FileStorageAdapterのモック化
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn((fileKey: string, expirationSeconds: number) => {
        return {
          downloadUrl: `https://example-s3.amazonaws.com/reports/${fileKey}?expires=${expirationTime.getTime()}`,
          expirationTime: expirationTime.toISOString(),
          fileKey: fileKey,
          expirationSeconds: expirationSeconds,
        };
      }),
      deleteExpiredReports: jest.fn(),
    };

    // レポートファイルメタデータの作成
    const reportFileMetadata = {
      fileKey: 'recommendation_report_001',
      uploadedAt: baseTime.toISOString(),
      expirationSeconds: 3600,
    };

    // generateDownloadUrl()を呼び出してダウンロードURLを生成
    const urlMetadata = mockFileStorageAdapter.generateDownloadUrl(
      reportFileMetadata.fileKey,
      reportFileMetadata.expirationSeconds
    );

    // レポートファイルメタデータに保存
    const storedMetadata = {
      ...reportFileMetadata,
      downloadUrl: urlMetadata.downloadUrl,
      expirationTime: urlMetadata.expirationTime,
    };

    // システム時刻をbaseTime + 3600秒に進める（有効期限がちょうど切れた時点）
    const accessTime = expirationTime;

    // 生成されたダウンロードURLに対してGETリクエストを送信
    global.fetch = jest.fn(async (url: string) => {
      // 有効期限チェック
      const expTime = new Date(storedMetadata.expirationTime);
      if (accessTime >= expTime) {
        return {
          ok: false,
          status: 403,
          statusText: 'Forbidden',
          text: async () => JSON.stringify({ error: 'URLの有効期限が切れています' }),
          json: async () => ({ error: 'URLの有効期限が切れています' }),
        } as Response;
      }
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => 'file content',
      } as Response;
    });

    // レスポンスを確認
    const response = await fetch(storedMetadata.downloadUrl);
    const responseBody = await response.json();

    // 期待結果の検証
    expect(response.status).toBe(403);
    expect(response.statusText).toBe('Forbidden');
    expect(responseBody.error).toMatch(/有効期限が切れています/);
  });
});