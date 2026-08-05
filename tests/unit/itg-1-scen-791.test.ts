import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { classifyAndPrioritizeDetectedProblems } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-791
  test('営業担当者IDが未設定・nullの場合、SALES_PERSON_ID_REQUIREDエラーが発生する', () => {
    const input_invalid = {
      salesPersonId: null,
      detectedProblems: [
        {
          problemId: 'prob_001',
          type: 'PROPOSAL_DEVIATION',
          severity: 'HIGH',
          frequency: 3,
          impact: 8,
          description: 'プロセス逸脱のテスト',
        },
      ],
      analysisTimestamp: new Date('2024-01-15T10:30:00Z'),
    };

    expect(() =>
      classifyAndPrioritizeDetectedProblems(input_invalid)
    ).toThrow(/SALES_PERSON_ID_REQUIRED/);
  });
});