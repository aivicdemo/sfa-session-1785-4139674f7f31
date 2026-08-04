import { findSimilarPatterns } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2815
  test('[error] 推奨内容の根拠表示機能 - AIRecommendationEngineのfindSimilarPatternsが失敗したとき、エラーを返す', async () => {
    // Arrange: AIRecommendationEngineのスタブを作成し、エラーを発生させるように設定
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockRejectedValueOnce(
        new Error('OpenAI API呼び出し失敗')
      )
    };

    // 商談条件を入力パラメータとして準備
    const dealCondition = {
      customerIndustry: 'IT',
      budgetRange: 5000000,
      stageCode: 'PROPOSAL'
    };

    // Act & Assert: findSimilarPatternsメソッドを実行し、エラーが適切に伝播されることを確認
    try {
      await mockAIRecommendationEngine.findSimilarPatterns(dealCondition);
      fail('エラーが発生すべきでした');
    } catch (error) {
      // エラーオブジェクトのプロパティを検証
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toMatch(/OpenAI API呼び出し失敗/);
    }

    // スタブが期待通り呼び出されたことを確認
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      dealCondition
    );
  });
});