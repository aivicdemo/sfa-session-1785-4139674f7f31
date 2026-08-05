import { describe, test, expect } from '@jest/globals';
import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('Improvement Priority Score Calculation', () => {
  test('SCEN-934: Low impact high frequency problem pattern should result in medium priority score', () => {
    // Arrange
    const impact_degree = 1; // Low (1-3 range)
    const occurrence_frequency = 5; // High (4-5 range)

    // Act
    const result = calculateImprovementPriorityScore({
      impact_degree,
      occurrence_frequency,
    });

    // Assert
    expect(result.priority_score).toBeGreaterThanOrEqual(50);
    expect(result.priority_score).toBeLessThanOrEqual(60);
    expect(result.priority_level).toBe('中');
  });
});