import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendationReportWithDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推奨根拠の可視化機能 - ダウンロードURL有効期限エラー', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-2287
  test('推奨レポート生成後、有効期限が既に切れたメタデータでURL生成を試みた場合、例外をスロー', () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileKey: 'recommendation-report-20240115-001',
        uploadTimestamp: new Date('2024-01-13T11:00:00Z').toISOString(),
        fileSize: 524288,
      }),
      generateDownloadUrl: jest.fn().mockRejectedValue(
        new Error('ExpiredToken')
      ),
      deleteExpiredReports: jest.fn().mockResolvedValue(undefined),
    };

    const recommendationData = {
      recommendationId: 'rec-20240115-001',
      customerId: 'cust-12345',
      proposalApproach: 'Consultative sales approach with focus on ROI',
      confidenceScore: 85,
      rootCauseAnalysis: [
        {
          factor: 'Customer industry maturity',
          evidenceData: 'Tech sector with proven adoption history',
        },
        {
          factor: 'Budget alignment',
          evidenceData: 'Q1 budget allocation matches proposal cost',
        },
      ],
      successPatterns: [
        {
          patternId: 'pattern-tech-001',
          matchScore: 92,
          description: 'Similar tech company acquisition pattern',
        },
      ],
      generatedAt: new Date('2024-01-15T11:00:00Z').toISOString(),
    };

    const reportMetadata = {
      fileKey: 'recommendation-report-20240113-stale',
      uploadTimestamp: new Date('2024-01-13T11:00:00Z').toISOString(),
      expiresAt: new Date('2024-01-14T11:00:00Z').toISOString(),
    };

    expect(() =>
      generateRecommendationReportWithDownloadUrl(
        recommendationData,
        reportMetadata,
        mockFileStorageAdapter
      )
    ).toThrow(/ExpiredToken|DownloadUrl|有効期限/i);

    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      reportMetadata.fileKey
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});