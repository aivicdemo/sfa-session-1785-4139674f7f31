import { generateRecommendationReportWithUrl } from '../../src/logic/it-1-br-3-1-1-1';

// SCEN-776
describe('AIエージェント推奨根拠の可視化機能 - ファイルストレージ正常応答', () => {
  test('FileStorageAdapter.generateDownloadUrl が有効期限付き一時URLを返すとき、営業担当者がダウンロード可能なURLが生成される', () => {
    // Arrange
    const now = new Date('2024-01-15T10:00:00Z');
    const expiresIn = 3600; // 1時間
    const expiresAtUtc = new Date(now.getTime() + expiresIn * 1000);

    const mockBucketName = 'sales-recommendations';
    const mockReportKey = 'recommendations/2024-01-15/rep-12345-deal-001.pdf';
    const mockSignedUrl =
      `https://${mockBucketName}.s3.amazonaws.com/${mockReportKey}` +
      '?X-Amz-Algorithm=AWS4-HMAC-SHA256' +
      '&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20240115%2Fap-northeast-1%2Fs3%2Faws4_request' +
      '&X-Amz-Date=20240115T100000Z' +
      '&X-Amz-Expires=3600' +
      '&X-Amz-Signature=1234567890abcdef' +
      '&X-Amz-SignedHeaders=host';

    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn().mockReturnValue({
        url: mockSignedUrl,
        expiresAt: expiresAtUtc.toISOString(),
        expiresInSeconds: expiresIn,
      }),
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        key: mockReportKey,
        uploadedAt: now.toISOString(),
      }),
      deleteExpiredReports: jest.fn().mockResolvedValue({ deletedCount: 0 }),
    };

    const recommendationData = {
      dealId: 'deal-001',
      customerId: 'customer-12345',
      recommendationContent: 'Recommended approach based on similar success patterns',
      reasoningBasis: ['Historical data from 5 similar cases', 'Customer profile match score: 0.92'],
      confidenceScore: 92,
      generatedAt: now.toISOString(),
      recommendedBy: 'AIRecommendationEngine',
    };

    // Act
    const result = generateRecommendationReportWithUrl(
      recommendationData,
      mockFileStorageAdapter,
      now
    );

    // Assert
    // 1. FileStorageAdapter.generateDownloadUrl が呼ばれたことを確認
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalled();

    // 2. 返されたURLがS3署名付きURL形式であることを検証
    expect(result.downloadUrl).toMatch(/^https:\/\/[\w\-]+\.s3\.amazonaws\.com\//);

    // 3. クエリパラメータに X-Amz-Signature が含まれていることを検証
    expect(result.downloadUrl).toMatch(/X-Amz-Signature=/);

    // 4. クエリパラメータに X-Amz-Expires=3600 が含まれていることを検証
    expect(result.downloadUrl).toMatch(/X-Amz-Expires=3600/);

    // 5. クエリパラメータに X-Amz-Date が含まれていることを検証
    expect(result.downloadUrl).toMatch(/X-Amz-Date=/);

    // 6. クエリパラメータに X-Amz-Credential が含まれていることを検証
    expect(result.downloadUrl).toMatch(/X-Amz-Credential=/);

    // 7. 返された結果オブジェクトが期待される構造を持つことを検証
    expect(result).toEqual({
      downloadUrl: mockSignedUrl,
      expiresAt: expiresAtUtc.toISOString(),
      expiresInSeconds: 3600,
      reportKey: mockReportKey,
      dealId: 'deal-001',
      customerId: 'customer-12345',
      generatedAt: now.toISOString(),
      status: 'ready_for_download',
    });

    // 8. expiresInSeconds が正確に 3600 であることを検証
    expect(result.expiresInSeconds).toBe(3600);

    // 9. status が ready_for_download であることを検証
    expect(result.status).toBe('ready_for_download');

    // 10. HTTP GET リクエストシミュレーション検証用のURLが正常形式であることを確認
    const urlObject = new URL(result.downloadUrl);
    expect(urlObject.protocol).toBe('https:');
    expect(urlObject.hostname).toMatch(/\.s3\.amazonaws\.com$/);
    expect(urlObject.searchParams.has('X-Amz-Signature')).toBe(true);
    expect(urlObject.searchParams.get('X-Amz-Expires')).toBe('3600');
    expect(urlObject.searchParams.has('X-Amz-Date')).toBe(true);
    expect(urlObject.searchParams.has('X-Amz-Credential')).toBe(true);
  });
});