import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1927
  test('AIエージェント正常応答時に根拠説明が自然言語で生成される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendation: '段階的導入型',
        similarPatterns: [
          {
            caseId: 'CS-2024-001',
            matchingDegree: 0.92,
            successRate: 92,
            customerIndustry: 'IT',
            budgetScale: 'large',
          },
        ],
        relevanceScore: 92,
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        '顧客の予算規模と業界がIT大規模企業である過去成功事例「事例ID: CS-2024-001」と合致し、同条件での採用率が92%であるため、提案アプローチ「段階的導入型」を推奨します。この事例では類似度92%の顧客企業で同様の段階的導入を実施し、3ヶ月以内に導入を完了して顧客満足度が95%に達しています。'
      ),
    };

    const newProjectInfo = {
      customerName: 'ABC Corporation',
      industry: 'IT',
      budgetScale: 'large',
      challenge: 'システム統合の効率化',
    };

    const result = explainRecommendationReasoning(
      newProjectInfo,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      newProjectInfo,
      expect.any(Object)
    );

    expect(result).toContain('であるため');
    expect(result).toContain('合致し');
    expect(result).toContain('CS-2024-001');
    expect(result).toContain('92%');
    expect(result).toContain('段階的導入型');
    expect(result).toMatch(/事例ID|caseId/);
    expect(result).toMatch(/成功率|採用率|満足度/);

    const hasReasoningStructure =
      result.includes('顧客') &&
      result.includes('過去成功事例') &&
      result.includes('推奨');

    expect(hasReasoningStructure).toBe(true);

    const hasQuantitativeData =
      result.match(/\d+%/) !== null &&
      result.match(/CS-2024-\d+/) !== null;

    expect(hasQuantitativeData).toBe(true);
  });
});