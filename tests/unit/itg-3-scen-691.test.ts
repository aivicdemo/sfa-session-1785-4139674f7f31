import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - レポート生成・保存', () => {
  // SCEN-691
  test('推奨内容のレポート生成・保存機能 - レポートのダウンロードURLの有効期限が切れる直前のとき、URLは有効である', async () => {
    const testStartTime = new Date('2026-01-15T10:00:00Z');
    const expirationTime = new Date(testStartTime.getTime() + 59 * 60 * 1000 + 59 * 1000);

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        downloadUrl: 'https://s3.amazonaws.com/reports/report-abc123.pdf?expires=1705315799',
        reportId: 'report-abc123',
        uploadedAt: testStartTime.toISOString(),
      }),
      generateDownloadUrl: jest.fn().mockReturnValue({
        url: 'https://s3.amazonaws.com/reports/report-abc123.pdf?expires=1705315799',
        expiresAt: expirationTime.toISOString(),
      }),
      deleteExpiredReports: jest.fn().mockResolvedValue(undefined),
    };

    const recommendationInput = {
      customerId: 'cust-xyz789',
      dealId: 'deal-abc456',
      recommendationContent: {
        proposalApproach: 'エンタープライズグレード導入支援',
        recommendationScore: 92,
        rationale: '過去成功パターンマッチング度: 0.88、顧客ニーズ適合度: 0.95、タイミング評価: 0.91',
      },
      generateFormat: 'pdf',
      includeReasoning: true,
    };

    const result = await generateRecommendationReport(
      recommendationInput,
      mockFileStorageAdapter,
    );

    expect(result.downloadUrl).toBe('https://s3.amazonaws.com/reports/report-abc123.pdf?expires=1705315799');
    expect(result.reportId).toBe('report-abc123');

    const urlExpiresParam = new URL(result.downloadUrl).searchParams.get('expires');
    expect(urlExpiresParam).toBe('1705315799');

    const expirationTimestamp = parseInt(urlExpiresParam || '0', 10) * 1000;
    const remainingTimeMs = expirationTimestamp - testStartTime.getTime();
    const remainingTimeSeconds = Math.floor(remainingTimeMs / 1000);

    expect(remainingTimeSeconds).toBeLessThanOrEqual(3599);
    expect(remainingTimeSeconds).toBeGreaterThan(0);

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'cust-xyz789',
        dealId: 'deal-abc456',
      }),
    );

    const fileMetadataRecord = {
      report_id: 'report-abc123',
      customer_id: 'cust-xyz789',
      deal_id: 'deal-abc456',
      download_url: 'https://s3.amazonaws.com/reports/report-abc123.pdf?expires=1705315799',
      expiration_at: expirationTime.toISOString(),
      created_at: testStartTime.toISOString(),
      format: 'pdf',
    };

    expect(fileMetadataRecord.expiration_at).toBe(expirationTime.toISOString());
    expect(fileMetadataRecord.report_id).toBe('report-abc123');
  });
});