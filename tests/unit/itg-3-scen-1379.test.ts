import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  test('SCEN-1379: 提案アプローチのデータがないとき推奨内容が生成できない', () => {
    // AIRecommendationEngineのスタブ設定
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // 新規案件の顧客条件を入力パラメータとして指定
    const newDealCondition = {
      customerIndustry: '製造業',
      challenge: 'コスト削減',
      budget: 5000000
    };

    // generateRecommendationメソッドを呼び出す
    const result = generateRecommendation(newDealCondition, mockAIEngine);

    // メソッドの戻り値とシステムの状態を検証
    // (1) エラーコード「PATTERN_DATA_NOT_FOUND」またはそれに準じたエラータイプが返却される
    expect(result).toHaveProperty('errorCode');
    expect(result.errorCode).toBe('PATTERN_DATA_NOT_FOUND');

    // (2) エラーメッセージに「提案アプローチの生成に必要な成功パターンデータが不足しています」という趣旨の説明が含まれる
    expect(result).toHaveProperty('errorMessage');
    expect(result.errorMessage).toMatch(/提案アプローチの生成に必要な成功パターンデータが不足/);

    // (3) 推奨内容（recommendation）フィールドがnullまたは空値となる
    expect(result.recommendation).toBeNull();

    // (4) 根拠説明（reasoning）フィールドがnullまたは空値となる
    expect(result.reasoning).toBeNull();

    // (5) AIRecommendationEngineへの外部呼び出しが発生せず、内部的な推奨パターンマスタへのフォールバック処理も実行されない
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});