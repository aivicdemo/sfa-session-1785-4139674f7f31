import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容と根拠の統合提示機能', () => {
  // SCEN-804
  test('推奨内容と根拠の統合提示機能 - 提案アプローチが推奨内容に含まれて返却される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: '顧客の経営課題に基づいた段階的提案',
        reasoning: '過去3年間の同業種案件で成功率78%',
        confidenceScore: 78,
      }),
    };

    const inputData = {
      customerIndustry: '製造業',
      challenge: '生産効率化',
      budgetScale: 50000000,
    };

    const result = await generateRecommendation(inputData, mockAIEngine);

    expect(result).toBeDefined();
    expect(result.recommendedApproach).toBe('顧客の経営課題に基づいた段階的提案');
    expect(result.reasoning).toBe('過去3年間の同業種案件で成功率78%');
    expect(result.confidenceScore).toBe(78);
  });
});