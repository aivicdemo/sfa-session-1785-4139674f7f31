import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用推奨機能', () => {
  test('SCEN-1586: 適用可能性スコアが負の値のとき、エラーが発生する', () => {
    // Arrange
    const customerId = 'CUST-001';
    const dealCondition = {
      dealType: '新規案件',
      budgetAmount: 5000000,
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: -0.5,
      }),
    };

    // Act & Assert
    const error = new Error();
    try {
      evaluatePatternRelevance(
        customerId,
        dealCondition,
        mockAIRecommendationEngine
      );
      fail('エラーが発生するはずですが、発生しませんでした');
    } catch (e: any) {
      expect(e.code).toBe('INVALID_RELEVANCE_SCORE');
      expect(e.message).toMatch(/適用可能性スコア/);
      expect(e.statusCode).toBe(400);
    }
  });
});