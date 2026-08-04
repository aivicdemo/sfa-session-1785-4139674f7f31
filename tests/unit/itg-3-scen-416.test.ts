import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  test('SCEN-416: [normal] データ品質スコア算出機能 - 検証結果が複数件の場合、全件の平均スコアが正しく算出される', () => {
    const validation_results = [
      { patternId: 'P001', relevanceScore: 0.85 },
      { patternId: 'P002', relevanceScore: 0.75 },
      { patternId: 'P003', relevanceScore: 0.90 },
    ];

    const calculated_score = calculateDataQualityScore(validation_results);

    const expected_average_score = (0.85 + 0.75 + 0.90) / 3;

    expect(Number(calculated_score.toFixed(4))).toBe(
      Number(expected_average_score.toFixed(4))
    );
    expect(calculated_score).toBeCloseTo(0.8333, 3);
  });
});