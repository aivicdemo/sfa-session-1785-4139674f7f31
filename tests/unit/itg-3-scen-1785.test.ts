import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1785: [normal] 推奨根拠の可視化機能 - 推奨タイミングの根拠として購買周期が説明される
  test('推奨タイミングの根拠に購買周期が含まれて表示される', () => {
    // Arrange: AIRecommendationEngine のスタブを構成
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedTiming: '2024-02-15',
        recommendationScore: 92,
        reasoning: {
          averagePurchaseCycle: 90,
          daysSinceLastPurchase: 85,
          purchaseCycleExplanation: '顧客の過去購買周期は平均90日であり、前回購入から85日経過しているため、現在が最適な提案タイミング',
        },
      }),
      explainRecommendationReasoning: jest.fn(),
    };

    const recommendationData = {
      customerId: 'C001',
      customerName: '株式会社テスト',
      lastPurchaseDate: '2024-01-01',
      averagePurchaseCycle: 90,
      daysSinceLastPurchase: 85,
      proposalContent: 'システム導入支援',
      recommendationScore: 92,
    };

    const expectedReasoningOutput = {
      timingReasoning: '顧客の過去購買周期は平均90日であり、前回購入から85日経過しているため、現在が最適な提案タイミング',
      keyFactors: [
        { label: '購買周期', value: '90日' },
        { label: '前回購入からの経過日数', value: '85日' },
      ],
      confidence: 92,
    };

    mockAIEngine.explainRecommendationReasoning.mockReturnValue(
      expectedReasoningOutput
    );

    // Act: explainRecommendationReasoning メソッドを呼び出し
    const result = explainRecommendationReasoning(
      recommendationData,
      mockAIEngine
    );

    // Assert: 根拠テキストに購買周期に関するキーワードが含まれていることを確認
    expect(result.timingReasoning).toContain('購買周期');
    expect(result.timingReasoning).toContain('90日');
    expect(result.timingReasoning).toContain('85日経過');

    // Assert: 根拠の構造と信頼度スコアが正しく返されていることを確認
    expect(result.keyFactors).toEqual([
      { label: '購買周期', value: '90日' },
      { label: '前回購入からの経過日数', value: '85日' },
    ]);
    expect(result.confidence).toBe(92);

    // Assert: AIエージェントが正しい入力データで呼び出されたことを確認
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationData
    );
  });
});