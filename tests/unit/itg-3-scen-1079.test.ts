import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチの自動推奨生成', () => {
  // SCEN-1079
  test('生成された提案アプローチに商談との紐づけ情報が含まれる', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-2026-001',
        dealId: 'DEAL-12345',
        customerId: 'CUST-67890',
        proposalApproach: '顧客の課題に対応した段階的導入アプローチ',
        reasoning: '過去成功パターンとの類似度95%',
        patterns: [{ patternId: 'PAT-001', similarity: 0.95 }],
      }),
    };

    const inputData = {
      dealId: 'DEAL-12345',
      customerId: 'CUST-67890',
      industry: '製造業',
      budget: '500万円',
      timeline: '3ヶ月',
    };

    const result = await generateRecommendation(inputData, mockAIEngine);

    expect(result.dealId).toBe('DEAL-12345');
    expect(result.customerId).toBe('CUST-67890');
    expect(result.recommendationId).toBe('REC-2026-001');
    expect(result.proposalApproach).toBe('顧客の課題に対応した段階的導入アプローチ');
    expect(result.reasoning).toBe('過去成功パターンとの類似度95%');
    expect(result.patterns).toEqual([{ patternId: 'PAT-001', similarity: 0.95 }]);
  });
});