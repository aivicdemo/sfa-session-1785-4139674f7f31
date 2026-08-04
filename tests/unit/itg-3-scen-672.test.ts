import { getRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・推奨機能', () => {
  test('SCEN-672: OpenAI API呼び出しが3回連続で失敗した場合、内部推奨パターンマスタから簡略版を返す', async () => {
    // Arrange: AIRecommendationEngineのスタブを3回連続で失敗するよう設定
    let attemptCount = 0;
    const failingAIRecommendationEngine = {
      generateRecommendation: async () => {
        attemptCount++;
        const error = new Error('API call failed');
        throw error;
      },
      findSimilarPatterns: async () => {
        throw new Error('API call failed');
      },
      explainRecommendationReasoning: async () => {
        throw new Error('API call failed');
      },
      evaluatePatternRelevance: async () => {
        throw new Error('API call failed');
      }
    };

    const newProjectConditions = {
      industry: 'IT',
      budgetScale: '5000000',
      decisionDeadline: '30'
    };

    // Act: getRecommendation()を呼び出し、3回の再試行を経て内部パターンマスタから返却される
    const result = await getRecommendation(
      newProjectConditions,
      failingAIRecommendationEngine
    );

    // Assert: 推奨パターンマスタから統計的に上位のパターンが返却されることを確認
    expect(result.recommendedPatternId).toBe('PATTERN_IT_500M_30D');
    expect(result.patternName).toBe('IT案件・500万規模・1ヶ月決定型');
    expect(result.successRate).toBe(0.72);
    
    // 簡略版の根拠説明であることを確認
    expect(result.simplifiedExplanation).toBe('過去同条件の成功事例72件から推奨します');
    
    // 詳細なAI生成根拠は含まれないことを確認
    expect(result.reasoning).toBeUndefined();
    
    // 必須フィールドが全て含まれていることを確認
    expect(result).toHaveProperty('recommendedPatternId');
    expect(result).toHaveProperty('patternName');
    expect(result).toHaveProperty('successRate');
    expect(result).toHaveProperty('simplifiedExplanation');
  });
});