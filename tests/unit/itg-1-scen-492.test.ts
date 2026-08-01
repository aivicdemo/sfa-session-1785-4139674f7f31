import { calculateAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-492: AIエージェント推論精度スコア算出機能 - 推論精度が50%超の場合、精度スコアが50より大きい値で算出される', () => {
    // Arrange: 推論精度が50%を超える値（75%）をテスト入力として設定
    const inference_accuracy_percentage = 75;

    // Act: 精度スコア算出処理を実行
    const accuracy_score = calculateAccuracyScore(inference_accuracy_percentage);

    // Assert: 精度スコアが50より大きい値で算出されていることを検証
    expect(accuracy_score).toBeGreaterThan(50);
    // 具体的な期待値の検証：入力精度が75%の場合、出力精度スコアは75以上となること
    expect(accuracy_score).toBeGreaterThanOrEqual(75);
  });
});