import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ自動推奨', () => {
  // SCEN-1552
  test('1つの提案アプローチのみ推奨される場合、その1つが結果に含まれる', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproaches: [
          {
            id: 'approach-001',
            name: 'カスタマイズ提案型',
            description: '顧客の業種特性に合わせたカスタマイズ提案',
            confidence: 0.92,
          },
        ],
        reasoning: '製造業の提案準備段階では、カスタマイズ提案型が最適です。',
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        baseReason: '過去の成功事例から製造業5000万円規模の案件では、カスタマイズ提案型が80%の採用率を示しています。',
        successPatternMatches: [
          {
            patternId: 'pattern-m-001',
            similarity: 0.95,
            pastDealCount: 12,
          },
        ],
      }),
    };

    const input = {
      customerIndustry: '製造業',
      dealStage: '提案準備',
      budgetSize: '5000万円',
    };

    const result = await generateRecommendation(input, mockAIEngine);

    expect(result.proposalApproaches).toHaveLength(1);
    expect(result.proposalApproaches[0].name).toBe('カスタマイズ提案型');
    expect(result.proposalApproaches[0].confidence).toBe(0.92);
    expect(result.reasoning).toBeDefined();
    expect(result.reasoning).toMatch(/カスタマイズ提案型/);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(input);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();
  });
});