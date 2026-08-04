import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出機能', () => {
  // SCEN-1011
  test('過去商談データが0件の場合、内部推奨パターンマスタから統計的に上位の成功パターンが返却される', async () => {
    // Arrange: 外部API呼び出しをモックして意図的にタイムアウト/ネットワークエラーをシミュレート
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(
        new Error('API timeout: exceeded 30 seconds')
      ),
      findSimilarPatterns: jest.fn().mockRejectedValue(
        new Error('Network error')
      ),
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error('Service unavailable')
      ),
      evaluatePatternRelevance: jest.fn().mockRejectedValue(
        new Error('Connection refused')
      ),
    };

    // 新規案件の条件を入力
    const newCaseConditions = {
      industry: 'IT企業',
      caseSize: 5000000,
      fiscalYearEnd: 3,
    };

    // Act: 推奨パターン抽出機能を実行
    const result = await generateRecommendation(
      newCaseConditions,
      mockAIRecommendationEngine
    );

    // Assert: 代替動作ロジックが発動し、内部マスタから返却されたパターンを検証
    expect(result).toBeDefined();
    expect(Array.isArray(result.recommendedPatterns)).toBe(true);
    expect(result.recommendedPatterns.length).toBeGreaterThanOrEqual(3);

    // 返却されたパターンが成功率で降順ソートされていることを確認
    for (let i = 0; i < result.recommendedPatterns.length - 1; i++) {
      expect(result.recommendedPatterns[i].successRate).toBeGreaterThanOrEqual(
        result.recommendedPatterns[i + 1].successRate
      );
    }

    // 各パターンが内部マスタから取得されたことを確認
    // （簡略版の根拠説明であること、外部AI生成の詳細な説明がないことを検証）
    result.recommendedPatterns.forEach((pattern) => {
      expect(pattern.reasoning).toBeDefined();
      expect(typeof pattern.reasoning).toBe('string');
      expect(pattern.reasoning.length).toBeGreaterThan(0);
      // 簡略版であることを確認：統計情報のみを含む
      expect(pattern.reasoning).toMatch(/成功率|平均|統計/);
      // 外部AIの詳細な自然言語説明が含まれていないことを確認
      expect(pattern.reasoning).not.toMatch(
        /提案アプローチを採用することで|顧客の課題を解決するため|当社の経験から/
      );
    });

    // 同一の推奨パターンセットが複数回呼び出しで返却されることを確認
    // （内部マスタのデータが一貫していることを保証）
    const result2 = await generateRecommendation(
      newCaseConditions,
      mockAIRecommendationEngine
    );

    expect(result.recommendedPatterns.length).toBe(
      result2.recommendedPatterns.length
    );
    result.recommendedPatterns.forEach((pattern, index) => {
      expect(pattern.id).toBe(result2.recommendedPatterns[index].id);
      expect(pattern.successRate).toBe(
        result2.recommendedPatterns[index].successRate
      );
    });

    // 外部APIが呼び出されたことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalled();
  });
});