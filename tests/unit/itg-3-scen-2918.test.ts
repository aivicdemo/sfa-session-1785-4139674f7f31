import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { generateAndUploadRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

// Mock types for external services
interface AIRecommendationStub {
  generateRecommendation: jest.Mock;
}

interface FileStorageStub {
  uploadRecommendationReport: jest.Mock;
}

interface RecommendationContent {
  proposalApproach: string;
  reasoningExplanation: string;
}

interface UploadResponse {
  status: number;
  message: string;
  s3ObjectKey: string;
}

interface FileMetadata {
  customerId: string;
  fileKey: string;
  uploadedAt: string;
  fileSizeBytes: number;
  fileFormat: 'PDF' | 'XLSX';
}

describe('AIエージェント推奨根拠の可視化 - Amazon S3連携', () => {
  let aiRecommendationStub: AIRecommendationStub;
  let fileStorageStub: FileStorageStub;
  let reportFileMetadataRecords: FileMetadata[];

  beforeEach(() => {
    reportFileMetadataRecords = [];

    // AIRecommendationEngine stub - returns recommendation content
    aiRecommendationStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: '既存システム統合による段階的移行戦略',
        reasoningExplanation: '当該顧客の保有レガシーシステムと新規ITプラットフォームの相互運用性を確保する段階的アプローチが過去の類似案件で75%の成功率を達成した。同業種での導入事例3件すべてが3ヶ月以内の予算達成を実現している。'
      } as RecommendationContent)
    };

    // FileStorageAdapter stub - simulates S3 upload success
    fileStorageStub = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        status: 200,
        message: 'Upload completed successfully',
        s3ObjectKey: 'recommendations/CUST-001/recommendation_CUST-001_20240115_113045.pdf'
      } as UploadResponse)
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-2918
  test('Amazon S3連携 - uploadRecommendationReport呼び出しが正常応答を受けた場合、推奨内容がPDF/Excel形式でクラウドストレージに保存される', async () => {
    const customerId = 'CUST-001';
    const dealCondition = '新規IT基盤構築案件';
    const outputFormats = ['PDF', 'XLSX'];
    const fixedTimestamp = '20240115_113045';

    // Execute the function under test
    const result = await generateAndUploadRecommendationReport(
      {
        customerId,
        dealCondition,
        outputFormats
      },
      aiRecommendationStub,
      fileStorageStub,
      (records: FileMetadata[]) => {
        reportFileMetadataRecords = records;
      },
      fixedTimestamp
    );

    // Verify uploadRecommendationReport was called
    expect(fileStorageStub.uploadRecommendationReport).toHaveBeenCalled();
    expect(fileStorageStub.uploadRecommendationReport).toHaveBeenCalledTimes(2);

    // Verify response status is 200
    expect(result.status).toBe(200);

    // Verify no error in response
    expect(result.error).toBeUndefined();

    // Verify PDF file was generated with correct naming format
    const pdfCall = fileStorageStub.uploadRecommendationReport.mock.calls[0];
    const pdfFileName = pdfCall[0].fileName;
    expect(pdfFileName).toMatch(/^recommendation_CUST-001_20240115_113045\.pdf$/);
    expect(pdfCall[0].format).toBe('PDF');

    // Verify Excel file was generated with correct naming format
    const xlsxCall = fileStorageStub.uploadRecommendationReport.mock.calls[1];
    const xlsxFileName = xlsxCall[0].fileName;
    expect(xlsxFileName).toMatch(/^recommendation_CUST-001_20240115_113045\.xlsx$/);
    expect(xlsxCall[0].format).toBe('XLSX');

    // Verify metadata records were inserted (2 records for PDF and XLSX)
    expect(reportFileMetadataRecords).toHaveLength(2);

    // Verify PDF metadata record
    const pdfMetadata = reportFileMetadataRecords[0];
    expect(pdfMetadata.customerId).toBe('CUST-001');
    expect(pdfMetadata.fileKey).toBe('recommendations/CUST-001/recommendation_CUST-001_20240115_113045.pdf');
    expect(pdfMetadata.uploadedAt).toBe('2024-01-15T11:30:45Z');
    expect(pdfMetadata.fileSizeBytes).toBeGreaterThan(0);
    expect(pdfMetadata.fileFormat).toBe('PDF');

    // Verify Excel metadata record
    const xlsxMetadata = reportFileMetadataRecords[1];
    expect(xlsxMetadata.customerId).toBe('CUST-001');
    expect(xlsxMetadata.fileKey).toBe('recommendations/CUST-001/recommendation_CUST-001_20240115_113045.xlsx');
    expect(xlsxMetadata.uploadedAt).toBe('2024-01-15T11:30:45Z');
    expect(xlsxMetadata.fileSizeBytes).toBeGreaterThan(0);
    expect(xlsxMetadata.fileFormat).toBe('XLSX');

    // Verify IAM authentication was passed in upload calls
    const pdfUploadParams = fileStorageStub.uploadRecommendationReport.mock.calls[0][0];
    expect(pdfUploadParams.authentication).toBeDefined();
    expect(pdfUploadParams.authentication.type).toBe('IAM');

    const xlsxUploadParams = fileStorageStub.uploadRecommendationReport.mock.calls[1][0];
    expect(xlsxUploadParams.authentication).toBeDefined();
    expect(xlsxUploadParams.authentication.type).toBe('IAM');

    // Verify recommendation content is included in both files
    expect(pdfUploadParams.content).toContain('既存システム統合による段階的移行戦略');
    expect(pdfUploadParams.content).toContain('当該顧客の保有レガシーシステムと新規ITプラットフォームの相互運用性を確保する段階的アプローチが過去の類似案件で75%の成功率を達成した。同業種での導入事例3件すべてが3ヶ月以内の予算達成を実現している。');
    expect(xlsxUploadParams.content).toContain('既存システム統合による段階的移行戦略');
    expect(xlsxUploadParams.content).toContain('当該顧客の保有レガシーシステムと新規ITプラットフォームの相互運用性を確保する段階的アプローチが過去の類似案件で75%の成功率を達成した。同業種での導入事例3件すべてが3ヶ月以内の予算達成を実現している。');
  });
});