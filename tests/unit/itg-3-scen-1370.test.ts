import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1370
  test('推奨根拠データが生成されていないとき、根拠が表示されない', () => {
    // Arrange: 推奨根拠データが null の場合のスタブレスポンス
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationId: 'REC-20240115-001',
        proposalApproach: 'クラウドシステム導入支援',
        confidenceScore: 85,
        reasoningData: null, // 推奨根拠が生成されていない
      }),
    };

    const customerInfo = {
      companyName: '株式会社サンプル',
      industry: '製造業',
      revenue: 50000000,
      budget: 5000000,
    };

    const dealCondition = {
      dealId: 'DEAL-20240115-001',
      stage: '初期提案',
      expectedCloseDate: '2024-03-31',
    };

    // Act: 推奨根拠の可視化機能を実行
    const result = explainRecommendationReasoning(
      mockAIRecommendationEngine.generateRecommendation(customerInfo, dealCondition),
      {
        displayFormat: 'html',
        includeScores: true,
      }
    );

    // Assert: 推奨根拠が表示されないことを検証
    expect(result.isVisible).toBe(false);
    expect(result.message).toMatch(/根拠情報が利用できません|根拠データが生成されていません/);
    expect(result.detailContent).toBeNull();
    expect(result.similarCases).toBeUndefined();
    expect(result.relevanceScore).toBeUndefined();
  });
});