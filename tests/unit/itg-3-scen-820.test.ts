import { recordRecommendationHistory } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-820
  test('[normal] 推奨履歴記録機能 - 推奨生成時に推奨内容・根拠・信頼度スコアが推奨履歴テーブルに記録される', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationContent: '顧客Aの過去成功パターンに基づき、提案アプローチXを推奨',
        reasoning: '類似度85%の過去事例Bで同一顧客セグメントに対して成功',
        relevanceScore: 0.87,
      }),
    };

    const customerCondition = {
      customerSegment: 'エンタープライズ',
      dealAmount: 5000000,
      industry: 'IT',
      companySize: '1000人以上',
    };

    const beforeTime = new Date('2024-01-15T11:00:00Z');
    const testTime = new Date('2024-01-15T11:00:00Z');
    const afterTime = new Date('2024-01-15T11:00:01Z');

    const result = await recordRecommendationHistory(
      customerCondition,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      recommendationContent: '顧客Aの過去成功パターンに基づき、提案アプローチXを推奨',
      reasoning: '類似度85%の過去事例Bで同一顧客セグメントに対して成功',
      confidenceScore: 0.87,
      createdAt: testTime,
      recordId: expect.any(String),
    });

    expect(result.confidenceScore).toBe(0.87);
    expect(result.recommendationContent).toBe(
      '顧客Aの過去成功パターンに基づき、提案アプローチXを推奨'
    );
    expect(result.reasoning).toBe(
      '類似度85%の過去事例Bで同一顧客セグメントに対して成功'
    );
    expect(result.createdAt.getTime()).toBeGreaterThanOrEqual(
      beforeTime.getTime()
    );
    expect(result.createdAt.getTime()).toBeLessThanOrEqual(afterTime.getTime());

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      customerCondition
    );
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(
      1
    );
  });
});