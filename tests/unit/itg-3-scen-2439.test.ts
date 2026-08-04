import { calculateRecommendationConfidenceScore } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2439
  test('推奨精度スコア算出機能 - 推奨内容の根拠情報が複数件のときすべてが信頼度スコアに反映される', () => {
    // 前提: AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue([
        { patternId: 'PATTERN_A', matchScore: 0.85 },
        { patternId: 'PATTERN_B', matchScore: 0.78 },
        { patternId: 'PATTERN_C', matchScore: 0.92 },
      ]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation((pattern) => {
          const scoreMap: { [key: string]: number } = {
            PATTERN_A: 0.85,
            PATTERN_B: 0.78,
            PATTERN_C: 0.92,
          };
          return scoreMap[pattern.patternId] || 0;
        }),
    };

    // テスト対象の商談条件
    const dealConditions = {
      customerIndustry: '製造業',
      budgetScale: 5000000,
      implementationUrgency: 'high',
    };

    // 推奨精度スコア算出機能を実行
    const confidenceScore = calculateRecommendationConfidenceScore(
      dealConditions,
      mockAIEngine,
    );

    // 期待結果: 3件の根拠情報すべての信頼度スコアが反映された計算結果
    // 計算式: (0.85 + 0.78 + 0.92) / 3 = 2.55 / 3 = 0.8166... ≈ 81.67
    const expectedConfidenceScore = 81.67;

    expect(confidenceScore).toBe(expectedConfidenceScore);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(dealConditions);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
  });
});