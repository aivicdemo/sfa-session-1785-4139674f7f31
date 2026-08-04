import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1866
  test('[error] 推奨内容の根拠表示機能 - 根拠となる過去事例データが0件のとき根拠表示に失敗する', () => {
    // Arrange
    const recommendationId = 'rec-20240115-001';
    const customerId = 'cust-test-tarou';
    const customerName = 'テスト太郎';
    const industry = '製造業';
    const budget = 5000000;
    const currentProposalApproach = 'デジタル化推進による業務効率化';

    const mockSimilarPatterns: Array<{
      patternId: string;
      successRate: number;
      customerCount: number;
      description: string;
    }> = [];

    const mockRecommendationContent = {
      recommendedApproach: '製造業向けERP導入による生産管理最適化',
      confidenceScore: 65,
      estimatedClosingRate: 0.45,
      proposedTimeline: '3ヶ月',
    };

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue(mockSimilarPatterns),
      generateRecommendation: jest.fn().mockReturnValue(mockRecommendationContent),
      explainRecommendationReasoning: jest.fn().mockImplementation(() => {
        throw new Error('ExplainRecommendationReasoning failed: No similar patterns found (0 records)');
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    const consoleLogSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act & Assert
    const result = explainRecommendationReasoning(
      recommendationId,
      {
        customerId,
        customerName,
        industry,
        budget,
      },
      currentProposalApproach,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      success: false,
      errorMessage: '根拠表示に失敗しました。推奨内容は表示されていますが、参考となる過去事例が見つかりませんでした',
      reasoningSection: '根拠データなし',
      fallbackPatterns: expect.arrayContaining([
        expect.objectContaining({
          patternId: expect.any(String),
          successRate: expect.any(Number),
          description: expect.any(String),
        }),
      ]),
      consoleErrorLogged: true,
    });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('ExplainRecommendationReasoning failed: No similar patterns found (0 records)')
    );

    consoleLogSpy.mockRestore();
  });
});