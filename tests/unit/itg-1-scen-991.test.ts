import { evaluateFactorApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-991
  test('成功要因・失敗要因の抽出と承認基準判定機能 - 要因テキストの信頼度スコアが閾値直下のとき無効と判定される', () => {
    const threshold = 0.75;
    const confidenceScore = 0.7499;
    const factorText = '顧客ニーズの早期把握';

    const result = evaluateFactorApprovalCriteria({
      factorText,
      confidenceScore,
      thresholdScore: threshold,
    });

    expect(result.status).toBe('INVALID');
    expect(result.confidenceScore).toBe(0.7499);
    expect(result.reason).toBe('Confidence score below threshold');
  });
});