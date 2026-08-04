import { generateDownloadUrlWithValidation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - ダウンロードURL生成機能', () => {
  test('SCEN-996: ファイルオブジェクトキーが未設定のとき、URL生成処理が開始されず警告が返される', () => {
    // Arrange
    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn()
    };

    const testCases = [
      { fileObjectKey: null, description: 'null' },
      { fileObjectKey: undefined, description: 'undefined' },
      { fileObjectKey: '', description: '空文字列' }
    ];

    testCases.forEach(({ fileObjectKey, description }) => {
      mockFileStorageAdapter.generateDownloadUrl.mockClear();

      // Act
      const result = generateDownloadUrlWithValidation(
        fileObjectKey as any,
        mockFileStorageAdapter
      );

      // Assert - (1) S3呼び出しが実行されていない
      expect(mockFileStorageAdapter.generateDownloadUrl).not.toHaveBeenCalled();

      // Assert - (2) 警告メッセージに必須フィールド指摘を含む
      expect(result.warning).toMatch(/fileObjectKey|ファイルオブジェクトキー/i);

      // Assert - (3) ステータスコードが400番台
      expect(result.statusCode).toBeGreaterThanOrEqual(400);
      expect(result.statusCode).toBeLessThan(500);

      // Assert - (4) downloadUrlがnullまたは空文字列
      expect(
        result.downloadUrl === null || result.downloadUrl === ''
      ).toBe(true);
    });
  });
});