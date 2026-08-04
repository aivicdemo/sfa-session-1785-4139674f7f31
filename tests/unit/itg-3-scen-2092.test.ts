import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import {
  generateRecommendation,
  uploadRecommendationReport,
} from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2092
  test('[normal] 提案内容と顧客対応パターンの標準プロセス照合分析 - PDF生成後S3アップロード成功', async () => {
    const dealId = 'DEAL-20240115-001';
    const customerId = 'CUST-12345';
    const proposalApproach = '段階的価値提案アプローチ';
    const recommendationConfidence = 92;
    const underlyingData = [
      {
        pastDealId: 'PAST-001',
        customerIndustry: '金融',
        dealStage: '提案段階',
        successIndicators: ['予算確保', '意思決定者参加'],
        matchScore: 0.95,
      },
      {
        pastDealId: 'PAST-002',
        customerIndustry: '金融',
        dealStage: '提案段階',
        successIndicators: ['複数回接触', '競合検討'],
        matchScore: 0.88,
      },
    ];

    const recommendationResult = {
      dealId,
      customerId,
      recommendedApproach: proposalApproach,
      confidenceScore: recommendationConfidence,
      rationale: 'Similar financial industry patterns detected with 92% match',
      underlyingEvidence: underlyingData,
      generatedAt: new Date('2024-01-15T11:00:00Z'),
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(recommendationResult),
    };

    const bucketName = 'sales-ai-reports-prod';
    const s3ObjectKey = `recommendations/${dealId}/analysis-${new Date('2024-01-15T11:00:00Z').getTime()}.pdf`;
    const downloadUrl = `https://${bucketName}.s3.amazonaws.com/${s3ObjectKey}?X-Amz-Expires=3600`;

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        s3ObjectKey,
        downloadUrl,
        uploadedAt: new Date('2024-01-15T11:00:00Z'),
      }),
    };

    const reportMetadataInserted = {
      fileId: `FILE-${dealId}-${new Date('2024-01-15T11:00:00Z').getTime()}`,
      s3ObjectKey,
      fileFormat: 'PDF',
      generatedAt: new Date('2024-01-15T11:00:00Z'),
      dealId,
      customerId,
      confidenceScore: recommendationConfidence,
    };

    const result = await generateRecommendation(
      { dealId, customerId },
      mockAIEngine
    );

    expect(result).toEqual(recommendationResult);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith({
      dealId,
      customerId,
    });

    const pdfReport = {
      dealId: result.dealId,
      proposalApproach: result.recommendedApproach,
      confidenceScore: result.confidenceScore,
      rationale: result.rationale,
      underlyingEvidence: result.underlyingEvidence,
      generatedAt: result.generatedAt,
    };

    const uploadPayload = {
      bucketName,
      objectKey: expect.stringContaining(`recommendations/${dealId}`),
      fileContent: pdfReport,
      fileFormat: 'PDF',
    };

    const uploadResult = await uploadRecommendationReport(
      uploadPayload,
      mockFileStorageAdapter
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(
      1
    );
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        bucketName,
        fileFormat: 'PDF',
      }),
      expect.any(Object)
    );

    expect(uploadResult).toEqual({
      fileId: expect.stringContaining(`FILE-${dealId}`),
      s3ObjectKey: expect.stringContaining(`recommendations/${dealId}`),
      fileFormat: 'PDF',
      generatedAt: expect.any(Date),
      dealId,
      customerId,
      downloadUrl: expect.stringContaining('s3.amazonaws.com'),
      confidenceScore: recommendationConfidence,
    });

    expect(uploadResult.s3ObjectKey).toMatch(/recommendations\/DEAL-20240115-001/);
    expect(uploadResult.fileFormat).toBe('PDF');
    expect(uploadResult.confidenceScore).toBe(92);
    expect(uploadResult.dealId).toBe(dealId);
    expect(uploadResult.customerId).toBe(customerId);
  });
});