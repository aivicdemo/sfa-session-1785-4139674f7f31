import { uploadRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 推奨内容レポート生成・保存', () => {
  // SCEN-774
  test('FileStorageAdapter.uploadRecommendationReport が PDF 形式での保存に成功したとき、ファイルメタデータが記録される', async () => {
    const projectId = 'PROJ-12345';
    const uploadedAtIso = '2026-08-01T09:30:00Z';
    const expiresAtIso = '2026-09-01T09:30:00Z';
    const fileSizeBytes = 125000;
    const s3ETag = '"abc123def456"';
    const fileKey = 's3://recommendation-reports/PROJ-12345_20260801_093000.pdf';
    const fileFormat = 'application/pdf';
    const statusCode = 200;

    const recommendationContent = {
      projectId,
      proposalApproach: 'Approach A: Digital transformation',
      customerCondition: {
        industry: 'Technology',
        employeeCount: 500,
        annualRevenue: 50000000
      },
      successPatternRef: 'PATTERN-2024-001',
      confidenceScore: 0.87,
      riskFactors: ['Market volatility', 'Resource constraints'],
      nextActions: ['Schedule follow-up meeting', 'Prepare detailed proposal']
    };

    const pdfBinaryData = Buffer.from('PDF binary content');

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileKey,
        fileFormat,
        fileSizeBytes,
        uploadedAt: uploadedAtIso,
        expiresAt: expiresAtIso,
        s3ETag,
        projectId,
        statusCode
      })
    };

    const mockInsertMetadata = jest.fn().mockResolvedValue({
      id: 'META-001',
      fileKey,
      fileFormat,
      fileSizeBytes,
      uploadedAt: uploadedAtIso,
      expiresAt: expiresAtIso,
      s3ETag,
      projectId,
      statusCode
    });

    const result = await uploadRecommendationReport(
      {
        projectId,
        recommendationContent,
        pdfBinaryData,
        generatedAt: uploadedAtIso
      },
      mockFileStorageAdapter,
      mockInsertMetadata
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId,
        pdfBinaryData,
        generatedAt: uploadedAtIso
      })
    );

    expect(mockInsertMetadata).toHaveBeenCalledWith({
      fileKey,
      fileFormat,
      fileSizeBytes,
      uploadedAt: uploadedAtIso,
      expiresAt: expiresAtIso,
      s3ETag,
      projectId,
      statusCode
    });

    expect(result).toEqual({
      fileKey,
      fileFormat,
      fileSizeBytes,
      uploadedAt: uploadedAtIso,
      expiresAt: expiresAtIso,
      s3ETag,
      projectId,
      statusCode
    });

    expect(result.fileKey).toBe('s3://recommendation-reports/PROJ-12345_20260801_093000.pdf');
    expect(result.fileFormat).toBe('application/pdf');
    expect(result.fileSizeBytes).toBe(125000);
    expect(result.uploadedAt).toBe('2026-08-01T09:30:00Z');
    expect(result.expiresAt).toBe('2026-09-01T09:30:00Z');
    expect(result.s3ETag).toBe('"abc123def456"');
    expect(result.projectId).toBe('PROJ-12345');
    expect(result.statusCode).toBe(200);
  });
});