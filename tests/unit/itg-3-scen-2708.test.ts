import { generateRecommendationReportWithRetry } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2708
  test('FileStorageAdapter.uploadRecommendationReportが2回目失敗したとき、10秒待機後に再試行される', async () => {
    const callTimestamps: number[] = [];
    let callCount = 0;

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(async () => {
        callTimestamps.push(Date.now());
        callCount++;

        if (callCount === 1) {
          throw new Error('S3 Upload Failed');
        }
        if (callCount === 2) {
          throw new Error('S3 Upload Failed');
        }
        if (callCount === 3) {
          return {
            success: true,
            fileKey: 'recommendations/report-2024-01-15.pdf',
            uploadedAt: '2024-01-15T11:05:00Z',
          };
        }
      }),
      generateDownloadUrl: jest.fn(async () => ({
        url: 'https://s3.amazonaws.com/signed-url',
        expiresAt: '2024-01-15T12:05:00Z',
      })),
      deleteExpiredReports: jest.fn(async () => ({ deleted: 0 })),
    };

    const recommendationData = {
      dealId: 'DEAL-001',
      customerId: 'CUST-123',
      recommendationContent: 'Proposal approach based on success pattern',
      confidenceScore: 87,
      reasoningBasis: ['Past similar case match', 'Customer segment alignment'],
      proposedApproachId: 'APPROACH-456',
      generatedAt: '2024-01-15T11:00:00Z',
    };

    const result = await generateRecommendationReportWithRetry(
      recommendationData,
      mockFileStorageAdapter,
    );

    expect(callTimestamps.length).toBe(3);
    expect(callTimestamps[1] - callTimestamps[0]).toBeGreaterThanOrEqual(10000);
    expect(callTimestamps[1] - callTimestamps[0]).toBeLessThan(11000);

    expect(result).toEqual({
      success: false,
      fallbackHtmlContent: expect.stringContaining(
        'Proposal approach based on success pattern',
      ),
      displayMethod: 'html',
      userCanSave: true,
    });

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(
      3,
    );
  });
});