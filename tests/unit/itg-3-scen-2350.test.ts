import { generateRecommendationReport } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - レポート生成・保存', () => {
  // SCEN-2350
  test('生成されたダウンロードURLの有効期限が正確に設定される', async () => {
    const baseTimestamp = new Date('2024-01-15T11:00:00Z').getTime();
    const expirationDurationSeconds = 3600;
    const toleranceSeconds = 1;

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileKey: 'test-report-key-001',
        uploadedAt: new Date('2024-01-15T11:00:00Z').toISOString(),
      }),
      generateDownloadUrl: jest.fn((fileKey: string, expirationSecs: number) => {
        const generatedAtTimestamp = new Date('2024-01-15T11:00:15Z').getTime();
        const expirationTimestamp = generatedAtTimestamp + expirationSecs * 1000;
        return Promise.resolve({
          downloadUrl: `https://s3.example.com/${fileKey}?exp=${expirationTimestamp}`,
          expiresAt: new Date(expirationTimestamp).toISOString(),
          expirationTimestampMs: expirationTimestamp,
        });
      }),
    };

    const mockAiRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        proposalApproach: 'approach-001',
        confidenceScore: 85,
        reasoningBasis: ['past-success-pattern-001', 'customer-fit-002'],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: 'Based on similar customer pattern',
      }),
    };

    const recommendationData = {
      dealId: 'deal-001',
      customerId: 'cust-001',
      confidenceScore: 85,
      proposedApproach: 'strategy-001',
      evidenceDataPoints: ['pattern-001', 'pattern-002'],
      rootCauseAnalysis: 'Market timing alignment',
    };

    const reportContent = {
      title: 'AI推奨内容根拠レポート',
      generatedAt: new Date('2024-01-15T11:00:00Z').toISOString(),
      recommendation: recommendationData,
    };

    const result = await generateRecommendationReport(
      reportContent,
      mockFileStorageAdapter,
      mockAiRecommendationEngine
    );

    const downloadUrlResult = await mockFileStorageAdapter.generateDownloadUrl(
      result.fileKey,
      expirationDurationSeconds
    );

    const generatedAtMs = new Date('2024-01-15T11:00:15Z').getTime();
    const expectedExpirationMs = generatedAtMs + expirationDurationSeconds * 1000;
    const actualExpirationMs = downloadUrlResult.expirationTimestampMs;
    const differenceSeconds = Math.abs(
      (actualExpirationMs - expectedExpirationMs) / 1000
    );

    expect(differenceSeconds).toBeLessThanOrEqual(toleranceSeconds);
    expect(downloadUrlResult.expiresAt).toBeDefined();
    expect(typeof downloadUrlResult.downloadUrl).toBe('string');
    expect(downloadUrlResult.downloadUrl).toContain('s3.example.com');

    // 複数回生成での一貫性検証
    const secondUrlResult = await mockFileStorageAdapter.generateDownloadUrl(
      result.fileKey,
      expirationDurationSeconds
    );

    const secondGeneratedAtMs = new Date('2024-01-15T11:00:15Z').getTime();
    const secondExpectedExpirationMs =
      secondGeneratedAtMs + expirationDurationSeconds * 1000;
    const secondActualExpirationMs = secondUrlResult.expirationTimestampMs;
    const secondDifferenceSeconds = Math.abs(
      (secondActualExpirationMs - secondExpectedExpirationMs) / 1000
    );

    expect(secondDifferenceSeconds).toBeLessThanOrEqual(toleranceSeconds);
    expect(secondUrlResult.expiresAt).toBeDefined();
    expect(
      mockFileStorageAdapter.generateDownloadUrl
    ).toHaveBeenCalledTimes(2);
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      result.fileKey,
      expirationDurationSeconds
    );
  });
});