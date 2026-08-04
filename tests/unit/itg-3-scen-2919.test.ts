import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - Amazon S3連携', () => {
  // SCEN-2919
  test('[normal] Amazon S3連携 - generateDownloadUrl呼び出しが正常応答を受けた場合、有効期限付きの一時ダウンロードURLが生成される', async () => {
    const fileKey = 'report-file-key-12345';
    const executionTime = new Date('2024-01-15T10:00:00Z');
    const expirationTime = new Date('2024-01-15T11:00:00Z');
    const mockDownloadUrl = `https://s3.amazonaws.com/bucket/report-xxxxx.pdf?Expires=${Math.floor(expirationTime.getTime() / 1000)}&Signature=mock_signature_abc123&X-Amz-Date=20240115T100000Z`;

    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn().mockResolvedValue({
        url: mockDownloadUrl,
        expiresAt: expirationTime.toISOString(),
      }),
    };

    const result = await generateDownloadUrl(fileKey, mockFileStorageAdapter);

    expect(result).toBeDefined();
    expect(result.url).toMatch(/https:\/\/s3\.amazonaws\.com\/bucket\/report-xxxxx\.pdf/);
    expect(result.url).toMatch(/Expires=/);
    expect(result.url).toMatch(/Signature=/);

    const expiresParam = result.url.match(/Expires=(\d+)/);
    expect(expiresParam).toBeTruthy();
    if (expiresParam) {
      const expiresTimestamp = parseInt(expiresParam[1], 10);
      const executionTimestamp = Math.floor(executionTime.getTime() / 1000);
      const timeDiff = expiresTimestamp - executionTimestamp;
      expect(timeDiff).toBeGreaterThanOrEqual(3600);
    }

    expect(result.expiresAt).toBe('2024-01-15T11:00:00Z');
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(fileKey);
  });
});