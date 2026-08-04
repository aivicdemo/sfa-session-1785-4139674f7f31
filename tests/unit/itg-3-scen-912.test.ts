import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能 - 照合対象データが0件の場合', () => {
  test('SCEN-912: 提案アプローチが0件のとき推奨が生成されない', () => {
    // AIRecommendationEngineのスタブ定義
    // findSimilarPatternsが空配列を返すように構成
    const stubAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 新規案件データ（提案アプローチが0件の状態）
    const newDealData = {
      customerName: 'テスト企業A',
      industry: 'IT',
      companySize: 'medium',
      dealCondition: 'initial_proposal',
      budget: 5000000,
      timeline: 'Q2_2024',
    };

    // 空の提案アプローチデータベース
    const proposalApproachDb: any[] = [];

    // 推奨生成処理を実行
    const result = generateRecommendation(
      newDealData,
      proposalApproachDb,
      stubAIRecommendationEngine
    );

    // 期待結果の検証
    // 推奨結果がnullまたは空オブジェクトであることを確認
    expect(result).toEqual(null);

    // AIRecommendationEngineのfindSimilarPatternsが呼ばれたことを確認
    expect(stubAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalled();

    // 推奨内容・根拠説明・パターンスコアが生成されていないことを確認
    // resultがnullの場合、これらの属性は存在しない
    expect(result?.recommendationContent).toBeUndefined();
    expect(result?.reasoningExplanation).toBeUndefined();
    expect(result?.patternScore).toBeUndefined();

    // ユーザーメッセージが設定されていることを確認
    expect(result?.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // エラーが発生していないことを確認
    expect(result?.error).toBeUndefined();
  });
});