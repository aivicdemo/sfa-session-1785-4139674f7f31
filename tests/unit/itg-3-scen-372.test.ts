import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-372
  test('[error] 推奨精度検証機能 - レポートファイル生成が失敗し、S3 アップロードが 2 回再試行後も失敗したとき、HTML形式代替表示が実行される', async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn(),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
    };

    const mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    const recommendationContent = {
      proposalId: 'PROP-2024-001',
      customerId: 'CUST-2024-001',
      trustScore: 85,
      recommendation: 'Propose tiered pricing model based on customer volume',
      rootCauses: [
        {
          factor: 'Customer procurement cycle',
          evidence: 'Historical purchase pattern shows 90-day cycle',
          weight: 0.35,
        },
        {
          factor: 'Competitive pressure',
          evidence: 'Market analysis indicates 3 competing vendors',
          weight: 0.25,
        },
        {
          factor: 'Budget availability Q3',
          evidence: 'Customer financial forecast shows allocation',
          weight: 0.4,
        },
      ],
      successPatterns: [
        {
          patternName: 'Enterprise Volume Discount',
          applicabilityScore: 92,
          pastCaseCount: 7,
        },
      ],
      timestamp: new Date('2024-01-15T14:30:00Z'),
    };

    mockRecommendationEngine.generateRecommendation.mockResolvedValue(
      recommendationContent
    );

    mockFileStorageAdapter.uploadRecommendationReport
      .mockRejectedValueOnce(new Error('S3 connection timeout'))
      .mockRejectedValueOnce(new Error('S3 access denied'))
      .mockRejectedValueOnce(new Error('S3 service unavailable'));

    const result = await generateRecommendationWithFallback(
      mockRecommendationEngine,
      mockFileStorageAdapter,
      mockLogger,
      {
        proposalId: 'PROP-2024-001',
        customerId: 'CUST-2024-001',
      }
    );

    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        proposalId: 'PROP-2024-001',
        customerId: 'CUST-2024-001',
      })
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(
      3
    );

    const htmlContent = result.content;
    expect(htmlContent).toContain('<html');
    expect(htmlContent).toContain('Propose tiered pricing model based on customer volume');
    expect(htmlContent).toContain('85');
    expect(htmlContent).toContain('Enterprise Volume Discount');
    expect(htmlContent).toContain('92');

    const errorLogs = mockLogger.error.mock.calls.filter((call) =>
      call[0]?.includes?.('Upload failed')
    );
    expect(errorLogs.length).toBeGreaterThan(0);
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('Upload failed after 2 retries')
    );

    expect(result.format).toBe('html');
    expect(result.displayMode).toBe('fallback');
    expect(result.fallbackReason).toBe(
      'Report generation failed after maximum retries. Displaying content in HTML format.'
    );

    expect(typeof result.content).toBe('string');
    expect(result.content.length).toBeGreaterThan(0);
  });
});