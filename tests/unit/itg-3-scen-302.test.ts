import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - レポート生成・アップロード', () => {
  test('SCEN-302: FileStorageAdapterが正常応答したとき、PDFレポートがS3にアップロードされ一時URLが生成される', async () => {
    const reportId = 'rec_20240115_001';
    const s3BucketName = 'ai-recommendation-reports';
    const s3ObjectKey = `report-${reportId}.pdf`;
    const baseUrl = 'https://s3.amazonaws.com';
    const expiresInSeconds = 3600;

    const recommendationContent = {
      approachTitle: '段階的提案アプローチ',
      approachDetails: '初回接触→ニーズ確認→提案→クロージング',
      confidenceScore: 85,
      reasoningBasis: [
        {
          dataType: 'success_pattern',
          reference: 'past_case_A_2024',
          weight: 0.6,
        },
        {
          dataType: 'customer_attribute_match',
          reference: 'industry_match_score',
          weight: 0.4,
        },
      ],
    };

    const pdfBufferMock = Buffer.from('PDF mock content');

    const currentTime = new Date('2024-01-15T11:00:00Z');
    const expiresAtTime = new Date(currentTime.getTime() + expiresInSeconds * 1000);

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: reportId,
        approachTitle: recommendationContent.approachTitle,
        approachDetails: recommendationContent.approachDetails,
        confidenceScore: recommendationContent.confidenceScore,
        reasoningBasis: recommendationContent.reasoningBasis,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        success: true,
        s3ObjectKey: s3ObjectKey,
        etag: '"abc123def456"',
        uploadedAt: currentTime.toISOString(),
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        downloadUrl: `${baseUrl}/${s3BucketName}/${s3ObjectKey}?X-Amz-Signature=MixedSignatureExample123&X-Amz-Expires=${expiresInSeconds}`,
        expiresAt: expiresAtTime.toISOString(),
      }),
      deleteExpiredReports: jest.fn(),
    };

    const reportFileMetadataRepository = {
      insertRecord: jest.fn().mockResolvedValue({
        reportId: reportId,
        s3ObjectKey: s3ObjectKey,
        generatedAt: currentTime.toISOString(),
        expiresAt: expiresAtTime.toISOString(),
        status: 'success',
      }),
    };

    const result = await generateRecommendationReport(
      aiRecommendationEngineStub,
      fileStorageAdapterStub,
      reportFileMetadataRepository,
      {
        recommendationId: reportId,
        customerId: 'cust_12345',
        dealId: 'deal_67890',
        generatedAt: currentTime,
      },
    );

    expect(aiRecommendationEngineStub.generateRecommendation).toHaveBeenCalled();

    expect(fileStorageAdapterStub.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        reportId: reportId,
        pdfBuffer: expect.any(Buffer),
        s3BucketName: s3BucketName,
      }),
    );

    expect(fileStorageAdapterStub.generateDownloadUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        s3ObjectKey: s3ObjectKey,
      }),
    );

    expect(fileStorageAdapterStub.generateDownloadUrl).toHaveBeenCalled();
    const downloadUrlCall = fileStorageAdapterStub.generateDownloadUrl.mock.results[0].value;
    expect(downloadUrlCall.downloadUrl).toMatch(/^https:\/\/s3\.amazonaws\.com/);
    expect(downloadUrlCall.downloadUrl).toMatch(/X-Amz-Signature/);
    expect(downloadUrlCall.downloadUrl).toMatch(/X-Amz-Expires=3600/);

    expect(reportFileMetadataRepository.insertRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        reportId: reportId,
        s3ObjectKey: s3ObjectKey,
        generatedAt: currentTime.toISOString(),
        expiresAt: expiresAtTime.toISOString(),
        status: 'success',
      }),
    );

    expect(result).toEqual(
      expect.objectContaining({
        reportId: reportId,
        downloadUrl: expect.stringContaining(s3ObjectKey),
        expiresAt: expiresAtTime.toISOString(),
        status: 'success',
      }),
    );

    expect(result.expiresAt).toBe('2024-01-15T12:00:00.000Z');
  });
});