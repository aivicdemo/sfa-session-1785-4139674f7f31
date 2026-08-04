import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への推奨機能', () => {
  // SCEN-1334
  test('OpenAI APIが正常応答したとき、成功パターンから推奨内容が生成される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: '導入前の現状分析ワークショップ→段階的導入→ROI測定',
        reasoning: '類似案件3件で同じアプローチにより成約率が68%→82%に向上',
        relevantCaseIds: ['case_2024_001', 'case_2024_002', 'case_2024_003'],
        applicabilityScore: 0.82
      })
    };

    const newDealInput = {
      customerIndustry: '製造業',
      challenge: '供給チェーン最適化',
      budgetRange: 5000000,
      decisionMakerCount: 3
    };

    const result = await generateRecommendation(newDealInput, mockAIEngine);

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerIndustry: '製造業',
        challenge: '供給チェーン最適化',
        budgetRange: 5000000,
        decisionMakerCount: 3
      })
    );

    expect(result.recommendedApproach).toBe('導入前の現状分析ワークショップ→段階的導入→ROI測定');
    expect(result.reasoning).toBe('類似案件3件で同じアプローチにより成約率が68%→82%に向上');
    expect(result.relevantCaseIds).toHaveLength(3);
    expect(result.relevantCaseIds).toEqual(['case_2024_001', 'case_2024_002', 'case_2024_003']);
    expect(result.applicabilityScore).toBeGreaterThanOrEqual(0.75);
    expect(result.applicabilityScore).toBe(0.82);
  });
});