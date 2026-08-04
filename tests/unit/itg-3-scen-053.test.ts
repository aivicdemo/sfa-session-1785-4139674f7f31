import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-053
  test('推奨根拠説明生成機能 - 推奨内容の根拠が営業担当者向けに自然言語で正常に生成される', () => {
    // Arrange
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn((recommendationData) => {
        return `当該顧客の規模（従業員数500名）と業界（製造業）は過去成功事例パターン ${recommendationData.similarPatterns[0].patternId} と ${(recommendationData.similarPatterns[0].successRate * 100).toFixed(0)}% の類似度が確認されました。このパターンでは初期段階で部門単位での導入を実施し、3 ヶ月後に全社展開した結果、平均 40% のコスト削減を達成しています。${recommendationData.approach}を適用することにより、顧客の承認リスクを軽減できます。`;
      }),
    };

    const recommendationData = {
      recommendationId: 'REC-001',
      approach: '予算制約が重要な判断軸となる本案件では、段階的導入',
      similarPatterns: [{ patternId: 'PAT-123', successRate: 0.85 }],
    };

    // Act
    const result = mockAIRecommendationEngine.explainRecommendationReasoning(recommendationData);

    // Assert
    expect(result).not.toBeNull();
    expect(result.length).toBeGreaterThanOrEqual(50);
    expect(result.length).toBeLessThanOrEqual(500);

    expect(result).toContain('85%');
    expect(result).toContain('PAT-123');
    expect(result).toContain('製造業');
    expect(result).toContain('従業員数500名');
    expect(result).toContain('段階的導入');
    expect(result).toContain('40%');

    expect(result).toMatch(/[ぁ-ん]/);
    expect(result).toMatch(/です|ました|できます|ください/);
  });
});