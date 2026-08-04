import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1296: OpenAI APIが正常応答した場合に自然言語形式の根拠説明が生成される', async () => {
    // Arrange: モック化されたAIRecommendationEngineを準備
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoningText:
          '顧客の業界は製造業で、従業員規模500名以上という条件が過去成功事例5件と合致しています。これらの案件では提案初期段階でのプロセス効率化アプローチが60%の成約率を達成しており、貴社の提案内容と相性が良好です。特に、決裁フロー3段階の企業では導入検討期間が平均45日と短縮される傾向があります。',
        model: 'gpt-4',
        tokensUsed: 87,
      }),
    };

    const newDealData = {
      industry: '製造業',
      employeeCount: 600,
      decisionStages: 3,
    };

    const recommendationContent = 'プロセス効率化ソリューション提案';

    // Act: explainRecommendationReasoningを呼び出す
    const result = await explainRecommendationReasoning(
      newDealData,
      recommendationContent,
      mockAIEngine
    );

    // Assert: 戻り値のreasoningTextを検証
    expect(result.reasoningText).toBe(
      '顧客の業界は製造業で、従業員規模500名以上という条件が過去成功事例5件と合致しています。これらの案件では提案初期段階でのプロセス効率化アプローチが60%の成約率を達成しており、貴社の提案内容と相性が良好です。特に、決裁フロー3段階の企業では導入検討期間が平均45日と短縮される傾向があります。'
    );
    expect(result.model).toBe('gpt-4');
    expect(result.tokensUsed).toBeGreaterThanOrEqual(87);
    expect(typeof result.tokensUsed).toBe('number');
  });
});