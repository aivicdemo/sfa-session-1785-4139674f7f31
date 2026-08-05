import { calculatePriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-949
  test('改善優先度スコア算出機能 - 発生頻度が100を超える数値のとき処理がエラーになる', () => {
    const input_frequency = 101;
    const input_impact = 50;

    expect(() => {
      calculatePriorityScore({
        frequency: input_frequency,
        impact: input_impact,
      });
    }).toThrow(/FREQUENCY_OUT_OF_RANGE|発生頻度は0〜100の範囲で指定してください/);
  });
});