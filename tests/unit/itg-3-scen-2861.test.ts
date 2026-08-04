import { RecommendationContentValidator } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2861: 推奨内容が空のとき、エラーを返す', () => {
    // 準備: RecommendationContentValidatorのインスタンスを作成
    const validator = new RecommendationContentValidator();

    // 検証対象オブジェクト: 推奨内容が空文字列
    const validationInput = {
      recommendationContent: '',
      successPattern: 'pattern_001',
      confidenceScore: 0.85,
      reasoningDetails: ['detail1', 'detail2']
    };

    // 検証メソッドを呼び出し、エラーが発生することを確認
    expect(() => {
      validator.validateRecommendationContent(validationInput);
    }).toThrow(/推奨内容/);

    // エラーオブジェクトの詳細を検証
    let thrownError: Error | undefined;
    try {
      validator.validateRecommendationContent(validationInput);
    } catch (error) {
      thrownError = error as Error;
    }

    // エラーコードとメッセージの検証
    if (thrownError && 'code' in thrownError) {
      expect((thrownError as any).code).toBe('EMPTY_RECOMMENDATION_CONTENT');
    }
    if (thrownError) {
      expect(thrownError.message).toBe('推奨内容が空です。有効な推奨内容を生成してください。');
      expect(thrownError.stack).toMatch(/RecommendationContentValidator/);
    }
  });
});