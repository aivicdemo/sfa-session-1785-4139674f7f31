import { presentExecutiveSummaryWithDivergenceOnly } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 管理職向け数値化結果の提示', () => {
  // SCEN-2192
  test('マッチスコア計算失敗時、乖離スコアのみが提示される', () => {
    // Arrange: スタブの設定
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockRejectedValueOnce(
        new Error('マッチスコア計算失敗')
      ),
      findSimilarPatterns: jest.fn().mockResolvedValueOnce({
        divergenceScore: 0.85,
        similarPatterns: [
          {
            patternId: 'PAT-001',
            similarity: 0.87,
            customerIndustry: '製造業',
            proposalAmount: 5000000,
          },
        ],
      }),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const dealConditions = {
      customerIndustry: '製造業',
      proposalAmount: 5000000,
      pastSimilarityLevel: 'high',
      dealId: 'DEAL-12345',
      customerId: 'CUST-67890',
    };

    // Act
    const response = presentExecutiveSummaryWithDivergenceOnly(
      dealConditions,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    // Assert: レスポンスオブジェクトの検証
    expect(response.divergenceScore).toBe(0.85);
    expect(response.matchScore).toBeUndefined();
    expect(response.userMessage).toBe(
      'マッチスコアの計算に失敗したため、乖離スコアのみを表示します'
    );
    expect(response.displayDivergenceScore).toBe('85%');
    expect(response.displayMatchScore).toBeNull();
    expect(response.isMatchScoreCalculationFailed).toBe(true);

    // Assert: FileStorageAdapterへのアップロード呼び出しが発生しないことを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();

    // Assert: AIRecommendationEngineの呼び出しを確認
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      dealConditions
    );
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      dealConditions
    );
  });
});