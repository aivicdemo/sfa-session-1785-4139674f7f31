import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2723
  test('OpenAI APIが正常応答した場合、生成された推奨内容と根拠がシステムに正しく取り込まれる', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationContent: 'クラウド型ソリューション提案',
        reasoning: '過去3件の同業種案件で採用率80%',
        confidenceScore: 0.87,
      }),
    };

    const dealData = {
      customerName: '株式会社テスト',
      industry: 'IT',
      budget: '500万円',
      issue: 'システム導入',
    };

    const result = await generateRecommendationWithReasoning(
      dealData,
      mockAIRecommendationEngine
    );

    expect(result.recommendationContent).toBe('クラウド型ソリューション提案');
    expect(result.reasoning).toBe('過去3件の同業種案件で採用率80%');
    expect(result.confidenceScore).toBe(0.87);
    expect(result.storedInRecommendationTable).toBe(true);
    expect(result.storedInReasoningTable).toBe(true);
    expect(result.displayedRecommendationContent).toBe(
      'クラウド型ソリューション提案'
    );
    expect(result.displayedReasoning).toBe(
      '過去3件の同業種案件で採用率80%'
    );
  });
});