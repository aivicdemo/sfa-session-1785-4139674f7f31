import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-676
  test('推奨内容根拠の可視化機能 - 成功パターン条件の必須項目が欠落しているとき、エラーが発生する', () => {
    const input_missing_recommendation_reason = {
      recommendation_reason: '',
      evidence_data_source: 'past_transaction_data',
      judgment_criteria_value: 85,
    };

    expect(() =>
      visualizeRecommendationBasis(input_missing_recommendation_reason)
    ).toThrow(/必須項目/);
  });
});