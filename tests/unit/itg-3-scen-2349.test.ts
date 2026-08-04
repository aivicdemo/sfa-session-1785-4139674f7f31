import { generateRecommendationReport } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2349
  test('[edge] 推奨内容のレポート生成・保存機能 - Amazon S3アップロード失敗時に2回までの再試行が実行される', async () => {
    const recommendationData = {
      recommendation_id: '12345',
      customer_id: 'CUST_001',
      deal_id: 'DEAL_001',
      recommendation_content: 'Recommended approach based on similar successful patterns',
      confidence_score: 85,
      reasoning_basis: [
        'Past case match with 92% similarity',
        'Customer profile aligned with success pattern',
        'Market timing favorable'
      ],
      generated_at: '2024-01-15T10:30:00Z'
    };

    const uploadTimestamps: number[] = [];
    let attemptCount = 0;

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(async (data: unknown, format: string, reportId: string) => {
        uploadTimestamps.push(Date.now());
        attemptCount++;

        if (attemptCount === 1) {
          // First call: network timeout error
          const error = new Error('Network timeout');
          (error as any).code = 'ETIMEDOUT';
          throw error;
        }

        if (attemptCount === 2) {
          // Second call: access denied error
          const error = new Error('Access denied to S3 bucket');
          (error as any).code = 'AccessDenied';
          throw error;
        }

        // Third call: success
        return {
          s3_key: `reports/recommendation_${reportId}.pdf`,
          bucket: 'sales-ai-reports',
          upload_timestamp: new Date('2024-01-15T10:30:13Z').toISOString(),
          file_size: 245632,
          content_type: 'application/pdf'
        };
      })
    };

    const result = await generateRecommendationReport(
      recommendationData,
      'PDF',
      '12345',
      mockFileStorageAdapter
    );

    // Verify retry logic execution
    expect(attemptCount).toBe(3);
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);

    // Verify retry timing: first retry after 3 seconds, second retry after 10 seconds
    const timingDelta1 = uploadTimestamps[1] - uploadTimestamps[0];
    const timingDelta2 = uploadTimestamps[2] - uploadTimestamps[1];

    expect(timingDelta1).toBeGreaterThanOrEqual(2900);
    expect(timingDelta1).toBeLessThanOrEqual(3100);
    expect(timingDelta2).toBeGreaterThanOrEqual(9900);
    expect(timingDelta2).toBeLessThanOrEqual(10100);

    // Verify successful upload result
    expect(result.status).toBe('success');
    expect(result.s3_key).toBe('reports/recommendation_12345.pdf');
    expect(result.bucket).toBe('sales-ai-reports');
    expect(result.upload_timestamp).toBe('2024-01-15T10:30:13Z');

    // Verify metadata recording
    expect(result.metadata).toEqual({
      status: 'success',
      s3_key: 'reports/recommendation_12345.pdf',
      upload_timestamp: '2024-01-15T10:30:13Z',
      retry_count: 2,
      total_duration_ms: expect.any(Number)
    });

    // Verify total duration is approximately 13 seconds (3 + 10)
    const totalDuration = result.metadata.total_duration_ms;
    expect(totalDuration).toBeGreaterThanOrEqual(12900);
    expect(totalDuration).toBeLessThanOrEqual(13100);

    // Verify all upload calls received correct parameters
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
      1,
      recommendationData,
      'PDF',
      '12345'
    );
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
      2,
      recommendationData,
      'PDF',
      '12345'
    );
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
      3,
      recommendationData,
      'PDF',
      '12345'
    );
  });
});