import { generateRecommendationForNewDeal } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し新規案件への推奨を生成', () => {
  test('SCEN-1050: 新規案件の商談条件が完全に入力された状態で推奨内容が生成される', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          caseId: 'case_001',
          industry: '製造業',
          dealAmount: 48000000,
          successRate: 0.85,
          caseTitle: '事例A：製造業・4,800万円・成功',
        },
        {
          caseId: 'case_002',
          industry: '製造業',
          dealAmount: 52000000,
          successRate: 0.87,
          caseTitle: '事例B：製造業・5,200万円・成功',
        },
        {
          caseId: 'case_003',
          industry: '製造業',
          dealAmount: 45000000,
          successRate: 0.86,
          caseTitle: '事例C：製造業・4,500万円・成功',
        },
      ]),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationTitle: '段階的提案アプローチ：初回ヒアリング→技術検証→コスト試算',
        recommendationReason: '過去同業種・同金額帯での成功パターン（3件のマッチング事例）',
        applicabilityScore: 0.87,
        similarCases: [
          '事例A：製造業・4,800万円・成功',
          '事例B：製造業・5,200万円・成功',
          '事例C：製造業・4,500万円・成功',
        ],
      }),
    };

    const newDealCondition = {
      customerName: 'テスト太郎商事',
      industry: '製造業',
      dealAmount: 50000000,
      decisionTimeline: '3ヶ月以内',
      challenge: '生産効率化',
      currentSolution: '未定',
      decisionMakerCount: 3,
    };

    const startTime = Date.now();
    const result = await generateRecommendationForNewDeal(
      newDealCondition,
      mockAIRecommendationEngine
    );
    const elapsedTime = Date.now() - startTime;

    expect(result.recommendationTitle).toBe(
      '段階的提案アプローチ：初回ヒアリング→技術検証→コスト試算'
    );
    expect(result.recommendationReason).toBe(
      '過去同業種・同金額帯での成功パターン（3件のマッチング事例）'
    );
    expect(result.applicabilityScore).toBe(0.87);
    expect(result.similarCases).toEqual([
      '事例A：製造業・4,800万円・成功',
      '事例B：製造業・5,200万円・成功',
      '事例C：製造業・4,500万円・成功',
    ]);
    expect(result.errorMessage).toBeUndefined();
    expect(elapsedTime).toBeLessThan(30000);

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealCondition
    );
    expect(
      mockAIRecommendationEngine.generateRecommendation
    ).toHaveBeenCalledWith(newDealCondition, expect.any(Array));
  });
});