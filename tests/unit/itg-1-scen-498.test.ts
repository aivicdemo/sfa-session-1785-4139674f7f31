import { describe, test, expect } from '@jest/globals';
import { calculateAIAgentInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-498
  test('対象の顧客対応パターンが複数件の場合、すべてを対象に精度スコアが算出される', () => {
    const customerId = 'CUST-20240115-001';
    const patternA = {
      patternId: 'PAT-001',
      patternType: 'initial_contact',
      patternName: '初期接触',
      inferenceResult: {
        recommendedAction: 'send_email',
        confidenceScore: 92,
      },
      actualOutcome: {
        actionTaken: 'send_email',
        result: 'success',
      },
    };

    const patternB = {
      patternId: 'PAT-002',
      patternType: 'proposal_phase',
      patternName: '提案フェーズ',
      inferenceResult: {
        recommendedAction: 'schedule_meeting',
        confidenceScore: 85,
      },
      actualOutcome: {
        actionTaken: 'schedule_meeting',
        result: 'success',
      },
    };

    const patternC = {
      patternId: 'PAT-003',
      patternType: 'closing',
      patternName: 'クロージング',
      inferenceResult: {
        recommendedAction: 'send_contract',
        confidenceScore: 78,
      },
      actualOutcome: {
        actionTaken: 'send_contract',
        result: 'success',
      },
    };

    const patterns = [patternA, patternB, patternC];

    const result = calculateAIAgentInferenceAccuracy({
      customerId,
      patterns,
    });

    expect(result).toBeDefined();
    expect(result.customerId).toBe(customerId);
    expect(result.patternScores).toHaveLength(3);

    expect(result.patternScores[0]).toEqual({
      patternId: 'PAT-001',
      patternType: 'initial_contact',
      accuracyScore: 92,
    });
    expect(result.patternScores[0].accuracyScore).toBeGreaterThanOrEqual(0);
    expect(result.patternScores[0].accuracyScore).toBeLessThanOrEqual(100);

    expect(result.patternScores[1]).toEqual({
      patternId: 'PAT-002',
      patternType: 'proposal_phase',
      accuracyScore: 85,
    });
    expect(result.patternScores[1].accuracyScore).toBeGreaterThanOrEqual(0);
    expect(result.patternScores[1].accuracyScore).toBeLessThanOrEqual(100);

    expect(result.patternScores[2]).toEqual({
      patternId: 'PAT-003',
      patternType: 'closing',
      accuracyScore: 78,
    });
    expect(result.patternScores[2].accuracyScore).toBeGreaterThanOrEqual(0);
    expect(result.patternScores[2].accuracyScore).toBeLessThanOrEqual(100);

    const expectedAverageScore = (92 + 85 + 78) / 3;
    expect(result.averageAccuracyScore).toBe(85);
  });
});