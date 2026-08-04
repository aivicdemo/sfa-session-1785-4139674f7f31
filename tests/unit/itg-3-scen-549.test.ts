import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-549
  test('改善対象項目が1件のとき方針がその項目に特化する', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    mockAIEngine.generateRecommendation.mockResolvedValueOnce({
      recommendedPolicy: 'フォローメール対応率向上に特化した営業指導',
      rationale: '現在のスコア:45%→目標:80%',
      targetPatterns: ['フォローメール テンプレート活用', 'フォローメール タイミング最適化'],
      confidence: 0.92,
    });

    const improvementRequest = {
      salesPersonId: 'SP-001',
      improvementTargets: [
        {
          itemName: 'フォローメール対応率',
          currentScore: 45,
          targetScore: 80,
        },
      ],
      analysisDate: '2024-02-15T10:00:00Z',
      managerId: 'MGR-002',
    };

    const result = await generateRecommendation(
      improvementRequest,
      mockAIEngine,
      mockFileStorage,
    );

    expect(result.recommendedPolicy).toBe('フォローメール対応率向上に特化した営業指導');
    expect(result.policyFocusRatio).toBe(100);
    expect(result.otherSkillDistribution).toBe(0);
    expect(result.recommendedActions.length).toBeGreaterThanOrEqual(1);
    expect(result.recommendedActions.length).toBeLessThanOrEqual(3);
    expect(result.recommendedActions.every(
      (action: { category: string }) =>
        action.category === 'フォローメール関連' ||
        action.category.includes('フォローメール'),
    )).toBe(true);
    expect(result.priorityScore).toBeGreaterThanOrEqual(90);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      improvementRequest,
    );
  });
});