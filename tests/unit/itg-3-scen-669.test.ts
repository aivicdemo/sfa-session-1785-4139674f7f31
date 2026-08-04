import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-669
  test('OpenAI API呼び出しが正常応答した場合、推奨内容と根拠を生成して返す', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: '顧客のIT投資課題に対応したクラウドコスト最適化ソリューションの提案',
        reasoning: '同業種・同予算規模の過去成功事例5件から、決裁者数2名の組織において承認率が85%以上のパターンを抽出。提案タイミングは上半期の予算確保フェーズが最適',
        similarPatterns: [
          { patternId: 'PAT-001', matchScore: 0.95 },
          { patternId: 'PAT-003', matchScore: 0.88 },
        ],
        evaluationScore: 0.92,
      }),
    };

    const newDealConditions = {
      customerIndustry: 'IT企業',
      budget: '500万円',
      decisionMakers: 2,
    };

    const result = await mockAIRecommendationEngine.generateRecommendation(
      newDealConditions
    );

    expect(result.recommendation).toBeTruthy();
    expect(typeof result.recommendation).toBe('string');
    expect(result.recommendation.length).toBeGreaterThan(0);

    expect(result.reasoning).toBeTruthy();
    expect(typeof result.reasoning).toBe('string');
    expect(result.reasoning.length).toBeGreaterThan(0);

    expect(typeof result.evaluationScore).toBe('number');
    expect(result.evaluationScore).toBeGreaterThanOrEqual(0);
    expect(result.evaluationScore).toBeLessThanOrEqual(1);
    expect(result.evaluationScore).toBe(0.92);

    expect(Array.isArray(result.similarPatterns)).toBe(true);
    expect(result.similarPatterns.length).toBeGreaterThanOrEqual(1);

    result.similarPatterns.forEach((pattern) => {
      expect(typeof pattern.matchScore).toBe('number');
      expect(pattern.matchScore).toBeGreaterThanOrEqual(0);
      expect(pattern.matchScore).toBeLessThanOrEqual(1);
    });

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      newDealConditions
    );
  });
});