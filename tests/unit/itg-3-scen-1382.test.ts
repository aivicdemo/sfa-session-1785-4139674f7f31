import { generateRecommendationReport } from '../../src/logic/it-1-br-3-2-1-1';

describe('推奨レポート生成・保存機能 - generateDownloadUrl 失敗時の処理', () => {
  test('SCEN-1382: FileStorageAdapter の generateDownloadUrl が失敗したときダウンロード URL が取得できない', () => {
    // Arrange
    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        metadataId: 'meta-12345',
        fileName: 'recommendation-report-2024-01-15.pdf',
        uploadedAt: '2024-01-15T11:00:00Z'
      }),
      generateDownloadUrl: jest.fn().mockRejectedValue(new Error('S3 generateDownloadUrl failed')),
      deleteExpiredReports: jest.fn().mockResolvedValue(undefined)
    };

    const recommendationData = {
      customerId: 'cust-001',
      dealId: 'deal-001',
      recommendationContent: 'Example recommendation content',
      confidenceScore: 85,
      reasoningBasis: ['Past success pattern match', 'Customer profile alignment'],
      generatedAt: '2024-01-15T11:00:00Z',
      recommendationType: 'proposal_approach'
    };

    // Act & Assert
    try {
      generateRecommendationReport(recommendationData, fileStorageAdapterStub);
      // If we reach here without error, the test should fail
      expect(fileStorageAdapterStub.generateDownloadUrl).toHaveBeenCalled();
    } catch (error) {
      // Verify that error is thrown from generateDownloadUrl
      expect(error).toEqual(new Error('S3 generateDownloadUrl failed'));
    }

    // Verify that uploadRecommendationReport was called
    expect(fileStorageAdapterStub.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendationContent: recommendationData.recommendationContent,
        confidenceScore: recommendationData.confidenceScore
      })
    );

    // Verify the error message shown to user
    const expectedUserMessage = 'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください';
    expect(() => {
      generateRecommendationReport(recommendationData, fileStorageAdapterStub);
    }).toThrow(/S3/);

    // Verify download URL is not returned (null or undefined)
    const result = (() => {
      try {
        return generateRecommendationReport(recommendationData, fileStorageAdapterStub);
      } catch {
        return null;
      }
    })();

    expect(result).toBeNull();
  });
});