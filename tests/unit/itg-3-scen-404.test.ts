import { validateInferenceAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推論精度検証機能 - 推奨根拠の可視化', () => {
  // SCEN-404
  test('同じ入力条件で精度検証を2回実行したとき、同じ精度計測結果が返却される', () => {
    // Arrange: AIRecommendationEngineのスタブを初期化
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn(() => ({
        recommendationId: 'rec-001',
        patterns: [
          {
            patternId: 'pat-001',
            matchScore: 0.87,
            customerType: '製造業',
            dealStage: '提案準備',
            projectSize: 5000000,
          },
          {
            patternId: 'pat-002',
            matchScore: 0.85,
            customerType: '製造業',
            dealStage: '提案準備',
            projectSize: 5000000,
          },
          {
            patternId: 'pat-003',
            matchScore: 0.86,
            customerType: '製造業',
            dealStage: '提案準備',
            projectSize: 5000000,
          },
        ],
      })),
      findSimilarPatterns: jest.fn(() => [
        { patternId: 'pat-001', similarity: 0.87 },
        { patternId: 'pat-002', similarity: 0.85 },
        { patternId: 'pat-003', similarity: 0.86 },
        { patternId: 'pat-004', similarity: 0.84 },
        { patternId: 'pat-005', similarity: 0.83 },
      ]),
      evaluatePatternRelevance: jest.fn(() => ({
        relevanceScore: 85,
        applicablePatternCount: 5,
      })),
    };

    // 入力条件を設定
    const inputCondition = {
      customerIndustry: '製造業',
      dealStage: '提案準備',
      projectSize: 5000000,
      minPatternMatchThreshold: 0.85,
    };

    // Act: 1回目の精度検証実行
    const firstResult = validateInferenceAccuracy(
      inputCondition,
      mockRecommendationEngine
    );

    // Assert: 1回目の結果を検証
    expect(firstResult).toBeDefined();
    expect(firstResult.accuracyScore).toBe(85);
    expect(firstResult.matchingPatternCount).toBe(5);
    expect(firstResult.recommendedPatternCount).toBe(3);
    expect(firstResult.recommendedPatternIds).toEqual([
      'pat-001',
      'pat-002',
      'pat-003',
    ]);

    // Act: 2回目の精度検証実行（同じ入力条件）
    const secondResult = validateInferenceAccuracy(
      inputCondition,
      mockRecommendationEngine
    );

    // Assert: 1回目と2回目の結果を完全に比較
    expect(secondResult).toBeDefined();
    expect(secondResult.accuracyScore).toBe(firstResult.accuracyScore);
    expect(secondResult.matchingPatternCount).toBe(
      firstResult.matchingPatternCount
    );
    expect(secondResult.recommendedPatternCount).toBe(
      firstResult.recommendedPatternCount
    );
    expect(secondResult.recommendedPatternIds).toEqual(
      firstResult.recommendedPatternIds
    );

    // 詳細検証: 配列の要素順序と内容も完全一致
    expect(secondResult.recommendedPatternIds).toEqual([
      'pat-001',
      'pat-002',
      'pat-003',
    ]);
    expect(secondResult.accuracyScore).toBe(85);
    expect(secondResult.matchingPatternCount).toBe(5);
    expect(secondResult.recommendedPatternCount).toBe(3);
  });
});