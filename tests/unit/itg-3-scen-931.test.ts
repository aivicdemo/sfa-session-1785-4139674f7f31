import { generateRecommendationAndUploadReport } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 提案資料生成とS3アップロード', () => {
  // SCEN-931
  test('推奨内容をPDF形式でS3にアップロードし、ダウンロードURLが正常に生成される', async () => {
    const customerId = 'CUST-20250801-001';
    const customerName = '株式会社テスト販売';
    const industry = '小売業';
    const companySize = 'medium';
    const challenge = '在庫管理の効率化とコスト削減';
    const recommendedApproach = 'クラウド型在庫管理システムの導入と運用最適化コンサルティング';
    const evidence = '過去3年間の類似案件で成功率85%、平均ROI280%を実現';
    const recommendationId = 'REC-20250801-abc123';
    const uploadedAt = new Date('2025-08-01T09:00:00Z');
    const expiresAt = new Date('2025-08-01T10:00:00Z');
    const s3Key = 'reports/recommendation_20250801_abc123.pdf';
    const bucketName = 'ai-agent-recommendations';
    const downloadUrl = 'https://ai-agent-recommendations.s3.ap-northeast-1.amazonaws.com/reports/recommendation_20250801_abc123.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20250801%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20250801T090000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=abc123def456';
    const expirySeconds = 3600;

    const recommendationData = {
      customerId,
      customerName,
      industry,
      companySize,
      challenge,
      recommendedApproach,
      evidence,
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId,
        customerId,
        customerName,
        industry,
        companySize,
        challenge,
        recommendedApproach,
        evidence,
        confidenceScore: 87,
        generatedAt: uploadedAt.toISOString(),
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        uploadStatus: 'success',
        s3Key,
        bucketName,
        uploadedAt: uploadedAt.toISOString(),
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        downloadUrl,
        expiresAt: expiresAt.toISOString(),
        expirySeconds,
      }),
      deleteExpiredReports: jest.fn(),
    };

    const result = await generateRecommendationAndUploadReport(
      recommendationData,
      aiRecommendationEngineStub,
      fileStorageAdapterStub,
    );

    expect(aiRecommendationEngineStub.generateRecommendation).toHaveBeenCalledWith(
      recommendationData,
    );

    expect(fileStorageAdapterStub.uploadRecommendationReport).toHaveBeenCalled();
    const uploadCallArgs = fileStorageAdapterStub.uploadRecommendationReport.mock.calls[0];
    expect(uploadCallArgs[0]).toHaveProperty('recommendationId', recommendationId);
    expect(uploadCallArgs[0]).toHaveProperty('customerName', customerName);

    expect(fileStorageAdapterStub.generateDownloadUrl).toHaveBeenCalledWith(s3Key);

    expect(result).toHaveProperty('downloadUrl');
    expect(result.downloadUrl).toMatch(/^https:\/\/ai-agent-recommendations\.s3\.ap-northeast-1\.amazonaws\.com\//);
    expect(result.downloadUrl).toMatch(/X-Amz-Algorithm=AWS4-HMAC-SHA256/);
    expect(result.downloadUrl).toMatch(/X-Amz-Credential=/);
    expect(result.downloadUrl).toMatch(/X-Amz-Expires=/);
    expect(result.downloadUrl).toMatch(/X-Amz-Signature=/);

    expect(result).toHaveProperty('expirySeconds', expirySeconds);
    expect(result.expirySeconds).toBe(3600);

    expect(result).toHaveProperty('expiresAt');
    expect(result.expiresAt).toBe(expiresAt.toISOString());

    expect(result).toHaveProperty('s3Key', s3Key);
    expect(result).toHaveProperty('bucketName', bucketName);
    expect(result).toHaveProperty('recommendationId', recommendationId);
    expect(result).toHaveProperty('uploadedAt');
  });
});