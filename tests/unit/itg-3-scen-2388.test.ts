import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2388
  test('推論精度スコア算出機能 - 顧客対応パターン分析結果が空配列のときエラーを発生させる', () => {
    const emptyAnalysisResults: any[] = [];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() => {
      calculateInferenceAccuracyScore(
        emptyAnalysisResults,
        mockAIRecommendationEngine
      );
    }).toThrow(/顧客対応パターン分析結果が空/);
  });
});