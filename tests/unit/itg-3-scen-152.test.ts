import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能 - 複数パターン部分一致時の複数アプローチ推奨', () => {
  test('SCEN-152: 新規案件が複数の成功パターンに部分一致する場合、複数アプローチが関連度スコア順にソートされて返却される', () => {
    // Arrange: AIRecommendationEngineのスタブを定義
    const mockSuccessPatternA = {
      patternId: 'A',
      industry: '製造業',
      budgetMin: 30000000,
      budgetMax: 70000000,
      decisionMakersMin: 2,
      decisionMakersMax: 4,
      implementationMonthsMin: 5,
      implementationMonthsMax: 7,
      relevanceScore: 0.85,
    };

    const mockSuccessPatternB = {
      patternId: 'B',
      industry: '製造業',
      budgetMin: 40000000,
      budgetMax: 60000000,
      decisionMakersMin: 3,
      decisionMakersMax: 5,
      implementationMonthsMin: 6,
      implementationMonthsMax: 8,
      relevanceScore: 0.82,
    };

    const mockSimilarPatterns = [
      mockSuccessPatternA,
      mockSuccessPatternB,
    ];

    const mockRecommendedApproaches = [
      {
        approachName: '提案アプローチ1：段階的導入プラン',
        relevanceScore: 0.85,
        successPatternId: 'A',
        reasoning: '過去事例から同規模の製造業では段階的導入により導入リスクが低減',
      },
      {
        approachName: '提案アプローチ2：並行運用体制構築プラン',
        relevanceScore: 0.82,
        successPatternId: 'B',
        reasoning: '複数の意思決定者がいる場合、並行運用体制による合意形成が効果的',
      },
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(mockSimilarPatterns),
      generateRecommendation: jest.fn().mockResolvedValue(mockRecommendedApproaches),
      explainRecommendationReasoning: jest.fn((approachId: string) => {
        if (approachId === 'A') {
          return Promise.resolve('過去事例から同規模の製造業では段階的導入により導入リスクが低減');
        }
        if (approachId === 'B') {
          return Promise.resolve('複数の意思決定者がいる場合、並行運用体制による合意形成が効果的');
        }
        return Promise.resolve('');
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({ applicable: true }),
    };

    const newDealCondition = {
      industry: '製造業',
      budgetAmount: 50000000,
      decisionMakers: 3,
      implementationMonths: 6,
    };

    // Act: generateRecommendationを実行
    const result = generateRecommendation(newDealCondition, mockAIEngine);

    // Assert: 推奨アプローチの配列長が2であることを確認
    expect(result).toHaveLength(2);

    // Assert: 第1要素の検証
    expect(result[0]).toEqual({
      approachName: '提案アプローチ1：段階的導入プラン',
      relevanceScore: 0.85,
      successPatternId: 'A',
      reasoning: '過去事例から同規模の製造業では段階的導入により導入リスクが低減',
    });

    // Assert: 第2要素の検証
    expect(result[1]).toEqual({
      approachName: '提案アプローチ2：並行運用体制構築プラン',
      relevanceScore: 0.82,
      successPatternId: 'B',
      reasoning: '複数の意思決定者がいる場合、並行運用体制による合意形成が効果的',
    });

    // Assert: 関連度スコアが降順でソートされていることを確認
    expect(result[0].relevanceScore).toBeGreaterThan(result[1].relevanceScore);
    expect(result[0].relevanceScore).toBe(0.85);
    expect(result[1].relevanceScore).toBe(0.82);

    // Assert: 各要素に必須フィールドが含まれることを確認
    result.forEach((approach) => {
      expect(approach).toHaveProperty('approachName');
      expect(approach).toHaveProperty('relevanceScore');
      expect(approach).toHaveProperty('successPatternId');
      expect(approach).toHaveProperty('reasoning');
      expect(typeof approach.approachName).toBe('string');
      expect(typeof approach.relevanceScore).toBe('number');
      expect(typeof approach.successPatternId).toBe('string');
      expect(typeof approach.reasoning).toBe('string');
    });

    // Assert: AIEngineのメソッドが適切に呼ばれたことを確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealCondition);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalled();
  });
});