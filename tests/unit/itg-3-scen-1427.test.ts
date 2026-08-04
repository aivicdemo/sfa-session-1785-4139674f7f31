import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1427
  test('AI推奨エンジンが正常応答したとき、推奨内容と根拠が返却される', async () => {
    // モック化されたAIRecommendationEngineを準備
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: '顧客の課題解決型提案',
        reasoning: '過去3件の類似案件で成功実績あり',
        confidenceScore: 0.92,
        similarPatterns: [
          {
            caseId: 'CASE-001',
            successRate: 0.95,
          },
          {
            caseId: 'CASE-002',
            successRate: 0.88,
          },
        ],
      }),
    };

    // テスト用の新規案件条件を準備
    const newCaseCondition = {
      industry: '製造業',
      budgetRange: '5000万円以上',
      stage: '要件定義完了',
    };

    // generateRecommendationを実行
    const result = await generateRecommendation(newCaseCondition, mockAIEngine);

    // recommendedApproachが正しい内容を含むことを確認
    expect(result.recommendedApproach).toContain('顧客の課題解決型提案');

    // reasoningフィールドが推奨根拠の説明文として存在することを確認
    expect(result.reasoning).toBe('過去3件の類似案件で成功実績あり');

    // confidenceScoreが0以上1以下の数値であることを確認
    expect(result.confidenceScore).toBe(0.92);
    expect(typeof result.confidenceScore).toBe('number');
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(1);

    // similarPatternsが配列形式で複数の過去成功事例を含むことを確認
    expect(Array.isArray(result.similarPatterns)).toBe(true);
    expect(result.similarPatterns.length).toBeGreaterThanOrEqual(1);

    // 各事例にcaseIdとsuccessRateが存在することを確認
    result.similarPatterns.forEach((pattern) => {
      expect(pattern).toHaveProperty('caseId');
      expect(pattern).toHaveProperty('successRate');
      expect(typeof pattern.caseId).toBe('string');
      expect(typeof pattern.successRate).toBe('number');
      expect(pattern.successRate).toBeGreaterThanOrEqual(0);
      expect(pattern.successRate).toBeLessThanOrEqual(1);
    });

    // 構造化されたJSON形式で返却されていることを確認
    expect(result).toEqual({
      recommendedApproach: '顧客の課題解決型提案',
      reasoning: '過去3件の類似案件で成功実績あり',
      confidenceScore: 0.92,
      similarPatterns: [
        {
          caseId: 'CASE-001',
          successRate: 0.95,
        },
        {
          caseId: 'CASE-002',
          successRate: 0.88,
        },
      ],
    });
  });
});