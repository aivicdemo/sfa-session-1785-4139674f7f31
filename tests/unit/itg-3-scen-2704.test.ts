import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendationReportWithStorage } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェントの推奨根拠の可視化機能 - 推奨レポート生成・保存', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-2704
  test('FileStorageAdapter.uploadRecommendationReportが正常応答したとき、推奨内容がPDF形式で保存される', async () => {
    const recommendationContent = {
      proposalApproach: '顧客のデジタル化支援パッケージを提案',
      reasoningBasis: [
        '過去3年間の類似顧客（製造業、売上100億円規模）の成功事例から抽出',
        '顧客の現在のITレディネススコアが75点で、提案適用企業の平均82点に近い',
        'フォローアップ成功率が過去事例で82%であることを根拠'
      ],
      successPatternScore: 87,
      generatedTimestamp: '2024-01-15T11:00:00Z',
      customerId: 'CUST-00123',
      dealId: 'DEAL-00456'
    };

    const aiEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue(recommendationContent)
    };

    const s3UploadSuccessResponse = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'アップロード成功',
        s3ObjectKey: 'recommendations/pdf/CUST-00123_DEAL-00456_20240115T110000Z.pdf',
        uploadedAt: '2024-01-15T11:00:05Z'
      })
    };

    fetchMock.mockResponseOnce(JSON.stringify(s3UploadSuccessResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        success: true,
        s3ObjectKey: 'recommendations/pdf/CUST-00123_DEAL-00456_20240115T110000Z.pdf',
        mimeType: 'application/pdf',
        uploadedTimestamp: '2024-01-15T11:00:05Z'
      })
    };

    const reportMetadataStub = {
      fileFormat: 'PDF',
      mimeType: 'application/pdf',
      fileSizeBytes: 45230,
      s3ObjectKey: 'recommendations/pdf/CUST-00123_DEAL-00456_20240115T110000Z.pdf',
      fileStatus: '保存完了',
      generatedTimestamp: '2024-01-15T11:00:00Z',
      uploadedTimestamp: '2024-01-15T11:00:05Z',
      customerId: 'CUST-00123',
      dealId: 'DEAL-00456'
    };

    const result = await generateRecommendationReportWithStorage(
      recommendationContent,
      aiEngineStub,
      fileStorageAdapterStub,
      reportMetadataStub
    );

    expect(result.success).toBe(true);
    expect(result.s3ObjectKey).toBe('recommendations/pdf/CUST-00123_DEAL-00456_20240115T110000Z.pdf');
    expect(result.mimeType).toBe('application/pdf');
    expect(fileStorageAdapterStub.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        proposalApproach: '顧客のデジタル化支援パッケージを提案',
        successPatternScore: 87,
        customerId: 'CUST-00123',
        dealId: 'DEAL-00456'
      }),
      'pdf'
    );

    expect(reportMetadataStub.fileFormat).toBe('PDF');
    expect(reportMetadataStub.mimeType).toBe('application/pdf');
    expect(reportMetadataStub.fileStatus).toBe('保存完了');
    expect(reportMetadataStub.s3ObjectKey).toBe('recommendations/pdf/CUST-00123_DEAL-00456_20240115T110000Z.pdf');

    expect(result.reportContent).toMatchObject({
      proposalApproach: '顧客のデジタル化支援パッケージを提案',
      successPatternScore: 87,
      reasoningBasisCount: 3
    });

    expect(result.reportContent.reasoningBasis).toEqual(
      expect.arrayContaining([
        expect.stringContaining('過去3年間の類似顧客'),
        expect.stringContaining('ITレディネススコア'),
        expect.stringContaining('フォローアップ成功率')
      ])
    );

    expect(result.fileMetadata.generatedTimestamp).toBe('2024-01-15T11:00:00Z');
    expect(result.fileMetadata.uploadedTimestamp).toBe('2024-01-15T11:00:05Z');
  });
});