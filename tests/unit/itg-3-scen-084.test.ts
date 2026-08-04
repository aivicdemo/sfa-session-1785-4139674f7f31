import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-084
  test('ダウンロードURLの有効期限がちょうど切れた場合に期限切れ判定が正常に返される', () => {
    const currentTime = new Date('2026-08-01T10:00:00.000Z');
    const expiresAt = new Date('2026-08-01T10:00:00.000Z');

    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn().mockReturnValue({
        url: 'https://s3.amazonaws.com/bucket/report-123.pdf?signature=abc123',
        expiresAt: expiresAt,
        expired: false,
      }),
    };

    const result = generateDownloadUrl(
      mockFileStorageAdapter,
      'report-123.pdf',
      currentTime
    );

    expect(result).toEqual({
      expired: true,
      errorCode: 'URL_EXPIRED',
      message:
        'このダウンロードリンクの有効期限が切れています。新しいレポートを生成してください',
    });
  });
});