import { calculateRecommendationTrustScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨支援システム - 推奨根拠可視化機能', () => {
  // SCEN-786
  test('推奨信頼度スコア算出機能 - 信頼度スコアがちょうど0のとき正常に返却される', () => {
    // Arrange: 推奨信頼度スコア算出に必要な入力パラメータを定義
    const dealCondition = {
      customerSize: 'mid_market',
      industry: 'manufacturing',
      budgetAmount: 5000000,
    };

    // AIRecommendationEngine をモック化し、evaluatePatternRelevance が 0.0 を返すようにスタブ設定
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.0),
    };

    // Act: 推奨信頼度スコア算出関数を呼び出し、スコア値 0.0 を入力
    const response = calculateRecommendationTrustScore(dealCondition, mockAIEngine);

    // Assert: 返却されたレスポンスオブジェクトを検証
    expect(response).toEqual({
      trustScore: 0.0,
      scoreStatus: 'no_match',
      recommendationAvailable: false,
      errorMessage: null,
      httpStatusCode: 200,
    });

    // 内部ロジックが信頼度スコア 0.0 に対して正常系の処理フロー（例外発生なし）を通ったことをアサート
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(dealCondition);
  });
});