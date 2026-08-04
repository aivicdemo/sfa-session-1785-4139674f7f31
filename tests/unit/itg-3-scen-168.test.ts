import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - ダウンロードURL生成', () => {
  test('SCEN-168: [edge] ダウンロードURL生成機能 - 有効期限付きのダウンロードURLが正常に生成される', () => {
    // Arrange: FileStorageAdapterのモック定義
    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn().mockResolvedValue(
        'https://bucket-name.s3.amazonaws.com/report-abc123?X-Amz-Expires=3600&X-Amz-Signature=xxx&X-Amz-Algorithm=AWS4-HMAC-SHA256'
      ),
    };

    // 保存済みレポートファイルのメタデータ
    const reportMetadata = {
      fileId: 'report-abc123',
      fileName: 'recommendation_report_2024-01-15.pdf',
      uploadedAt: new Date('2024-01-15T10:00:00Z'),
    };

    // Act: ダウンロードURL生成機能を呼び出し
    const resultPromise = generateDownloadUrl(reportMetadata, mockFileStorageAdapter);

    // Assert: 非同期処理の完了を待機して検証
    return resultPromise.then((result: string) => {
      // ①URLの形式がS3の一時URLフォーマットに準拠していることを確認
      expect(result).toMatch(/^https:\/\/bucket-name\.s3\.amazonaws\.com\/report-.+\?/);

      // ②URLに『X-Amz-Expires=3600』パラメータが含まれていることを確認
      expect(result).toMatch(/X-Amz-Expires=3600/);

      // ③URLに有効なシグネチャ（X-Amz-Signature）が含まれていることを確認
      expect(result).toMatch(/X-Amz-Signature=/);

      // ④URLが文字列型で返されていることを確認
      expect(typeof result).toBe('string');

      // FileStorageAdapterが正しい引数で呼ばれたことを確認
      expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          fileId: 'report-abc123',
          fileName: 'recommendation_report_2024-01-15.pdf',
          uploadedAt: new Date('2024-01-15T10:00:00Z'),
        }),
        3600
      );

      // URLの構成要素をさらに検証
      const urlParts = result.split('?');
      expect(urlParts).toHaveLength(2);
      expect(urlParts[0]).toMatch(/^https:\/\/bucket-name\.s3\.amazonaws\.com\/report-abc123$/);

      const queryParams = new URLSearchParams(urlParts[1]);
      expect(queryParams.get('X-Amz-Expires')).toBe('3600');
      expect(queryParams.has('X-Amz-Signature')).toBe(true);
      expect(queryParams.has('X-Amz-Algorithm')).toBe(true);
    });
  });
});