import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン照合機能 - 顧客条件0個の場合', () => {
  test('SCEN-897: 顧客条件が0個入力されたとき照合ロジックが成立しない', async () => {
    // テスト用のスタブ設定
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const emptyConditions: any[] = [];

    // 照合ロジックを実行
    const result = await findSimilarPatterns(
      emptyConditions,
      mockAIEngine,
    );

    // 期待結果: findSimilarPatternsが空配列を受け取って実行される
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(emptyConditions);

    // 照合ロジックが成立せず、代替提案フローに切り替わることを検証
    expect(result).toEqual({
      status: 'fallback',
      message: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      recommendedPatterns: [],
      cacheUsed: true,
    });

    // evaluatePatternRelevanceが呼び出されていないことを検証
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();

    // findSimilarPatternsの呼び出し回数を検証
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
  });
});