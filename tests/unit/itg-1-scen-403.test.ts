import { evaluatePatternApplicability } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-403
  test('成功パターン適用判定機能 - 成約率がちょうど閾値と等しい場合、そのパターンが適用可能と判定される', () => {
    const successPatternThreshold = 75;
    const winRatePercent = 75;

    const result = evaluatePatternApplicability({
      winRatePercent,
      patternThresholdPercent: successPatternThreshold,
    });

    expect(result.applicable).toBe(true);
  });
});