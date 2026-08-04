import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援: 過去商談データから成功パターンを抽出し新規案件に適用', () => {
  test('SCEN-1020: OpenAI APIが正常応答した場合、推奨内容と根拠が正しく返却される', async () => {
    // Mock AIRecommendationEngine
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: '顧客業種と予算に合わせた段階的提案アプローチ',
        implementationSteps: [
          '初回ヒアリング（1週間以内）',
          'ニーズ分析レポート提示（2週間以内）',
          '提案資料作成・決定者ブリーフィング（3週間以内）'
        ],
        reasoning: {
          successPatternMatchScore: 0.87,
          similarSuccessCaseCount: 5,
          matchedPatterns: [
            'IT業種・初回提案・3名以上の決定者',
            '予算500万円帯での段階的アプローチ'
          ]
        }
      })
    };

    // Test input data
    const newDealInput = {
      customerIndustry: 'IT',
      customerBudget: 5000000,
      dealType: 'initialProposal',
      decisionMakerCount: 3
    };

    // Execute function with mocked AI engine
    const result = await generateRecommendation(newDealInput, mockAIEngine);

    // Verify AI engine was called exactly once (no retries on success)
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(newDealInput);

    // Verify recommended approach contains specific content
    expect(result.recommendedApproach).toContain('段階的提案アプローチ');

    // Verify implementation steps are present
    expect(result.implementationSteps).toBeInstanceOf(Array);
    expect(result.implementationSteps.length).toBeGreaterThan(0);
    expect(result.implementationSteps[0]).toContain('ヒアリング');

    // Verify reasoning structure with exact numerical values
    expect(result.reasoning).toBeDefined();
    expect(result.reasoning.successPatternMatchScore).toBeGreaterThanOrEqual(0.85);
    expect(result.reasoning.successPatternMatchScore).toBe(0.87);
    expect(result.reasoning.similarSuccessCaseCount).toBeGreaterThanOrEqual(3);
    expect(result.reasoning.similarSuccessCaseCount).toBe(5);

    // Verify matched patterns contain relevant information
    expect(result.reasoning.matchedPatterns).toBeInstanceOf(Array);
    expect(result.reasoning.matchedPatterns.length).toBeGreaterThan(0);
    expect(result.reasoning.matchedPatterns[0]).toMatch(/IT業種/);
  });
});