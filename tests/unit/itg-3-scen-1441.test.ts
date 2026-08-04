import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AI推奨生成 - 商談条件データ欠落時のフォールバック', () => {
  // SCEN-1441
  test('商談条件データが欠落しているとき、推奨生成がスキップされ、統計上位パターンとフォールバックメッセージが返却される', () => {
    // Arrange: 商談条件データで必須フィールド（顧客名）が null の状態
    const incompleteConditions = {
      customerName: null,
      industry: 'IT',
      budget: 5000000,
      decisionTimeline: '2024-Q2'
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // Act: incompleteConditions を入力として generateRecommendation を呼び出す
    const result = generateRecommendation(incompleteConditions, mockAIEngine);

    // Assert: 外部 OpenAI API 呼び出しが実行されないことを確認
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();

    // Assert: 戻り値が推奨パターンマスタから取得した統計上位パターンとメッセージを含む
    expect(result).toEqual({
      recommendation: {
        pattern: '標準提案アプローチ_v1',
        description: '初期段階での信頼構築と課題ヒアリング',
        successRate: 0.72
      },
      reasoning: '過去実績に基づいた推奨',
      message: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    });
  });
});