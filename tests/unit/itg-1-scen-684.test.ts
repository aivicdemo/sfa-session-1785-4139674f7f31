import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-684
  test('改善優先度スコア算出機能 - 問題パターンの発生頻度が最大値直上のとき処理がエラーになる', () => {
    const input_frequency = 1001;
    const input_impact = 80;
    const max_threshold = 1000;

    expect(() =>
      calculateImprovementPriorityScore({
        frequency: input_frequency,
        impact: input_impact,
      })
    ).toThrow(/FREQUENCY_EXCEEDS_MAX_THRESHOLD/);

    try {
      calculateImprovementPriorityScore({
        frequency: input_frequency,
        impact: input_impact,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toMatch(
          /問題パターンの発生頻度が許容上限値を超過しています/
        );
        expect(error.message).toMatch(/最大値: 1000/);
        expect(error.message).toMatch(/入力値: 1001/);
      }
    }
  });
});