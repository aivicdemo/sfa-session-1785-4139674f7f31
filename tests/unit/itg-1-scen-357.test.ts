import { evaluateDataQualityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業データ品質スコア合格判定機能', () => {
  // SCEN-357
  test('営業データ品質スコアがちょうど合格基準値に達した場合に合格と判定される', () => {
    const pass_threshold = 80;
    const test_score = 80;

    const result = evaluateDataQualityScore({
      score: test_score,
      threshold: pass_threshold,
    });

    expect(result).toEqual({
      status: 'PASS',
      score: 80,
      message: '営業データ品質スコアが合格基準を達成しました',
    });
  });
});