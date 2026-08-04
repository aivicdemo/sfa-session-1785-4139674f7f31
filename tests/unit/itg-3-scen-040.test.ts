import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容生成機能 - 商談条件検証', () => {
  test('SCEN-040: 商談条件が未設定の場合に検証結果が正常に返される', () => {
    // AIRecommendationEngineのスタブを設定
    const aiEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 商談条件オブジェクトを作成 - すべての必須プロパティが未設定または空値
    const emptyDealCondition = {
      customerInfo: undefined,
      dealContent: undefined,
      budget: undefined,
      industry: undefined,
      dealValue: null,
      customerScale: '',
      dealStage: null,
      proposedProducts: undefined,
      timeline: undefined,
    };

    // 関数を実行
    const result = generateRecommendation(emptyDealCondition, aiEngineStub);

    // ステータスコードを確認
    expect(result.status).toBe('validation_error');

    // エラーメッセージを確認
    expect(result.errorMessage).toBe(
      '商談条件が未設定です。顧客情報、商談内容、予算、業界などの必須項目を入力してください'
    );

    // recommendationオブジェクトがnullであることを確認
    expect(result.recommendation).toBeNull();

    // AIRecommendationEngineの外部API呼び出しが実行されていないことを確認
    expect(aiEngineStub.generateRecommendation).not.toHaveBeenCalled();
    expect(aiEngineStub.findSimilarPatterns).not.toHaveBeenCalled();
    expect(aiEngineStub.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});