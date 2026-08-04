import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1104
  test('推奨根拠の信頼度スコアが1を超過したとき、根拠表示処理がエラーになる', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(1.5),
    };

    const recommendationId = 'rec-12345';
    const customerConditions = {
      industry: '製造業',
      scale: '中堅企業',
      revenue: 5000000000,
    };
    const dealConditions = {
      productCategory: 'ERP',
      dealStage: '提案段階',
      customerChallenges: ['業務効率化', 'システム統合'],
    };

    try {
      explainRecommendationReasoning(
        recommendationId,
        customerConditions,
        dealConditions,
        mockAIRecommendationEngine
      );
      fail('エラーが発生すべき');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      expect(errorMessage).toMatch(/信頼度スコア/);
      expect(errorMessage).toMatch(/許容範囲/);
      expect(errorMessage).toMatch(/0\.0～1\.0/);

      const errorStack = error instanceof Error ? error.stack : '';
      expect(errorStack).toMatch(/Invalid confidence score/);
      expect(errorStack).toMatch(/1\.5/);
      expect(errorStack).toMatch(/1\.0/);

      expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
      expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    }
  });
});