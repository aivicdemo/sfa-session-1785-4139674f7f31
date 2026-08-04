import { generateRecommendation, explainRecommendationReasoning } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  test('SCEN-1968: 提案商品カテゴリが完全一致するパターンが優先される', () => {
    // モック設定：複数の成功パターンを返却
    const mockSimilarPatterns = [
      {
        patternId: 'pattern-a',
        proposalCategoryName: 'ERPシステム',
        categoryMatchDegree: 'exact',
        similarityScore: 0.95,
        historicalSuccessRate: 0.92,
        customerIndustry: '製造業',
        issue: '在庫管理の効率化',
      },
      {
        patternId: 'pattern-b',
        proposalCategoryName: '業務管理ツール',
        categoryMatchDegree: 'partial',
        similarityScore: 0.88,
        historicalSuccessRate: 0.85,
        customerIndustry: '製造業',
        issue: '業務効率化',
      },
      {
        patternId: 'pattern-c',
        proposalCategoryName: 'クラウドサービス',
        categoryMatchDegree: 'related',
        similarityScore: 0.82,
        historicalSuccessRate: 0.78,
        customerIndustry: '製造業',
        issue: 'IT基盤整備',
      },
    ];

    // モック化されたAIRecommendationEngine
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue(mockSimilarPatterns),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // 新規案件の条件を定義
    const newDealCondition = {
      customerIndustry: '製造業',
      issue: '在庫管理の効率化',
      proposalTargetCategory: 'ERPシステム',
    };

    // generateRecommendation メソッドを呼び出す
    const recommendationResult = generateRecommendation(newDealCondition, mockAIEngine);

    // 返却された推奨結果の最優先パターンを確認する
    expect(recommendationResult).toBeDefined();
    expect(recommendationResult.topPriority).toEqual({
      patternId: 'pattern-a',
      proposalCategoryName: 'ERPシステム',
      categoryMatchDegree: 'exact',
      similarityScore: 0.95,
      priority: 1,
    });

    // 根拠情報をexplainRecommendationReasoning で取得する
    const reasoningExplanation = explainRecommendationReasoning(
      recommendationResult.topPriority.patternId,
      mockAIEngine
    );

    // 期待結果：根拠説明に完全一致の旨が含まれること
    expect(reasoningExplanation).toContain('提案商品カテゴリが顧客要件と完全一致しているため');
    expect(reasoningExplanation).toContain('過去の同一カテゴリ成功事例を最優先で推奨します');

    // パターンB・Cが優先順位2位以下に配置されていることを確認
    expect(recommendationResult.allPatterns).toHaveLength(3);
    expect(recommendationResult.allPatterns[0].patternId).toBe('pattern-a');
    expect(recommendationResult.allPatterns[0].priority).toBe(1);
    expect(recommendationResult.allPatterns[1].patternId).toBe('pattern-b');
    expect(recommendationResult.allPatterns[1].priority).toBe(2);
    expect(recommendationResult.allPatterns[2].patternId).toBe('pattern-c');
    expect(recommendationResult.allPatterns[2].priority).toBe(3);

    // 優先度がスコア順（完全一致 > 部分一致 > 関連一致）に正しく設定されていることを確認
    expect(recommendationResult.allPatterns[0].similarityScore).toBeGreaterThan(
      recommendationResult.allPatterns[1].similarityScore
    );
    expect(recommendationResult.allPatterns[1].similarityScore).toBeGreaterThan(
      recommendationResult.allPatterns[2].similarityScore
    );
  });
});