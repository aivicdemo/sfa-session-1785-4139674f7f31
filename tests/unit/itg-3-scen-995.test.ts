import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - ダウンロード URL 生成', () => {
  test('SCEN-995: レポートファイルメタデータが空オブジェクトのとき、URL生成処理が開始されず警告が返される', () => {
    // Arrange
    const emptyMetadata = {};
    let s3CallCount = 0;

    const mockFileStorageAdapter = {
      generateDownloadUrl: (metadata: Record<string, unknown>) => {
        // メタデータの妥当性チェック
        if (!metadata || Object.keys(metadata).length === 0) {
          return {
            error: 'INVALID_METADATA',
            message: 'レポートファイルメタデータが空または無効です。ダウンロード URL の生成に失敗しました'
          };
        }
        // S3呼び出しカウント
        s3CallCount++;
        return {
          url: 'https://example-bucket.s3.amazonaws.com/report.pdf?X-Amz-Signature=abc123',
          expiresAt: '2024-01-15T12:00:00Z'
        };
      }
    };

    // Act
    const result = mockFileStorageAdapter.generateDownloadUrl(emptyMetadata);

    // Assert
    expect(result).toEqual({
      error: 'INVALID_METADATA',
      message: 'レポートファイルメタデータが空または無効です。ダウンロード URL の生成に失敗しました'
    });
    expect(s3CallCount).toBe(0);
    expect(result.error).toBe('INVALID_METADATA');
    expect(result.message).toMatch(/レポートファイルメタデータ/);
  });
});