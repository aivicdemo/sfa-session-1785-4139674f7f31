import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1756
  test('根拠信頼度が100のとき根拠を高信頼度として表示する', () => {
    // Arrange
    const mockRecommendationData = {
      recommendationId: 'REC-2024-001',
      customerId: 'CUST-12345',
      recommendedApproach: '顧客の既存契約を活用した段階的アップセル提案',
      reasoningBasis: [
        {
          basisId: 'BASIS-001',
          type: 'success_pattern',
          description: '過去12ヶ月の同業種顧客で88%の採用率',
          supportData: {
            historicalMatchCount: 16,
            totalMatchCount: 18,
            adoptionRate: 0.88
          }
        },
        {
          basisId: 'BASIS-002',
          type: 'customer_signal',
          description: '顧客の購買サイクルが3ヶ月周期で安定',
          supportData: {
            observedCycles: 4,
            consistencyScore: 0.95
          }
        }
      ],
      confidenceScore: 100,
      generatedAt: '2024-01-15T11:00:00Z'
    };

    // Act
    const result = evaluatePatternRelevance(mockRecommendationData);

    // Assert - 信頼度スコアが100であることを確認
    expect(result.confidenceScore).toBe(100);

    // Assert - 根拠データが高信頼度として評価されていることを確認
    expect(result.trustworthinessLevel).toBe('high');

    // Assert - 根拠の視覚的スタイル属性が高信頼度用に設定されていることを確認
    expect(result.visualIndicator).toEqual({
      colorCode: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      textContent: '信頼度: 100'
    });

    // Assert - 根拠データ数が正確に反映されていることを確認
    expect(result.reasoningBasisCount).toBe(2);

    // Assert - すべての根拠が高信頼度でマークされていることを確認
    expect(result.allBasisMarkedAsHighTrust).toBe(true);
  });
});