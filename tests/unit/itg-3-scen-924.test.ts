import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 過去商談データから成功パターンを抽出し新規案件に推奨', () => {
  test('SCEN-924: 成功パターンが存在し適用可能な場合、推奨アプローチが生成される', async () => {
    const pastSuccessPattern = {
      dealId: 'DEAL-001',
      customerIndustry: '製造業',
      employeeCount: 500,
      businessChallenge: '生産効率化',
      proposalApproach: 'IoTセンサー導入',
      contractStatus: 'success',
      matchScore: 0.95,
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([pastSuccessPattern]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.85),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'IoTセンサー導入',
        reasoning: '類似業種・規模での成功実績あり',
      }),
      explainRecommendationReasoning: jest.fn(),
    };

    const newDealInput = {
      customerIndustry: '製造業',
      employeeCount: 480,
      businessChallenge: '生産効率化',
    };

    const result = await generateRecommendation(newDealInput, mockAIEngine);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealInput);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      pastSuccessPattern,
      newDealInput
    );
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      [pastSuccessPattern],
      newDealInput
    );

    expect(result.recommendedApproach).toBe('IoTセンサー導入');
    expect(result.reasoning).toBe('類似業種・規模での成功実績あり');
    expect(result.applicabilityScore).toBe(85);
    expect(result.recommendationStatus).toBe('確定推奨');
    expect(result.detailedExplanation).toContain('過去の類似案件');
    expect(result.detailedExplanation).toContain('製造業');
    expect(result.detailedExplanation).toContain('500名');
    expect(result.detailedExplanation).toContain('生産効率化課題');
    expect(result.detailedExplanation).toContain('85%');
  });
});