import { displayRecommendationRationale } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-888
  test('類似度スコアが昇順で並ぶ根拠データが降順に再ソートされて提示される', () => {
    // Arrange: AIRecommendationEngineのfindSimilarPatternsメソッドをスタブ化
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'pattern_001',
          customerIndustry: 'manufacturing',
          customerScale: 'large',
          proposalApproach: 'cost_reduction',
          similarityScore: 0.65,
          successRate: 0.78,
          caseCount: 12,
        },
        {
          patternId: 'pattern_002',
          customerIndustry: 'manufacturing',
          customerScale: 'large',
          proposalApproach: 'quality_improvement',
          similarityScore: 0.72,
          successRate: 0.82,
          caseCount: 18,
        },
        {
          patternId: 'pattern_003',
          customerIndustry: 'manufacturing',
          customerScale: 'large',
          proposalApproach: 'process_optimization',
          similarityScore: 0.88,
          successRate: 0.91,
          caseCount: 25,
        },
      ]),
    };

    const dealCondition = {
      customerId: 'cust_12345',
      customerIndustry: 'manufacturing',
      customerScale: 'large',
      dealAmount: 5000000,
      dealStage: 'proposal',
    };

    // Act: 推奨根拠データの提示機能を実行
    const result = displayRecommendationRationale(dealCondition, mockAIEngine);

    // Assert: 根拠データが類似度スコアの降順で再ソートされている
    expect(result.rationaleData).toHaveLength(3);
    expect(result.rationaleData[0].similarityScore).toBe(0.88);
    expect(result.rationaleData[0].patternId).toBe('pattern_003');
    expect(result.rationaleData[1].similarityScore).toBe(0.72);
    expect(result.rationaleData[1].patternId).toBe('pattern_002');
    expect(result.rationaleData[2].similarityScore).toBe(0.65);
    expect(result.rationaleData[2].patternId).toBe('pattern_001');

    // 最も関連性の高い根拠データ（スコア0.88）が最初に表示されることを確認
    expect(result.rationaleData[0].successRate).toBe(0.91);
    expect(result.rationaleData[0].caseCount).toBe(25);
  });
});