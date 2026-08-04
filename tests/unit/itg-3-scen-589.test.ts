import { uploadRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - レポートファイル生成・保存', () => {
  // SCEN-589
  test('FileStorageAdapter.uploadRecommendationReportが初回失敗後2回目で成功するとき最終的にS3に保存される', async () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          fileKey: 'recommendations/report-20240115-001.pdf',
          eTag: '"abc123def456"',
          uploadCompletedAt: '2024-01-15T11:30:45Z',
          fileSize: 2048576,
          contentType: 'application/pdf'
        })
    };

    const mockRecommendationData = {
      recommendationId: 'REC-20240115-001',
      customerId: 'CUST-00001',
      proposalApproachId: 'PA-20240115-001',
      confidenceScore: 92,
      recommendedTiming: '2024-01-20T10:00:00Z',
      recommendedQuantity: 150,
      rootCausePatterns: [
        {
          patternId: 'PAT-001',
          patternName: '初回提案から2週間以内のフォローアップ',
          matchScore: 0.95,
          pastSuccessCount: 47
        }
      ],
      recommendationReasoning: 'Past similar customer patterns show 95% success rate with this timing approach',
      generatedAt: '2024-01-15T11:00:00Z'
    };

    let retryAttempts = 0;
    const startTime = Date.now();

    try {
      const result = await uploadRecommendationReport(
        mockFileStorageAdapter,
        mockRecommendationData
      );

      retryAttempts = mockFileStorageAdapter.uploadRecommendationReport.mock.calls.length;
      const elapsedTime = Date.now() - startTime;

      expect(retryAttempts).toBe(2);
      expect(elapsedTime).toBeGreaterThanOrEqual(3000);
      expect(result).toEqual({
        fileKey: 'recommendations/report-20240115-001.pdf',
        eTag: '"abc123def456"',
        uploadCompletedAt: '2024-01-15T11:30:45Z',
        fileSize: 2048576,
        contentType: 'application/pdf'
      });
      expect(result.fileKey).toMatch(/^recommendations\//);
      expect(result.contentType).toBe('application/pdf');
    } catch (error) {
      fail('uploadRecommendationReport should succeed after retry');
    }
  });
});