import { calculatePriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-937: [normal] 改善優先度スコア算出機能 - 顧客対応パターン問題から改善優先度スコアが正しく算出される
  test('顧客対応パターン問題の分析データから改善優先度スコアが正しく算出される', () => {
    // Arrange: 顧客対応パターン問題の分析データを準備
    const customer_response_delay_score = 60;
    const customer_response_omission_score = 75;
    const customer_explanation_insufficiency_score = 50;

    // 各問題に対応する重要度係数をスタブで定義
    const problem_weights = {
      response_delay: 0.3,
      response_omission: 0.5,
      explanation_insufficiency: 0.2,
    };

    // Act: 改善優先度スコア算出関数に上記のデータと係数を入力
    const priority_score = calculatePriorityScore({
      problem_scores: {
        response_delay: customer_response_delay_score,
        response_omission: customer_response_omission_score,
        explanation_insufficiency: customer_explanation_insufficiency_score,
      },
      weights: problem_weights,
    });

    // Assert: 算出されたスコアの値を検証
    // 期待値: 60×0.3 + 75×0.5 + 50×0.2 = 18 + 37.5 + 10 = 67.5
    expect(priority_score).toBe(67.5);
  });
});