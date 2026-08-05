import { evaluateFactorValidity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-990: [edge] 成功要因・失敗要因の抽出と承認基準判定機能 - 要因テキストの信頼度スコアが閾値ちょうどのとき有効と判定される
  test('要因テキストの信頼度スコアが閾値0.75と等しい場合、isValidがtrueで返されること', () => {
    const factorText = '顧客ニーズの深掘りが不足していた';
    const confidenceThreshold = 0.75;
    const mockConfidenceScore = 0.75;

    const result = evaluateFactorValidity(
      factorText,
      confidenceThreshold,
      mockConfidenceScore
    );

    expect(result.isValid).toBe(true);
    expect(result.confidenceScore).toBe(0.75);
    expect(result.status).toBe('有効');
  });
});