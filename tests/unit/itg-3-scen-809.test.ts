import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨外部連携（正常系）', () => {
  test('SCEN-809: OpenAI APIから推奨根拠の説明文が正常に生成されて返却される', async () => {
    // Arrange: 新規案件データを準備
    const dealData = {
      customerId: 'CUST-12345',
      customerIndustry: '製造業',
      customerScale: '従業員500名',
      dealStage: '初回提案',
      productCategory: 'ERP',
      dealConditions: {
        budget: 5000000,
        decisionTimeline: '3ヶ月以内',
        competitors: ['Competitor A', 'Competitor B']
      }
    };

    // Mock AIRecommendationEngine
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: '顧客の業界は製造業で、過去成功事例との類似度が85%です。同業種での提案アプローチAは成約率78%の実績があります。過去12ヶ月間で同規模企業6社との取引実績があり、平均契約金額は450万円です。',
        error: false,
        confidence_score: 0.85
      })
    };

    // Act: explainRecommendationReasoningを呼び出し
    const result = await explainRecommendationReasoning(dealData, mockAIEngine);

    // Assert: レスポンスが正常であることを検証
    expect(result).toBeDefined();
    expect(typeof result.reasoning).toBe('string');
    expect(result.reasoning.length).toBeGreaterThanOrEqual(1);
    expect(result.reasoning.length).toBeLessThanOrEqual(500);
    expect(result.reasoning).toMatch(/製造業|成功パターン|成約率/);
    expect(result.error).toBe(false);
    expect(result.confidence_score).toBeGreaterThanOrEqual(0);
    expect(result.confidence_score).toBeLessThanOrEqual(1);
    
    // Assert: AIEngineが正しい引数で呼び出されたことを検証
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(dealData);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(1);
  });
});