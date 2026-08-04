import { generateRecommendation, findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-2313
  test('過去商談データが0件のとき成功パターンが抽出されない', async () => {
    // Arrange: 新規案件の条件を設定
    const newDealCondition = {
      customerName: 'テスト顧客A',
      industry: 'IT',
      budget: 5000000,
      dealStage: '初期接触'
    };

    // モック化されたAIRecommendationEngineスタブを作成
    // 過去商談データが0件の状態をシミュレート
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn().mockResolvedValue(null),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // findSimilarPatterns の呼び出し - 空の配列を返す
    const similarPatternsResult = await mockAIEngine.findSimilarPatterns(newDealCondition);

    expect(similarPatternsResult).toEqual([]);

    // generateRecommendation の呼び出し - 空の過去商談データに基づいて推奨を生成
    const recommendationResult = await generateRecommendation(
      newDealCondition,
      mockAIEngine
    );

    // Assert: 推奨内容の検証
    // successPatterns フィールドが空配列であること
    expect(recommendationResult.successPatterns).toEqual([]);

    // explanationReasoning フィールドが簡略版の説明文であること
    expect(recommendationResult.explanationReasoning).toBe(
      '過去商談データが不足しているため、成功パターンを抽出できません。内部の推奨パターンマスタから統計的に上位の成功パターンを表示します'
    );

    // 内部の推奨パターンマスタから統計的に上位のパターンが代替表示されていること
    expect(recommendationResult.fallbackPatterns).toBeDefined();
    expect(Array.isArray(recommendationResult.fallbackPatterns)).toBe(true);
  });
});