import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - ダウンロードURL生成', () => {
  test('SCEN-085: ダウンロードURLの有効期限が切れていない場合にURLが正常に返される', async () => {
    // Arrange
    const fileId = 'report-12345';
    const currentTime = new Date('2024-01-15T10:00:00Z');
    const expiresAt = new Date('2024-01-15T11:00:00Z');
    const expiresAtIso = expiresAt.toISOString();
    const expiresAtUnix = Math.floor(expiresAt.getTime() / 1000);
    const currentTimeUnix = Math.floor(currentTime.getTime() / 1000);
    const downloadUrl = `https://s3.amazonaws.com/bucket/${fileId}.pdf?Expires=${expiresAtUnix}&Signature=abc123def456`;

    // Mock FileStorageAdapter
    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn().mockResolvedValue({
        downloadUrl: downloadUrl,
        expiresAt: expiresAtIso,
        status: 'valid',
        fileId: fileId,
      }),
    };

    // Act
    const result = await generateDownloadUrl(fileId, mockFileStorageAdapter, currentTime);

    // Assert
    expect(result).toEqual({
      downloadUrl: downloadUrl,
      expiresAt: expiresAtIso,
      status: 'valid',
      fileId: fileId,
    });

    // Verify URL format and expiration
    expect(result.downloadUrl).toMatch(
      /^https:\/\/s3\.amazonaws\.com\/bucket\/report-\d+\.pdf\?Expires=\d+&Signature=/
    );

    // Extract Expires timestamp from URL and verify it's greater than current time
    const expiresMatch = result.downloadUrl.match(/Expires=(\d+)/);
    expect(expiresMatch).not.toBeNull();
    const urlExpiresUnix = parseInt(expiresMatch![1], 10);
    expect(urlExpiresUnix).toBeGreaterThan(currentTimeUnix);

    // Verify mock was called with correct fileId
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(fileId);
  });
});