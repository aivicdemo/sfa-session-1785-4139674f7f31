import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1304
  test('推奨レポート生成・保存機能 - レポートメタデータが0件の場合に適切なエラーが返される', async () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const mockRecommendationId = 'rec-12345';
    const mockSalesOpportunityId = 'opp-67890';
    const mockGeneratedAt = '2024-01-15T11:00:00Z';

    const recommendationData = {
      recommendationId: mockRecommendationId,
      salesOpportunityId: mockSalesOpportunityId,
      generatedAt: mockGeneratedAt,
      content: {
        approachStrategy: '顧客の経営課題に基づいた段階的提案',
        confidence: 85,
        similarPatterns: [],
        rationale: '過去の成功事例との合致度が高い',
      },
    };

    const mockMetadataRepository = {
      findAll: jest.fn().mockResolvedValue([]),
    };

    let thrownError: any;
    try {
      await generateRecommendationReport(
        recommendationData,
        mockFileStorageAdapter,
        mockMetadataRepository
      );
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeDefined();
    expect(thrownError.statusCode).toBe(400);
    expect(thrownError.message).toMatch(/メタデータ/);
    expect(thrownError.errorCode).toBe('METADATA_EMPTY');
    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});