import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンテンプレート自動判定機能', () => {
  test('SCEN-2595: 業界分類条件が一致する場合、推奨パターンが正しく選定される', () => {
    // ビジネスルール: 顧客属性と商談条件に基づいて、適用すべき成功パターンテンプレートを自動判定し、AIエージェントが推奨ロジックに組み込める形で出力される
    // precondition: 推奨パターンマスタにPAT-001が登録済み
    // trigger: 業界分類='IT・ソフトウェア'の新規案件でgenerateRecommendationを呼び出し
    // outcome: パターンID='PAT-001'、推奨アプローチ='クラウド導入支援'、パターン適用スコア≧0.92で返却

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        patternId: 'PAT-001',
        recommendedApproach: 'クラウド導入支援',
        patternApplicabilityScore: 0.92,
        successRate: 0.85,
        confidence: 92,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PAT-001',
          industry: 'IT・ソフトウェア',
          successRate: 0.85,
          recommendedApproach: 'クラウド導入支援',
          similarityScore: 0.92,
        },
      ]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDeal = {
      customerId: 'CUST-001',
      industry: 'IT・ソフトウェア',
      companySize: '中堅企業',
      challenge: 'システム基盤の現代化',
      dealValue: 5000000,
    };

    const result = generateRecommendation(newDeal, mockAIEngine);

    expect(result.patternId).toBe('PAT-001');
    expect(result.recommendedApproach).toBe('クラウド導入支援');
    expect(result.patternApplicabilityScore).toBeGreaterThanOrEqual(0.92);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: 'IT・ソフトウェア',
      })
    );
  });
});