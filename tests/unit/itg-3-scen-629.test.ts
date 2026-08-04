import { generateAIRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨送信準備機能', () => {
  // SCEN-629
  test('[normal] 外部AI推奨エンジンが正常応答した場合、推奨内容と根拠が生成される', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: '顧客の業界特性に合わせた段階的提案アプローチ',
        reasoning: '過去3件の同業種案件で成約率78%を達成したパターンに合致',
        patternSimilarityScore: 0.87,
        sourcePatterns: ['パターンID:PAT-2024-001', 'パターンID:PAT-2024-015'],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: '過去3件の同業種案件で成約率78%を達成したパターンに合致',
      }),
    };

    const newCaseData = {
      customerIndustry: '製造業',
      budgetScale: 50000000,
      salesRepExperienceYears: 3,
    };

    const result = await generateAIRecommendation(newCaseData, mockAIRecommendationEngine);

    expect(result.recommendationContent).toBe('顧客の業界特性に合わせた段階的提案アプローチ');
    expect(result.reasoning).toBe('過去3件の同業種案件で成約率78%を達成したパターンに合致');
    expect(result.patternSimilarityScore).toBe(0.87);
    expect(result.sourcePatternIds).toEqual(['PAT-2024-001', 'PAT-2024-015']);
    expect(result.recommendationStatus).toBe('準備完了');
  });
});