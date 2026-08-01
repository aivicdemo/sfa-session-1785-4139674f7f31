import { calculatePriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('改善優先度スコア算出機能', () => {
  // SCEN-682
  test('問題パターンの発生頻度が最大値直下のとき優先度スコアが適切に計算される', () => {
    const input = {
      occurrenceFrequency: 99,
      maxOccurrenceFrequency: 100,
      impactDegree: 5,
      impactDegreeMax: 10,
      resolutionDifficulty: 3,
      resolutionDifficultyMax: 10,
    };

    const result = calculatePriorityScore(input);

    const frequencyScore = (input.occurrenceFrequency / input.maxOccurrenceFrequency) * 0.4;
    const impactScore = (input.impactDegree / input.impactDegreeMax) * 0.35;
    const resolutionScore = (1 - (input.resolutionDifficulty / input.resolutionDifficultyMax)) * 0.25;
    const expectedScore = frequencyScore + impactScore + resolutionScore;

    expect(result).toBe(0.75);
  });
});