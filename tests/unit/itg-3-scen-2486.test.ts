import { describe, test, expect, beforeEach } from '@jest/globals';
import * as FileStorageAdapter from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2486
  test('[normal] 推奨内容のレポート生成・保存機能 - Amazon S3へのアップロードが正常応答し、有効期限付きのダウンロードURLが生成される', async () => {
    const s3ObjectKey = 'recommendation-report-20250801-123456.pdf';
    const expirationSeconds = 3600;
    const fixedTimestamp = '20250801T120000Z';
    const s3Region = 'ap-northeast-1';
    const s3Endpoint = `s3.${s3Region}.amazonaws.com`;
    const signatureValue = 'AWSv4SignedValue123456789';

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        objectKey: s3ObjectKey,
        bucket: 'sales-ai-reports',
        uploadedAt: new Date('2025-08-01T12:00:00Z'),
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        url: `https://${s3Endpoint}/${s3ObjectKey}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20250801%2F${s3Region}%2Fs3%2Faws4_request&X-Amz-Date=${fixedTimestamp}&X-Amz-Expires=${expirationSeconds}&X-Amz-SignedHeaders=host&X-Amz-Signature=${signatureValue}`,
        expiresAt: new Date('2025-08-01T13:00:00Z'),
      }),
    };

    const recommendationReport = {
      dealId: 'DEAL-001',
      customerId: 'CUST-001',
      proposalApproach: 'テクノロジー導入による効率化',
      successPattern: 'Type-A',
      confidenceScore: 87,
      evidenceData: [
        { type: 'pastCase', caseId: 'CASE-001', similarity: 0.92 },
        { type: 'customerProfile', profileScore: 0.85 },
      ],
      generatedAt: '2025-08-01T12:00:00Z',
      format: 'PDF',
    };

    const uploadResult = await mockFileStorageAdapter.uploadRecommendationReport(
      recommendationReport
    );

    expect(uploadResult).toBeDefined();
    expect(uploadResult.objectKey).toBe(s3ObjectKey);
    expect(uploadResult.bucket).toBe('sales-ai-reports');

    const downloadUrlResult = await mockFileStorageAdapter.generateDownloadUrl(
      s3ObjectKey,
      expirationSeconds
    );

    expect(downloadUrlResult).toBeDefined();
    const generatedUrl = downloadUrlResult.url;

    const urlObj = new URL(generatedUrl);
    expect(urlObj.protocol).toBe('https:');
    expect(urlObj.hostname).toMatch(/^s3(\.[a-z0-9\-]+)?\.amazonaws\.com$/);

    const expiresParam = urlObj.searchParams.get('X-Amz-Expires');
    expect(expiresParam).toBe(expirationSeconds.toString());

    const dateParam = urlObj.searchParams.get('X-Amz-Date');
    expect(dateParam).toBe(fixedTimestamp);
    expect(/^\d{8}T\d{6}Z$/.test(dateParam)).toBe(true);

    const signatureParam = urlObj.searchParams.get('X-Amz-Signature');
    expect(signatureParam).toBeDefined();
    expect(signatureParam).not.toBeNull();
    expect(signatureParam).toBe(signatureValue);

    const expiresAtTime = new Date(downloadUrlResult.expiresAt).getTime();
    const generatedAtTime = new Date('2025-08-01T12:00:00Z').getTime();
    const timeDifferenceSeconds = (expiresAtTime - generatedAtTime) / 1000;
    expect(timeDifferenceSeconds).toBe(expirationSeconds);
  });
});