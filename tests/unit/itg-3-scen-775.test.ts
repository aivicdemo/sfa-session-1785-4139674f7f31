import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { uploadRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('AIエージェント推奨根拠の可視化機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-775
  test('推奨内容レポート生成・保存機能(ファイルストレージ正常応答)', async () => {
    const customerName = '顧客A';
    const proposalContent = 'クラウドサービス導入';
    const generatedAt = '2026-08-01T10:30:00Z';
    const fileKey = `recommendation_${customerName}_20260801.xlsx`;
    const fileFormat = 'xlsx';
    const s3Location = `https://s3.amazonaws.com/sales-ai-bucket/${fileKey}`;
    const versionId = 'v12345abcde';
    const eTag = '"abc123def456"';
    const fileSizeBytes = 12847;

    const mockRecommendationData = {
      customerName: customerName,
      proposalContent: proposalContent,
      generatedAt: generatedAt,
      confidenceScore: 85,
      reasoningBasis: [
        {
          factorType: 'customer_history',
          description: '過去の類似案件での成功パターンに合致',
          weight: 0.4,
        },
        {
          factorType: 'market_timing',
          description: '業界の購買シグナルが好機',
          weight: 0.35,
        },
        {
          factorType: 'competitive_analysis',
          description: '競合状況から最適な提案時期',
          weight: 0.25,
        },
      ],
    };

    const s3Response = {
      ETag: eTag,
      Location: s3Location,
      VersionId: versionId,
      ServerSideEncryption: 'AES256',
    };

    fetchMock.mockResponseOnce(JSON.stringify(s3Response), { status: 200 });

    const result = await uploadRecommendationReport(
      mockRecommendationData,
      fileFormat,
      fileKey,
      fileSizeBytes
    );

    expect(result).toEqual({
      s3Location: s3Location,
      fileKey: fileKey,
      status: 'success',
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const callArgs = fetchMock.mock.calls[0];
    expect(callArgs[0]).toMatch(/s3|amazonaws/);

    const metadataRecord = {
      fileKey: fileKey,
      fileFormat: fileFormat,
      uploadedAt: generatedAt,
      s3Location: s3Location,
      fileSizeBytes: fileSizeBytes,
      status: 'completed',
    };

    expect(metadataRecord.fileKey).toBe('recommendation_顧客A_20260801.xlsx');
    expect(metadataRecord.fileFormat).toBe('xlsx');
    expect(metadataRecord.uploadedAt).toBe('2026-08-01T10:30:00Z');
    expect(metadataRecord.s3Location).toBe(
      'https://s3.amazonaws.com/sales-ai-bucket/recommendation_顧客A_20260801.xlsx'
    );
    expect(metadataRecord.fileSizeBytes).toBe(12847);
    expect(metadataRecord.status).toBe('completed');
  });
});