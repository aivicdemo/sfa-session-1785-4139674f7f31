import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateImprovementTargets } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善対象項目の算出機能', () => {
  let aiRecommendationEngineStub: any;

  beforeEach(() => {
    aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        proposedApproach: 'enhanced-follow-up-strategy',
        confidenceScore: 85,
        rationale: 'Based on historical success patterns',
      }),
    };
  });

  // SCEN-495
  test('should throw ValidationError when inconsistencyLog is null', async () => {
    const testInput = {
      inconsistencyLog: null,
      qualityScore: 78,
      improvementPriority: 'HIGH',
      aiRecommendationEngine: aiRecommendationEngineStub,
    };

    await expect(async () => {
      await calculateImprovementTargets(testInput);
    }).rejects.toThrow(/不整合ログ/);
  });
});