import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendationReportWithReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  let mockAIRecommendationEngine: any;
  let mockFileStorageAdapter: any;
  let mockReportFileMetadataTable: any;
  let capturedUploadCall: any;

  beforeEach(() => {
    mockReportFileMetadataTable = [];

    mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationContent: {
          proposalApproach: 'increase_frequency',
          recommendedProducts: ['product-a', 'product-b'],
          estimatedRevenue: 2500000,
          priority: 'high'
        },
        reasoning: 'Based on manufacturing industry patterns and deal amount of 5,000,000 JPY, increased frequency engagement strategy shows 85% success rate in similar deals. Recommended products align with Q2-Q3 seasonal demand.'
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const uploadTimestamp = '2024-02-15T14:30:45.123Z';
    const fileSize = 256000;

    mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileKey: `recommendation-${uploadTimestamp}.pdf`,
        bucketName: 'recommendation-reports',
        uploadedAt: uploadTimestamp,
        fileFormat: 'application/pdf',
        fileSize: fileSize
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    mockFileStorageAdapter.uploadRecommendationReport.mockImplementation(async (uploadParams: any) => {
      capturedUploadCall = uploadParams;
      
      const metadataRecord = {
        dealId: uploadParams.dealId,
        fileKey: `recommendation-${uploadTimestamp}.pdf`,
        bucketName: 'recommendation-reports',
        fileFormat: 'application/pdf',
        createdAt: uploadTimestamp,
        fileSize: fileSize
      };
      mockReportFileMetadataTable.push(metadataRecord);

      return {
        fileKey: `recommendation-${uploadTimestamp}.pdf`,
        bucketName: 'recommendation-reports',
        uploadedAt: uploadTimestamp,
        fileFormat: 'application/pdf',
        fileSize: fileSize
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1948
  test('[edge] 推奨内容の根拠表示機能 - S3ファイルアップロード成功時にPDF形式の根拠レポートが保存される', async () => {
    const testDealData = {
      dealId: 'DEAL-TEST-001',
      customerId: 'CUST-A001',
      dealAmount: 5000000,
      industry: 'manufacturing',
      dealStage: 'proposal'
    };

    const result = await generateRecommendationReportWithReasoning(
      testDealData,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(1);

    expect(capturedUploadCall).toEqual(
      expect.objectContaining({
        format: 'pdf',
        dealId: 'DEAL-TEST-001',
        recommendationContent: expect.objectContaining({
          proposalApproach: 'increase_frequency',
          recommendedProducts: expect.arrayContaining(['product-a', 'product-b']),
          estimatedRevenue: 2500000,
          priority: 'high'
        }),
        reasoning: expect.stringContaining('manufacturing industry patterns')
      })
    );

    expect(mockReportFileMetadataTable).toHaveLength(1);

    const savedMetadata = mockReportFileMetadataTable[0];
    expect(savedMetadata).toEqual(
      expect.objectContaining({
        dealId: 'DEAL-TEST-001',
        fileKey: expect.stringMatching(/^recommendation-2024-02-15T14:30:45\.123Z\.pdf$/),
        bucketName: 'recommendation-reports',
        fileFormat: 'application/pdf',
        createdAt: '2024-02-15T14:30:45.123Z',
        fileSize: 256000
      })
    );

    expect(result).toEqual(
      expect.objectContaining({
        fileKey: expect.stringMatching(/^recommendation-2024-02-15T14:30:45\.123Z\.pdf$/),
        bucketName: 'recommendation-reports',
        uploadedAt: '2024-02-15T14:30:45.123Z',
        fileFormat: 'application/pdf',
        fileSize: 256000
      })
    );
  });
});