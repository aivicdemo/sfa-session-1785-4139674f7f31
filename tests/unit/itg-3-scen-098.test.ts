import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - データ品質検証と推論実行制御', () => {
  test('SCEN-098: データ品質検証が未完了の状態で推論実行が保留される', () => {
    // テストデータ: 新規案件情報
    const newDealInput = {
      customer_name: 'A社',
      deal_amount: 5000000,
      industry: '製造業',
      data_quality_status: 'INCOMPLETE'
    };

    // AIRecommendationEngineをスタブ化
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // データ品質検証モジュールをモック化
    const mockQualityValidator = {
      validate: jest.fn().mockReturnValue({
        is_valid: false,
        status: 'INCOMPLETE',
        error_code: 'DATA_VALIDATION_INCOMPLETE',
        message: 'データ品質検証が完了してからご実行ください'
      })
    };

    // 推論実行を試みて、エラーが発生することを検証
    const result = generateRecommendation(
      newDealInput,
      mockAIEngine,
      mockQualityValidator
    );

    // 期待結果1: HTTPステータス422またはエラーコード『DATA_VALIDATION_INCOMPLETE』が返却される
    expect(result.status).toBe('UNPROCESSABLE_ENTITY');
    expect(result.error_code).toBe('DATA_VALIDATION_INCOMPLETE');

    // 期待結果2: AIRecommendationEngineのgenerateRecommendationメソッドが呼び出されない
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(0);

    // 期待結果3: 推論実行ステータスが『保留中』で記録される
    expect(result.inference_status).toBe('SUSPENDED');

    // 期待結果4: エラーメッセージに『データ品質検証が完了してからご実行ください』が含まれる
    expect(result.error_message).toMatch(/データ品質検証が完了してからご実行ください/);

    // 期待結果5: HTTPステータスコード検証
    expect(result.http_status_code).toBe(422);
  });
});