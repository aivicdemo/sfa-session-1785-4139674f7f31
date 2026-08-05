import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { convertProcessStandardToSystemRequirement } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  // SCEN-201
  test('判定基準の精度がちょうど許容範囲の上限値（+5%）のとき、要件として受け入れられる', () => {
    const input = {
      processStandardId: 'PS-2024-001',
      processStandardName: '営業初回接触プロセス',
      judgementCriteriaAccuracyPercent: 5.0,
      toleranceUpperLimitPercent: 5.0,
      requirementStatus: 'pending' as const,
      systemRequirementName: '初回接触ステップの判定ルール',
      createdAt: new Date('2024-01-15T11:00:00Z'),
      updatedAt: new Date('2024-01-15T11:00:00Z'),
    };

    const result = convertProcessStandardToSystemRequirement(input);

    expect(result.requirementStatus).toBe('acceptable');
    expect(result.requirementId).toBeDefined();
    expect(result.registeredToMasterAt).toBeDefined();
    expect(result.conversionRemark).toMatch(/許容範囲上限/);
  });
});