import { evaluatePatternRelevance, findSimilarPatterns, generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し新規案件に推奨する機能', () => {
  // SCEN-269
  test('成功パターンに重複が含まれるとき、一意のパターンのみ評価対象になる', () => {
    // Arrange: テスト用の過去商談データと成功パターン
    const duplicatePattern = {
      id: 'pattern-A',
      customerIndustry: 'manufacturing_large',
      budgetThreshold: 10000000,
      decisionMaker: 'factory_director',
      successRate: 0.82,
    };

    const uniquePattern = {
      id: 'pattern-B',
      customerIndustry: 'manufacturing_large',
      budgetThreshold: 8000000,
      decisionMaker: 'procurement_manager',
      successRate: 0.75,
    };

    // AIRecommendationEngineのスタブ: 重複を含む4パターン（同一パターン3件 + 異なるパターン1件）を返す
    const aiEngineStub = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        duplicatePattern,
        duplicatePattern,
        duplicatePattern,
        uniquePattern,
      ]),
      evaluatePatternRelevance: jest.fn((patterns) => {
        // パターン集合の一意性を確認し、各パターンのスコアを計算
        const uniquePatterns = Array.from(
          new Map(patterns.map((p) => [p.id, p])).values()
        );
        return uniquePatterns.map((pattern) => ({
          patternId: pattern.id,
          relevanceScore: pattern.successRate * 100,
          applicability: pattern.successRate >= 0.75,
        }));
      }),
      generateRecommendation: jest.fn((patterns, newCaseCondition) => {
        // 重複排除後のパターン集合から推奨内容を生成
        const uniquePatterns = Array.from(
          new Map(patterns.map((p) => [p.id, p])).values()
        );
        const applicablePatterns = uniquePatterns.filter(
          (p) => p.successRate >= 0.75
        );
        return {
          recommendedApproaches: applicablePatterns.map((p) => ({
            patternId: p.id,
            approach: `Apply pattern ${p.id} for ${newCaseCondition.customerIndustry}`,
            confidence: p.successRate,
          })),
          totalPatternsEvaluated: uniquePatterns.length,
          applicablePatternsCount: applicablePatterns.length,
        };
      }),
    };

    // 新規案件条件
    const newCaseCondition = {
      customerIndustry: 'manufacturing_large',
      budget: 15000000,
      decisionMaker: 'factory_director',
    };

    // Act: findSimilarPatternsを呼び出し、重複を含むパターンリストを取得
    const extractedPatterns = findSimilarPatterns(
      newCaseCondition,
      aiEngineStub
    );

    // evaluatePatternRelevanceを呼び出し、一意パターンのみで評価
    const relevanceResults = evaluatePatternRelevance(
      extractedPatterns,
      newCaseCondition,
      aiEngineStub
    );

    // generateRecommendationを呼び出し、推奨内容を生成
    const recommendation = generateRecommendation(
      extractedPatterns,
      newCaseCondition,
      aiEngineStub
    );

    // Assert: 重複排除後のパターン集合が一意な2件のみであること
    const uniquePatternIds = Array.from(
      new Set(extractedPatterns.map((p) => p.id))
    );
    expect(uniquePatternIds.length).toBe(2);
    expect(uniquePatternIds).toContain('pattern-A');
    expect(uniquePatternIds).toContain('pattern-B');

    // 評価対象のパターン数が2件であること
    expect(relevanceResults.length).toBe(2);

    // 推奨結果に含まれるパターン数が2件であること
    expect(recommendation.totalPatternsEvaluated).toBe(2);
    expect(recommendation.applicablePatternsCount).toBe(2);

    // 各パターンが1度ずつ評価されていること（重複による重み付け累積がないこと）
    expect(recommendation.recommendedApproaches.length).toBe(2);
    const recommendedPatternIds = recommendation.recommendedApproaches.map(
      (a) => a.patternId
    );
    expect(recommendedPatternIds).toEqual(['pattern-A', 'pattern-B']);

    // 推奨内容の信頼度スコアが各パターンの成功率に基づいているか確認
    const patternARecommendation = recommendation.recommendedApproaches.find(
      (a) => a.patternId === 'pattern-A'
    );
    expect(patternARecommendation?.confidence).toBe(0.82);

    const patternBRecommendation = recommendation.recommendedApproaches.find(
      (a) => a.patternId === 'pattern-B'
    );
    expect(patternBRecommendation?.confidence).toBe(0.75);
  });
});