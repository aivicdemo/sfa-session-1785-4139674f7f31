import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-076
  test('[normal] 推奨レポート生成機能 - 生成されたレポートがAmazon S3にアップロードされ正常に保存される', async () => {
    const reportTimestamp = '2024-01-15T11:30:00Z';
    const reportData = {
      customerId: 'CUST-001',
      customerName: '顧客A株式会社',
      dealId: 'DEAL-2024-001',
      dealCondition: '営業プロセス標準化支援',
      recommendationContent: 'クラウドベースのCRM導入を提案',
      reasoningExplanation: '過去の類似案件（業種：製造業、規模：従業員500名）で成功率85%のパターンと一致',
      confidenceScore: 85,
      generatedAt: reportTimestamp,
    };

    const s3UploadResponse = {
      Bucket: 'recommendation-reports',
      Key: `report-${reportTimestamp}.pdf`,
      ETag: '12345abc',
      Location: `s3://recommendation-reports/report-${reportTimestamp}.pdf`,
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue(s3UploadResponse),
      generateDownloadUrl: jest.fn().mockReturnValue({
        url: `https://recommendation-reports.s3.amazonaws.com/report-${reportTimestamp}.pdf?X-Amz-Signature=abc123&X-Amz-Expires=3600&X-Amz-Date=20240115T113000Z`,
        expiresAt: new Date('2024-01-15T12:30:00Z'),
      }),
    };

    const reportMetadata = {
      reportId: 'RPT-2024-001',
      fileName: `report-${reportTimestamp}.pdf`,
      s3Path: `s3://recommendation-reports/report-${reportTimestamp}.pdf`,
      fileSize: 2048,
      uploadedAt: new Date(reportTimestamp),
      status: 'uploaded',
    };

    const result = await generateRecommendationReport(
      reportData,
      mockFileStorageAdapter
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-001',
        customerName: '顧客A株式会社',
        dealId: 'DEAL-2024-001',
        dealCondition: '営業プロセス標準化支援',
        recommendationContent: 'クラウドベースのCRM導入を提案',
        reasoningExplanation: '過去の類似案件（業種：製造業、規模：従業員500名）で成功率85%のパターンと一致',
        confidenceScore: 85,
        generatedAt: reportTimestamp,
      })
    );

    expect(result.uploadResponse).toEqual({
      Bucket: 'recommendation-reports',
      Key: `report-${reportTimestamp}.pdf`,
      ETag: '12345abc',
      Location: `s3://recommendation-reports/report-${reportTimestamp}.pdf`,
    });

    expect(result.metadata).toEqual({
      reportId: expect.any(String),
      fileName: `report-${reportTimestamp}.pdf`,
      s3Path: `s3://recommendation-reports/report-${reportTimestamp}.pdf`,
      fileSize: expect.any(Number),
      uploadedAt: expect.any(Date),
      status: 'uploaded',
    });

    expect(result.metadata.s3Path).toBe(
      `s3://recommendation-reports/report-${reportTimestamp}.pdf`
    );

    expect(result.metadata.status).toBe('uploaded');

    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      `report-${reportTimestamp}.pdf`
    );

    const downloadUrl = result.downloadUrl;
    expect(downloadUrl.url).toMatch(/^https:\/\/recommendation-reports\.s3\.amazonaws\.com\//);
    expect(downloadUrl.url).toMatch(/X-Amz-Signature=/);
    expect(downloadUrl.url).toMatch(/X-Amz-Expires=3600/);
    expect(downloadUrl.expiresAt.getTime()).toBe(
      new Date('2024-01-15T12:30:00Z').getTime()
    );
  });
});