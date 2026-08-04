import { generateRecommendationApproach } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチの自動推奨機能', () => {
  test('SCEN-2473: 新規案件が成功パターンと1件完全マッチするとき、対応する提案アプローチが推奨される', async () => {
    // Arrange: テスト用の新規案件データ
    const newDealData = {
      dealId: 'DEAL-20240115-001',
      customerScale: '中堅企業',
      industry: '製造業',
      challenge: 'DX推進',
      budget: 50000000,
      decisionMaker: '経営層',
      createdAt: new Date('2024-01-15T11:00:00Z'),
    };

    // モック用の成功パターンデータ
    const successPatternMatch = {
      patternId: 'PATTERN-MFG-001',
      customerScale: '中堅企業',
      industry: '製造業',
      challenge: 'DX推進',
      budgetMin: 40000000,
      budgetMax: 60000000,
      decisionMaker: '経営層',
      recommendedApproach: 'クラウドERP導入支援パッケージ',
      matchScore: 1.0,
    };

    // AIRecommendationEngine のモック
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: successPatternMatch.patternId,
          approach: successPatternMatch.recommendedApproach,
          score: successPatternMatch.matchScore,
          customerScale: successPatternMatch.customerScale,
          industry: successPatternMatch.industry,
          challenge: successPatternMatch.challenge,
        },
      ]),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'クラウドERP導入支援パッケージ',
        matchPercentage: 100,
        reasoning: '過去成功事例との完全マッチ：同一顧客属性・課題・予算帯での成約実績あり',
        matchScore: 1.0,
        timestamp: new Date('2024-01-15T11:00:00Z'),
      }),
    };

    // データベースモック用の推奨履歴保存
    const recommendationHistory: Array<{
      dealId: string;
      approach: string;
      matchScore: number;
      recordedAt: Date;
    }> = [];

    const mockDatabase = {
      saveRecommendationHistory: jest.fn((record) => {
        recommendationHistory.push(record);
        return Promise.resolve();
      }),
    };

    // Act: 提案アプローチ自動推奨機能を実行
    const result = await generateRecommendationApproach(
      newDealData,
      mockAIEngine,
      mockDatabase
    );

    // Assert: 推奨結果の検証
    expect(result.recommendedApproach).toBe('クラウドERP導入支援パッケージ');
    expect(result.matchPercentage).toBe(100);
    expect(result.reasoning).toBe(
      '過去成功事例との完全マッチ：同一顧客属性・課題・予算帯での成約実績あり'
    );

    // Assert: AIEngine のメソッド呼び出し確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith({
      customerScale: '中堅企業',
      industry: '製造業',
      challenge: 'DX推進',
      budget: 50000000,
      decisionMaker: '経営層',
    });

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      newDealData,
      expect.arrayContaining([
        expect.objectContaining({
          patternId: 'PATTERN-MFG-001',
          score: 1.0,
        }),
      ])
    );

    // Assert: 推奨履歴への記録確認
    expect(mockDatabase.saveRecommendationHistory).toHaveBeenCalled();
    expect(recommendationHistory).toHaveLength(1);
    expect(recommendationHistory[0]).toEqual({
      dealId: 'DEAL-20240115-001',
      approach: 'クラウドERP導入支援パッケージ',
      matchScore: 1.0,
      recordedAt: new Date('2024-01-15T11:00:00Z'),
    });
  });
});