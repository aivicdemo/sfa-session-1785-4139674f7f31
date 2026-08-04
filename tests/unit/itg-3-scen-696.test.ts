import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推奨根拠の可視化 - レポート生成・保存機能', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-696
  test('1件の推奨内容が入力された場合、1件の内容を含むPDFレポートが生成され、S3にアップロードされて、レポートファイルメタデータに推奨件数1として保存される', async () => {
    const mockRecommendationId = 'REC-001';
    const mockProposalApproach = '顧客の経営課題に基づくソリューション提案';
    const mockReasoning = '過去の成功事例から抽出した顧客属性・業種パターンと75%の合致度';
    const mockEvaluationScore = 85;
    const mockRecommendationContent = {
      recommendationId: mockRecommendationId,
      proposalApproach: mockProposalApproach,
      reasoning: mockReasoning,
      evaluationScore: mockEvaluationScore,
      customerId: 'CUST-12345',
      dealId: 'DEAL-67890',
      timestamp: '2024-01-15T11:00:00Z',
    };

    const mockFileKey = 'reports/REC-001-20240115110000.pdf';
    const mockFileName = 'recommendation_report_REC-001.pdf';
    const mockGeneratedDate = '2024-01-15T11:00:00Z';
    const mockRecommendationCount = 1;
    const mockFileSizeBytes = 245632;

    const mockS3UploadResponse = {
      fileKey: mockFileKey,
      fileName: mockFileName,
      status: 'success',
    };

    const mockMetadata = {
      fileKey: mockFileKey,
      fileName: mockFileName,
      generatedDate: mockGeneratedDate,
      recommendationCount: mockRecommendationCount,
      fileSizeBytes: mockFileSizeBytes,
      contentHash: 'sha256_abc123def456',
    };

    fetchMock.mockResponseOnce(
      JSON.stringify(mockS3UploadResponse),
      { status: 200 }
    );

    const result = await generateRecommendationReport(
      [mockRecommendationContent],
      {
        uploadRecommendationReport: async (pdfBuffer: Buffer) => ({
          fileKey: mockFileKey,
          fileName: mockFileName,
          status: 'success',
        }),
        generateDownloadUrl: async (fileKey: string) =>
          `https://s3.example.com/${fileKey}`,
        deleteExpiredReports: async () => true,
      }
    );

    expect(result.fileKey).toBe(mockFileKey);
    expect(result.fileName).toBe(mockFileName);
    expect(result.recommendationCount).toBe(mockRecommendationCount);
    expect(result.status).toBe('success');
    expect(result.pdfContent).toBeDefined();
    expect(result.pdfContent).toContain(mockProposalApproach);
    expect(result.pdfContent).toContain(mockReasoning);
    expect(result.pdfContent).toContain(mockEvaluationScore.toString());
    expect(result.metadata.recommendationCount).toBe(1);
    expect(result.metadata.fileKey).toBe(mockFileKey);
    expect(typeof result.metadata.fileSizeBytes).toBe('number');
    expect(result.metadata.fileSizeBytes).toBeGreaterThan(0);
  });
});