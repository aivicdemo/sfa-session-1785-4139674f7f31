import { generateRecommendation, explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1945
  test('推奨内容の根拠表示機能 - 根拠参照の過去事例件数が0件のときに参照情報なしで表示される', () => {
    // モック化: AIRecommendationEngine.findSimilarPatterns が空配列を返す
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'IT企業向けの効率化提案',
        confidenceScore: 75,
        riskFactors: ['実装期間が短い'],
        nextActions: ['顧客の現状ヒアリング実施'],
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: '統計的成功パターンに基づき、IT企業における500万円規模の商談では効率化ソリューションの提案が有効です。',
        referenceExamples: [],
        exampleCount: 0,
        similarityScores: [],
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    // 商談条件入力パラメータ
    const dealCondition = {
      customerIndustry: 'IT',
      dealAmount: 5000000,
      dealStage: '初期接触',
      customerSize: '中堅企業',
    };

    // generateRecommendation メソッド呼び出し
    const recommendationResult = mockAIRecommendationEngine.generateRecommendation(dealCondition);

    // explainRecommendationReasoning メソッド呼び出し
    const reasoningResult = mockAIRecommendationEngine.explainRecommendationReasoning(
      recommendationResult,
      dealCondition,
      mockAIRecommendationEngine.findSimilarPatterns(dealCondition)
    );

    // 期待結果の検証
    // 1. 根拠説明テキストが存在する
    expect(reasoningResult.reasoning).toBeDefined();
    expect(reasoningResult.reasoning).toContain('統計的成功パターン');

    // 2. 参照事例件数が0件
    expect(reasoningResult.exampleCount).toBe(0);

    // 3. 参照事例リストが空配列
    expect(reasoningResult.referenceExamples).toEqual([]);
    expect(Array.isArray(reasoningResult.referenceExamples)).toBe(true);
    expect(reasoningResult.referenceExamples.length).toBe(0);

    // 4. 類似度スコア表示が空配列
    expect(reasoningResult.similarityScores).toEqual([]);
    expect(Array.isArray(reasoningResult.similarityScores)).toBe(true);

    // 5. 根拠表示構造が正しい（参照情報がないことを確認）
    expect(reasoningResult).toHaveProperty('reasoning');
    expect(reasoningResult).toHaveProperty('referenceExamples');
    expect(reasoningResult).toHaveProperty('exampleCount');
    expect(reasoningResult).toHaveProperty('similarityScores');

    // 6. 参照情報フィールドに値がないことを確認
    expect(reasoningResult.referenceExamples.length === 0).toBe(true);
    expect(reasoningResult.similarityScores.length === 0).toBe(true);
  });
});