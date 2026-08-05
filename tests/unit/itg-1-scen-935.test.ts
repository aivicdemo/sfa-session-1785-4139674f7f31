import { describe, test, expect } from '@jest/globals';
import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('改善優先度スコア算出機能 - 冪等性検証', () => {
  test('SCEN-935: 同じ入力で2回実行しても同じ改善優先度スコアが算出される', () => {
    const processItemId = 'proc-001';
    const improvementIndexScore = 75;
    const executionFrequency = 12;
    const impactDegree = 8;

    const scoreResult1 = calculateImprovementPriorityScore({
      processItemId,
      improvementIndexScore,
      executionFrequency,
      impactDegree,
    });

    const scoreResult2 = calculateImprovementPriorityScore({
      processItemId,
      improvementIndexScore,
      executionFrequency,
      impactDegree,
    });

    expect(scoreResult1).toBe(scoreResult2);
    expect(scoreResult1).toBe(450);
  });
});