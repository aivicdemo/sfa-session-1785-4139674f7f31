import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2922
  test('Amazon S3連携 - uploadRecommendationReport呼び出しが失敗した場合、最大2回の再試行が決められた振る舞いで実行される', async () => {
    let uploadAttemptCount = 0;
    const uploadTimestamps: number[] = [];

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(async () => {
        uploadAttemptCount += 1;
        uploadTimestamps.push(Date.now());

        if (uploadAttemptCount <= 2) {
          const error = new Error('S3 Upload failed');
          (error as any).code = 'NetworkError';
          throw error;
        }

        return {
          bucketName: 'test-bucket',
          objectKey: 'recommendations/test-report-001.pdf',
          uploadedAt: '2024-01-15T12:00:00Z',
          downloadUrl: 'https://s3.amazonaws.com/test-bucket/recommendations/test-report-001.pdf'
        };
      })
    };

    const recommendationInput = {
      customerId: 'CUST-12345',
      dealId: 'DEAL-67890',
      recommendedApproach: 'Account-based selling with executive sponsorship',
      confidenceScore: 85,
      supportingEvidenceList: [
        {
          evidenceType: 'past_similar_deal',
          dealId: 'DEAL-11111',
          similarity: 0.92,
          outcomeStatus: 'won'
        },
        {
          evidenceType: 'customer_pattern',
          patternId: 'PAT-22222',
          matchScore: 0.88
        }
      ],
      riskFactors: [
        {
          riskId: 'RISK-001',
          description: 'Long procurement cycle',
          mitigationStrategy: 'Early stakeholder engagement'
        }
      ],
      nextActionRecommendation: 'Schedule executive presentation'
    };

    await generateRecommendationReport(recommendationInput, mockFileStorageAdapter);

    expect(uploadAttemptCount).toBe(3);
    expect(uploadTimestamps.length).toBe(3);

    const timeDiffFirstToSecond = uploadTimestamps[1] - uploadTimestamps[0];
    const timeDiffSecondToThird = uploadTimestamps[2] - uploadTimestamps[1];

    expect(timeDiffFirstToSecond).toBeGreaterThanOrEqual(3000);
    expect(timeDiffFirstToSecond).toBeLessThan(3500);

    expect(timeDiffSecondToThird).toBeGreaterThanOrEqual(10000);
    expect(timeDiffSecondToThird).toBeLessThan(10500);

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);
  });
});