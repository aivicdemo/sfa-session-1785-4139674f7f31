import { recordRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1824
  test('[normal] 推奨根拠情報の統合機能 - 推奨根拠データが推奨履歴テーブルに正確に記録される', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-2024-001',
        recommendationContent: '顧客A向け提案アプローチX',
        reasoningScore: 0.92,
        similarCasesCount: 5,
        reasoningDescription: '過去3年間の類似顧客5社で同一アプローチの成約率が85%',
        generatedTimestamp: '2024-01-15T10:30:45Z',
      }),
    };

    const mockDatabase = {
      insertRecommendationHistory: jest.fn().mockResolvedValue({
        recommendationId: 'REC-2024-001',
        userId: 'USER-2024-001',
        recommendationContent: '顧客A向け提案アプローチX',
        reasoningScore: 0.92,
        similarCasesCount: 5,
        reasoningDescription: '過去3年間の類似顧客5社で同一アプローチの成約率が85%',
        recordedTimestamp: '2024-01-15T10:30:45Z',
        recordCreatedAt: '2024-01-15T10:30:45Z',
      }),
      selectRecommendationHistory: jest.fn().mockResolvedValue({
        recommendationId: 'REC-2024-001',
        userId: 'USER-2024-001',
        recommendationContent: '顧客A向け提案アプローチX',
        reasoningScore: 0.92,
        similarCasesCount: 5,
        reasoningDescription: '過去3年間の類似顧客5社で同一アプローチの成約率が85%',
        recordedTimestamp: '2024-01-15T10:30:45Z',
        recordCreatedAt: '2024-01-15T10:30:45Z',
      }),
    };

    const inputRequest = {
      userId: 'USER-2024-001',
      customerIndustry: '製造業',
      budgetAmount: 5000000,
      considerationPeriodMonths: 3,
    };

    const result = await recordRecommendationReasoning(
      inputRequest,
      mockAIRecommendationEngine,
      mockDatabase
    );

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      inputRequest
    );

    expect(mockDatabase.insertRecommendationHistory).toHaveBeenCalledWith({
      recommendationId: 'REC-2024-001',
      userId: 'USER-2024-001',
      recommendationContent: '顧客A向け提案アプローチX',
      reasoningScore: 0.92,
      similarCasesCount: 5,
      reasoningDescription: '過去3年間の類似顧客5社で同一アプローチの成約率が85%',
      recordedTimestamp: '2024-01-15T10:30:45Z',
    });

    expect(result).toEqual({
      recommendationId: 'REC-2024-001',
      userId: 'USER-2024-001',
      recommendationContent: '顧客A向け提案アプローチX',
      reasoningScore: 0.92,
      similarCasesCount: 5,
      reasoningDescription: '過去3年間の類似顧客5社で同一アプローチの成約率が85%',
      recordedTimestamp: '2024-01-15T10:30:45Z',
      recordCreatedAt: '2024-01-15T10:30:45Z',
    });

    expect(result.recommendationId).toBe('REC-2024-001');
    expect(result.reasoningScore).toBe(0.92);
    expect(result.similarCasesCount).toBe(5);
    expect(result.recordedTimestamp).toBe('2024-01-15T10:30:45Z');
  });
});