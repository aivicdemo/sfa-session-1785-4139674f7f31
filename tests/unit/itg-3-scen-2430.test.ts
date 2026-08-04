import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度スコア算出機能 - 重複スコア値の統計計算', () => {
  // SCEN-2430
  test('過去成功パターンのスコア値が重複しているとき統計計算が適切に処理される', () => {
    const duplicate_scores = [0.85, 0.85, 0.85, 0.72, 0.72, 0.65];
    
    const result = evaluatePatternRelevance(duplicate_scores);
    
    const expected_mean = (0.85 * 3 + 0.72 * 2 + 0.65 * 1) / 6;
    const expected_median = 0.785;
    
    const sorted_scores = [...duplicate_scores].sort((a, b) => a - b);
    const mid = Math.floor(sorted_scores.length / 2);
    const computed_median = sorted_scores.length % 2 === 0
      ? (sorted_scores[mid - 1] + sorted_scores[mid]) / 2
      : sorted_scores[mid];
    
    const variance = duplicate_scores.reduce((sum, score) => {
      return sum + Math.pow(score - expected_mean, 2);
    }, 0) / duplicate_scores.length;
    const expected_std_dev = Math.sqrt(variance);
    
    const frequency_dist: Record<number, number> = {};
    duplicate_scores.forEach(score => {
      frequency_dist[score] = (frequency_dist[score] || 0) + 1;
    });
    
    expect(result.mean).toBe(expected_mean);
    expect(result.median).toBe(expected_median);
    expect(result.standard_deviation).toBeCloseTo(expected_std_dev, 5);
    expect(result.frequency_distribution).toEqual(frequency_dist);
    expect(Number.isFinite(result.mean)).toBe(true);
    expect(Number.isFinite(result.median)).toBe(true);
    expect(Number.isFinite(result.standard_deviation)).toBe(true);
    expect(Object.keys(result.frequency_distribution).length).toBe(3);
    expect(result.frequency_distribution[0.85]).toBe(3);
    expect(result.frequency_distribution[0.72]).toBe(2);
    expect(result.frequency_distribution[0.65]).toBe(1);
  });
});