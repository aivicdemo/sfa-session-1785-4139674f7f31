import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨支援システム - ダウンロードURL生成機能', () => {
  // SCEN-080
  test('保存されたレポートの有効期限付きダウンロードURLが正常に生成される', async () => {
    const reportId = 'RPT-20250801-001';
    const fileName = 'recommendation_report.pdf';
    const s3Key = 'reports/RPT-20250801-001/recommendation_report.pdf';
    const uploadedAt = '2025-08-01T10:00:00Z';
    const expiresAt = '2025-08-02T10:00:00Z';
    const expiresInSeconds = 86400;

    const presignedUrl = 'https://s3.amazonaws.com/bucket/reports/RPT-20250801-001/recommendation_report.pdf?X-Amz-Expires=86400&X-Amz-Signature=abc123def456';

    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn().mockResolvedValue({
        downloadUrl: presignedUrl,
        expiresAt: expiresAt,
        expiresInSeconds: expiresInSeconds,
      }),
    };

    const result = await generateDownloadUrl(reportId, mockFileStorageAdapter);

    expect(result.downloadUrl).toBe(presignedUrl);
    expect(result.downloadUrl).toMatch(/^https:\/\/s3\.amazonaws\.com\//);
    expect(result.downloadUrl).toMatch(/X-Amz-Expires=86400/);
    expect(result.downloadUrl).toMatch(/X-Amz-Signature=/);
    expect(result.expiresAt).toBe('2025-08-02T10:00:00Z');
    expect(result.expiresInSeconds).toBe(86400);
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledTimes(1);
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(reportId);
  });
});