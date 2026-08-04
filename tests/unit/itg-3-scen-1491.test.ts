import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  // SCEN-1491
  test('購買履歴データが1件のとき品質判定が実行される', () => {
    // Arrange: 購買履歴データが1件だけのテストケースを準備
    const purchaseHistoryInput = {
      purchaseHistories: [
        {
          purchaseId: 'PH-001',
          customerId: 'CUST-123',
          productId: 'PROD-456',
          purchaseDate: '2024-01-15',
          quantity: 5,
          amount: 50000
        }
      ],
      customerData: {
        customerId: 'CUST-123',
        industryType: '製造業',
        companySize: '中堅企業'
      }
    };

    // AIRecommendationEngineのスタブ作成
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.75,
        matchedPatterns: 1,
        applicabilityLevel: 'HIGH'
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn()
    };

    // Act: 品質判定機能を実行
    const result = evaluatePatternRelevance(
      purchaseHistoryInput,
      mockAIEngine
    );

    // Assert: 品質判定結果を検証
    expect(result).toEqual({
      dataCount: 1,
      judgmentStatus: '実行完了',
      evaluationScore: 0.75,
      executionLog: expect.objectContaining({
        executedAt: expect.any(String),
        aiEngineInvoked: true,
        patternRelevanceScore: 0.75
      })
    });

    // AIRecommendationEngineのevaluatePatternRelevanceが呼び出されたことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      purchaseHistoryInput
    );

    // 評価スコアが0.0～1.0の範囲内であることを確認
    expect(result.evaluationScore).toBeGreaterThanOrEqual(0.0);
    expect(result.evaluationScore).toBeLessThanOrEqual(1.0);

    // エラーが発生していないことを確認
    expect(result.judgmentStatus).toBe('実行完了');
  });
});